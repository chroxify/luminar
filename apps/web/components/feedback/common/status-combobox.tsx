'use client';

import * as React from 'react';
import { Button } from '@feedbase/ui/components/button';
import { Command, CommandGroup, CommandItem } from '@feedbase/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@feedbase/ui/components/popover';
import { cn } from '@feedbase/ui/lib/utils';
import { Check, ChevronsUpDownIcon } from 'lucide-react';
import { STATUS_OPTIONS } from '@/lib/constants';

interface ComboboxProps {
  initialStatus: string | null;
  onStatusChange: (status: string) => void;
}

export function StatusCombobox({ initialStatus, onStatusChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState(initialStatus || '');
  const currentItem = STATUS_OPTIONS.find(
    (item) => item.label.toLowerCase() === selectedStatus.toLowerCase()
  );

  // Update the selected status when the initial status changes
  React.useEffect(() => {
    setSelectedStatus(initialStatus || '');
  }, [initialStatus]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant='ghost'
          size='sm'
          className='text-secondary-foreground w-1/2 justify-between'>
          {currentItem ? (
            <div className='flex flex-row items-center gap-1.5'>
              {/* Status icon */}
              <currentItem.icon className='text-foreground/60 group-hover:text-foreground h-4 w-4 transition-colors' />

              {/* Status label */}
              {currentItem.label}
            </div>
          ) : (
            'Status'
          )}

          <ChevronsUpDownIcon className='text-muted-foreground h-4 w-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='end'>
        <Command>
          <CommandGroup>
            {STATUS_OPTIONS.map((item) => (
              <CommandItem
                key={item.label.toLowerCase()}
                onSelect={(currentValue) => {
                  setSelectedStatus(currentValue);
                  setOpen(false);
                  onStatusChange?.(currentValue);
                }}
                className='flex flex-row items-center gap-[6px]'>
                {/* Icon */}
                <item.icon className='h-4 w-4' />

                {/* Status label */}
                {item.label}

                {/* Checkmark */}
                <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    selectedStatus.toLowerCase() === item.label.toLowerCase() ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
