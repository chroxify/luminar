import { NextResponse } from 'next/server';
import { deleteFeedbackById, getFeedbackById, updateFeedbackByID } from '@/lib/api/feedback';
import { FeedbackWithUserInputProps } from '@/lib/types';

/*
    Get Workspace Feedback by ID
    GET /api/v1/workspaces/[slug]/feedback/[id]
*/
export async function GET(req: Request, context: { params: { slug: string; feedbackId: string } }) {
  const { data: feedback, error } = await getFeedbackById(
    context.params.feedbackId,
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}

/*
    Update Feedback by ID
    PATCH /api/v1/workspaces/[slug]/feedback/[id]
    {
        title: string;
        content: string;
        status: string;
        tags: string[];
        board_id: string;
    }
*/
export async function PATCH(req: Request, context: { params: { slug: string; feedbackId: string } }) {
  const {
    title,
    content,
    status,
    tags,
    board_id: boardId,
  } = (await req.json()) as FeedbackWithUserInputProps;

  const { data: feedback, error } = await updateFeedbackByID(
    context.params.feedbackId,
    context.params.slug,
    {
      title: title || '',
      content: content || '',
      status: status?.toLowerCase() as FeedbackWithUserInputProps['status'],
      board_id: boardId || '',
      user_id: 'dummy-id',
      tags: tags || undefined,
      workspace_id: 'dummy-id',
    },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}

/*
    Delete Feedback by ID
    DELETE /api/v1/workspaces/[slug]/feedback/[id]
*/
export async function DELETE(req: Request, context: { params: { slug: string; feedbackId: string } }) {
  const { data: feedback, error } = await deleteFeedbackById(
    context.params.feedbackId,
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
