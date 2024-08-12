import { notFound } from 'next/navigation';
import { getWorkspaceInvite } from '@/lib/api/invite';
import { getCurrentUser } from '@/lib/api/user';
import WorkspaceInviteForm from '@/components/workspace/accept-invite-form';

export default async function WorkspaceInvite({ params }: { params: { inviteId: string } }) {
  const { data: invite, error: inviteError } = await getWorkspaceInvite(params.inviteId, 'server');

  if (inviteError) {
    return notFound();
  }

  // Get current user
  const { data: user } = await getCurrentUser('server');

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <WorkspaceInviteForm invite={invite} user={user} />
    </div>
  );
}
