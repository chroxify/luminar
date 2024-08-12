import { NextResponse } from 'next/server';
import { getPublicWorkspaceChangelogs } from '@/lib/api/public';

/*
    Get workspace changelogs
    GET /api/v1/workspaces/[slug]/changelogs
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: changelogs, error } = await getPublicWorkspaceChangelogs(
    context.params.slug,
    'route',
    true,
    false
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return changelogs
  return NextResponse.json(changelogs, { status: 200 });
}
