'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { CalendarRange, CircleDashed, CircleDotDashed } from 'lucide-react';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import { STATUS_OPTIONS } from '@/lib/constants';
import useQueryParamRouter from '@/lib/hooks/use-query-router';
import useFeedback from '@/lib/swr/use-feedback';
import { FeedbackWithUserProps } from '@/lib/types';
import { actionFetcher } from '@/lib/utils';
import FeedbackFilterHeader, { FilterFeedback } from '@/components/feedback/common/feedback-filters';
import AnimatedTabs from '@/components/shared/animated-tabs';
import FeedbackKanban from '../kanban';

type sortingOptions = 'upvotes' | 'created' | 'trending';

export default function RoadmapBoard() {
  const [tab, setTab] = useState('Status');
  const { feedback: feedbackData, mutate, isValidating } = useFeedback();
  const [feedback, setFeedback] = useState<FeedbackWithUserProps[]>(feedbackData || []);
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const createQueryParams = useQueryParamRouter(useRouter(), usePathname(), searchParams);

  // Filter / Sort feedback
  const { feedback: filteredFeedback, sortType } = FilterFeedback(feedback || []);

  // Handle non-applied sort query params
  if (sortType !== searchParams.get('sort')) {
    createQueryParams('sort', sortType ? sortType : '');
  }

  // Group feedback by status
  const groupedFeedbackData = useCallback(() => {
    const groupedFeedback: Record<string, FeedbackWithUserProps[]> = {};

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

    return groupedFeedback;
  }, [filteredFeedback])();

  const { trigger: updateFeedback } = useSWRMutation(
    `/api/v1/workspaces/${slug}/feedback`, // using general feedback endpoint here so that it mutates the feedback cache - proper url is set in the inputOverride
    actionFetcher,
    {
      onError: () => {
        setFeedback(filteredFeedback);
        toast.error('Failed to update feedback');
      },
      revalidate: false,
    }
  );

  useEffect(() => {
    setFeedback(feedbackData || []);
  }, [feedbackData]);

  return (
    <>
      {/* Header tabs */}
      <AnimatedTabs
        tabs={[
          {
            label: 'Status',
            icon: CircleDashed,
          },
          {
            label: 'Quarterly',
            icon: CalendarRange,
          },
          {
            label: 'Monthly',
            icon: CircleDotDashed,
          },
        ]}
        selectedTab={tab}
        setSelectedTab={setTab}
      />

      <Separator />

      {/* Feedback Filter Header */}
      <FeedbackFilterHeader mutate={mutate} className='border-b px-5' />

      {/* Kanban Board */}
      {groupedFeedbackData ? (
        <FeedbackKanban
          data={groupedFeedbackData}
          columns={STATUS_OPTIONS}
          sortedBy={(searchParams.get('sort') as sortingOptions) || 'upvotes'}
          isValidating={isValidating}
          onDataChange={(data, changedFeedback) => {
            // Update feedback
            changedFeedback?.forEach((f) => {
              // Get the new status of the feedback
              const newStatus = Object.keys(data).find((status) => data[status].includes(f));

              // If the feedback was not moved to a new status, return
              if (!newStatus) return;

              // Update the feedback status
              updateFeedback({
                method: 'PATCH',
                status: newStatus,
                inputOverride: `/api/v1/workspaces/${slug}/feedback/${f.id}`,
              });

              // Update the status of the feedback
              f.status = newStatus.toLowerCase() as FeedbackWithUserProps['status'];
            });

            // Update the feedback state
            setFeedback(filteredFeedback);
          }}
          hideEmptyColumns
        />
      ) : null}
    </>
  );
}
