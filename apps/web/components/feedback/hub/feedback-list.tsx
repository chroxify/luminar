'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { toast } from 'sonner';
import useQueryParamRouter from '@/lib/hooks/use-query-router';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackBoardProps, FeedbackWithUserProps } from '@/lib/types';
import FetchError from '@/components/shared/fetch-error';
import FeedbackFilterHeader, { FilterFeedback } from '../common/feedback-filters';
import FeedbackItem from './feedback-item';

export default function FeedbackList({
  workspaceSlug,
  feedbackBoards,
}: {
  workspaceSlug: string;
  feedbackBoards: FeedbackBoardProps['Row'][];
}) {
  const { feedback: feedbackData, loading, error, mutate } = useFeedback(true);
  const [feedback, setFeedback] = useState<FeedbackWithUserProps[]>(feedbackData || []);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const createQueryParams = useQueryParamRouter(useRouter(), pathname, searchParams);

  // Query params
  const sort = searchParams.get('sort');
  const board = pathname.split('/').pop();

  // Filter feedback by query params if they exist
  const { feedback: initialFeedback, sortType } = FilterFeedback(feedback || []);

  // Filter feedback by board
  const filteredFeedback = initialFeedback.filter((feedback) => {
    if (!board) return true;

    return (
      feedback.board_id ===
      feedbackBoards.find((b) => b.name.toLowerCase().replace(/\s+/g, '-') === board)?.id
    );
  });

  // Handle non-applied sort query params
  if (sortType !== sort) {
    createQueryParams('sort', sortType ? sortType : '');
  }

  const upvoteFeedback = (id: string) => {
    // Optimistically update the feedback
    const feedbackIndex = filteredFeedback.findIndex((feedback) => feedback.id === id);

    if (feedbackIndex !== -1) {
      const feedbackCopy = [...filteredFeedback];
      feedbackCopy[feedbackIndex].upvotes = feedbackCopy[feedbackIndex].has_upvoted
        ? feedbackCopy[feedbackIndex].upvotes - 1
        : feedbackCopy[feedbackIndex].upvotes + 1;
      feedbackCopy[feedbackIndex].has_upvoted = !feedbackCopy[feedbackIndex].has_upvoted;
      setFeedback(feedbackCopy);
    }

    // Upvote feedback
    fetch(`/api/v1/workspaces/${workspaceSlug}/feedback/${id}/upvotes`, {
      method: 'POST',
    }).then((res) => {
      if (!res.ok) {
        // Revert the feedback
        setFeedback(filteredFeedback);
        toast.error('Failed to upvote feedback');
      }
    });
  };

  useEffect(() => {
    setFeedback(feedbackData || []);
  }, [feedbackData]);

  return (
    <div className='h-full w-full'>
      <FeedbackFilterHeader mutate={mutate} className='py-0 pt-3' />

      {/* Loading state */}
      {loading && !error ? (
        <div className='flex h-full w-full flex-col gap-1 pt-3'>
          {Array.from({ length: 7 }, () => (
            <Skeleton className='h-[6.75rem] w-full' key={`skeleton-${crypto.randomUUID()}`} />
          ))}
        </div>
      ) : null}

      {/* Error state */}
      {error ? <FetchError error={error} mutate={mutate} name='feedback' isValidating={loading} /> : null}

      {/* Empty state */}
      {filteredFeedback?.length === 0 && !loading && !error && (
        <div className='flex h-full w-full flex-col items-center justify-center gap-3 pt-10'>
          <h1 className='text-foreground/90 text-2xl '>No feedback yet</h1>
          <p className='text-foreground/60 text-center text-base '>
            This is where you can share your feedback and feature requests.
          </p>
        </div>
      )}

      {/* Feedback list */}
      {filteredFeedback?.length > 0 && !loading && !error && (
        <div className='flex h-full w-full flex-col pt-3'>
          {filteredFeedback.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} onUpvote={upvoteFeedback} />
          ))}
        </div>
      )}
    </div>
  );
}
