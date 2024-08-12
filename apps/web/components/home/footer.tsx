'use client';

import Link from 'next/link';
import { cn } from '@feedbase/ui/lib/utils';
import { formatRootUrl } from '@/lib/utils';
import { Icons } from '../shared/icons/icons-static';
import { navTabs } from './header';

export default function HomeFooter({ fixed }: { fixed?: boolean }) {
  return (
    <div className={cn('w-full', fixed && 'fixed bottom-0')}>
      <div className='flex h-28 w-full flex-col items-center justify-evenly border-t px-20 md:h-28 md:flex-row md:justify-between'>
        {/* Socials */}
        <div className='flex flex-row items-center justify-center gap-5 md:flex'>
          <Link
            href={formatRootUrl('', '/twitter')}
            target='_blank'
            rel='noopener noreferrer'
            className='select-none'>
            <Icons.Twitter className='fill-foreground/60 hover:fill-foreground/90 h-5 w-5 transition duration-200 ease-in-out' />
          </Link>

          <Link
            href={formatRootUrl('', '/github')}
            target='_blank'
            rel='noopener noreferrer'
            className='select-none'>
            <Icons.Github className='text-foreground/60 hover:text-foreground/90 h-5 w-5 transition duration-200 ease-in-out' />
          </Link>
        </div>

        {/* Links */}
        <div className='flex flex-row items-center justify-center gap-10'>
          {navTabs.map((tab) => (
            <Link
              href={tab.href}
              className='text-foreground/70 hover:text-foreground/90 text-sm  transition duration-200 ease-in-out'
              key={tab.label.toLowerCase()}>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Name */}
        <div className='text-foreground/60 hidden flex-row items-center justify-center gap-5 text-sm  md:flex'>
          © {new Date().getFullYear()} Feedbase
        </div>
      </div>
    </div>
  );
}
