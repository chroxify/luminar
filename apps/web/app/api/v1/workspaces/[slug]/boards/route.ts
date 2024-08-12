import { NextResponse } from 'next/server';
import { getWorkspaceBoards } from '@/lib/api/boards';

/* 
  Get all workspace boards
  GET /api/v1/workspaces/[slug]/boards
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: boards, error } = await getWorkspaceBoards(context.params.slug, 'route', true, false);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return boards
  return NextResponse.json(boards, { status: 200 });
}
