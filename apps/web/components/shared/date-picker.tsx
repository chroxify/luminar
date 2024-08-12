'use client';

import * as React from 'react';
import { Calendar } from '@feedbase/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@feedbase/ui/components/popover';

export function DatePicker({
  children,
  date,
  setDate,
  closeOnSelect = true,
}: {
  children: React.ReactNode;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>> | ((date: Date | undefined) => void);
  date?: Date | undefined;
  closeOnSelect?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            // Close the popover on select
            if (closeOnSelect) {
              setOpen(false);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
