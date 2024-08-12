import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { FeedbackBoardProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useFeedbackBoards() {
  const { slug, workspace } = useParams<{ slug: string; workspace: string }>();

  // Set workspace slug to whichever is not null
  const workspaceSlug = slug || workspace;

  const {
    data: feedbackBoards,
    isValidating,
    error,
    mutate,
  } = useSWR<FeedbackBoardProps['Row'][]>(`/api/v1/workspaces/${workspaceSlug}/boards`, fetcher, {
    revalidateOnFocus: false,
    errorRetryInterval: 30000,
  });

  return {
    feedbackBoards,
    loading: !feedbackBoards,
    mutate,
    error,
    isValidating,
  };
}
