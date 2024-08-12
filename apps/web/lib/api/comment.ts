import { withFeedbackAuth } from '../auth';
import { CommentProps, CommentWithUserProps } from '../types';

// Create comment for feedback by id
export const createCommentForFeedbackById = (
  data: CommentProps['Insert'],
  workspaceSlug: string,
  cType: 'server' | 'route'
) =>
  withFeedbackAuth<CommentProps['Row']>(async (user, supabase, feedback, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // If reply_to_id is provided, make sure comment exists
    if (data.reply_to_id) {
      const { data: replyToComment, error: replyToCommentError } = await supabase
        .from('comment')
        .select()
        .eq('id', data.reply_to_id)
        .single();

      // Check for errors
      if (replyToCommentError) {
        return { data: null, error: { message: replyToCommentError.message, status: 500 } };
      }

      // Check if comment exists
      if (!replyToComment) {
        return { data: null, error: { message: 'comment not found.', status: 404 } };
      }
    }

    // Make sure comment is not empty or just html tags
    if (data.content.replace(/<[^>]*>?/gm, '').length === 0) {
      return { data: null, error: { message: 'comment cannot be empty.', status: 400 } };
    }

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from('comment')
      .insert({
        feedback_id: data.feedback_id,
        user_id: user!.id,
        content: data.content,
        reply_to_id: data.reply_to_id,
      })
      .select()
      .single();

    // Check for errors
    if (commentError) {
      return { data: null, error: { message: commentError.message, status: 500 } };
    }

    // Create workspace notification
    await supabase
      .from('notification')
      .insert({
        type: 'comment',
        workspace_id: workspace!.id,
        initiator_id: user!.id,
        feedback_id: data.feedback_id,
        comment_id: comment.id,
      })
      .select()
      .single();

    // Return comment
    return { data: comment, error: null };
  })(data.feedback_id, workspaceSlug, cType);

// Get comments for feedback by id
export const getCommentsForFeedbackById = withFeedbackAuth<CommentWithUserProps[]>(
  async (user, supabase, feedback, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('comment')
      .select('*, user:user_id (*)')
      .eq('feedback_id', feedback!.id);

    // Check for errors
    if (commentsError) {
      return { data: null, error: { message: commentsError.message, status: 500 } };
    }

    // Convert comments to CommentWithUserProps[]
    const commentsData = comments as unknown as CommentWithUserProps[];

    // Get team members
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('workspace_member')
      .select('profile (full_name, avatar_url), *')
      .eq('workspace_id', workspace!.id);

    if (teamMembersError) {
      return { data: null, error: { message: teamMembersError.message, status: 500 } };
    }

    // Set team members
    commentsData.forEach((comment) => {
      comment.user.isTeamMember = teamMembers.some((member) => member.member_id === comment.user_id);
    });

    // Check if user has upvoted any comments
    if (user) {
      // Get upvoters
      const { data: userUpvotes, error: userUpvotesError } = await supabase
        .from('comment_upvoter')
        .select()
        .eq('profile_id', user.id);

      if (userUpvotesError) {
        return { data: null, error: { message: userUpvotesError.message, status: 500 } };
      }

      // Set has_upvoted property
      commentsData.forEach((comment) => {
        comment.has_upvoted = userUpvotes.some((upvote) => upvote.comment_id === comment.id);
      });
    }

    // Restructure comments to have replies as a property
    const commentsWithReplies = commentsData.map((comment) => {
      // If comment has a reply_to_id, add it to the replies array of the comment it's replying to
      if (comment.reply_to_id) {
        const replyToComment = commentsData.find((c) => c.id === comment.reply_to_id);

        if (replyToComment) {
          if (!replyToComment.replies) {
            replyToComment.replies = [];
          }

          // Push comment to replies array
          replyToComment.replies.push(comment);
        }

        // Return null to remove comment from commentsWithReplies array
        return null;
      }

      return comment;
    });

    // Remove null values from commentsWithReplies array
    const nonNullCommentsWithReplies: CommentWithUserProps[] = commentsWithReplies.filter(
      (comment): comment is CommentWithUserProps => comment !== null
    );

    // Return comments
    return { data: nonNullCommentsWithReplies, error: null };
  }
);

