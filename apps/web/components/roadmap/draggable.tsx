import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@feedbase/ui/lib/utils';

export function Draggable(props: {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.id,
    disabled: props.disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(props.className, isDragging && 'opacity-0')}>
      {props.children}
    </div>
  );
}
