import { decode } from 'base64-arraybuffer';
import { withUserAuth } from '../auth';
import { NotificationProps, ProfileProps, WorkspaceProps } from '../types';
import { uploadToSupabaseStorage } from '../utils';

// Get current user
export const getCurrentUser = withUserAuth<ProfileProps['Row']>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error };
  }

  if (!user) {
    return { data: null, error: { message: 'user not found.', status: 404 } };
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('id', user.id)
    .single();

  // Check for errors
  if (profileError) {
    return { data: null, error: { message: profileError.message, status: 500 } };
  }

  // Return workspaces
  return { data: profile, error: null };
});

// Get all workspaces for an user
export const getUserWorkspaces = withUserAuth<WorkspaceProps['Row'][]>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error };
  }

  // Get all workspaces user is a member of
  const { data: workspaces, error: workspacesError } = await supabase
    .from('workspace_member')
    .select('workspace (*)')
    .eq('member_id', user!.id);

  // Check for errors
  if (workspacesError || !workspaces) {
    return { data: null, error: { message: workspacesError.message, status: 500 } };
  }

  // Restructure workspaces data
  const restructuredData = workspaces.map((item) =>
    'workspace' in item ? item.workspace : item
  ) as WorkspaceProps['Row'][];

  // Return workspaces
  return { data: restructuredData, error: null };
});

// Update user profile
export const updateUserProfile = (
  cType: 'route' | 'server',
  data: { full_name: string | undefined; avatar_url: string | undefined }
) =>
  withUserAuth<ProfileProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    if (!user) {
      return { data: null, error: { message: 'user not found.', status: 404 } };
    }

    // If avatar url provided, upload to supabase storage
    if (data.avatar_url) {
      const { data: publicUrl, error: uploadError } = await uploadToSupabaseStorage(
        supabase,
        'avatars',
        `${user.id}.png`,
        decode(data.avatar_url.split(',')[1]),
        'image/png',
        true
      );

      // Check for errors
      if (uploadError) {
        return { data: null, error: { message: uploadError.message, status: 500 } };
      }

      // Update user profile
      data.avatar_url = publicUrl;
    }

    // Update user profile
    const { data: updatedUser, error: updatedUserError } = await supabase
      .from('profile')
      .update({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      })
      .eq('id', user.id)
      .select()
      .single();

    // Check for errors
    if (updatedUserError) {
      return { data: null, error: { message: updatedUserError.message, status: 500 } };
    }

    // Return updated user
    return { data: updatedUser, error: null };
  })(cType);

// Get user's notifications
export const getUserNotifications = withUserAuth<NotificationProps[]>(async (user, supabase, error) => {
  // If any errors, return error
  if (error) {
    return { data: null, error };
  }

  if (!user) {
    return { data: null, error: { message: 'user not found.', status: 404 } };
  }

  // Get all workspaces user is a member of
  const { data: workspaces, error: workspacesError } = await supabase
    .from('workspace_member')
    .select('workspace (*)')
    .eq('member_id', user.id);

  // Check for errors
  if (workspacesError) {
    return { data: null, error: { message: workspacesError.message, status: 500 } };
  }

  // Restructure workspaces data
  const restructuredData = workspaces.map((item) =>
    'workspace' in item ? item.workspace : item
  ) as WorkspaceProps['Row'][];

  // Get all notifications for user
  const { data: notifications, error: notificationsError } = await supabase
    .from('notification')
    .select('*, workspace:workspace_id (name, slug, icon), initiator:initiator_id (full_name)')
    .in(
      'workspace_id',
      restructuredData.map((item) => item.id)
    )
    .neq('initiator_id', user.id);

  // Check for errors
  if (notificationsError) {
    return { data: null, error: { message: notificationsError.message, status: 500 } };
  }

  // Convert notifications type
  const restructuredNotifications = notifications as unknown as NotificationProps[];

  // Return notifications
  return { data: restructuredNotifications, error: null };
});

// Archive notification
export const archiveUserNotification = (
  cType: 'route' | 'server',
  notificationId: string,
  archived: boolean
) =>
  withUserAuth<NotificationProps>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    if (!user) {
      return { data: null, error: { message: 'user not found.', status: 404 } };
    }

    // Get notification
    const { data: notification, error: notificationError } = await supabase
      .from('notification')
      .select()
      .eq('id', notificationId)
      .single();

    // Check for errors
    if (notificationError) {
      return { data: null, error: { message: notificationError.message, status: 500 } };
    }

    // Check if notification exists
    if (!notification) {
      return { data: null, error: { message: 'notification not found.', status: 404 } };
    }

    // Check if user has access to notification
    const { data: workspaceMember, error: workspaceMemberError } = await supabase
      .from('workspace_member')
      .select()
      .eq('workspace_id', notification.workspace_id)
      .eq('member_id', user.id)
      .single();

    // Check for errors
    if (workspaceMemberError) {
      return { data: null, error: { message: workspaceMemberError.message, status: 500 } };
    }

    // Check if user is a member of the workspace
    if (!workspaceMember) {
      return { data: null, error: { message: 'user is not a member of the workspace.', status: 403 } };
    }

    // Append user to has_archived array
    const updatedNotification = archived
      ? [...(notification.has_archived || []), user.id]
      : (notification.has_archived || []).filter((item) => item !== user.id);

    // Update notification
    const { data: updatedNotificationData, error: updatedNotificationError } = await supabase
      .from('notification')
      .update({
        has_archived: updatedNotification,
      })
      .eq('id', notificationId)
      .select('*, workspace:workspace_id (name, slug, icon), initiator:initiator_id (full_name)')
      .single();

    // Check for errors
    if (updatedNotificationError) {
      return { data: null, error: { message: updatedNotificationError.message, status: 500 } };
    }

    // Convert notifications type
    const restructuredNotification = updatedNotificationData as unknown as NotificationProps;

    // Return updated notification
    return { data: restructuredNotification, error: null };
  })(cType);
