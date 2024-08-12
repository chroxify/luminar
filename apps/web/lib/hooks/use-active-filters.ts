'use client';

import { ReadonlyURLSearchParams } from 'next/navigation';
import { FeedbackBoardProps, FeedbackFilterProps, FeedbackTagProps } from '@/lib/types';
import { STATUS_OPTIONS } from '../constants';

export function useActiveFilters(
  searchParams: ReadonlyURLSearchParams,
  workspaceTags: FeedbackTagProps['Row'][] | undefined,
  feedbackBoards: FeedbackBoardProps['Row'][] | undefined
): FeedbackFilterProps {
  const filters = {
    tags: searchParams.get('tags') ?? '',
    status: searchParams.get('status') ?? '',
    search: searchParams.get('search') ?? '',
    createdBefore: searchParams.get('cb') ?? '',
    createdAfter: searchParams.get('ca') ?? '',
    board: searchParams.get('board') ?? '',
  };

  const feedbackFilters: FeedbackFilterProps = {
    tags: {
      i:
        workspaceTags?.filter((tag) => {
          return filters.tags.split(',').includes(tag.name.toLowerCase());
        }) ?? [],
      e:
        workspaceTags?.filter((tag) => {
          return filters.tags.split(',').includes(`!${tag.name.toLowerCase()}`);
        }) ?? [],
    },
    status: {
      i:
        filters.status
          .split(',')
          .map((s) => {
            if (!s.startsWith('!')) {
              return STATUS_OPTIONS.find(
                (option) => option.label.toLowerCase() === s.replace('!', '').replace('+', ' ').toLowerCase()
              );
            }
            return null;
          })
          .filter(Boolean) ?? [],
      e:
        filters.status
          .split(',')
          .map((s) => {
            if (s.startsWith('!')) {
              return STATUS_OPTIONS.find(
                (option) => option.label.toLowerCase() === s.replace('!', '').replace('+', ' ').toLowerCase()
              );
            }
            return null;
          })
          .filter(Boolean) ?? [],
    },
    created_date: {
      b: filters.createdBefore,
      a: filters.createdAfter,
    },
    board: {
      i:
        feedbackBoards?.filter((board) => {
          return filters.board.split(',').includes(board.name.toLowerCase());
        }) ?? [],
      e:
        feedbackBoards?.filter((board) => {
          return filters.board.split(',').includes(`!${board.name.toLowerCase()}`);
        }) ?? [],
    },
    search: filters.search,
  } as FeedbackFilterProps;

  return feedbackFilters;
}
