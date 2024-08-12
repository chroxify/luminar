import { NextResponse } from 'next/server';
import { updateWorkspaceIntegrations } from '@/lib/api/integration';

/*
    Update Slack integration
    PATCH /api/v1/workspaces/:slug/config/integrations/slack
    {
        status: boolean,
        webhook: string,
    }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const { enabled, webhook } = (await req.json()) as {
    enabled: boolean;
    webhook: string;
  };

  // If status is true, make sure webhook and roleId are not empty
  if (enabled && !webhook) {
    return NextResponse.json(
      { error: 'webhook is required when enabling Slack integration.' },
      { status: 400 }
    );
  }

  // Update workspace config
  const { data: updatedWorkspaceConfig, error } = await updateWorkspaceIntegrations(
    context.params.slug,
    {
      slack_enabled: enabled,
      slack_webhook: enabled ? webhook : null,
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
