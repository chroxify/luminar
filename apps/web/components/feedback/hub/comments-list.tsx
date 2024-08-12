'use client';

import { useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import useCreateQueryString from '@/lib/hooks/use-query-router';
import useFeedbackComments from '@/lib/swr/use-comments';
import { CommentWithUserProps, FeedbackWithUserProps } from '@/lib/types';
import FetchError from '@/components/shared/fetch-error';
import { Icons } from '@/components/shared/icons/icons-static';
import AuthModal from '../../modals/login-signup-modal';
import Comment from '../comments/comment';
import CommentInput from '../comments/comment-input';
import { CommentSortCombobox } from './sort-combobox';

export default function CommentsList({
  workspaceSlug,
  feedback,
  isLoggedIn,
}: {
  workspaceSlug: string;
  feedback: FeedbackWithUserProps;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(router, pathname, searchParams);
  const { comments, loading, isValidating, error, mutate } = useFeedbackComments(feedback.id);

  // Query params
  const sort = searchParams.get('sort') || '';
  const comment = searchParams.get('comment') || '';

  // Sort comments by query params if they exist
  const sortedComments = comments?.sort((a, b) => {
    // Switch case for sort
    switch (sort) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'best':
        return b.upvotes - a.upvotes;
      case 'worst':
        return a.upvotes - b.upvotes;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Render comments recursively
  const renderComments = useCallback(
    (comments: CommentWithUserProps[] | undefined) => {
      return comments?.map((comment: CommentWithUserProps) => (
        <Comment commentData={comment} workspaceSlug={workspaceSlug} key={comment.id} id={comment.id}>
          {renderComments(comment.replies)}
        </Comment>
      ));
    },
    [workspaceSlug]
  );

  // Calculate total comments and replies
  const calculateTotalCommentsAndReplies = useCallback(
    (comments: CommentWithUserProps[] | undefined): number => {
      return (comments ?? []).reduce((acc: number, comment: CommentWithUserProps) => {
        const commentCount = 1 + (comment.replies ? calculateTotalCommentsAndReplies(comment.replies) : 0);
        return acc + commentCount;
      }, 0);
    },
    []
  );

  // Scroll to comment if query param is present
  useEffect(() => {
    // If comment query param is present, scroll to comment
    if (comment) {
      const commentElement = document.getElementById(comment);

      if (commentElement) {
        commentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [comment]);

  return (
    <div className='flex h-full w-full flex-col gap-2 pb-5'>
      {/* Write Comment Text Area */}
      {isLoggedIn ? (
        <CommentInput workspaceSlug={workspaceSlug} feedbackId={feedback.id} />
      ) : (
        <div className='border-highlight/40 bg-highlight/20 flex w-full flex-col justify-between gap-4 rounded-md border p-3 sm:h-10 sm:flex-row sm:items-center'>
          <p className='text-foreground/90 text-sm '>Please authenticate to take part in the discussion.</p>

          <div className='flex flex-row items-center gap-2'>
            <AuthModal>
              <p className='text-foreground/90 font- hover:text-foreground cursor-pointer text-xs transition-colors'>
                Login / Sign up →
              </p>
            </AuthModal>
          </div>
        </div>
      )}

      {/* Comments Header */}
      <div className='flex h-full w-full flex-row justify-between pt-5'>
        <div className='flex flex-row items-center gap-1.5'>
          <p className='text-foreground/100 text-sm font-medium'>Comments</p>
          {comments === null ? (
            <Skeleton className='h-6 w-7 rounded-full' />
          ) : (
            <p className='text-foreground/80 bg-secondary select-none rounded-full px-[9px] py-1 text-xs '>
              {feedback.comment_count}
            </p>
          )}
        </div>

        <CommentSortCombobox
          onSelect={(sort) => {
            createQueryString('sort', sort === 'newest' ? '' : sort);
          }}
          initialValue={sort === '' ? 'newest' : sort}
        />
      </div>

      {/* Comments */}
      <div className='flex h-full w-full flex-col gap-5'>
        {/* Loading State */}
        {loading && !error ? (
          <div className='flex w-full flex-col items-center justify-center gap-1 pt-20'>
            <Icons.Spinner className='text-muted-foreground h-[18px] w-[18px] animate-spin' />
            <span className='text-secondary-foreground ml-2 text-sm'>Loading comments...</span>
          </div>
        ) : null}

        {/* Error State */}
        {error ? (
          <FetchError error={error} mutate={mutate} name='comments' isValidating={isValidating} />
        ) : null}

        {/* BUG: This currently forces re-render on each render, a possible way is to also include it in the useCallback but then change logic for scrolling down as it takes a bit until mounted */}
        {/* Comments */}
        {(comments?.length ?? 0) > 0 && !loading && !error && (
          <div className='flex h-full w-full flex-col gap-5'>{renderComments(sortedComments)}</div>
        )}

        {/* Empty State */}
        {comments?.length === 0 && (
          <div className='flex h-full w-full flex-col items-center justify-center pt-10'>
            <p className='text-foreground/60 pb-10 text-sm '>No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
