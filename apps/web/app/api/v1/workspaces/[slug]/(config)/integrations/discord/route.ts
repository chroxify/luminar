import { NextResponse } from 'next/server';
import { updateWorkspaceIntegrations } from '@/lib/api/integration';

/*
    Update Discord integration
    PATCH /api/v1/workspaces/:slug/config/integrations/discord
    {
        enabled: boolean,
        webhook: string,
        roleId: string,
    }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { enabled, webhook, roleId } = (await req.json()) as {
    enabled: boolean;
    webhook: string;
    roleId: number;
  };

  // If status is true, make sure webhook and roleId are not empty
  if (enabled && !webhook) {
    return NextResponse.json(
      { error: 'webhook is required when enabling Discord integration.' },
      { status: 400 }
    );
  }

  // Update workspace config
  const { data: updatedWorkspaceConfig, error } = await updateWorkspaceIntegrations(
    context.params.slug,
    {
      discord_enabled: enabled,
      discord_webhook: enabled ? webhook : null,
      discord_role_id: enabled ? roleId : null,
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
