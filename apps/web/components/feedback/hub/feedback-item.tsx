'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronUp, MessagesSquare } from 'lucide-react';
import { PROSE_CN } from '@/lib/constants';
import { FeedbackWithUserProps } from '@/lib/types';
import { formatTimeAgo, signInAnonymously } from '@/lib/utils';
import NumberAnimation from '@/components/shared/animated-number';
import AuthModal from '../../modals/login-signup-modal';

export default function FeedbackItem({
  feedback,
  forceAuth,
  onUpvote,
}: {
  feedback: FeedbackWithUserProps;
  forceAuth?: boolean;
  onUpvote: (feedbackId: string) => void;
}) {
  return (
    <div
      className='hover:bg-muted/30 group flex h-full w-full cursor-pointer flex-row items-stretch justify-between border border-b-0 transition-all first:rounded-t-md last:rounded-b-md last:border-b'
      key={feedback.id}>
      <AuthModal disabled={!forceAuth}>
        <div className='hover:bg-muted/50 flex items-center border-r transition-colors duration-150'>
          {/* Upvotes */}
          <Button
            variant='ghost'
            size='sm'
            className='group/upvote flex h-full flex-col items-center rounded-none px-4 transition-all duration-150 hover:bg-transparent active:scale-[0.85]'
            onClick={async () => {
              await signInAnonymously();

              // Upvote
              onUpvote(feedback.id);
            }}>
            {/* Arrow */}
            <ChevronUp
              className={cn(
                'h-4 text-sm  transition-colors ',
                feedback.has_upvoted ? 'text-foreground' : 'text-foreground/60'
              )}
            />

            {/* Upvotes */}
            <NumberAnimation
              baseNumber={feedback.has_upvoted ? feedback.upvotes - 1 : feedback.upvotes}
              isIncremented={feedback.has_upvoted}
            />
          </Button>
        </div>
      </AuthModal>

      {/* Main Content */}
      <Link
        href={`/feedback/${feedback.id}`}
        className='flex flex-grow flex-col items-start justify-between gap-3 p-4'>
        <div className='flex flex-col'>
          {/* Title */}
          <span className='text-foreground/90 line-clamp-1 pr-10 text-sm font-medium'>{feedback.title}</span>

          {/* Description */}
          <div
            className={cn('line-clamp-1 max-w-full text-sm', PROSE_CN)}
            dangerouslySetInnerHTML={{ __html: feedback.content }}
          />
        </div>

        {/* Author */}
        <div className='text-foreground/60 flex select-none flex-row items-center justify-start gap-2 '>
          {/* User */}
          <Avatar className='h-6 w-6 gap-2 border'>
            <AvatarImage src={feedback.user.avatar_url || ''} alt={feedback.user.full_name} />
            <AvatarFallback className='text-xs '>{feedback.user.full_name[0]}</AvatarFallback>
          </Avatar>
          {/* Name */}
          <span className='text-foreground/70 text-sm font-light'>{feedback.user.full_name}</span>·
          {/* Time ago */}
          <span className='text-foreground/50 text-xs font-light'>
            {formatTimeAgo(new Date(feedback.created_at))}
          </span>
        </div>
      </Link>

      {/* Comments Count */}
      <div className='text-foreground/50 hidden flex-row items-center justify-center gap-1.5 pl-2 pr-5 sm:flex'>
        <MessagesSquare className='text-foreground/50 h-4 w-4' />
        <span className='text-foreground/50 text-sm font-light'>{feedback.comment_count}</span>
      </div>
    </div>
  );
}
