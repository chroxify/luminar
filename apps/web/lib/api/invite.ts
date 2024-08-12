import { sendEmail } from '@/emails';
import WorkspaceInviteEmail from '@/emails/workspace-invite';
import { withUserAuth, withWorkspaceAuth } from '../auth';
import { ExtendedInviteProps, ProfileProps, TeamInviteProps } from '../types';
import { formatRootUrl, isValidEmail } from '../utils';

// Get all workspace invites
export const getWorkspaceInvites = withWorkspaceAuth<ExtendedInviteProps[]>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get all invites for workspace
    const { data: invites, error: invitesError } = await supabase
      .from('workspace_invite')
      .select('*, workspace:workspace_id (name, slug), creator:creator_id (full_name)')
      .eq('workspace_id', workspace!.id);

    // If any errors, return error
    if (invitesError) {
      return { data: null, error: { message: invitesError.message, status: 500 } };
    }

    // Convert invites type
    const invitesData = invites as unknown as ExtendedInviteProps[];

    // Return invites
    return { data: invitesData, error: null };
  }
);

// Get workspace invite
export const getWorkspaceInvite = (inviteId: string, cType: 'server' | 'route') =>
  withUserAuth<ExtendedInviteProps>(async (user, supabase, error) => {
    // If any errors, return error
    if (error && error.status !== 401) {
      return { data: null, error };
    }

    // Get invite
    const { data: invite, error: inviteError } = await supabase
      .from('workspace_invite')
      .select('*, workspace:workspace_id (name, slug, icon), creator:creator_id (full_name)')
      .eq('id', inviteId)
      .single();

    // If any errors, return error
    if (inviteError) {
      return { data: null, error: { message: inviteError.message, status: 500 } };
    }

    // Convert invite type
    const inviteData = invite as unknown as ExtendedInviteProps;

    // Return invite
    return { data: inviteData, error: null };
  })(cType);

// Create new workspace invite
export const createWorkspaceInvite = (slug: string, cType: 'server' | 'route', email: string) =>
  withWorkspaceAuth<TeamInviteProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Validate email
    if (!isValidEmail(email)) {
      return { data: null, error: { message: 'Please provide a valid email', status: 400 } };
    }

    // Check if user has an account already
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select()
      .eq('email', email)
      .single();

    // If any errors, return error and make sure it's not a PGRST116 error (no rows found)
    if (profileError && profileError.code !== 'PGRST116') {
      return { data: null, error: { message: profileError.message, status: 500 } };
    }

    if (profile) {
      // Check if user is already a member of the workspace
      const { data: isMember, error: isMemberError } = await supabase
        .from('workspace_member')
        .select()
        .eq('workspace_id', workspace!.id)
        .eq('member_id', profile.id)
        .single();

      // If any errors, return error
      if (isMemberError) {
        return { data: null, error: { message: isMemberError.message, status: 500 } };
      }

      // If user is already a member of the workspace, return error
      if (isMember) {
        return { data: null, error: { message: 'User is already a member of this workspace', status: 400 } };
      }
    }

    // Make sure user is not already invited to the workspace
    const { data: alreadyInvited, error: alreadyInvitedError } = await supabase
      .from('workspace_invite')
      .select()
      .eq('workspace_id', workspace!.id)
      .eq('email', email);

    // If any errors, return error
    if (alreadyInvitedError) {
      return { data: null, error: { message: alreadyInvitedError.message, status: 500 } };
    }

    // If user is already invited to the workspace, return error
    if (alreadyInvited && alreadyInvited.length > 0) {
      return { data: null, error: { message: 'User is already invited to this workspace', status: 400 } };
    }

    // Create invite
    const { data: invite, error: inviteError } = await supabase
      .from('workspace_invite')
      .insert({ workspace_id: workspace!.id, email, creator_id: user!.id })
      .select('*, creator:creator_id (full_name, email)')
      .single();

    // If any errors, return error
    if (inviteError) {
      return { data: null, error: { message: inviteError.message, status: 500 } };
    }

    // Convert invite to invite with creator object
    const inviteData = invite as unknown as TeamInviteProps['Row'] & { creator: ProfileProps['Row'] };

    // Send email to user
    const { error: emailError } = await sendEmail({
      subject: `You've been invited to join ${workspace!.name} on Feedbase`,
      email,
      react: WorkspaceInviteEmail({
        email,
        invitedByFullName: inviteData.creator.full_name,
        invitedByEmail: inviteData.creator.email,
        workspaceName: workspace!.name,
        inviteLink: formatRootUrl('dash', `/invite/${inviteData.id}`),
      }),
    })
      .then((data) => {
        return { data, error: null };
      })
      .catch((err) => {
        // If any errors, return error
        return { data: null, error: { message: err.message, status: 500 } };
      });

    // If any errors, return error
    if (emailError) {
      // Delete invite
      await supabase.from('workspace_invite').delete().eq('id', inviteData.id).single();

      return { data: null, error: emailError };
    }

    // Return invite
    return { data: invite, error: null };
  })(slug, cType);

// Accept workspace invite
export const acceptWorkspaceInvite = (inviteId: string, cType: 'server' | 'route') =>
  withUserAuth<TeamInviteProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get invite
    const { data: invite, error: inviteError } = await supabase
      .from('workspace_invite')
      .select()
      .eq('id', inviteId)
      .single();

    // If any errors, return error
    if (inviteError) {
      return { data: null, error: { message: inviteError.message, status: 500 } };
    }

    // Make sure invite exists
    if (!invite) {
      return { data: null, error: { message: 'Invite not found', status: 404 } };
    }

    // Validate invite user
    if (invite.email !== user!.email) {
      return { data: null, error: { message: 'Invalid invite', status: 400 } };
    }

    // Validate invite expiration (invite created_at + 7 days)
    const inviteExpiration = new Date(invite.created_at);
    inviteExpiration.setDate(inviteExpiration.getDate() + 7);

    if (inviteExpiration < new Date()) {
      return { data: null, error: { message: 'Invite has expired', status: 400 } };
    }

    // Validate invite status
    if (invite.accepted) {
      return { data: null, error: { message: 'Invite has already been accepted', status: 400 } };
    }

    // Add user to workspace
    const { error: memberError } = await supabase
      .from('workspace_member')
      .insert({ workspace_id: invite.workspace_id, member_id: user!.id })
      .single();

    // If any errors, return error
    if (memberError) {
      return { data: null, error: { message: memberError.message, status: 500 } };
    }

    // Set invite to accepted
    const { data: updatedInvite, error: updatedInviteError } = await supabase
      .from('workspace_invite')
      .update({ accepted: true })
      .eq('id', inviteId)
      .select()
      .single();

    // If any errors, return error
    if (updatedInviteError) {
      return { data: null, error: { message: updatedInviteError.message, status: 500 } };
    }

    // Return member
    return { data: updatedInvite, error: null };
  })(cType);

// Delete workspace invite
export const deleteWorkspaceInvite = (inviteId: string, cType: 'server' | 'route') =>
  withUserAuth<TeamInviteProps['Row']>(async (user, supabase, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Delete invite
    const { data: invite, error: inviteError } = await supabase
      .from('workspace_invite')
      .delete()
      .eq('id', inviteId)
      .select()
      .single();

    // If any errors, return error
    if (inviteError) {
      return { data: null, error: { message: inviteError.message, status: 500 } };
    }

    // Return invite
    return { data: invite, error: null };
  })(cType);
