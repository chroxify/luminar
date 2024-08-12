import { notFound, redirect } from 'next/navigation';
import { getWorkspaceBySlug } from '@/lib/api/workspace';
import UnsubscribeChangelogCard from '@/components/changelog/unsubscribe-card';

export default async function ChangelogUnsubscribe({
  params,
  searchParams,
}: {
  params: { workspace: string };
  searchParams: { subId: string };
}) {
  if (!searchParams.subId) {
    redirect('/');
  }

  // Check if subId is in uuid format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(searchParams.subId)) {
    redirect('/');
  }

  // Get workspace
  const { data: workspace, error } = await getWorkspaceBySlug(params.workspace, 'server', true, false);

  // If workspace is undefined redirects to 404
  if (error?.status === 404 || !workspace) {
    notFound();
  }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <UnsubscribeChangelogCard workspace={workspace} subId={searchParams.subId} />
    </div>
  );
}
