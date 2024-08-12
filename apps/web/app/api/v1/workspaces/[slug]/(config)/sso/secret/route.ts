import { NextResponse } from 'next/server';
import { createWorkspaceSSOSecret } from '@/lib/api/workspace';

/* 
  Generate random jwt secret
  POST /api/v1/workspaces/:slug/config/integrations/sso/secret
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const { data, error } = await createWorkspaceSSOSecret(context.params.slug, 'route');

  // If there is an error, return it
  if (error) {
    return NextResponse.json(error, { status: error.status });
  }

  return NextResponse.json(data, { status: 200 });
}
