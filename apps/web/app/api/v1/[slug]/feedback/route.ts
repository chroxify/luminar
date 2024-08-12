import { NextResponse } from 'next/server';
import { getPublicWorkspaceFeedback } from '@/lib/api/public';

/* 
  Get public feedback
  GET /api/v1/[slug]/feedback
  */
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: feedback, error } = await getPublicWorkspaceFeedback(
    context.params.slug,
    'route',
    true,
    false
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
