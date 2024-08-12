import { PostgrestError } from '@supabase/supabase-js';
import { withWorkspaceAuth } from '@/lib/auth';
import {
  ChangelogSubscriberProps,
  ChangelogWithAuthorProps,
  FeedbackTagProps,
  FeedbackWithUserProps,
} from '@/lib/types';

// Get Public Workspace Changelogs
export const getPublicWorkspaceChangelogs = withWorkspaceAuth<ChangelogWithAuthorProps[]>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get Changelogs
    const { data: changelogs, error: changelogsError } = (await supabase
      .from('changelog')
      .select('author:profile (full_name, avatar_url), *')
      .eq('workspace_id', workspace!.id)
      .eq('published', true)) as { data: ChangelogWithAuthorProps[]; error: PostgrestError | null };

    // Check for errors
    if (changelogsError) {
      return { data: null, error: { message: changelogsError.message, status: 500 } };
    }

    // Return changelogs
    return { data: changelogs, error: null };
  }
);

// Get Public Workspace Feedback
export const getPublicWorkspaceFeedback = withWorkspaceAuth<FeedbackWithUserProps[]>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get feedback and also include complete user object
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*, user:profile (avatar_url, full_name)')
      .eq('workspace_id', workspace!.id);

    // Check for errors
    if (feedbackError) {
      return { data: null, error: { message: feedbackError.message, status: 500 } };
    }

    // Convert feedback to unknown type and then to test type
    const feedbackData = feedback as unknown as FeedbackWithUserProps[];

    // Convert raw tags to tags and remove raw tags
    feedbackData.forEach((feedback) => {
      feedback.tags = feedback.raw_tags as unknown as FeedbackTagProps['Row'][];
    });

    // Get team members
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('workspace_member')
      .select('profile (full_name, avatar_url), *')
      .eq('workspace_id', workspace!.id);

    // Check for errors
    if (teamMembersError) {
      return { data: null, error: { message: teamMembersError.message, status: 500 } };
    }

    // Set team members
    feedbackData.forEach((feedback) => {
      feedback.user.isTeamMember = teamMembers.some((member) => member.member_id === feedback.user_id);
    });

    // If user logged in, get upvoted feedback
    if (user) {
      // Get upvoters
      const { data: userUpvotes, error: userUpvotesError } = await supabase
        .from('feedback_upvoter')
        .select()
        .eq('profile_id', user.id);

      // Check for errors
      if (userUpvotesError) {
        return { data: null, error: { message: userUpvotesError.message, status: 500 } };
      }

      // Get array of upvoted feedback ids
      const upvotedFeedbackIds = userUpvotes.map((upvoter) => upvoter.feedback_id);

      // Add has upvoted
      if (upvotedFeedbackIds.length > 0) {
        feedbackData.forEach((feedback) => {
          feedback.has_upvoted = upvotedFeedbackIds.includes(feedback.id);
        });
      }
    }

    // Return feedback
    return { data: feedbackData, error: null };
  }
);

// Subscribe to workspace changelogs
export const subscribeToWorkspaceChangelogs = (workspaceSlug: string, email: string) =>
  withWorkspaceAuth<ChangelogSubscriberProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Validate email
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { data: null, error: { message: 'Invalid email.', status: 400 } };
    }

    // Check if subscriber already exists for this workspace
    const { data: existingSubscriber } = await supabase
      .from('changelog_subscriber')
      .select()
      .eq('workspace_id', workspace!.id)
      .eq('email', email)
      .single();

    // If subscriber already exists, return error
    if (existingSubscriber) {
      return { data: null, error: { message: 'You are already subscribed to this workspace.', status: 400 } };
    }

    // Subscribe to workspace changelogs
    const { data: subscriber, error: subscriberError } = await supabase
      .from('changelog_subscriber')
      .insert({ workspace_id: workspace!.id, email })
      .select()
      .single();

    // Check for errors
    if (subscriberError) {
      return { data: null, error: { message: subscriberError.message, status: 500 } };
    }

    // Return subscriber
    return { data: subscriber, error: null };
  })(workspaceSlug, 'server', true, false);

// Unsubscribe from workspace changelogs
export const unsubscribeFromWorkspaceChangelogs = (workspaceSlug: string, subId: string) =>
  withWorkspaceAuth<ChangelogWithAuthorProps[]>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if subscriber exists
    const { data: existingSubscriber } = await supabase
      .from('changelog_subscriber')
      .select()
      .eq('id', subId)
      .single();

    // If subscriber doesn't exist, return error
    if (!existingSubscriber) {
      return { data: null, error: { message: 'Subscriber does not exist.', status: 400 } };
    }

    // Delete subscriber
    const { data, error: deleteError } = await supabase
      .from('changelog_subscriber')
      .delete()
      .eq('id', subId)
      .single();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return success
    return { data, error: null };
  })(workspaceSlug, 'server', true, false);
