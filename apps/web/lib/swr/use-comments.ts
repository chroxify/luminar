import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { CommentWithUserProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useFeedbackComments(feedbackId: string) {
  const { slug, workspace } = useParams<{ slug: string; workspace: string }>();

  // Set workspace slug to whichever is not null
  const workspaceSlug = slug || workspace;

  const {
    data: comments,
    isValidating,
    error,
    mutate,
  } = useSWR<CommentWithUserProps[]>(
    `/api/v1/workspaces/${workspaceSlug}/feedback/${feedbackId}/comments`,
    fetcher,
    {
      revalidateOnFocus: false,
      errorRetryInterval: 30000,
    }
  );

  return {
    comments,
    error,
    mutate,
    loading: !comments,
    isValidating,
  };
}
