import Link from 'next/link';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { SidebarTabProps, SidebarTabsProps } from '@/lib/types';
import NavTabs from '@/components/layout/nav-tabs';
import ToggleThemeButton from './theme-button';

export default async function Sidebar({
  tabs,
  initialTab,
  subSidebar,
}: {
  tabs: SidebarTabsProps;
  initialTab: SidebarTabProps;
  subSidebar?: {
    label: string;
    backTo: string;
  };
}) {
  return (
    <div
      className={cn(
        'bg-root fixed left-0 top-14 z-40 hidden h-full min-w-[240px] flex-col items-center justify-between border-r pb-20 md:flex',
        subSidebar ? 'z-50' : ''
      )}>
      {/* Back Button */}
      <div className='flex w-full flex-col items-center'>
        {subSidebar ? <Link
            href={subSidebar.backTo}
            className='text-foreground/70 hover:text-foreground flex w-full items-center justify-start gap-1 border-b p-5 transition-colors'>
            <ChevronLeft className='h-5 w-5' />
            <span>{subSidebar.label}</span>
          </Link> : null}

        {/* Tabs */}
        <div className='flex w-full flex-col gap-y-10 p-5'>
          {/* Main Tabs */}
          <NavTabs tabs={tabs} initialTab={initialTab} />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className='flex w-full flex-col px-5'>
        <ToggleThemeButton />
      </div>
    </div>
  );
}
