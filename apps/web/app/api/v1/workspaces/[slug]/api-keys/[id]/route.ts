import { NextResponse } from 'next/server';
import { deleteWorkspaceApiKey } from '@/lib/api/api-key';

/*
  Delete api key for a workspace
  DELETE /api/v1/workspaces/:slug/config/api/:token
*/
export async function DELETE(req: Request, context: { params: { slug: string; id: string } }) {
  const { error } = await deleteWorkspaceApiKey(context.params.slug, context.params.id, 'route');

  if (error) {
    return NextResponse.json({ error }, { status: error.status });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
