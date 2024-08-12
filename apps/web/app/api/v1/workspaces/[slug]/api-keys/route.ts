import { NextResponse } from 'next/server';
import { createWorkspaceApiKey, getWorkspaceApiKeys } from '@/lib/api/api-key';
import { ApiKeyPermissions } from '@/lib/types';

/*
  Get all API keys for a workspace
  GET /api/v1/workspaces/:slug/config/api
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  // Get all api keys
  const { data: apiKeys, error } = await getWorkspaceApiKeys(context.params.slug, 'route');

  if (error) {
    return NextResponse.json(error, { status: error.status });
  }

  return NextResponse.json(apiKeys, { status: 200 });
}

/*
  Create a new API key for a workspace  
  POST /api/v1/workspaces/:slug/config/api
  {
    "name": "string",
    "permissions": "string"
  }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { name, permission } = (await req.json()) as { name: string; permission: ApiKeyPermissions };

  // Validate input
  if (!name || !permission) {
    return NextResponse.json({ error: 'name and permission are required' }, { status: 400 });
  }

  // Create api key
  const { data: apiKey, error } = await createWorkspaceApiKey(
    context.params.slug,
    { name, permission },
    'route'
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(apiKey, { status: 200 });
}
