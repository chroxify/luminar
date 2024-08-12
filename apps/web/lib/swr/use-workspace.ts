import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { WorkspaceProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useWorkspace() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: workspace,
    isValidating,
    error,
    mutate,
  } = useSWR<WorkspaceProps['Row']>(`/api/v1/workspaces/${slug}`, fetcher, {
    revalidateOnFocus: false,
    errorRetryInterval: 30000,
  });

  return {
    workspace,
    loading: !workspace,
    mutate,
    error,
    isValidating,
  };
}
