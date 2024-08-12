'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { cn } from '@feedbase/ui/lib/utils';
import { motion } from 'framer-motion';
import { useSWRConfig } from 'swr';
import FeedbackFilterHeader from '@/components/feedback/common/feedback-filters';
import { FilterCombobox } from '../../feedback/common/filter-combobox';
import SortFeedbackDropdown from '../sort-dropdown';
import RoadmapKanban from './roadmap-board';

const tabs = [
  { id: 'kanban', label: 'Kanban' },
  { id: 'list', label: 'List' },
];

export default function Roadmap() {
  const { mutate } = useSWRConfig();
  const { workspace: slug } = useParams<{ workspace: string }>();
  const [activeTab, setActiveTab] = useState<'kanban' | 'list'>('kanban');

  return (
    <div className='flex h-full w-full flex-col items-start gap-3 px-5 sm:px-8 lg:px-14'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2'>
          {/* Sort Button */}
          <SortFeedbackDropdown />

          {/* Filter Combobox */}
          <FilterCombobox />
        </div>

        {/* Tabs */}
        <div className='bg-background flex h-[33px] w-fit select-none space-x-1 rounded-lg border p-0.5'>
          {tabs.map((tab) => (
            <button
              type='button'
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'kanban' | 'list');
              }}
              className={cn(
                'relative z-20 rounded-md px-3 text-sm font-normal outline-none transition',
                activeTab !== tab.id
                  ? 'text-muted-foreground hover:text-secondary-foreground'
                  : 'text-foreground'
              )}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}>
              {activeTab === tab.id && (
                <motion.span
                  layoutId='bubble'
                  className='bg-accent foreground-accent-foreground absolute inset-0 z-10 rounded-md border mix-blend-overlay'
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Header */}
      <FeedbackFilterHeader
        mutate={() => {
          return mutate(`/api/v1/${slug}/feedback`);
        }}
        className='py-0'
      />

      {/* Kanban / List */}
      <RoadmapKanban style={activeTab} />
    </div>
  );
}
