'use client';

import * as React from 'react';
import { Button } from '@feedbase/ui/components/button';
import { Command, CommandGroup, CommandItem } from '@feedbase/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@feedbase/ui/components/popover';
import { cn } from '@feedbase/ui/lib/utils';
import { Check, ChevronsUpDownIcon, LayoutGrid } from 'lucide-react';
import useFeedbackBoards from '@/lib/swr/use-boards';

interface ComboboxProps {
  initialBoard: string | null;
  onBoardChange: (board: string) => void;
}

export function BoardCombobox({ initialBoard, onBoardChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedBoard, setSelectedBoard] = React.useState(initialBoard || '');
  const { feedbackBoards } = useFeedbackBoards();

  const currentItem = feedbackBoards?.find((item) => item.id.toLowerCase() === selectedBoard.toLowerCase());

  React.useEffect(() => {
    setSelectedBoard(initialBoard || '');
  }, [initialBoard]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant='ghost'
          size='sm'
          className='text-secondary-foreground w-1/2 justify-between gap-1'>
          {currentItem ? (
            <div className='flex items-center gap-1.5 truncate'>
              <LayoutGrid className='text-foreground/60 h-4 w-4 shrink-0' />
              <span className='line-clamp-1 flex items-center gap-1.5'>
                {currentItem.name.length > 10 ? `${currentItem.name.slice(0, 11)}...` : currentItem.name}
              </span>
            </div>
          ) : (
            <div className='flex items-center gap-1.5'>
              <LayoutGrid className='text-foreground/60 h-4 w-4' />
              Board
            </div>
          )}

          <ChevronsUpDownIcon className='text-muted-foreground h-4 w-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='end'>
        <Command>
          <CommandGroup>
            {feedbackBoards?.map((item) => (
              <CommandItem
                key={item.id.toLowerCase()}
                onSelect={() => {
                  setSelectedBoard(item.id);
                  setOpen(false);
                  onBoardChange?.(item.id);
                }}
                className='flex flex-row items-center gap-[6px]'>
                {/* Status label */}
                {item.name}

                {/* Checkmark */}
                <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    selectedBoard.toLowerCase() === item.id.toLowerCase() ? 'opacity-100' : 'opacity-0'
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
