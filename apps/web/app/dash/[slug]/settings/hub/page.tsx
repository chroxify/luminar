import { getWorkspaceModuleConfig } from '@/lib/api/module';
import { getWorkspaceBySlug } from '@/lib/api/workspace';

// import HubConfigCards from '@/components/dashboard/settings/hub-cards';

export default async function HubSettings({ params }: { params: { slug: string } }) {
  // Fetch workspace data
  const { data: workspace, error } = await getWorkspaceBySlug(params.slug, 'server');

  if (error) {
    return <div>{error.message}</div>;
  }

  // Fetch workspace config
  const { data: workspaceConfig, error: configError } = await getWorkspaceModuleConfig(params.slug, 'server');

  if (configError) {
    return <div>{configError.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      {/* Hub Card */}
      {/* <HubConfigCards workspaceData={workspace} workspaceConfigData={workspaceConfig} /> */}
    </div>
  );
}
