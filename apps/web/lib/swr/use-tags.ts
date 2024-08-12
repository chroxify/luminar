import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { FeedbackTagProps } from '../types';
import { fetcher } from '../utils';

export default function useTags() {
  const { slug, workspace } = useParams<{ slug: string; workspace: string }>();

  // Set workspace slug to whichever is not null
  const workspaceSlug = slug || workspace;

  const { data: tags, isValidating } = useSWR<FeedbackTagProps['Row'][]>(
    `/api/v1/workspaces/${workspaceSlug}/feedback/tags`,
    fetcher
  );

  return {
    tags,
    loading: !tags,
    isValidating,
  };
}
