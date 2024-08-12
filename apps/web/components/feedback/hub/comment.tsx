'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Separator } from '@feedbase/ui/components/separator';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { cn } from '@feedbase/ui/lib/utils';
import { BadgeCheck, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { CommentWithUserProps, ProfileProps } from '@/lib/types';
import { formatRootUrl } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';
import RichTextEditor from '@/components/shared/tiptap-editor';
import AuthModal from '../../modals/login-signup-modal';

// Define a type for the props
interface CommentProps extends React.HTMLAttributes<HTMLDivElement> {
  commentData: CommentWithUserProps;
  workspaceSlug: string;
  user: ProfileProps['Row'] | null;
  children?: React.ReactNode;
}

export default function Comment({ commentData, workspaceSlug, user, children, ...props }: CommentProps) {
  const [comment, setComment] = useState<CommentWithUserProps>(commentData);
  const [replyContent, setReplyContent] = useState<string>('');
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Time ago
  function formatTimeAgo(date: Date) {
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();

    const times = [
      { unit: 'year', value: 1000 * 60 * 60 * 24 * 365 },
      { unit: 'month', value: 1000 * 60 * 60 * 24 * 30 },
      { unit: 'day', value: 1000 * 60 * 60 * 24 },
      { unit: 'hour', value: 1000 * 60 * 60 },
      { unit: 'minute', value: 1000 * 60 },
      { unit: 'second', value: 1000 },
    ];

    for (const unit of times) {
      const value = Math.floor(timeDiff / unit.value);
      if (value >= 1) {
        return `${value} ${unit.unit}${value > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }

  // On delete comment
  async function onDelete() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${workspaceSlug}/feedback/${comment.feedback_id}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    promise
      .then(() => {
        // Reload comments
        router.refresh();
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  // On upvote comment
  async function onUpvote() {
    // Update comment
    const updatedComment = { ...comment }; // Create a copy of the comment
    updatedComment.upvotes = comment.upvotes + (comment.has_upvoted ? -1 : 1);
    updatedComment.has_upvoted = !comment.has_upvoted;

    // Update state
    setComment(updatedComment);

    const promise = new Promise((resolve, reject) => {
      fetch(
        `/api/v1/workspaces/${workspaceSlug}/feedback/${comment.feedback_id}/comments/${comment.id}/upvote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    promise.catch((err) => {
      // Revert the comment to its previous state
      setComment(comment);

      toast.error(err);
    });
  }

  // Post comment
  async function onPostReply() {
    // Set loading
    setIsLoading(true);

    // Create promise
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${workspaceSlug}/feedback/${comment.feedback_id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          reply_to_id: comment.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    promise
      .then(() => {
        // Set loading
        setIsLoading(false);

        // Reset reply state
        setIsReplying(false);
        setReplyContent('');

        // Reload comments
        router.refresh();
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  useEffect(() => {
    setTimeAgo(formatTimeAgo(new Date(comment.created_at)));
  }, [comment.created_at]);

  return (
    <div className='flex h-full w-full flex-col' {...props}>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-2'>
          {/* Author */}
          <div className='text-foreground/60 flex select-none flex-row items-center justify-start gap-2 '>
            {/* User */}
            <Avatar className='h-8 w-8 gap-2 overflow-visible border'>
              <div className='h-full w-full overflow-hidden rounded-full'>
                <AvatarImage src={comment.user.avatar_url || ''} alt={comment.user.full_name} />
                <AvatarFallback className='text-xs '>{comment.user.full_name[0]}</AvatarFallback>
                {/* If team member, add small verified badge to top of profile picture */}
                {commentData.user.isTeamMember ? (
                  <div className='bg-root absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full'>
                    <BadgeCheck className='fill-highlight stroke-root outline-root z-10 h-4 w-4 outline-2' />
                  </div>
                ) : null}
              </div>
            </Avatar>
            {/* Name */}
            <span className='text-foreground/90 text-sm'>{comment.user.full_name}</span>·{/* Time ago */}
            {!timeAgo ? (
              <Skeleton className='h-4 w-20 rounded-sm' />
            ) : (
              <span className='text-foreground/50 text-xs font-light'>{timeAgo}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        {comment.user.id === user?.id && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='text-foreground/60 -mr-3 flex h-8 w-8 hover:bg-transparent'
                size='icon'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuItem
                className='text-destructive focus:text-destructive flex flex-row items-center gap-2 '
                onClick={onDelete}>
                <Icons.Trash className='fill-destructive h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className='flex h-full min-h-fit w-full flex-row gap-5'>
        {/* Separator */}
        <div className='relative flex flex-col items-center justify-center'>
          <Separator
            className='from-border to-root/95 absolute left-[14px] top-1 h-full w-1 rounded-lg bg-gradient-to-b'
            orientation='vertical'
          />
        </div>

        {/* Content */}
        <div className='flex h-full w-full flex-col gap-1 pl-5'>
          {/* Comment Content html */}
          <div
            className='prose dark:prose-invert prose-p:font-light prose-zinc text-foreground/70 prose-headings:font-medium prose-headings:text-foreground/80 prose-strong:text-foreground/80 prose-strong:font-normal prose-code:text-foreground/70 prose-code: prose-code:font-monospace prose-blockquote:text-foreground/80 prose-blockquote:font-normal pl-0.5 text-sm '
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />

          {/* Bottom Row */}
          <div className='flex w-full flex-row items-center justify-start gap-1.5'>
            {/* Upvote Button */}
            <AuthModal disabled={user !== null}>
              <Button
                variant='ghost'
                className={cn(
                  'text-foreground/60 hover:text-foreground/60 -ml-2 gap-1.5 text-sm  hover:bg-transparent'
                )}
                size='sm'
                onClick={() => {
                  if (!user) return;

                  onUpvote();
                }}>
                <span
                  className={cn(
                    'hover:text-highlight flex flex-row items-center gap-1 transition-all duration-200',
                    comment.has_upvoted ? 'text-highlight' : 'text-foreground/60'
                  )}>
                  {comment.has_upvoted ? 'Upvoted' : 'Upvote'}
                </span>

                {/* Upvote Count */}
                <span className='flex flex-row items-center gap-1'>({comment.upvotes})</span>
              </Button>
            </AuthModal>

            {/* Reply Button */}
            <AuthModal disabled={user !== null}>
              <Button
                variant='ghost'
                className='text-foreground/60 hover:text-highlight -ml-2 text-sm  hover:bg-transparent'
                size='sm'
                onClick={() => {
                  if (!user) return;

                  setIsReplying(!isReplying);
                }}>
                Reply
              </Button>
            </AuthModal>

            {/* Share Button */}
            <Button
              variant='ghost'
              className='text-foreground/60 hover:text-highlight -ml-2 text-sm  hover:bg-transparent'
              size='sm'
              onClick={() => {
                navigator.clipboard.writeText(
                  formatRootUrl(workspaceSlug, `/feedback/${comment.feedback_id}?comment=${comment.id}`)
                );

                toast.success('Copied link to clipboard.');
              }}>
              Share
            </Button>
          </div>

          {/* Reply Input */}
          {isReplying ? (
            <div className='prose dark:prose-invert flex w-full flex-col items-center justify-end rounded-md border p-4'>
              {/* Editable Comment div with placeholder */}
              <RichTextEditor
                content={replyContent}
                setContent={setReplyContent}
                placeholder='Write your reply here...'
              />

              {/* Bottom Row */}
              <div className='flex w-full flex-row items-center justify-end'>
                {/* Submit Button */}
                <Button
                  variant='outline'
                  className='text-foreground/60 flex h-8 items-center justify-between border font-light sm:w-fit'
                  size='sm'
                  onClick={onPostReply}
                  disabled={
                    // disabled if content is 0 or its only html tags
                    replyContent.replace(/<[^>]*>?/gm, '').length === 0 || isLoading
                  }>
                  {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
                  Post Reply
                </Button>
              </div>
            </div>
          ) : null}

          {/* Replies */}
          <div className='flex h-full w-full flex-col gap-5 pt-2'>{children}</div>
        </div>
      </div>
    </div>
  );
}
