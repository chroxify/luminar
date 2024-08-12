'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import { PlusIcon, Search } from 'lucide-react';
import useDebounce from '@/lib/hooks/use-debounce';
import useCreateQueryString from '@/lib/hooks/use-query-router';
import { FeedbackBoardProps, ProfileProps, WorkspaceModuleProps } from '@/lib/types';
import SortFeedbackDropdown from '@/components/roadmap/sort-dropdown';
import CreatePostModal from '../../modals/create-post-modal';
import AuthModal from '../../modals/login-signup-modal';
import { FilterCombobox } from '../common/filter-combobox';

export default function FeedbackHeader({
  user,
  moduleConfig,
  feedbackBoards,
}: {
  user: ProfileProps['Row'] | null;
  moduleConfig: WorkspaceModuleProps['Row'];
  feedbackBoards: FeedbackBoardProps['Row'][];
}) {
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
  const createQueryParams = useCreateQueryString(useRouter(), usePathname(), searchParams);

  const handleSearchDebounce = useDebounce((value: string) => {
    createQueryParams('search', value);
  }, 500);

  useEffect(() => {
    // Preset / update search value
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  return (
    <>
      {/* Header */}
      <div className='flex w-full flex-col items-start justify-between gap-2 md:flex-row'>
        <div className='flex gap-1.5'>
          {/* Sort Dropdown */}
          <SortFeedbackDropdown />

          {/* Filter Dropdown */}
          <FilterCombobox size='icon' />
        </div>

        <div className='flex w-full flex-row items-center justify-start gap-1.5 md:w-fit'>
          {/* Search */}
          <div className='relative flex w-full items-center justify-end md:w-72'>
            {/* Input */}
            <Input
              placeholder='Search posts'
              className='px-8'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearchDebounce(e.target.value);
              }}
            />

            {/* Icon */}
            <Search className='text-muted-foreground absolute left-3 h-4 w-4' />
          </div>

          {(user && !user.is_anonymous) || moduleConfig?.feedback_anon_posting ? (
            <CreatePostModal
              defaultBoard={moduleConfig.feedback_default_board_id}
              feedbackBoards={feedbackBoards}>
              <Button variant='default' className='font-base shrink-0 text-sm'>
                Create Post
              </Button>
            </CreatePostModal>
          ) : (
            <AuthModal>
              <Button variant='default'>
                Create Post
                <PlusIcon className='ml-1 h-4 w-4' />
              </Button>
            </AuthModal>
          )}
        </div>
      </div>
    </>
  );
}
