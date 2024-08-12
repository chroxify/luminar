import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Separator } from '@feedbase/ui/components/separator';
import { cn } from '@feedbase/ui/lib/utils';
import { BadgeCheck } from 'lucide-react';
import { getPublicWorkspaceFeedback } from '@/lib/api/public';
import { getCurrentUser } from '@/lib/api/user';
import { PROSE_CN, STATUS_OPTIONS } from '@/lib/constants';
import CommentsList from '@/components/feedback/hub/comments-list';
import AnalyticsWrapper from '@/components/shared/analytics-wrapper';

type Props = {
  params: { workspace: string; id: string };
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get feedback
  const { data: feedbackList, error } = await getPublicWorkspaceFeedback(
    params.workspace,
    'server',
    true,
    false
  );

  // If workspace is undefined redirects to 404
  if (error?.status === 404 || !feedbackList) {
    notFound();
  }

  // Get current feedback
  const feedback = feedbackList.find((feedback) => feedback.id === params.id);

  // If feedback is undefined redirects to 404
  if (!feedback) {
    notFound();
  }

  return {
    title: feedback.title,
    description: feedback.content,
  };
}

export default async function FeedbackDetails({ params }: Props) {
  const { data: feedbackList, error } = await getPublicWorkspaceFeedback(
    params.workspace,
    'server',
    true,
    false
  );

  if (error || !feedbackList) {
    return <div>{error.message}</div>;
  }

  // Get current feedback
  const feedback = feedbackList.find((feedback) => feedback.id === params.id);

  // If feedback is undefined redirects to 404
  if (!feedback) {
    notFound();
  }

  // Get current user
  const { data: user } = await getCurrentUser('server');

  return (
    <AnalyticsWrapper workspaceSlug={params.workspace} feedbackId={params.id}>
      {/* // Row Splitting up date and Content  */}
      <div className='relative flex w-full flex-row px-5 sm:px-10 md:px-8 lg:px-10' key={feedback.id}>
        <div className='flex h-full w-full flex-col md:w-5/6 md:border-r md:pr-5 lg:flex-row'>
          {/* Back Button */}
          <div className='relative flex'>
            <div className='flex w-full pb-4 lg:w-[200px] lg:pb-0'>
              <Link href='/' className='h-fit w-fit select-none'>
                <p className='text-foreground/60 hover:text-foreground w-full text-sm  transition-colors'>
                  ← Back to Posts
                </p>
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className='flex h-full w-full flex-col gap-5'>
            {/* Title & Description */}
            <div className='flex w-full flex-col gap-2'>
              <h1 className='text-foreground/100 text-2xl font-bold'>{feedback.title}</h1>

              <div
                className={cn('text-foreground/60 text-sm ', PROSE_CN)}
                dangerouslySetInnerHTML={{ __html: feedback.content }}
              />
            </div>

            {/* Info */}
            <div className='flex h-full w-full flex-col md:hidden'>
              {/* Stats */}
              <div className='flex h-full w-full flex-col gap-5 border-t p-5'>
                {/* Upvotes */}
                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm '>Upvotes</p>

                  {/* Upvotes */}
                  <span className='text-foreground/90 text-sm  '>{feedback.upvotes}</span>
                </div>

                {/* Status */}
                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm '>Status</p>
                  {(() => {
                    if (feedback.status) {
                      const currentStatus =
                        STATUS_OPTIONS.find(
                          (option) => option.label.toLowerCase() === feedback.status?.toLowerCase()
                        ) || STATUS_OPTIONS[0];

                      return (
                        <div className='text-foreground/60 flex flex-row items-center gap-2 '>
                          <currentStatus.icon className='text-foreground/90 h-4 w-4' />
                          <span className='text-foreground/90 text-sm  '>{currentStatus.label}</span>
                        </div>
                      );
                    }
                    return <span className='text-foreground/90 text-sm  '>No status</span>;
                  })()}
                </div>

                {/* Tags */}
                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm '>Tags</p>

                  {/* Grid with all tags */}
                  <div className='flex w-full flex-row flex-wrap justify-end gap-2 pl-12'>
                    {feedback.tags
                      ? feedback.tags.map((tag) => (
                          <div
                            className='group/tag hover:border-foreground/20 hover:bg-accent/50 flex w-fit flex-shrink-0 select-none flex-wrap items-center gap-2 rounded-full border px-3 py-1 transition-colors'
                            key={tag.name.toLowerCase()}>
                            {/* Tag color */}
                            <div className='h-2 w-2 rounded-full' style={{ backgroundColor: tag.color }} />
                            {/* Tag name */}
                            <div className='text-foreground/80 group-hover/tag:text-foreground/95 text-xs  transition-colors'>
                              {tag.name}
                            </div>
                          </div>
                        ))
                      : null}
                  </div>

                  {/* Empty State */}
                  {(!feedback.tags || feedback.tags.length === 0) && (
                    <span className='text-foreground/90 w-full text-end text-sm '>No tags</span>
                  )}
                </div>
              </div>

              {/* Separator */}
              <Separator className='w-full' />

              {/* Metadata */}
              <div className='flex h-full w-full flex-col gap-5 px-5 pt-5'>
                {/* Created */}
                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm '>Created</p>

                  <p className='text-foreground/90 ml-2 text-sm '>
                    {new Date(feedback.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Author */}
                <div className='flex w-full flex-row items-center justify-between'>
                  <p className='text-foreground/70 text-sm '>Author</p>

                  {/* Author */}
                  <div className='text-foreground/60 flex flex-row items-center justify-start gap-2 '>
                    {/* User */}
                    <Avatar className='h-6 w-6 select-none gap-2 overflow-visible border'>
                      <div className='h-full w-full overflow-hidden rounded-full'>
                        <AvatarImage src={feedback.user.avatar_url || ''} alt={feedback.user.full_name} />
                        <AvatarFallback className='text-xs '>{feedback.user.full_name[0]}</AvatarFallback>
                        {/* If team member, add small verified badge to top of profile picture */}
                        {feedback.user.isTeamMember ? (
                          <div className='bg-root absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full'>
                            <BadgeCheck className='fill-highlight stroke-root outline-root z-10 h-3.5 w-3.5 outline-2' />
                          </div>
                        ) : null}
                      </div>
                    </Avatar>
                    {/* Name */}
                    <span className='text-foreground/90 text-sm '>{feedback.user.full_name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <CommentsList feedback={feedback} workspaceSlug={params.workspace} isLoggedIn={!!user} />
          </div>
        </div>

        {/* Sidebar */}
        <div className='hidden h-full w-1/3 min-w-[250px] flex-col gap-5 md:flex'>
          {/* Stats */}
          <div className='flex h-full w-full flex-col gap-5 pl-5'>
            {/* Upvotes */}
            <div className='flex w-full flex-row items-center justify-between'>
              <p className='text-foreground/70 text-sm '>Upvotes</p>

              {/* Upvotes */}
              <span className='text-foreground/90 text-sm  '>{feedback.upvotes}</span>
            </div>

            {/* Status */}
            <div className='flex w-full flex-row items-center justify-between'>
              <p className='text-foreground/70 text-sm '>Status</p>
              {(() => {
                if (feedback.status) {
                  const currentStatus =
                    STATUS_OPTIONS.find(
                      (option) => option.label.toLowerCase() === feedback.status?.toLowerCase()
                    ) || STATUS_OPTIONS[0];

                  return (
                    <div className='text-foreground/60 flex flex-row items-center gap-2 '>
                      <currentStatus.icon className='text-foreground/90 h-4 w-4' />
                      <span className='text-foreground/90 text-sm  '>{currentStatus.label}</span>
                    </div>
                  );
                }
                return <span className='text-foreground/90 text-sm  '>No status</span>;
              })()}
            </div>

            {/* Tags */}
            <div className='flex w-full flex-row items-center justify-between'>
              <p className='text-foreground/70 text-sm '>Tags</p>

              {/* Grid with all tags */}
              <div className='flex w-full flex-row flex-wrap justify-end gap-2 pl-12'>
                {feedback.tags
                  ? feedback.tags.map((tag) => (
                      <div
                        className='group/tag hover:border-foreground/20 hover:bg-accent/50 hidden w-fit flex-shrink-0 select-none flex-wrap items-center gap-2 rounded-full border px-3 py-1 transition-colors md:flex'
                        key={tag.name.toLowerCase()}>
                        {/* Tag color */}
                        <div className='h-2 w-2 rounded-full' style={{ backgroundColor: tag.color }} />
                        {/* Tag name */}
                        <div className='text-foreground/80 group-hover/tag:text-foreground/95 text-xs  transition-colors'>
                          {tag.name}
                        </div>
                      </div>
                    ))
                  : null}
              </div>

              {/* Empty State */}
              {(!feedback.tags || feedback.tags.length === 0) && (
                <span className='text-foreground/90 w-full text-end text-sm '>No tags</span>
              )}
            </div>
          </div>

          {/* Separator */}
          <Separator className='w-full' />

          {/* Metadata */}
          <div className='flex h-full w-full flex-col gap-5 pl-5'>
            {/* Created */}
            <div className='flex w-full flex-row items-center justify-between'>
              <p className='text-foreground/70 text-sm '>Created</p>

              <p className='text-foreground/90 ml-2 text-sm '>
                {new Date(feedback.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Author */}
            <div className='flex w-full flex-row items-center justify-between'>
              <p className='text-foreground/70 text-sm '>Author</p>

              {/* Author */}
              <div className='text-foreground/60 flex flex-row items-center justify-start gap-2 '>
                {/* User */}
                <Avatar className='h-6 w-6 select-none gap-2 overflow-visible border'>
                  <div className='h-full w-full overflow-hidden rounded-full'>
                    <AvatarImage src={feedback.user.avatar_url || ''} alt={feedback.user.full_name} />
                    <AvatarFallback className='text-xs '>{feedback.user.full_name[0]}</AvatarFallback>
                    {/* If team member, add small verified badge to top of profile picture */}
                    {feedback.user.isTeamMember ? (
                      <div className='bg-root absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full'>
                        <BadgeCheck className='fill-highlight stroke-root outline-root z-10 h-3.5 w-3.5 outline-2' />
                      </div>
                    ) : null}
                  </div>
                </Avatar>

                {/* Name */}
                <span className='text-foreground/90 text-sm '>{feedback.user.full_name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnalyticsWrapper>
  );
}
