import { NextResponse } from 'next/server';
import { getUserWorkspaces } from '@/lib/api/user';
import { createWorkspace } from '@/lib/api/workspace';

/*
    Create Workspace
    POST /api/v1/workspaces
    {
        "name": "Workspace Name",
        "slug": "workspace-slug",
    }
*/
export async function POST(req: Request) {
  // Get Request Body
  const { name, slug } = await req.json();

  // Validate Request Body
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required.' }, { status: 400 });
  }

  // Create Workspace
  const { data: workspace, error } = await createWorkspace({ name, slug }, 'route');

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(workspace, { status: 201 });
}

/*
    Get User Workspaces
    GET /api/v1/workspaces
*/
export async function GET(req: Request) {
  // Get User Workspaces
  const { data: workspaces, error } = await getUserWorkspaces('route');

  // Check for errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return workspaces
  return NextResponse.json(workspaces, { status: 200 });
}
