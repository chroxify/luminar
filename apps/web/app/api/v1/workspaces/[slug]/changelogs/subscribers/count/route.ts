import { NextResponse } from 'next/server';
import { getChangelogSubscribers } from '@/lib/api/changelog';

/*
  Get the subscribers count for a workspace changelog
  GET /api/v1/workspaces/:slug/changelogs/subscribers/count
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: subscribers, error } = await getChangelogSubscribers(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return new Response(error.message, { status: error.status });
  }

  return NextResponse.json({ count: subscribers.length });
}
