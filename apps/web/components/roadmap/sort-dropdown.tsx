'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Clock3, Flame, ThumbsUp } from 'lucide-react';
import useQueryParamRouter from '@/lib/hooks/use-query-router';

export default function SortFeedbackDropdown() {
  const searchParams = useSearchParams();
  const createQueryString = useQueryParamRouter(useRouter(), usePathname(), searchParams);

  // Query params
  const sort = searchParams.get('sort') || '';

  const [currentSort, setCurrentSort] = useState<string>(sort);

  useEffect(() => {
    setCurrentSort(sort);
  }, [sort]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='gap-1.5 pr-2'>
          {currentSort === '' && (
            <>
              <Clock3 className='h-3.5 w-3.5' />
              Recent
            </>
          )}
          {currentSort === 'trending' && (
            <>
              <Flame className='h-3.5 w-3.5' />
              Trending
            </>
          )}
          {currentSort === 'upvotes' && (
            <>
              <ThumbsUp className='h-3.5 w-3.5' />
              Upvotes
            </>
          )}
          <ChevronUpDownIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuItem
          className='gap-1.5'
          key='upvotes'
          onSelect={() => {
            setCurrentSort('upvotes');
            createQueryString('sort', 'upvotes');
          }}>
          <ThumbsUp className='h-4 w-4' />
          <span>Upvotes</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='gap-1.5'
          key='recent'
          onSelect={() => {
            setCurrentSort('');
            createQueryString('sort', '');
          }}>
          <Clock3 className='h-4 w-4' />
          <span>Recent</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='gap-1.5'
          key='trending'
          onSelect={() => {
            setCurrentSort('trending');
            createQueryString('sort', 'trending');
          }}>
          <Flame className='h-4 w-4' />
          <span>Trending</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
