import { NextResponse } from 'next/server';
import { createCommentForFeedbackById, getCommentsForFeedbackById } from '@/lib/api/comment';
import { CommentProps } from '@/lib/types';

/* 
    Create feedback comment
    POST /api/v1/workspaces/[slug]/feedback/[id]/comments
    {
        content: string
        reply_to_id?: string
    }
*/
export async function POST(req: Request, context: { params: { slug: string; feedbackId: string } }) {
  const { content, reply_to_id: replyToId } = (await req.json()) as CommentProps['Insert'];

  if (!content) {
    return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
  }

  const { data: comment, error } = await createCommentForFeedbackById(
    {
      feedback_id: context.params.feedbackId,
      content: content || '',
      user_id: 'dummy-id',
      reply_to_id: replyToId || null,
    },
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

/*
    Get feedback comments
    GET /api/v1/workspaces/[slug]/feedback/[id]/comments
*/
export async function GET(req: Request, context: { params: { slug: string; feedbackId: string } }) {
  const { data: comments, error } = await getCommentsForFeedbackById(
    context.params.feedbackId,
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return comments
  return NextResponse.json(comments, { status: 200 });
}
