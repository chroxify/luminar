import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { TeamMemberProps } from '@/lib/types';
import { fetcher } from '../utils';

export default function useTeamMembers() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: teamMembers,
    isValidating,
    error,
    mutate,
  } = useSWR<TeamMemberProps[]>(`/api/v1/workspaces/${slug}/members`, fetcher);

  return {
    teamMembers,
    loading: !teamMembers,
    mutate,
    error,
    isValidating,
  };
}
