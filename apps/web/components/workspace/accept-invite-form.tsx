'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@feedbase/ui/components/card';
import { toast } from 'sonner';
import { ExtendedInviteProps, ProfileProps } from '@/lib/types';
import { formatRootUrl } from '@/lib/utils';

export default function WorkspaceInviteForm({
  invite,
  user,
}: {
  invite: ExtendedInviteProps;
  user: ProfileProps['Row'] | null;
}) {
  const router = useRouter();

  // Accept invitation
  function acceptInvitation() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${invite.workspace.slug}/invites/${invite.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    toast.promise(promise, {
      loading: 'Accepting invitation...',
      success: () => {
        router.push(`/${invite.workspace.slug}`);
        return `Invitation accepted! Redirecting...`;
      },
      error: (err) => {
        return err;
      },
    });
  }

  // Expiration date = created_at + 7 days
  const expirationDate = new Date(invite.created_at);
  expirationDate.setDate(expirationDate.getDate() + 7);

  return (
    <Card className='w-full p-5 sm:max-w-md sm:p-6'>
      <CardHeader className='flex flex-col items-center space-y-2'>
        <Avatar className='border-border/80 h-14 w-14 rounded-md border'>
          <AvatarImage
            src={
              invite.workspace.icon !== '' || invite.workspace.icon !== null
                ? invite.workspace.icon
                : `${formatRootUrl()}/icon-512x512.png`
            }
            alt='Workspace Icon'
          />
          <AvatarFallback className='rounded-md'>
            {invite.workspace.name[0].toUpperCase() + invite.workspace.name[1].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className='pt-5 text-center text-lg'>
          You&apos;ve been invited to join {invite.workspace.name}
        </CardTitle>
        <CardDescription className='text-center'>
          {invite.creator.full_name} has invited you to join and collaborate on the workspace{' '}
          <strong className='text-foreground/70'>{invite.workspace.name}</strong> on Feedbase.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-5'>
        {(!user || user.email !== invite.email) && (
          <span className='text-foreground/50 text-center text-sm '>
            To accept this invitation, please login as{' '}
            <strong className='text-foreground/70 inline-flex'>{invite.email}</strong>.
          </span>
        )}

        {!invite.accepted &&
          expirationDate > new Date() &&
          (!user || user.email !== invite.email ? (
            <Link href='/login'>
              <Button className='w-full'> Sign In </Button>
            </Link>
          ) : (
            <Button className='w-full' onClick={acceptInvitation}>
              {' '}
              Accept Invitation{' '}
            </Button>
          ))}

        {/* Invalid invitation */}
        {invite.accepted || expirationDate < new Date() ? (
          <Button className='w-full' disabled>
            {' '}
            {invite.accepted ? 'Invitation accepted' : 'Invitation expired'}{' '}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
