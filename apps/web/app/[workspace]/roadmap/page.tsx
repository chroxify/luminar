import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { getWorkspaceModuleConfig } from '@/lib/api/module';
import { getCurrentUser } from '@/lib/api/user';
import { getWorkspaceBySlug } from '@/lib/api/workspace';
import Roadmap from '@/components/roadmap/hub/roadmap';
import AnalyticsWrapper from '@/components/shared/analytics-wrapper';

type Props = {
  params: { workspace: string };
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get workspace
  const { data: workspace, error } = await getWorkspaceBySlug(params.workspace, 'server', true, false);

  // If workspace is undefined redirects to 404
  if (error?.status === 404 || !workspace) {
    notFound();
  }

  return {
    title: `Roadmap - ${workspace.name}`,
    description: 'Have a suggestion or found a bug? Let us know!',
  };
}

export default async function Feedback({ params }: Props) {
  const headerList = headers();
  const pathname = headerList.get('x-pathname');

  // Get current user
  const { data: user } = await getCurrentUser('server');

  // Get workspace module config
  const { data: moduleConfig, error: moduleError } = await getWorkspaceModuleConfig(
    params.workspace,
    'server',
    true,
    false
  );

  if (moduleError) {
    return <div>{moduleError.message}</div>;
  }

  return (
    <AnalyticsWrapper className='items-center gap-9' workspaceSlug={params.workspace}>
      {/* Title, Description */}
      <div className='flex w-full px-5 sm:px-8 lg:px-14'>
        <div className='flex w-full flex-col items-start gap-2'>
          <h1 className='font- text-xl sm:text-2xl'>Roadmap</h1>
          <p className='text-secondary-foreground text-base font-normal'>
            View what we&apos;re working on and what&apos;s coming next.
          </p>
        </div>
      </div>

      {/* Seperator */}
      <Separator className='bg-border/60' />

      {/* Roadmap */}
      <Roadmap />
    </AnalyticsWrapper>
  );
}
