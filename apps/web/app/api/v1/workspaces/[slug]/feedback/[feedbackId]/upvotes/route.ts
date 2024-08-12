import { NextRequest, NextResponse } from 'next/server';
import { getFeedbackById, getFeedbackUpvotersById, upvoteFeedbackByID } from '@/lib/api/feedback';

/*
  Get feedback upvotes
  GET /api/v1/workspaces/[slug]/feedback/[id]/upvotes
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

  // Get feedback upvoters
  const { data: upvoters, error: upvotersError } = await getFeedbackUpvotersById(
    context.params.feedbackId,
    context.params.slug,
    'route'
  );

  // If any errors thrown, return error
  if (upvotersError) {
    return NextResponse.json({ error: upvotersError.message }, { status: upvotersError.status });
  }

  // Return feedback
  return NextResponse.json(
    {
      upvotes: feedback.upvotes,
      upvoters,
    },
    { status: 200 }
  );
}

/*
    Upvote a feedback
    POST /api/v1/workspaces/[slug]/feedback/[id]/upvotes
*/
export async function POST(req: NextRequest, context: { params: { slug: string; feedbackId: string } }) {
  // Upvote feedback
  const { data: feedback, error } = await upvoteFeedbackByID(
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
