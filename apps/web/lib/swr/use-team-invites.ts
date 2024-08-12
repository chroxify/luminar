import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { ExtendedInviteProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useTeamInvites() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: teamInvites,
    isValidating,
    error,
    mutate,
  } = useSWR<ExtendedInviteProps[]>(`/api/v1/workspaces/${slug}/invites`, fetcher);

  return {
    teamInvites,
    loading: !teamInvites,
    mutate,
    error,
    isValidating,
  };
}
