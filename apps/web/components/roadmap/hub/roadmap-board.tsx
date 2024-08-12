'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { STATUS_OPTIONS } from '@/lib/constants';
import useQueryParamRouter from '@/lib/hooks/use-query-router';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import { FilterFeedback } from '@/components/feedback/common/feedback-filters';
import FeedbackKanban from '@/components/roadmap/kanban';
import RoadmapList from './roadmap-list';

type sortingOptions = 'upvotes' | 'created' | 'trending';

export default function RoadmapBoard({ style = 'kanban' }: { style: 'kanban' | 'list' }) {
  const { feedback: feedbackData, isValidating } = useFeedback(true);
  const [feedback, setFeedback] = useState<FeedbackWithUserProps[]>(feedbackData || []);
  const { workspace: slug } = useParams<{ workspace: string }>();
  const searchParams = useSearchParams();
  const createQueryParams = useQueryParamRouter(useRouter(), usePathname(), searchParams);

  // Filter / Sort feedback
  const { feedback: filteredFeedback, sortType } = FilterFeedback(feedback || []);

  // Group feedback by status
  const groupedFeedbackData = useCallback(() => {
    let groupedFeedback: Record<string, FeedbackWithUserProps[]> = {};

    // Initialize the groupedFeedback object with empty arrays for each status in STATUS_OPTIONS
    STATUS_OPTIONS.forEach(({ label }) => {
      groupedFeedback[label] = [];
    });

    const statusOptions = new Set(['in review', 'planned', 'in progress', 'completed', 'rejected']);

    filteredFeedback.forEach((feedback) => {
      const { status } = feedback;
      const normalizedStatus = status ? status.toLowerCase().replace(/\s/g, ' ') : '';

      if (normalizedStatus && statusOptions.has(normalizedStatus)) {
        const label =
          STATUS_OPTIONS.find(({ label }) => label.toLowerCase().replace(/\s/g, ' ') === normalizedStatus)
            ?.label || '';

        groupedFeedback[label].push(feedback);
      }
    });

    // Remove empty groups if style === 'kanban'
    if (style === 'kanban') {
      groupedFeedback = Object.fromEntries(
        Object.entries(groupedFeedback).filter(([_, value]) => value.length > 0)
      );
    }

    return groupedFeedback;
  }, [filteredFeedback, style])();

  // Handle non-applied sort query params
  if (sortType !== searchParams.get('sort')) {
    createQueryParams('sort', sortType ? sortType : '');
  }

  // On upvote feedback
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
    fetch(`/api/v1/workspaces/${slug}/feedback/${id}/upvotes`, {
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
    <div className='min-h-[100%] w-full'>
      {/* Kanban */}
      {style === 'kanban' && (
        <FeedbackKanban
          data={groupedFeedbackData}
          columns={STATUS_OPTIONS}
          sortedBy={(searchParams.get('sort') as sortingOptions) || 'upvotes'}
          isValidating={isValidating}
          hideEmptyColumns
          publicBoard
        />
      )}

      {/* List */}
      {style === 'list' && (
        <RoadmapList
          groupedFeedback={groupedFeedbackData}
          onUpvote={upvoteFeedback}
          isValidating={isValidating}
          sections={STATUS_OPTIONS}
        />
      )}
    </div>
  );
}
