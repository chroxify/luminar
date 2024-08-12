import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Button } from '@feedbase/ui/components/button';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronUp, LayoutGrid, LucideIcon, Plus } from 'lucide-react';
import { STATUS_OPTIONS } from '@/lib/constants';
import { FeedbackWithUserProps } from '@/lib/types';
import { FeedbackSheet } from '@/components/feedback/dashboard/feedback-sheet';
import { Draggable } from './draggable';
import { Droppable } from './droppable';

// Card component for draggable feedback items
function FeedbackCard({ feedback }: { feedback: FeedbackWithUserProps }) {
  return (
    <>
      {/* Status, Title, Upvotes */}
      <div className='flex h-fit items-center justify-between gap-1'>
        <div className='flex w-full items-center gap-2'>
          {/* Status Icon */}
          {(() => {
            if (feedback.status) {
              const currentStatus =
                STATUS_OPTIONS.find(
                  (option) => option.label.toLowerCase() === feedback.status?.toLowerCase()
                ) || STATUS_OPTIONS[0];

              return <currentStatus.icon className='text-foreground/60 h-3.5 w-3.5 shrink-0' />;
            }
            return null;
          })()}
          <span className='w-full text-start text-sm'>{feedback.title}</span>
        </div>

        {/* Upvotes */}
        <div className='flex h-full shrink-0 items-center gap-0.5'>
          <ChevronUp className='text-muted-foreground h-3.5 w-3.5' />
          <span className='text-muted-foreground text-xs'>{feedback.upvotes}</span>
        </div>
      </div>

      {/* Board Combobox & Tags */}
      <div className='flex flex-wrap items-center gap-2'>
        {/* Board Combobox */}
        <Button
          variant='outline'
          size='icon'
          className='text-foreground/60 hover:text-foreground/80 hover:border-foreground/20 hover:bg-background h-6 w-6'>
          <LayoutGrid className='h-3.5 w-3.5' />
        </Button>

        {/* Tags */}
        {feedback.tags && feedback.tags.length > 0
          ? feedback.tags.map((tag) => (
              <button
                className='bg-background group/tag hover:border-foreground/20 hidden h-6 flex-shrink-0 flex-wrap items-center gap-2 rounded-lg border  px-2 transition-colors hover:cursor-pointer md:flex'
                key={tag.name.toLowerCase()}
                type='button'>
                {/* Tag color */}
                <div className='h-2 w-2 rounded-full' style={{ backgroundColor: tag.color }} />
                {/* Tag name */}
                <div className='text-foreground/60 group-hover/tag:text-foreground/80 text-xs  transition-colors'>
                  {tag.name}
                </div>
              </button>
            ))
          : null}
      </div>
    </>
  );
}

export default function FeedbackKanban({
  columns,
  data,
  onDataChange,
  sortedBy,
  publicBoard = false,
  hideEmptyColumns = false,
  isValidating,
}: {
  columns: { label: string; icon: LucideIcon }[];
  data: Record<string, FeedbackWithUserProps[]>;
  onDataChange?: (
    data: Record<string, FeedbackWithUserProps[]>,
    changedFeedback?: FeedbackWithUserProps[]
  ) => void;
  sortedBy: string;
  publicBoard?: boolean;
  hideEmptyColumns?: boolean;
  isValidating?: boolean;
}) {
  const [activeItem, setActiveItem] = useState<FeedbackWithUserProps | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Get item by id
  function getItemById(id: string) {
    for (const key in data) {
      const item = data[key].find((item) => item.id === id);
      if (item) return item;
    }
    return null;
  }

  const randomCounts = useMemo(() => columns.map(() => Math.floor(Math.random() * 8) + 1), [columns]);

  return (
    <div className={cn('flex h-full w-full gap-9', publicBoard ? 'h-[70dvh]' : 'max-h-[calc(100%-108px)]')}>
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
        <div
          className={cn(
            'flex h-full w-full gap-3 overflow-x-auto p-5',
            publicBoard ? 'custom-scrollbar min-h-full p-0' : 'pt-5'
          )}>
          {columns.map(({ label, icon: Icon }, index) => {
            if (hideEmptyColumns && !data[label]?.length) return null;
            const randomCount = randomCounts[index];

            return (
              <div
                className='bg-secondary/50 dark:bg-root relative flex h-full w-full min-w-[350px] flex-col gap-3 overflow-y-auto rounded-md p-3 dark:brightness-110'
                key={label}>
                {/* Header Row */}
                <div className='flex items-center justify-between dark:brightness-90'>
                  <div className='flex items-center gap-2'>
                    <Icon className='text-muted-foreground h-4 w-4' />
                    <span className='text-sm'>{label}</span>
                    <span className='text-muted-foreground text-sm'>{data[label]?.length || 0}</span>
                  </div>
                  {!publicBoard ? (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-muted-foreground hover:text-foreground h-6 w-6'>
                      <Plus className='h-3.5 w-3.5' />
                    </Button>
                  ) : null}
                </div>

                {/* Feedback Items */}
                <Droppable
                  key={label}
                  id={label}
                  className='no-scrollbar relative flex h-full w-full flex-col gap-3 overflow-y-auto rounded-md dark:brightness-90'
                  isOverOverlay={
                    <div className='bg-root absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-md border opacity-90'>
                      <span>Drop here</span>
                      <span className='text-muted-foreground text-sm'>Items are sorted by {sortedBy}</span>
                    </div>
                  }>
                  {isValidating
                    ? [...Array(randomCount)].map((_, i) => (
                        <Skeleton key={`skeleton-${i}`} className='h-20 w-full brightness-[0.98]' />
                      ))
                    : data[label]?.map((item) => (
                        <FeedbackSheet
                          key={item.id}
                          initialFeedback={item}
                          feedback={data[label]}
                          disabled={publicBoard}>
                          <Draggable
                            key={item.id}
                            id={item.id}
                            disabled={publicBoard}
                            className='bg-root z-50 flex h-fit w-full flex-col gap-3 rounded-md border p-3'>
                            <FeedbackCard feedback={item} />
                          </Draggable>
                        </FeedbackSheet>
                      ))}
                </Droppable>
              </div>
            );
          })}
        </div>

        <DragOverlay
          style={{
            transition: 'transform 0.1s cubic-bezier(0.54, 1.5, 0.38, 1.11)',
            cursor: 'grabbing',
            zIndex: 9999,
          }}>
          {activeItem ? (
            <div className='bg-root flex h-fit w-full flex-col gap-3 rounded-md border p-3'>
              <FeedbackCard feedback={activeItem} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function onDragStart(event: DragStartEvent) {
    // Set active draggable id
    setActiveItem(getItemById(event.active.id as string));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Find where active item is currently in
    const currentContainer = Object.entries(data).find(([key, items]) =>
      // For each item, check if the id is equal to the active id
      items.find((item) => item.id === active.id)
    )?.[0];
    if (!currentContainer || !over || over.id === currentContainer) return;

    // Update data state object
    const newData: Record<string, FeedbackWithUserProps[]> = {
      ...data,
      [currentContainer]: data[currentContainer].filter((item) => item.id !== active.id),
      [over.id]: [
        ...(data[over.id] || []),
        data[currentContainer].find((item) => item.id === active.id),
      ].filter(Boolean) as FeedbackWithUserProps[],
    };

    // Call onDataChange callback
    if (onDataChange) onDataChange(newData, [getItemById(active.id as string)!]);
    setActiveItem(null);
  }
}
