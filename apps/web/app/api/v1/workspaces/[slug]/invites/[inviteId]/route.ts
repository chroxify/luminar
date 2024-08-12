import { NextResponse } from 'next/server';
import { acceptWorkspaceInvite, deleteWorkspaceInvite } from '@/lib/api/invite';

/*
  Accept workspace invite
  POST /api/v1/workspaces/[slug]/invites/[inviteId]
*/
export async function POST(req: Request, context: { params: { slug: string; inviteId: string } }) {
  const { data: invite, error } = await acceptWorkspaceInvite(context.params.inviteId, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json(invite, { status: 200 });
}

/*
  Delete workspace invite
  DELETE /api/v1/workspaces/[slug]/invites/[inviteId]
*/
export async function DELETE(req: Request, context: { params: { slug: string; inviteId: string } }) {
  const { data: invite, error } = await deleteWorkspaceInvite(context.params.inviteId, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json(invite, { status: 200 });
}
