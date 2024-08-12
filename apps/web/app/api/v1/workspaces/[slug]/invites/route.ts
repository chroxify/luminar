import { NextResponse } from 'next/server';
import { createWorkspaceInvite, getWorkspaceInvites } from '@/lib/api/invite';

/*
  Get all workspace invites
  GET /api/v1/workspaces/[slug]/invites
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: invites, error } = await getWorkspaceInvites(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return invites
  return NextResponse.json(invites, { status: 200 });
}

/* 
  Invite a new member to a workspace
  POST /api/v1/workspaces/[slug]/members
  {
    email: string
  }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { email } = await req.json();

  // Create invite
  const { data: invite, error } = await createWorkspaceInvite(context.params.slug, 'route', email);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return invite
  return NextResponse.json(invite, { status: 200 });
}
