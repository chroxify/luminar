'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@feedbase/ui/components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDestructiveItem,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Label } from '@feedbase/ui/components/label';
import { Separator } from '@feedbase/ui/components/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@feedbase/ui/components/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@feedbase/ui/components/tabs';
import { cn } from '@feedbase/ui/lib/utils';
import { DialogTriggerProps } from '@radix-ui/react-dialog';
import {
  BadgeCheck,
  CalendarClockIcon,
  ChevronDown,
  ChevronsUpDownIcon,
  ChevronUp,
  EditIcon,
  EyeOffIcon,
  Hash,
  Info,
  LinkIcon,
  MailIcon,
  MessageCircleOff,
  MoreHorizontal,
  PinIcon,
  Trash2Icon,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { PROSE_CN } from '@/lib/constants';
import { CommentWithUserProps, FeedbackWithUserProps } from '@/lib/types';
import { actionFetcher, fetcher, formatRootUrl } from '@/lib/utils';
import Comment from '@/components/feedback/comments/comment';
import CommentInput from '@/components/feedback/comments/comment-input';
import { StatusCombobox } from '@/components/feedback/common/status-combobox';
import { TagCombobox } from '@/components/feedback/common/tag-combobox';
import { Icons } from '@/components/shared/icons/icons-static';
import DefaultTooltip from '@/components/shared/tooltip';
import { BoardCombobox } from '../common/board-combobox';

export function FeedbackSheet({
  feedback,
  initialFeedback,
  children,
  ...props
}: {
  feedback: FeedbackWithUserProps[];
  initialFeedback: FeedbackWithUserProps;
  children: React.ReactNode;
} & DialogTriggerProps) {
  const { mutate } = useSWRConfig();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [currentFeedback, setCurrentFeedback] = useState(initialFeedback);
  const [open, setOpen] = useState(false);

  const { data: comments, isLoading: commentsLoading } = useSWR<CommentWithUserProps[]>(
    currentFeedback.id && open ? `/api/v1/workspaces/${slug}/feedback/${currentFeedback.id}/comments` : null,
    fetcher
  );

  // Render comments recursively
  const renderComments = useCallback(
    (comments: CommentWithUserProps[] | undefined) => {
      return comments?.map((comment: CommentWithUserProps) => (
        <Comment commentData={comment} workspaceSlug={slug} key={comment.id} id={comment.id}>
          {renderComments(comment.replies)}
        </Comment>
      ));
    },
    [slug]
  );

  // Navigate feedback
  const navigateFeedback = useCallback(
    (direction: 'next' | 'previous') => {
      const currentIndex = feedback.findIndex((f) => f.id === currentFeedback.id);
      if (direction === 'next') {
        setCurrentFeedback(feedback[currentIndex + 1]);
      } else {
        setCurrentFeedback(feedback[currentIndex - 1]);
      }
    },
    [feedback, currentFeedback]
  );

  // Copy to clipboard
  const copyToClipboard = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${key} copied to clipboard`);
  };

  const { trigger: upvoteFeedback } = useSWRMutation(
    `/api/v1/workspaces/${slug}/feedback/${currentFeedback.id}/upvotes`,
    actionFetcher,
    {
      onSuccess: () => {
        mutate(`/api/v1/workspaces/${slug}/feedback`);
      },
      onError: () => {
        toast.error(`Failed to ${currentFeedback.has_upvoted ? 'remove upvote' : 'upvote feedback'}`);
        setCurrentFeedback(feedback.find((f) => f.id === currentFeedback.id) || initialFeedback);
      },
      optimisticData: () => {
        setCurrentFeedback((prev) => ({
          ...prev,
          has_upvoted: !prev.has_upvoted,
          upvotes: prev.has_upvoted ? prev.upvotes - 1 : prev.upvotes + 1,
        }));
      },
    }
  );

  const { trigger: updateFeedback } = useSWRMutation(
    `/api/v1/workspaces/${slug}/feedback/${currentFeedback.id}`,
    actionFetcher,
    {
      onSuccess: () => {
        mutate(`/api/v1/workspaces/${slug}/feedback`);
      },
      onError: () => {
        toast.error('Failed to update feedback');
        setCurrentFeedback(feedback.find((f) => f.id === currentFeedback.id) || initialFeedback);
      },
    }
  );

  // Make sure to always set initial feedback if sheet is opened
  useEffect(() => {
    if (open) {
      setCurrentFeedback(initialFeedback);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Format date in a readable format, e.g. 2 days ago or if too old, show the date
  const formatDate = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) {
      return 'Today';
    } else if (days < 2) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    }
    return new Date(date).toDateString();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger {...props}>{children}</SheetTrigger>
      <SheetContent className='flex max-w-full flex-row items-start justify-between gap-0 p-0 sm:w-[calc(100vw-20px)] sm:max-w-full md:max-w-5xl'>
        <div className='flex h-full w-full flex-col'>
          {/* Header */}
          <div className='flex h-12 w-full shrink-0 flex-row items-center justify-between gap-2 border-b px-6'>
            <div className='flex items-center gap-2'>
              <Label>Feedback</Label>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='text-muted-foreground hover:text-foreground h-6 w-6'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  <DropdownMenuItem
                    className='text-secondary-foreground hover:text-foreground flex flex-row items-center gap-2'
                    onClick={() => {
                      copyToClipboard('ID', currentFeedback.id);
                    }}>
                    <Hash className='h-4 w-4' />
                    Copy ID
                  </DropdownMenuItem>

                  {/* Edit feedback */}
                  <DropdownMenuItem
                    className='text-secondary-foreground hover:text-foreground flex flex-row items-center gap-2'
                    onClick={() => {
                      // TODO: Edit feedback
                    }}>
                    <EditIcon className='h-4 w-4' />
                    Edit Title / Content
                  </DropdownMenuItem>

                  {/* Mailto submitter */}
                  <DropdownMenuItem
                    className='flex flex-row items-center gap-2'
                    onClick={() => {
                      router.push(
                        `mailto:${currentFeedback.user.email}?subject=Your Feedback Submission (${currentFeedback.id})&body=Hi ${currentFeedback.user.full_name},%0D%0A%0D%0AWe have received your recent feedback and had some follow up questions about it.%0D%0A%0D%0A%0D%0A%0D%0AIf you could get back to us as soon as possible, that would be great!%0D%0A%0D%0AThanks!`
                      );
                    }}>
                    <MailIcon className='h-4 w-4' />
                    Email submitter
                  </DropdownMenuItem>

                  {/* Disable Commenting */}
                  <DropdownMenuItem
                    className='flex flex-row items-center gap-2'
                    onClick={() => {
                      // TODO: Disable commenting
                    }}>
                    <MessageCircleOff className='h-4 w-4' />
                    Disable Commenting
                  </DropdownMenuItem>

                  {/* Delete feedback */}
                  <DropdownMenuDestructiveItem
                    className='flex flex-row items-center gap-2'
                    onClick={() => {
                      // TODO: Delete feedback
                    }}>
                    <Trash2Icon className='h-4 w-4' />
                    Delete
                  </DropdownMenuDestructiveItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Feedback Navigation */}
            {feedback && feedback.length > 0 ? (
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground select-none text-sm'>
                  {feedback.findIndex((f) => f.id === currentFeedback.id) + 1}{' '}
                  <span className='text-muted-foreground/60'>/ {feedback.length}</span>
                </span>
                <DefaultTooltip
                  content={
                    feedback.findIndex((f) => f.id === currentFeedback.id) === 0
                      ? "You've reached the first post"
                      : 'Go to previous post'
                  }>
                  <Button
                    size='icon'
                    variant='outline'
                    className='text-muted-foreground hover:text-foreground h-6 w-6'
                    disabled={feedback.findIndex((f) => f.id === currentFeedback.id) === 0}
                    onClick={() => {
                      navigateFeedback('previous');
                    }}>
                    <ChevronUp className='h-4 w-4' />
                  </Button>
                </DefaultTooltip>
                <DefaultTooltip
                  content={
                    feedback.findIndex((f) => f.id === currentFeedback.id) === feedback.length - 1
                      ? "You've reached the last post"
                      : 'Go to next post'
                  }>
                  <Button
                    size='icon'
                    variant='outline'
                    disabled={feedback.findIndex((f) => f.id === currentFeedback.id) === feedback.length - 1}
                    className='text-muted-foreground hover:text-foreground h-6 w-6'
                    onClick={() => {
                      navigateFeedback('next');
                    }}>
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DefaultTooltip>
              </div>
            ) : null}
          </div>

          {/* Post Content */}
          <div className='flex h-full w-full flex-col items-start gap-4 overflow-auto p-6'>
            <SheetHeader>
              <SheetTitle>{currentFeedback.title}</SheetTitle>
              <div
                className={cn('text-secondary-foreground text-sm ', PROSE_CN)}
                dangerouslySetInnerHTML={{ __html: currentFeedback.content }}
              />
            </SheetHeader>

            {/* Feedback Comment Field */}
            <CommentInput feedbackId={currentFeedback.id} workspaceSlug={slug} />

            {/* Comments / Activity */}
            <Tabs defaultValue='comments' className='w-full space-y-4'>
              <TabsList className='flex items-center justify-between'>
                <div className='flex gap-2.5'>
                  <TabsTrigger
                    value='comments'
                    className='data-[state=active]:border-foreground hover:border-muted-foreground border-b border-transparent p-1 px-0 transition-colors'>
                    <Button variant='ghost' size='sm' className='text-foreground px-1.5 hover:bg-transparent'>
                      Comments
                    </Button>
                  </TabsTrigger>
                  <TabsTrigger
                    value='activity'
                    className='data-[state=active]:border-foreground hover:border-muted-foreground border-b border-transparent p-1 px-0 transition-colors'>
                    <Button variant='ghost' size='sm' className='text-foreground px-1.5 hover:bg-transparent'>
                      Activity
                    </Button>
                  </TabsTrigger>
                </div>

                <Button size='sm' variant='outline' className='text-secondary-foreground'>
                  Top comments
                </Button>
              </TabsList>
              <TabsContent value='comments' className='flex w-full flex-col items-start justify-start gap-4'>
                {/* Loading State */}
                {!comments && commentsLoading ? (
                  <div className='flex w-full flex-col items-center justify-center gap-1 pt-20'>
                    <Icons.Spinner className='text-muted-foreground h-[18px] w-[18px] animate-spin' />
                    <span className='text-secondary-foreground ml-2 text-sm'>Loading comments...</span>
                  </div>
                ) : null}

                {/* Empty State */}
                {comments && comments.length === 0 && !commentsLoading ? (
                  <Alert className='w-full'>
                    <Info className='stroke-secondary-foreground -mt-[2px] h-5 w-5' />
                    <AlertTitle>No comments yet</AlertTitle>
                    <AlertDescription>
                      Be the first to comment on this feedback. Your feedback is important to us.
                    </AlertDescription>
                  </Alert>
                ) : null}

                {/* Comments */}
                {comments && comments.length > 0 ? renderComments(comments) : null}
              </TabsContent>
              <TabsContent value='activity'>
                {/* TODO */}
                Feedback Activity
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Post Details */}
        <div className='flex h-full min-w-[33%] flex-col items-center border-l'>
          {/* Manage Bar */}
          <div className='flex h-12 w-full flex-row items-center justify-between gap-2 border-b pl-6 pr-9'>
            <Label>Manage</Label>
            <div className='flex gap-2'>
              <DefaultTooltip content='Copy Public Link'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='text-muted-foreground hover:text-foreground h-7 w-7'
                  onClick={() => {
                    copyToClipboard('Link', formatRootUrl(slug, `/feedback/${currentFeedback.id}`));
                  }}>
                  <LinkIcon className='h-4 w-4' />
                </Button>
              </DefaultTooltip>
              <DefaultTooltip content='Pin Post'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='text-muted-foreground hover:text-foreground h-7 w-7'>
                  <PinIcon className='h-4 w-4' />
                </Button>
              </DefaultTooltip>
              <DefaultTooltip content='Make Private'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='text-muted-foreground hover:text-foreground h-7 w-7'>
                  <EyeOffIcon className='h-4 w-4' />
                </Button>
              </DefaultTooltip>
            </div>

            {/* Placeholder due to the close button of the sheet */}
            <div />
          </div>

          <div className='flex w-full flex-col gap-2 p-6'>
            <div className='flex items-center justify-between'>
              <Label>Upvotes</Label>
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  className={cn(
                    'text-secondary-foreground gap-1 transition-all active:scale-95',
                    currentFeedback.has_upvoted && 'text-accent-foreground bg-accent'
                  )}
                  onClick={() => {
                    upvoteFeedback({});
                  }}>
                  <ChevronUp className='h-4 w-4' />
                  {currentFeedback.upvotes}
                </Button>

                <DefaultTooltip content='View upvoters'>
                  <Button variant='ghost' size='icon' className='text-secondary-foreground h-7 w-7' disabled>
                    <Users className='h-4 w-4' />
                  </Button>
                </DefaultTooltip>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <Label>Status</Label>
              <StatusCombobox
                initialStatus={currentFeedback.status}
                onStatusChange={(status) => {
                  setCurrentFeedback((prev) => ({
                    ...prev,
                    status: status as FeedbackWithUserProps['status'],
                  }));
                  updateFeedback({ status, method: 'PATCH' });
                }}
              />
            </div>

            <div className='flex items-center justify-between'>
              <Label>Tags</Label>
              <TagCombobox
                initialTags={currentFeedback.tags || []}
                onTagsChange={(tags) => {
                  updateFeedback({ tags, method: 'PATCH' });
                }}
              />
            </div>

            <div className='flex items-center justify-between'>
              <Label>Board</Label>
              <BoardCombobox
                initialBoard={currentFeedback.board_id}
                onBoardChange={(board) => {
                  setCurrentFeedback((prev) => ({
                    ...prev,
                    board_id: board,
                  }));
                  updateFeedback({ board_id: board, method: 'PATCH' });
                }}
              />
            </div>

            <div className='flex items-center justify-between'>
              <Label>ETA</Label>
              <Button
                variant='ghost'
                size='sm'
                className='text-secondary-foreground w-1/2 justify-between'
                disabled>
                <div className='flex items-center gap-1.5'>
                  <CalendarClockIcon className='text-foreground/60 h-4 w-4' />
                  ETA
                </div>
                <ChevronsUpDownIcon className='text-muted-foreground h-4 w-4' />
              </Button>
            </div>
          </div>

          <Separator orientation='horizontal' className='w-[calc(100%-40px)]' />

          <div className='flex w-full flex-col items-end gap-2 p-6'>
            <div className='flex w-full items-center justify-between'>
              <Label>Author</Label>
              <div className='text-secondary-foreground flex items-center gap-2 text-sm'>
                <Avatar className='-ml-1 h-6 w-6 select-none overflow-visible border '>
                  <div className='h-full w-full overflow-hidden rounded-full'>
                    <AvatarImage
                      src={currentFeedback.user.avatar_url || ''}
                      alt={currentFeedback.user.full_name}
                    />
                    <AvatarFallback className='text-xs '>{currentFeedback.user.full_name[0]}</AvatarFallback>
                    {currentFeedback.user.isTeamMember ? (
                      <div className='bg-root absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full'>
                        <BadgeCheck className='fill-highlight stroke-root outline-root z-10 h-3.5 w-3.5 outline-2' />
                      </div>
                    ) : null}
                  </div>
                </Avatar>
                {currentFeedback.user.full_name}
              </div>
            </div>

            <div className='flex w-full items-center justify-between'>
              <Label>Created At</Label>
              <span className='text-secondary-foreground text-sm'>
                {formatDate(currentFeedback.created_at)}
              </span>
            </div>

            {/* <Button
              variant='ghost'
              size='sm'
              className='text-secondary-foreground mt-5 flex w-fit items-center gap-2'>
              View full profile
              <ChevronRight className='h-4 w-4' />
            </Button> */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
