import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { FeedbackWithUserProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useFeedback(publicOnly?: boolean) {
  const { slug, workspace } = useParams<{ slug: string; workspace: string }>();

  // Set workspace slug to whichever is not null
  const workspaceSlug = slug || workspace;

  const {
    data: feedback,
    isValidating,
    error,
    mutate,
  } = useSWR<FeedbackWithUserProps[]>(
    publicOnly ? `/api/v1/${workspaceSlug}/feedback` : `/api/v1/workspaces/${workspaceSlug}/feedback`,
    fetcher,
    {
      revalidateOnFocus: false,
      errorRetryInterval: 30000,
    }
  );

  return {
    feedback,
    error,
    mutate,
    loading: !feedback,
    isValidating,
  };
}
