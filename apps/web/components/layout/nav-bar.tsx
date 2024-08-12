'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { cn } from '@feedbase/ui/lib/utils';
import { satoshi } from '@feedbase/ui/styles/fonts';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { ProfileProps, WorkspaceProps, WorkspaceThemeProps } from '@/lib/types';
import { hslToHex } from '@/lib/utils';
import AuthModal from '../modals/login-signup-modal';
import UserDropdown from '../shared/user-dropdown';

interface TabProps {
  name: string;
  link: string;
  items?: TabProps[];
}

export default function Header({
  tabs,
  intialTab,
  workspace,
  workspaceTheme,
  user,
}: {
  tabs: TabProps[];
  intialTab: TabProps;
  workspace: WorkspaceProps['Row'];
  workspaceTheme: WorkspaceThemeProps['Row'];
  user: ProfileProps['Row'] | null;
}) {
  const [currentTab, setCurrentTab] = useState(intialTab);
  const router = useRouter();
  const pathname = usePathname();

  // check for tab change
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.link === pathname);
    if (currentTab) {
      setCurrentTab(currentTab);
    }
  }, [pathname, tabs]);

  return (
    <div className='bg-root fixed z-30 flex h-14 w-full items-center justify-center border-b'>
      <div className='flex h-full w-full items-center justify-between px-5 sm:px-10 lg:max-w-screen-xl'>
        {/* Branding, Navigation */}
        <div className='flex w-full items-center justify-center gap-12'>
          {/* Branding */}
          <Link
            href={workspace.icon_redirect_url || '/'}
            className='flex cursor-pointer select-none flex-row items-center gap-3.5'>
            {/* Logo Image */}
            {workspace?.icon ? (
              <Image
                src={workspace?.icon || ''}
                alt='Logo'
                width={35}
                height={35}
                className={workspace?.icon_radius || ''}
              />
            ) : null}

            {/* Name */}
            <div
              className={cn(
                satoshi.variable,
                'text-foreground/90 font-satoshi text-center text-lg font-medium'
              )}>
              {workspace?.name}
            </div>
          </Link>

          {/* Navigation */}
          <div className='mt-1 flex h-full w-full flex-row items-center gap-5'>
            {tabs.map((tab) =>
              tab.items && tab.items.length > 0 ? (
                <DropdownMenu key={tab.name.toLowerCase()}>
                  <DropdownMenuTrigger className='hover:text-foreground text-secondary-foreground flex items-center justify-center gap-1 text-sm outline-none transition-colors duration-150'>
                    {tab.name}
                    <ChevronUpDownIcon className='h-4 w-4' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start'>
                    <DropdownMenuItem
                      key={tab.name.toLowerCase()}
                      onSelect={() => {
                        setCurrentTab(tab);
                        router.push('/');
                      }}>
                      All {tab.name}
                    </DropdownMenuItem>
                    {tab.items.map((item) => (
                      <DropdownMenuItem
                        key={item.name.toLowerCase()}
                        onSelect={() => {
                          setCurrentTab(item);
                          router.push(item.link);
                        }}>
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href={tab.link}
                  className={cn(
                    'hover:text-foreground text-secondary-foreground text-sm font-normal transition-colors',
                    currentTab.link === tab.link && 'text-foreground'
                  )}
                  key={tab.name.toLowerCase()}>
                  {tab.name}
                </Link>
              )
            )}
          </div>
        </div>

        {/* User, Login */}
        <div className='flex items-center gap-4'>
          {/* User */}
          {user && !user.is_anonymous ? (
            <UserDropdown
              user={user}
              iconColor={workspaceTheme.theme === 'custom' ? hslToHex(workspaceTheme.foreground) : undefined}
            />
          ) : null}

          {/* Login */}
          {!workspace.sso_auth_enabled && (!user || user?.is_anonymous) ? (
            <AuthModal>
              <Button variant='default' size='sm'>
                Login
              </Button>
            </AuthModal>
          ) : null}

          {/* SSO */}
          {workspace.sso_auth_enabled && (!user || user?.is_anonymous) ? (
            <Link href={workspace.sso_auth_url || ''}>
              <Button variant='default' size='sm'>
                Login with {workspace?.name}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
