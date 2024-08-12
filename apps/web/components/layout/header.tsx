import Link from 'next/link';
import { ProfileProps, WorkspaceProps } from '@/lib/types';
import { Icons } from '@/components/shared/icons/icons-static';
import UserDropdown from '@/components/shared/user-dropdown';
import InboxPopover from '@/components/workspace/inbox-popover';
import WorkspaceDropdown from '../workspace/workspace-dropdown';

export default function DashboardHeader({
  user,
  workspaces,
  currentWorkspace,
}: {
  user: ProfileProps['Row'];
  workspaces: WorkspaceProps['Row'][];
  currentWorkspace: WorkspaceProps['Row'];
}) {
  return (
    <div className='bg-root fixed top-0 z-50 flex h-14 w-full flex-row items-center justify-between border-b px-5'>
      <div className='flex items-center gap-5'>
        {/* Logo */}
        <Link href='/' className='h-fit w-fit'>
          <Icons.Logo className='fill-foreground -mr-2 h-8 w-fit shrink-0' />
        </Link>

        {/* Seperator */}
        <div className='bg-border h-5 w-[1px] rotate-[35deg] transform' />

        {/* Workspace */}
        <WorkspaceDropdown workspaces={workspaces} activeWorkspace={currentWorkspace} />
      </div>

      <div className='flex flex-row items-center gap-2'>
        <InboxPopover user={user} />
        <UserDropdown user={user} />
      </div>
    </div>
  );
}
