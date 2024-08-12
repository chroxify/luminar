import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { WorkspaceThemeProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useWorkspaceTheme() {
  const { slug, workspace } = useParams<{ slug: string; workspace: string }>();

  // Set workspace slug to whichever is not null
  const workspaceSlug = slug || workspace;

  const {
    data: workspaceTheme,
    isValidating,
    error,
    mutate,
  } = useSWR<WorkspaceThemeProps['Row']>(`/api/v1/workspaces/${workspaceSlug}/theme`, fetcher, {
    revalidateOnFocus: false,
    errorRetryInterval: 30000,
  });

  return {
    workspaceTheme,
    loading: !workspaceTheme,
    mutate,
    error,
    isValidating,
  };
}
