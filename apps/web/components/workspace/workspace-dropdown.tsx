'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronsUpDownIcon, GlobeIcon, Plus } from 'lucide-react';
import { WorkspaceProps } from '@/lib/types';
import AddWorkspaceDialog from '@/components/modals/add-workspace-modal';

export default function WorkspaceDropdown({
  workspaces,
  activeWorkspace,
  className,
}: {
  workspaces: WorkspaceProps['Row'][];
  activeWorkspace: WorkspaceProps['Row'] | undefined;
  className?: string;
}) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceProps['Row'] | undefined>(
    activeWorkspace
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            'group w-fit min-w-[100px] shrink-0 justify-between rounded-lg pl-1 pr-1.5',
            className
          )}>
          <div className='flex flex-row items-center justify-start gap-1.5'>
            {activeWorkspace?.icon ? (
              <div className='ml-[2px] flex items-center justify-center'>
                <Image
                  src={activeWorkspace.icon}
                  width={22}
                  height={22}
                  className='rounded-sm'
                  alt='Workspace Icon'
                />
              </div>
            ) : (
              <div className='flex flex-row items-center justify-center p-[6px]'>
                <GlobeIcon className='text-foreground/70 h-4 w-4' />
              </div>
            )}
            {/* While selected workspace is null (incase of unexpected error), show skeleton */}
            <span className='text-sm'>
              {selectedWorkspace ? selectedWorkspace.name : <Skeleton className='h-4 w-20' />}
            </span>
          </div>
          <ChevronsUpDownIcon className='text-muted-foreground group-hover:text-foreground h-3.5 w-3.5 transition-colors' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-[200px] justify-between', className)} align='start'>
        {workspaces.map((workspace) => (
          <Link href={`/${workspace.slug}`} key={workspace.id}>
            <DropdownMenuItem
              onSelect={() => {
                setSelectedWorkspace(workspace);
              }}
              className='flex flex-row items-center gap-2'>
              {workspace.icon ? (
                <Image
                  src={workspace.icon}
                  width={22}
                  height={22}
                  className='rounded-sm'
                  alt='Workspace Icon'
                />
              ) : (
                <div className='flex items-center justify-center rounded-sm px-[3.5px]'>
                  <GlobeIcon className='text-foreground/70 h-4 w-4' />
                </div>
              )}
              {workspace.name}
            </DropdownMenuItem>
          </Link>
        ))}
        <AddWorkspaceDialog
          trigger={
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
              }}>
              <div className='flex flex-row items-center gap-3 pl-[3.5px]'>
                <Plus className='text-foreground/70 h-4 w-4' />
                New Workspace
              </div>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
