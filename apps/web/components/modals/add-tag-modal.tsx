'use client';

import React from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@feedbase/ui/components/command';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import { actionFetcher } from '@/lib/utils';

const colors = [
  {
    name: 'Turquoise',
    hex: '#40E0D0',
  },
  {
    name: 'Red',
    hex: '#E57373',
  },
  {
    name: 'Lavender',
    hex: '#BB87FC',
  },
  {
    name: 'Green',
    hex: '#C8E6C9',
  },
  {
    name: 'Pink',
    hex: '#E7A3BE',
  },
  {
    name: 'Yellow',
    hex: '#FFECB3',
  },
  {
    name: 'Sky Blue',
    hex: '#E6E6FA',
  },
  {
    name: 'Beige',
    hex: '#FFDAB9',
  },
  {
    name: 'Blue',
    hex: '#6495ED',
  },
];

export function CreateTagModal({
  open,
  setOpen,
  tagName,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  tagName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const { trigger: createTag } = useSWRMutation(`/api/v1/workspaces/${slug}/feedback/tags`, actionFetcher, {
    onSuccess: () => {
      toast.success('Tag created successfully');
      router.push(pathname);
    },
    onError: () => {
      toast.error('Failed to create tag');
    },
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Search color...' hideIcon />
      <CommandList className='my-2' style={{ scrollbarWidth: 'none' }}>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup className='p-0'>
          {colors.map((color) => (
            <CommandItem
              key={color.name.toLowerCase()}
              onSelect={() => {
                createTag({ name: tagName, color: color.hex });
                setOpen(false);
              }}
              className='flex h-10 flex-row items-center gap-1 rounded-md  hover:cursor-pointer'>
              {/* Color */}
              <div className='ml-2 mt-[1px] h-3 w-3 rounded-full' style={{ backgroundColor: color.hex }} />

              {/* Name */}
              <span className='ml-2'>{color.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
