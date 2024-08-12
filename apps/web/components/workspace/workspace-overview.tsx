import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@feedbase/ui/components/card';
import { WorkspaceProps } from '@/lib/types';
import { formatRootUrl } from '@/lib/utils';
import { Icons } from '../shared/icons/icons-static';

export default function WorkspaceOverview({ workspaces }: { workspaces: WorkspaceProps['Row'][] }) {
  return (
    <Card className='relative w-[450px] shadow-md'>
      <CardHeader className='flex flex-col items-center justify-center pt-10 text-center'>
        {/* Logo */}
        <div className='bg-foreground absolute -top-[18px] -mr-2 w-fit rounded-lg border shadow-sm'>
          <Icons.Logo className='fill-root h-8 w-fit' />
        </div>
        <CardTitle>Choose a Workspace</CardTitle>
        <CardDescription>
          You are a member of {workspaces.length} workspaces. If you don&apos;t see your workspace here, ask
          your team members to invite you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {workspaces.map((workspace) => (
          <Link
            key={workspace.id}
            href={`/${workspace.slug}`}
            className='group flex w-full border-x border-b p-2 first:rounded-t-md first:border-t last:rounded-b-md'>
            <div className='group-hover:bg-muted/[0.45] flex h-full w-full flex-col gap-2 rounded-sm p-3 group-hover:cursor-pointer'>
              <div className='flex flex-row items-center gap-3.5'>
                <Avatar className='bg-muted h-10 w-10 rounded-md border hover:cursor-pointer'>
                  <AvatarImage src={workspace.icon || ''} alt={workspace.name} className='rounded-md' />
                  <AvatarFallback className='select-none text-sm'>{workspace.name[0]}</AvatarFallback>
                </Avatar>
                <div className='flex h-10 flex-col items-start justify-between py-1'>
                  <h3 className='font-normal leading-4'>{workspace.name}</h3>
                  <p className='text-muted-foreground text-sm leading-3'>
                    {workspace.custom_domain && workspace.custom_domain_verified
                      ? `${workspace.slug}.${workspace.custom_domain}`
                      : formatRootUrl(workspace.slug).replace('https://', '').replace('http://', '')}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
      <CardFooter>
        <Button>Create Workspace</Button>
      </CardFooter>
    </Card>
  );
}
