'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { PROSE_CN } from '@/lib/constants';
import BentoCardWrapper from '@/components/home/spotlight-card';
import RichTextEditor from '../shared/tiptap-editor';

// const demoTags = [
//   {
//     value: 'feature',
//     label: 'Feature',
//     color: '#F87171',
//   },
//   {
//     value: 'bug',
//     label: 'Bug',
//     color: '#FBBF24',
//   },
//   {
//     value: 'question',
//     label: 'Question',
//     color: '#60A5FA',
//   },
//   {
//     value: 'other',
//     label: 'Other',
//     color: '#6EE7B7',
//   },
// ];

export default function FeedbackSection() {
  const [upvotes, setUpvotes] = useState(63);
  const [commentContent, setCommentContent] = useState(
    '<p><strong>try</strong> <mark>writing</mark> <em>markdown</em> in here!</p>'
  );

  return (
    <div className='flex h-full w-full flex-col items-center justify-start gap-2 pb-60'>
      <span className='select-none bg-gradient-to-t from-[#c7d2fe] to-[#8678f9] bg-clip-text text-lg text-transparent sm:text-xl'>
        Capture feedback
      </span>

      <h1 className='w-full gap-2 text-center text-3xl font-medium leading-tight text-white sm:text-4xl'>
        Build your feedback community
      </h1>

      <p className='mt-2 w-[800px] max-w-full text-center text-sm  text-white/60 sm:text-base'>
        A place for your users to give feedback, support creative ideas, and have meaningful discussions about
        product features and improvements.
      </p>

      {/* Bento  */}
      <div className='mt-10 flex w-full flex-col items-center justify-center gap-5 xl:flex-row'>
        {/* Upvotes */}
        <div className='flex w-full flex-col items-center justify-center gap-5 md:flex-row xl:w-fit'>
          <BentoCardWrapper className='h-[260px] w-full min-w-[350px]'>
            <div className='p-7'>
              <h1 className='text-lg font-medium text-white'>Prioritize with voting</h1>
              <p className='mt-2 text-sm  text-white/60'>
                Stop guessing - let your users tell you what they want to see next.
              </p>
            </div>

            <div className='group flex h-32 w-full translate-x-7 cursor-pointer flex-row items-stretch  justify-between rounded-tl-md border-l border-t transition-all'>
              <div className='flex items-center border-r'>
                {/* Upvotes */}
                <Button
                  variant='ghost'
                  size='sm'
                  className='group/upvote flex h-full flex-col items-center rounded-sm px-4 transition-all duration-200 hover:bg-transparent active:scale-[80%]'
                  onClick={(event) => {
                    setUpvotes(upvotes === 62 ? 63 : 62);
                  }}>
                  {/* Arrow */}
                  <ChevronUp
                    className={cn(
                      'h-4 text-sm  transition-colors ',
                      upvotes === 63 ? 'text-foreground' : 'text-foreground/60'
                    )}
                  />

                  {/* Upvotes */}
                  <div
                    className={cn(
                      'text-sm  transition-colors',
                      upvotes === 63 ? 'text-foreground' : 'text-foreground/60'
                    )}>
                    {upvotes}
                  </div>
                </Button>
              </div>

              <div className='flex flex-grow flex-col items-start justify-between gap-3 p-4'>
                <div className='flex flex-col gap-1'>
                  {/* Title */}
                  <span className='text-foreground/90 line-clamp-2 pr-10 text-sm font-medium'>
                    Allow custom domains
                  </span>

                  {/* Description */}
                  <div className={cn('line-clamp-2 max-w-full text-sm', PROSE_CN)}>
                    Allow custom domains for each workspace. This will allow users to use their own domain for
                    the feedback portal.
                  </div>
                </div>

                {/* Author */}
                <div className='text-foreground/60 flex select-none flex-row items-center justify-start gap-2 '>
                  {/* User */}
                  <Avatar className='h-6 w-6 gap-2 border'>
                    <AvatarImage src='https://avatars.githubusercontent.com/u/65873518?v=4' alt='' />
                    <AvatarFallback className='text-xs '>CT</AvatarFallback>
                  </Avatar>
                  {/* Name */}
                  <span className='text-foreground/70 text-sm font-light'>Christo Todorov</span>·
                  {/* Time ago */}
                  <span className='text-foreground/50 text-xs font-light'>2h ago</span>
                </div>
              </div>
            </div>
          </BentoCardWrapper>

          {/* Tags */}
          <BentoCardWrapper className='h-[260px] w-full min-w-[350px]'>
            <div className='h-full p-7'>
              <h1 className='text-lg font-medium text-white'>Categorize your feedback</h1>
              <p className='mt-2 text-sm  text-white/60'>
                Simplify feedback organization with tags and statuses for better user understanding.
              </p>

              <div className='mt-3 flex h-full flex-col items-start gap-3'>
                {/* TODO: RE-ENABLE / REWORK THIS */}
                {/* <TagCombobox
                  workspaceTags={demoTags}
                  onSelect={(tags) => demoTags.filter((tag) => tags.includes(tag.value))}
                  triggerClassName='w-full sm:w-full mt-5'
                  demo
                />

                <StatusCombobox triggerClassName='w-full mt-5' /> */}
              </div>
            </div>
          </BentoCardWrapper>
        </div>

        {/* Comments */}
        <BentoCardWrapper className='h-[260px] w-full min-w-[350px] xl:w-1/3'>
          <div className='p-7'>
            <h1 className='text-lg font-medium text-white'>Discuss with your users</h1>
            <p className='mt-2 text-sm  text-white/60'>
              Engage users, answer questions, and foster meaningful product discussions.
            </p>

            <div className='prose-invert mb-2 mt-8 flex h-[98px] w-full flex-col items-center justify-end rounded-sm border p-4'>
              {/* Editable Comment div with placeholder */}
              <RichTextEditor
                content={commentContent}
                setContent={setCommentContent}
                placeholder='Write your comment here...'
                characterLimit={50}
                className='overflow-auto'
              />

              {/* Bottom Row */}
              <div className='flex w-full flex-row items-center justify-between pt-1.5'>
                {/* Max char */}
                <span className='text-foreground/60 text-sm font-light'>
                  {commentContent.replace(/<[^>]+>/gi, '').length}/50
                </span>

                {/* Submit Button */}
                <Button
                  variant='outline'
                  className='text-foreground/60 flex h-8 items-center justify-between gap-2 border font-light sm:w-fit'
                  size='sm'
                  onClick={() => {
                    toast.promise(
                      new Promise<void>((resolve) => {
                        setTimeout(() => {
                          resolve();
                        }, 1750);
                      }),
                      {
                        loading: 'Posting comment...',
                        success: 'Comment posted!',
                        error: 'Failed to post comment.',
                      }
                    );
                  }}>
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </BentoCardWrapper>
      </div>
    </div>
  );
}
