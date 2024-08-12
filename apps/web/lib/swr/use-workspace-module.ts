import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { WorkspaceModuleProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useWorkspaceModuleConfig() {
  const { slug, workspace } = useParams<{ slug: string; workspace: string }>();

  // Set workspace slug to whichever is not null
  const workspaceSlug = slug || workspace;

  const {
    data: workspaceModuleConfig,
    isValidating,
    error,
    mutate,
  } = useSWR<WorkspaceModuleProps['Row']>(`/api/v1/workspaces/${workspaceSlug}/modules`, fetcher, {
    revalidateOnFocus: false,
    errorRetryInterval: 30000,
  });

  return {
    workspaceModuleConfig,
    loading: !workspaceModuleConfig,
    mutate,
    error,
    isValidating,
  };
}
