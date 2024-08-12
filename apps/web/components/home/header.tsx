'use client';

import Link from 'next/link';
import { Button } from '@feedbase/ui/components/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@feedbase/ui/components/sheet';
import { cn } from '@feedbase/ui/lib/utils';
import { MenuIcon } from 'lucide-react';
import useScroll from '@/lib/hooks/use-scroll';
import { formatRootUrl } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';

export const navTabs = [
  {
    label: 'Docs',
    href: '/docs',
  },
  {
    label: 'Demo',
    href: '/demo',
  },
  {
    label: 'Deploy',
    href: '/deploy',
  },
];

export default function HomeNav() {
  const scrolled = useScroll(60);

  return (
    <div className='absolute top-0 z-50 flex h-20 w-full flex-row items-center justify-center px-5'>
      <div
        className={cn(
          'flex w-full max-w-screen-2xl flex-row items-center justify-between',
          scrolled && 'justify-center'
        )}>
        {/* Logo */}
        <Link href='/'>
          <Icons.LogoText className='fill-foreground w-24' />
        </Link>

        {/* Static Nav Tabs */}
        <div
          className={cn(
            'hover:bg-background hidden h-[46px] flex-row items-center justify-center gap-2 rounded-full px-2 py-2.5 transition-all hover:border sm:flex',
            scrolled && 'hidden'
          )}>
          {navTabs.map((tab) => (
            <Link
              href={tab.href}
              className='text-foreground/80 hover:border-border hover:bg-foreground/5 flex h-8 items-center justify-center rounded-full border border-transparent px-3 text-sm  transition-all'
              key={tab.label.toLowerCase()}>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Dynamic Nav Tabs */}
        <div
          className={cn(
            'bg-background fixed top-4 flex h-[46px] -translate-y-full transform flex-row items-center justify-center gap-2 rounded-full border px-2 py-2.5 opacity-0 shadow-md transition-transform',
            scrolled && 'translate-y-0 opacity-100'
          )}>
          {navTabs.map((tab) => (
            <Link
              href={tab.href}
              className='text-foreground/80 hover:border-border hover:bg-foreground/5 flex h-8 items-center justify-center rounded-full border border-transparent px-3 text-sm  transition-all'
              key={tab.label.toLowerCase()}>
              {tab.label}
            </Link>
          ))}

          {scrolled ? (
            <Link href={formatRootUrl('dash', '/signup')}>
              <Button
                className='border-background h-8 min-w-fit shrink-0 rounded-full border px-2.5 text-sm font-normal sm:inline-flex'
                size='sm'>
                Get Started
              </Button>
            </Link>
          ) : null}
        </div>

        {/* Buttons */}
        <div className={cn('flex flex-row items-center justify-center gap-3')}>
          <Link href={formatRootUrl('dash', '/signup')} className='inline-flex'>
            <Button className='h-8 sm:inline-flex' size='sm'>
              Get Started
            </Button>
          </Link>

          {/* Mobile */}
          <Sheet>
            <SheetTrigger asChild className='sm:hidden'>
              <Button size='icon' className='h-[34px] w-[34px] rounded-full border' variant='ghost'>
                <MenuIcon className='text-foreground h-5 w-5 stroke-[1.5px]' />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className='items-start justify-start pb-3'>
                <SheetTitle className='font-medium'>Menu</SheetTitle>
              </SheetHeader>

              <div className='-ml-3 flex flex-col items-start justify-start gap-2'>
                {navTabs.map((tab) => (
                  <SheetClose key={tab.label.toLowerCase()} asChild>
                    <Link href={tab.href} className='text-foreground/80 flex h-8 items-center px-3 text-sm '>
                      {tab.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
