'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import { Label } from '@feedbase/ui/components/label';
import { Separator } from '@feedbase/ui/components/separator';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { cn } from '@feedbase/ui/lib/utils';
import { CheckCircle2, ChevronUp, CircleDot, CircleDotDashed, Info, XCircle } from 'lucide-react';
import { STATUS_OPTIONS } from '@/lib/constants';
import useQueryParamRouter from '@/lib/hooks/use-query-router';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import AnimatedTabs from '@/components/shared/animated-tabs';
import FetchError from '@/components/shared/fetch-error';
import FeedbackFilterHeader, { FilterFeedback } from '../common/feedback-filters';
import { FeedbackSheet } from './feedback-sheet';

type DateSortedFeedbackProps = Record<string, FeedbackWithUserProps[]>;

export default function FeedbackList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryParams = useQueryParamRouter(router, pathname, searchParams);
  const [tab, setTab] = useState('All');
  const { feedback: feedbackList, error, loading: isLoading, mutate } = useFeedback();

  // Filter feedback by query params if they exist
  const { feedback: initialFeedback } = FilterFeedback(feedbackList || [], tab);

  const filteredFeedback =
    initialFeedback.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

  // Categorize feedback by date - Today, Yesterday, Last 7 days, Last 30 days, Older
  const dateSortedFeedback: DateSortedFeedbackProps = filteredFeedback.reduce<DateSortedFeedbackProps>(
    (acc, feedback) => {
      const feedbackDate = new Date(feedback.created_at);
      const currentDate = new Date();
      const diffInDays = Math.floor((currentDate.getTime() - feedbackDate.getTime()) / (1000 * 3600 * 24));

      let dateKey;
      if (diffInDays === 0) {
        dateKey = 'Today';
      } else if (diffInDays === 1) {
        dateKey = 'Yesterday';
      } else if (diffInDays <= 7) {
        dateKey = 'Last 7 days';
      } else if (diffInDays <= 30) {
        dateKey = 'Last 30 days';
      } else {
        dateKey = 'Older';
      }

      return {
        ...acc,
        [dateKey]: [...(acc[dateKey] || []), feedback],
      };
    },
    {}
  );

  // Calculate date in format: XX Mon
  function formatDate(date: Date) {
    const day = date.getDate().toString();
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    return `${day} ${month}`;
  }

  return (
    <>
      {/* Header tabs */}
      <AnimatedTabs
        tabs={[
          {
            label: 'All',
          },
          ...STATUS_OPTIONS,
        ]}
        selectedTab={tab}
        setSelectedTab={setTab}
      />

      <Separator />

      {/* Filters */}
      <FeedbackFilterHeader mutate={mutate} className='border-b px-5' />

      <div className='flex h-full w-full flex-col items-center justify-start gap-4 overflow-y-auto p-5'>
        {/* eslint-disable react/no-array-index-key */}
        {isLoading && !error ? (
          <div className='flex w-full flex-col'>
            {[...Array(10)].map((_, index) => (
              <div
                className='flex h-12 w-full flex-row items-center justify-between border border-b-0 p-1 px-2 [&:first-child]:rounded-t-md [&:last-child]:rounded-b-md [&:last-child]:border-b'
                key={`item-${index}`}>
                <div className='flex w-full items-center gap-2 pr-10'>
                  <Skeleton className='h-6 w-6' />
                  <Skeleton className='h-6 w-full' />
                </div>

                <div className='flex items-center gap-2'>
                  {}
                  {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, innerIndex) => (
                    <Skeleton key={`inner-item-${innerIndex}`} className='h-6 w-12 rounded-full' />
                  ))}
                  <Skeleton className='h-6 w-6 rounded-full' />
                  <Skeleton className='h-4 w-10' />
                  <Skeleton className='h-6 w-6 rounded-full' />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Error State */}
        {error ? <FetchError error={error} mutate={mutate} name='feedback' isValidating={isLoading} /> : null}

        {/* Empty State */}
        {filteredFeedback.length === 0 && !isLoading && !error && (
          <div className='flex flex-col items-center gap-2 p-10'>
            <Info className='text-secondary-foreground h-7 w-7 stroke-[1.5px]' />
            <div className='space-y-1.5 text-center'>
              <div className='text-secondary-foreground text-center'>
                No feedback found. Try changing the filters.
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <Button
                size='sm'
                variant='secondary'
                onClick={() => {
                  mutate();
                }}>
                Refresh
              </Button>
              <Button size='sm' variant='default'>
                Create Post
              </Button>
            </div>
          </div>
        )}

        {/* If filteredFeedback is not empty */}
        {!error &&
          Object.entries(dateSortedFeedback).map(([key, value]) => {
            return (
              <div key={key} className='flex w-full flex-col gap-2'>
                <Label>{key}</Label>
                <div>
                  {value.map((feedback) => (
                    <FeedbackSheet
                      key={feedback.id}
                      feedback={filteredFeedback}
                      initialFeedback={feedback}
                      asChild>
                      <div
                        className='jusify-between hover:bg-muted/50 group flex h-11 cursor-pointer flex-row items-center border border-b-0 p-1 transition-all [&:first-child]:rounded-t-md [&:last-child]:rounded-b-md [&:last-child]:border-b'
                        key={feedback.id}>
                        {/* Upvotes & Title */}
                        <div className='flex h-full w-full min-w-0 flex-row items-center'>
                          {/* Upvotes */}
                          <div className='flex h-10 flex-col items-center justify-center rounded-sm px-2'>
                            {/* Arrow */}
                            <ChevronUp
                              className={cn(
                                ' h-4 w-4 shrink-0 text-sm transition-colors',
                                feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
                              )}
                            />

                            {/* Upvotes */}
                            <div
                              className={cn(
                                '-mt-1 text-xs transition-colors',
                                feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
                              )}>
                              {feedback.upvotes}
                            </div>
                          </div>

                          <span className='text-foreground line-clamp-1 pr-1 text-[15px] transition-all'>
                            {feedback.title}
                          </span>
                        </div>

                        {/* Tags & User */}
                        <div className='mr-2 flex flex-shrink-0 items-center gap-2'>
                          {/* Tags */}
                          {feedback.tags && feedback.tags.length > 0
                            ? feedback.tags.map((tag) => (
                                <button
                                  className=' group/tag hover:border-foreground/20 hover:bg-accent/50 hidden flex-shrink-0 flex-wrap items-center gap-2 rounded-full border px-3 py-1 transition-colors hover:cursor-pointer md:flex'
                                  key={tag.name.toLowerCase()}
                                  type='button'
                                  onClick={(e) => {
                                    // Prevent sheet from opening
                                    e.stopPropagation();

                                    // If already selected, remove the tag
                                    if (tag.name.toLowerCase() === searchParams.get('tags')) {
                                      createQueryParams('tags', '');
                                      return;
                                    }

                                    createQueryParams('tags', tag.name);
                                  }}>
                                  {/* Tag color */}
                                  <div
                                    className='h-2 w-2 rounded-full'
                                    style={{ backgroundColor: tag.color }}
                                  />
                                  {/* Tag name */}
                                  <div className='text-foreground/60 group-hover/tag:text-foreground/80 text-xs  transition-colors'>
                                    {tag.name}
                                  </div>
                                </button>
                              ))
                            : null}

                          <div className='flex flex-shrink-0 items-center gap-2'>
                            {/* Status Icon */}
                            {(() => {
                              if (feedback.status) {
                                const currentStatus =
                                  STATUS_OPTIONS.find(
                                    (option) => option.label.toLowerCase() === feedback.status?.toLowerCase()
                                  ) || STATUS_OPTIONS[0];

                                return (
                                  <button
                                    className='group/tag hover:border-foreground/20 hover:bg-accent/50 hidden flex-shrink-0 flex-wrap items-center gap-2 rounded-full border p-1 transition-colors hover:cursor-pointer md:flex'
                                    type='button'
                                    onClick={(e) => {
                                      // Prevent sheet from opening
                                      e.stopPropagation();

                                      // If already selected, remove the status
                                      if (currentStatus.label.toLowerCase() === searchParams.get('status')) {
                                        createQueryParams('status', '');
                                        return;
                                      }

                                      createQueryParams('status', currentStatus.label);
                                    }}>
                                    <currentStatus.icon className='text-foreground/60 h-4 w-4' />
                                  </button>
                                );
                              }
                              return null;
                            })()}

                            {/* Date */}
                            <div className='text-muted-foreground cursor-default select-none text-center text-xs'>
                              {formatDate(new Date(feedback.created_at))}
                            </div>

                            {/* User */}
                            <Avatar className='h-6 w-6 gap-2 border'>
                              <AvatarImage
                                src={feedback.user.avatar_url || ''}
                                alt={feedback.user.full_name}
                              />
                              <AvatarFallback>{feedback.user.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </FeedbackSheet>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
