'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Checkbox } from '@feedbase/ui/components/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@feedbase/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@feedbase/ui/components/popover';
import { cn } from '@feedbase/ui/lib/utils';
import {
  CalendarClock,
  CalendarPlus,
  CircleDashed,
  Filter,
  LayoutGrid,
  NotebookPen,
  Tags,
} from 'lucide-react';
import { STATUS_OPTIONS } from '@/lib/constants';
import useQueryParamRouter from '@/lib/hooks/use-query-router';
import useFeedbackBoards from '@/lib/swr/use-boards';
import useTags from '@/lib/swr/use-tags';

export function FilterCombobox({ size = 'default' }: { size?: 'default' | 'icon' }) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [pages, setPages] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = React.useState<string[]>([]);
  const searchParams = useSearchParams();
  const createQueryParams = useQueryParamRouter(useRouter(), usePathname(), searchParams);
  const { tags } = useTags();
  const { feedbackBoards } = useFeedbackBoards();
  const page = pages[pages.length - 1];

  React.useEffect(() => {
    // Preset tags
    setSelectedTags(searchParams.get('tags')?.split(',') || []);

    // Preset statuses
    setSelectedStatuses(searchParams.get('status')?.split(',') || []);

    // Preset boards
    setSelectedBoards(searchParams.get('board')?.split(',') || []);
  }, [searchParams]);

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        // If open is true, reset pages
        if (!open) {
          setPages([]);
        }
        setOpen(!open);
      }}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='text-secondary-foreground hover:text-foreground flex items-center gap-1'
          size={size}>
          <Filter className='h-4 w-4' />
          {size === 'icon' ? null : 'Filter'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit min-w-[200px] p-0' side='bottom' align='end'>
        <Command
          onKeyDown={(e) => {
            // Escape goes to previous page
            // Backspace goes to previous page when search is empty
            if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
              e.preventDefault();
              setPages((pages) => pages.slice(0, -1));
            }
          }}>
          <CommandInput placeholder='Filter...' hideIcon value={search} onValueChange={setSearch} autoFocus />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {!page && (
              <CommandGroup>
                <CommandItem
                  className='group flex items-center gap-2'
                  onSelect={() => {
                    setPages([...pages, 'status']);
                  }}>
                  <CircleDashed className='text-secondary-foreground group-aria-selected:text-foreground h-4 w-4 transition-colors' />
                  Status
                </CommandItem>
                <CommandItem
                  className='group flex items-center gap-2'
                  onSelect={() => {
                    setPages([...pages, 'board']);
                  }}>
                  <LayoutGrid className='text-secondary-foreground group-aria-selected:text-foreground h-4 w-4 transition-colors' />
                  Board
                </CommandItem>
                <CommandItem
                  className='group flex items-center gap-2'
                  onSelect={() => {
                    setPages([...pages, 'tags']);
                  }}>
                  <Tags className='text-secondary-foreground group-aria-selected:text-foreground h-4 w-4 transition-colors' />
                  Tags
                </CommandItem>
                <CommandItem className='group flex items-center gap-2'>
                  <NotebookPen className='text-secondary-foreground group-aria-selected:text-foreground h-4 w-4 transition-colors' />
                  Author
                </CommandItem>
                <CommandItem
                  className='group flex items-center gap-2'
                  onSelect={() => {
                    setPages([...pages, 'created-date']);
                  }}>
                  <CalendarPlus className='text-secondary-foreground group-aria-selected:text-foreground h-4 w-4 transition-colors' />
                  Created Date
                </CommandItem>
                <CommandItem className='group flex items-center gap-2'>
                  <CalendarClock className='text-secondary-foreground group-aria-selected:text-foreground h-4 w-4 transition-colors' />
                  ETA
                </CommandItem>
              </CommandGroup>
            )}

            {page === 'status' && (
              <CommandGroup>
                {STATUS_OPTIONS.map((item) => (
                  <CommandItem
                    key={item.label.toLowerCase()}
                    className='group flex items-center gap-2'
                    onSelect={() => {
                      // Append or remove status from selectedStatuses
                      const newStatuses = selectedStatuses.find(
                        (t) => t.toLowerCase() === item.label.toLowerCase()
                      )
                        ? selectedStatuses.filter((t) => t.toLowerCase() !== item.label.toLowerCase())
                        : [...selectedStatuses, item.label];

                      // Set statuses
                      setSelectedStatuses(newStatuses);

                      // Close popover
                      setOpen(false);

                      // Apply statuses
                      createQueryParams('status', newStatuses.join(','));
                    }}>
                    <Checkbox
                      className={cn(
                        'border-foreground/50 h-3.5 w-3.5 opacity-0 shadow-none group-aria-selected:opacity-100',
                        selectedStatuses.find((t) => t.toLowerCase() === item.label.toLowerCase()) &&
                          'opacity-100'
                      )}
                      iconCn='h-3.5 w-3.5'
                      checked={!!selectedStatuses.find((t) => t.toLowerCase() === item.label.toLowerCase())}
                    />

                    {/* Icon */}
                    <item.icon className='h-4 w-4' />

                    {/* Status label */}
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {page === 'tags' && (
              <CommandGroup>
                {tags?.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    className='group flex items-center gap-2'
                    onSelect={() => {
                      // Append or remove tag from selectedTags
                      const newTags = selectedTags.find((t) => t.toLowerCase() === tag.name.toLowerCase())
                        ? selectedTags.filter((t) => t.toLowerCase() !== tag.name.toLowerCase())
                        : [...selectedTags, tag.name];

                      // Set tags
                      setSelectedTags(newTags);

                      // Close popover
                      setOpen(false);

                      // Apply tags
                      createQueryParams('tags', newTags.join(','));
                    }}>
                    <Checkbox
                      className={cn(
                        'border-foreground/50 h-3.5 w-3.5 opacity-0 shadow-none group-aria-selected:opacity-100',
                        selectedTags.find((t) => t.toLowerCase() === tag.name.toLowerCase()) && 'opacity-100'
                      )}
                      iconCn='h-3.5 w-3.5'
                      checked={!!selectedTags.find((t) => t.toLowerCase() === tag.name.toLowerCase())}
                    />

                    <div className='h-2 w-2 rounded-full' style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {page === 'created-date' && (
              <CommandGroup>
                <CommandItem
                  className='group flex items-center gap-2'
                  onSelect={() => {
                    // Date 1 day ago
                    createQueryParams('ca', new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString());

                    // Close popover
                    setOpen(false);
                  }}>
                  1 day ago
                </CommandItem>
                <CommandItem
                  className='group flex items-center gap-2'
                  onSelect={() => {
                    // Date 1 week ago
                    createQueryParams('ca', new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString());

                    // Close popover
                    setOpen(false);
                  }}>
                  1 week ago
                </CommandItem>

                <CommandItem
                  className='group flex items-center gap-2'
                  onSelect={() => {
                    // Date 1 month ago
                    createQueryParams('ca', new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString());

                    // Close popover
                    setOpen(false);
                  }}>
                  1 month ago
                </CommandItem>
                <CommandItem
                  className='group flex items-center gap-2'
                  onSelect={() => {
                    // Date 3 months ago
                    createQueryParams('ca', new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString());

                    // Close popover
                    setOpen(false);
                  }}>
                  3 months ago
                </CommandItem>
                <CommandItem className='group flex items-center gap-2'>
                  Custom date or timeframe...
                </CommandItem>
              </CommandGroup>
            )}

            {page === 'board' && (
              <CommandGroup>
                {feedbackBoards?.map((board) => (
                  <CommandItem
                    key={board.id}
                    className='group flex items-center gap-2'
                    onSelect={() => {
                      // Append or remove board from selectedBoards
                      const newBoards = selectedBoards.find(
                        (t) => t.toLowerCase() === board.name.toLowerCase()
                      )
                        ? selectedBoards.filter((t) => t.toLowerCase() !== board.name.toLowerCase())
                        : [...selectedBoards, board.name];

                      // Set boards
                      setSelectedBoards(newBoards);

                      // Close popover
                      setOpen(false);

                      // Apply boards
                      createQueryParams('board', newBoards.join(','));
                    }}>
                    <Checkbox
                      className={cn(
                        'border-foreground/50 h-3.5 w-3.5 opacity-0 shadow-none group-aria-selected:opacity-100',
                        selectedBoards.find((t) => t.toLowerCase() === board.name.toLowerCase()) &&
                          'opacity-100'
                      )}
                      iconCn='h-3.5 w-3.5'
                      checked={!!selectedBoards.find((t) => t.toLowerCase() === board.name.toLowerCase())}
                    />
                    {board.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
