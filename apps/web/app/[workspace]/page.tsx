import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { getWorkspaceBoards } from '@/lib/api/boards';
import { getWorkspaceModuleConfig } from '@/lib/api/module';
import { getCurrentUser } from '@/lib/api/user';
import { getWorkspaceBySlug } from '@/lib/api/workspace';
import FeedbackBoardList from '@/components/feedback/hub/board-list';
import FeedbackHeader from '@/components/feedback/hub/button-header';
import FeedbackList from '@/components/feedback/hub/feedback-list';
import AnalyticsWrapper from '@/components/shared/analytics-wrapper';

type Props = {
  params: { workspace: string };
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get workspace
  const { data: workspace, error } = await getWorkspaceBySlug(params.workspace, 'server', true, false);

  // If workspace is undefined redirects to 404
  if (error?.status === 404 || !workspace) {
    notFound();
  }

  return {
    title: `Feedback - ${workspace.name}`,
    description: 'Have a suggestion or found a bug? Let us know!',
  };
}

export default async function Feedback({ params }: Props) {
  const headerList = headers();
  const pathname = headerList.get('x-pathname');

  // Get current user
  const { data: user } = await getCurrentUser('server');

  // Fetch feedback boards
  const { data: boards, error: boardError } = await getWorkspaceBoards(
    params.workspace,
    'server',
    true,
    false
  );

  if (boardError) {
    return <div>{boardError.message}</div>;
  }

  // Get workspace module config
  const { data: moduleConfig, error: moduleError } = await getWorkspaceModuleConfig(
    params.workspace,
    'server',
    true,
    false
  );

  if (moduleError) {
    return <div>{moduleError.message}</div>;
  }

  // Search for the initial board mathing the pathname by /board/board-name format
  const initialBoard = boards.find(
    (board) => pathname?.includes(`/board/${board.name.toLowerCase().replace(/\s+/g, '-')}`)
  );

  return (
    <AnalyticsWrapper className='items-center gap-9' workspaceSlug={params.workspace}>
      {/* Title, Description */}
      <div className='flex w-full px-5 sm:px-8 lg:px-14'>
        <div className='flex w-full flex-col items-start gap-2'>
          <h1 className='font- text-xl sm:text-2xl'>Feedback</h1>
          <p className='text-secondary-foreground text-base font-normal'>
            Have a suggestion or found a bug? Let us know!
          </p>
        </div>
      </div>

      {/* Seperator */}
      <Separator className='bg-border/60' />

      <div className='flex w-full gap-8 px-5 sm:px-8 lg:px-14'>
        {/* Filter Header, Feedback List */}
        <div className='flex h-full w-full flex-col items-center justify-center'>
          {/* Filter Header */}
          <FeedbackHeader user={user} moduleConfig={moduleConfig} feedbackBoards={boards} />
          {/* Feedback List */}
          <FeedbackList workspaceSlug={params.workspace} feedbackBoards={boards} />
        </div>
        {/* Boards */}
        <FeedbackBoardList boards={boards} initialBoard={initialBoard} />
      </div>
    </AnalyticsWrapper>
  );
}
