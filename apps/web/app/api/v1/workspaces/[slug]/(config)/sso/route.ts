import { NextResponse } from 'next/server';
import { updateWorkspaceBySlug } from '@/lib/api/workspace';

/*
  Update SSO configuration
  PATCH /api/v1/workspaces/:slug/config/integrations/sso
  {
    enabled: boolean,
    url: string
  }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { enabled, url } = await req.json();

  // Update workspace config
  const { data: updatedWorkspaceConfig, error } = await updateWorkspaceBySlug(
    context.params.slug,
    {
      sso_auth_enabled: enabled,
      sso_auth_url: url,
    },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return updated workspace config
  return NextResponse.json(updatedWorkspaceConfig, { status: 200 });
}
