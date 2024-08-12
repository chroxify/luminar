import { NextResponse } from 'next/server';
import { upvoteCommentForFeedbackById } from '@/lib/api/comment';

/*
    Upvote comment for feedback by id
    POST /api/v1/workspaces/[slug]/feedback/[id]/comments/[id]/upvote
*/
export async function POST(
  req: Request,
  context: { params: { slug: string; feedbackId: string; commentId: string } }
) {
  const { data: comment, error } = await upvoteCommentForFeedbackById(
    context.params.commentId,
    context.params.feedbackId,
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return comment
  return NextResponse.json(comment, { status: 200 });
}