// Delete comment for feedback by id
export const deleteCommentForFeedbackById = (
  commentId: string,
  feedbackId: string,
  workspaceSlug: string,
  cType: 'server' | 'route'
) =>
  withFeedbackAuth<CommentProps['Row']>(async (user, supabase, feedback, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Make sure comment exists
    const { data: comment, error: commentError } = await supabase
      .from('comment')
      .select()
      .eq('id', commentId)
      .single();

    // Check for errors
    if (commentError) {
      return { data: null, error: { message: commentError.message, status: 500 } };
    }

    // Check if comment exists
    if (!comment) {
      return { data: null, error: { message: 'comment not found.', status: 404 } };
    }

    // Make sure user is the author of the comment
    if (comment.user_id !== user!.id) {
      return { data: null, error: { message: 'only the author of the comment can delete it.', status: 403 } };
    }

    // Delete comment
    const { data: deletedComment, error: deletedCommentError } = await supabase
      .from('comment')
      .delete()
      .eq('id', commentId)
      .select()
      .single();

    // Check for errors
    if (deletedCommentError) {
      return { data: null, error: { message: deletedCommentError.message, status: 500 } };
    }

    // Return deletedComment
    return { data: deletedComment, error: null };
  })(feedbackId, workspaceSlug, cType);

// Upvote comment for feedback by id
export const upvoteCommentForFeedbackById = (
  commentId: string,
  feedbackId: string,
  workspaceSlug: string,
  cType: 'server' | 'route'
) =>
  withFeedbackAuth<CommentProps['Row'] & { has_upvoted: boolean }>(
    async (user, supabase, feedback, workspace, error) => {
      // If any errors, return error
      if (error) {
        return { data: null, error };
      }

      // Make sure comment exists
      const { data: comment, error: commentError } = await supabase
        .from('comment')
        .select()
        .eq('id', commentId)
        .single();

      // Check for errors
      if (commentError) {
        return { data: null, error: { message: commentError.message, status: 500 } };
      }

      // Check if comment exists
      if (!comment) {
        return { data: null, error: { message: 'comment not found.', status: 404 } };
      }

      // Check if user has already upvoted the comment
      const { data: upvoter, error: upvoterError } = await supabase
        .from('comment_upvoter')
        .select()
        .eq('profile_id', user!.id)
        .eq('comment_id', commentId)
        .single();

      // Check for errors
      if (upvoterError && upvoterError.code !== 'PGRST116') {
        return { data: null, error: { message: upvoterError.message, status: 500 } };
      }

      // If user has already upvoted the comment, delete upvote
      if (upvoter) {
        const { error: deletedUpvoteError } = await supabase
          .from('comment_upvoter')
          .delete()
          .eq('id', upvoter.id);

        // Check for errors
        if (deletedUpvoteError) {
          return { data: null, error: { message: deletedUpvoteError.message, status: 500 } };
        }

        // Return comment without upvote
        return {
          data: { ...comment, upvotes: comment.upvotes - 1, has_upvoted: false },
          error: null,
        };
      }

      // Create upvote
      const { error: upvoteError } = await supabase
        .from('comment_upvoter')
        .insert({ profile_id: user!.id, comment_id: commentId })
        .select()
        .single();

      // Check for errors
      if (upvoteError) {
        return { data: null, error: { message: upvoteError.message, status: 500 } };
      }

      // Return comment with upvote
      return {
        data: { ...comment, upvotes: comment.upvotes + 1, has_upvoted: true },
        error: null,
      };
    }
  )(feedbackId, workspaceSlug, cType);
