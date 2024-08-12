import { NextResponse } from 'next/server';
import { getWorkspaceModuleConfig } from '@/lib/api/module';

/* 
  Get workspace module config
  GET /api/v1/workspaces/[slug]/modules
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  // Get workspace module config
  const { data: moduleConfig, error } = await getWorkspaceModuleConfig(context.params.slug, 'route');

  if (error) {
    return NextResponse.json(error, { status: error.status });
  }

  return NextResponse.json(moduleConfig, { status: 200 });
}
