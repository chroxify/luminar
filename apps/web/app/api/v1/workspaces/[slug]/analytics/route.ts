import { NextRequest, NextResponse } from 'next/server';
import { getWorkspaceAnalytics } from '@/lib/api/workspace';

/*
  Get Analytics
  GET /api/v1/workspaces/:slug/analytics
*/
export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  // Check if tinybird variables are set
  if (!process.env.TINYBIRD_API_URL || !process.env.TINYBIRD_API_KEY) {
    return NextResponse.json({ error: 'Tinybird variables not set.' }, { status: 500 });
  }

  // Get query params
  const start = req.nextUrl.searchParams.get('start');
  const end = req.nextUrl.searchParams.get('end');

  // Check if start and end are valid dates
  if ((start && !Date.parse(start)) || (end && !Date.parse(end))) {
    return NextResponse.json({ error: 'Invalid start or end date.' }, { status: 400 });
  }

  const { data: analyticsData, error } = await getWorkspaceAnalytics(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return response
  return NextResponse.json(analyticsData, { status: 200 });
}
