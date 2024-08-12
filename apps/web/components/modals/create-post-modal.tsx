import { useState } from 'react';
import * as React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Command, CommandGroup, CommandItem } from '@feedbase/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@feedbase/ui/components/popover';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import { Switch } from '@feedbase/ui/components/switch';
import { cn } from '@feedbase/ui/lib/utils';
import { Editor } from '@tiptap/react';
import { Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { FeedbackBoardProps, FeedbackProps } from '@/lib/types';
import { actionFetcher, signInAnonymously } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';
import PostInput from '../feedback/common/post-input';

export default function CreatePostModal({
  children,
  defaultBoard,
  feedbackBoards,
}: {
  children: React.ReactNode;
  defaultBoard: string;
  feedbackBoards: FeedbackBoardProps['Row'][];
}) {
  const pathname = usePathname();
  const commentEditor = React.useRef<Editor | null>(null);
  const [createMore, setCreateMore] = useState<boolean>(false);
  const { workspace: slug } = useParams<{ workspace: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackProps['Insert']>({
    title: '',
    content: '',
    board_id: defaultBoard,
    workspace_id: '',
    user_id: '',
  });

  const { mutate } = useSWRConfig();

  // Create post
  const { trigger: createPost, isMutating } = useSWRMutation(
    `/api/v1/workspaces/${slug}/feedback`,
    actionFetcher,
    {
      onSuccess: () => {
        // Mutate feedback
        mutate(`/api/v1/${slug}/feedback`);

        // Close modal
        if (!createMore) setOpen(false);

        // Reset feedback
        setFeedback({ ...feedback, title: '', content: '' });

        // Clear editor
        commentEditor.current?.commands.clearContent();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      // Focus post input
      commentEditor.current?.commands.focus();
    }
  };

  // Set default board
  React.useEffect(() => {
    const currentBoard = feedbackBoards.find(
      (board) => pathname?.includes(`/board/${board.name.toLowerCase().replace(/\s+/g, '-')}`)
    );

    setFeedback({ ...feedback, board_id: currentBoard?.id || defaultBoard });
  }, [pathname, feedbackBoards, defaultBoard]);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen} modal>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='w-fit min-w-[550px] max-w-none gap-3'>
        <ResponsiveDialogHeader className='-mt-1.5 flex flex-row items-center justify-start gap-1.5'>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                aria-expanded={open}
                variant='outline'
                size='sm'
                className='text-secondary-foreground -ml-1.5 mt-0.5 h-6 w-fit items-center justify-between gap-1 px-1.5 font-normal'>
                <span className='line-clamp-1 flex select-none items-center gap-1.5 text-xs'>
                  {
                    feedbackBoards.find((item) => item.id.toLowerCase() === feedback.board_id.toLowerCase())
                      ?.name
                  }
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0' align='start'>
              <Command>
                <CommandGroup>
                  {((feedbackBoards ?? []).length > 2
                    ? (feedbackBoards ?? []).filter(
                        (item) => item.id.toLowerCase() !== feedback.board_id.toLowerCase()
                      )
                    : feedbackBoards ?? []
                  ).map((item) => (
                    <CommandItem
                      key={item.id.toLowerCase()}
                      onSelect={() => {
                        setFeedback({ ...feedback, board_id: item.id });
                        setPopoverOpen(false);
                      }}
                      className='flex flex-row items-center gap-[6px]'>
                      {/* Status label */}
                      {item.name}

                      {/* Checkmark */}
                      {(feedbackBoards ?? []).length <= 2 ? (
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            feedback.board_id.toLowerCase() === item.id.toLowerCase()
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <ChevronRight className='text-muted-foreground h-3 w-3 shrink-0' />
          <span className='text-secondary-foreground select-none text-xs'>Create Post</span>
        </ResponsiveDialogHeader>
        <div className='-mt-1.5 flex flex-col gap-1.5'>
          {/* Workspace Name */}
          <input
            id='title'
            placeholder='Post title'
            value={feedback?.title}
            autoFocus
            onChange={(event) => { setFeedback({ ...feedback, title: event.target.value }); }}
            onKeyDown={handleTitleKeyDown}
            className='placeholder:text-muted-foreground text-foreground h-8 w-full bg-transparent px-0 font-medium outline-none'
          />

          {/* Editable Comment div with placeholder */}
          <PostInput
            commentEditor={commentEditor}
            content={feedback.content}
            setContent={(content) => { setFeedback({ ...feedback, content }); }}
          />
        </div>
        <ResponsiveDialogFooter className='items-center justify-end gap-3 border-t px-4 py-3'>
          <div className='flex items-center gap-1.5'>
            <Switch
              id='createMore'
              checked={createMore}
              onCheckedChange={setCreateMore}
              className='h-[16px] w-[24px]'
              thumbClassName='h-[12px] w-[12px] data-[state=checked]:translate-x-2'
            />
            <label htmlFor='createMore' className='text-secondary-foreground text-xs'>
              Create more
            </label>
          </div>
          <Button
            variant='default'
            type='submit'
            size='sm'
            onClick={() => {
              // Sign in anonymously
              signInAnonymously();

              // Create post
              createPost({ title: feedback.title, content: feedback.content, board_id: feedback.board_id });
            }}
            disabled={
              !feedback.title || feedback.content.replace(/<[^>]*>?/gm, '').length === 0 || isMutating
            }>
            {isMutating ? <Icons.Spinner className='mr-2 h-3.5 w-3.5 animate-spin' /> : null}
            Submit Post
          </Button>
          <ResponsiveDialogClose asChild />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
