'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import { Separator } from '@feedbase/ui/components/separator';
import { cn } from '@feedbase/ui/lib/utils';
import { Plus, X } from 'lucide-react';
import useDebounce from '@/lib/hooks/use-debounce';
import useQueryParamRouter from '@/lib/hooks/use-query-router';
import { SearchIcon } from '@/components/shared/icons/icons-animated';
import LottiePlayer from '@/components/shared/lottie-player';
import { FilterCombobox } from '../common/filter-combobox';

export default function FeedbackHeader() {
  const [searchActive, setSearchActive] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchParams = useSearchParams();
  const createQueryParams = useQueryParamRouter(useRouter(), usePathname(), searchParams);

  const handleSearchDebounce = useDebounce((value: string) => {
    createQueryParams('search', value);
  }, 500);

  useEffect(() => {
    // Preset / update search value
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  return (
    <div className='flex h-[52px] w-full flex-row items-center justify-between px-5 pt-5'>
      <h2 className='text-2xl font-medium'>Feedback</h2>

      <div className='flex items-center gap-3'>
        {/* Search & Filter */}
        <div className='flex items-center gap-2'>
          {/* Search Input */}
          <div
            className={cn(
              'bg-background relative flex h-8 w-8 items-center gap-1 overflow-hidden rounded-md border transition-all',
              searchActive && 'w-60'
            )}>
            <Input
              placeholder='Search feedback'
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleSearchDebounce(e.target.value);
              }}
              className={cn(
                'absolute left-0 block w-52 rounded-none border-transparent bg-transparent pr-0.5 font-normal outline-none ring-offset-transparent focus-visible:ring-transparent',
                !searchActive && 'hidden cursor-pointer'
              )}
            />
            <button
              type='button'
              className='hover:bg-accent text-secondary-foreground hover:text-foreground absolute right-0 z-10 flex h-8 w-8 items-center justify-center bg-transparent transition-all'
              onClick={() => {
                // Toggle search
                setSearchActive(!searchActive);

                // If closing search, clear search value and query param
                if (searchActive) {
                  setSearchValue('');
                  handleSearchDebounce('');
                } else {
                  // Focus input
                  window.setTimeout(() => {
                    document.querySelector('input')?.focus();
                  }, 0);
                }
              }}
              onMouseEnter={() => {
                setAnimate(true);
              }}
              onMouseLeave={() => {
                setAnimate(false);
              }}>
              {/* Icon */}
              <LottiePlayer
                lottieSrc={SearchIcon}
                animate={animate}
                initialColor='hsl(var(--secondary-foreground))'
                animationColor='hsl(var(--foreground))'
                className={cn('-mr-0.5 h-4 w-4 dark:mr-0', searchActive && 'hidden')}
              />
              <X className={cn('h-4 w-4', !searchActive && 'hidden')} />
            </button>
          </div>

          {/* Filter Combobox */}
          <FilterCombobox />
        </div>

        {/* Seperator Line */}
        <Separator orientation='vertical' className='h-6' />

        {/* Create new Button */}
        <Button variant='default' className='flex items-center gap-1'>
          <Plus className='-ml-[2px] inline-flex h-[18px] w-[18px]' />
          Create Post
        </Button>
      </div>
    </div>
  );
}
