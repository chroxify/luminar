import { NextResponse } from 'next/server';
import { deleteCommentForFeedbackById } from '@/lib/api/comment';

/*
    Delete comment for feedback by id
    DELETE /api/v1/workspaces/[slug]/feedback/[id]/comments/[id]
*/
export async function DELETE(
  req: Request,
  context: { params: { slug: string; feedbackId: string; commentId: string } }
) {
  const { data: comment, error } = await deleteCommentForFeedbackById(
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
