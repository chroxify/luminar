import { NextRequest, NextResponse } from 'next/server';
import { createFeedback, getAllBoardFeedback, getAllWorkspaceFeedback } from '@/lib/api/feedback';
import { FeedbackWithUserInputProps } from '@/lib/types';

export const runtime = 'edge';

/*
    Create Feedback
    POST /api/v1/workspaces/[slug]/feedback
    {
        title: string;
        content: string;
        status: string;
        tags: [id, id, id],
        board_id?: string;
    }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const {
    title,
    content,
    status,
    tags,
    user,
    board_id: boardId,
  } = (await req.json()) as FeedbackWithUserInputProps;

  // Validate Request Body
  if (!title) {
    return NextResponse.json({ error: 'title is required.' }, { status: 400 });
  }

  const { data: feedback, error } = await createFeedback(
    boardId,
    context.params.slug,
    {
      title: title || '',
      content: content || '',
      status: status?.toLowerCase() as FeedbackWithUserInputProps['status'],
      board_id: boardId || '',
      workspace_id: context.params.slug,
      user_id: 'dummy-id',
      tags: tags || [],
      user: user !== null ? user : undefined,
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
    Get Workspace Feedback
    GET /api/v1/workspaces/[slug]/feedback
    Query Parameters: 
    - b (board_id): string
*/
export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  // Get query parameters
  const boardId = req.nextUrl.searchParams.get('b');

  // If boardId is provided, get feedback by boardId
  if (boardId) {
    const { data: feedback, error } = await getAllBoardFeedback(boardId, context.params.slug, 'route');

    // If any errors thrown, return error
    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    // Return feedback
    return NextResponse.json(feedback, { status: 200 });
  }

  // Get all feedback
  const { data: feedback, error } = await getAllWorkspaceFeedback(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
