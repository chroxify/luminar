import { LucideIcon } from 'lucide-react';
import { Database } from '@/lib/supabase';
import { IconObject } from '@/components/shared/icons/icons-animated';

// DB Types
export type WorkspaceProps = Database['public']['Tables']['workspace'];

export type WorkspaceIntegrationProps = Database['public']['Tables']['workspace_integration'];

export type TeamMemberProps = Database['public']['Tables']['profile']['Row'] & {
  joined_at: string;
};

export type WorkspaceModuleProps = Database['public']['Tables']['workspace_module'];

export type WorkspaceThemeProps = Database['public']['Tables']['workspace_theme'];

export type NotificationProps = Database['public']['Tables']['notification']['Row'] & {
  workspace: { name: string; slug: string; icon: string };
  initiator: { full_name: string };
};

export type TeamInviteProps = Database['public']['Tables']['workspace_invite'];

export type WorkspaceApiKeyProps = Database['public']['Tables']['workspace_api_key'];

export type WorkspaceApiKeyWithTokenProps = Database['public']['Tables']['workspace_api_key']['Row'] & {
  token: string;
};

export type ExtendedInviteProps = TeamInviteProps['Row'] & {
  workspace: { name: string; slug: string; icon: string };
  creator: { full_name: string };
};

export type AnalyticsProps = {
  key: string;
  clicks: number;
  visitors: number;
}[];

export type ChangelogProps = Database['public']['Tables']['changelog'];

export type ChangelogWithAuthorProps = Database['public']['Tables']['changelog']['Row'] & {
  author: {
    full_name: string;
    avatar_url: string;
  };
};

export type ChangelogSubscriberProps = Database['public']['Tables']['changelog_subscriber'];

export type FeedbackProps = Database['public']['Tables']['feedback'];

export type FeedbackUpvoter = Database['public']['Tables']['feedback_upvoter'];

export type FeedbackBoardProps = Database['public']['Tables']['feedback_board'];

export type FeedbackTagProps = Database['public']['Tables']['feedback_tag'];

export type FeedbackWithUserProps = Database['public']['Tables']['feedback']['Row'] & {
  user: ProfileProps['Row'] & { isTeamMember: boolean };
  tags: { name: string; color: string }[];
  board: FeedbackBoardProps['Row'];
  has_upvoted: boolean;
};

export type FeedbackWithUserInputProps = Database['public']['Tables']['feedback']['Insert'] & {
  tags?: string[];
  user?: ProfileProps['Update'];
};

export type CommentProps = Database['public']['Tables']['comment'];

export type CommentWithUserProps = Database['public']['Tables']['comment']['Row'] & {
  user: ProfileProps['Row'] & { isTeamMember: boolean };
  has_upvoted: boolean;
  replies: CommentWithUserProps[];
};

export type ProfileProps = Database['public']['Tables']['profile'];

// Helper Types
export interface ErrorProps {
  message: string;
  status: number;
}

// Incase error is null, data won't be and vice versa
export type ApiResponse<T, E extends ErrorProps | null = ErrorProps | null> = Promise<
  E extends null ? { data: T; error: null } : { data: null; error: E }
>;

export interface SidebarTabProps {
  name: string;
  icon?: IconObject;
  customIcon?: React.ReactNode;
  slug: string;
}

export type SidebarTabsProps = Record<string, SidebarTabProps[]>;

export interface CategoryTabProps {
  name: string;
  slug: string;
}

export type ApiKeyPermissions = 'public_access' | 'full_access';

// Feedback Filter Props
export interface FeedbackFilterProps {
  tags: {
    i: FeedbackTagProps['Row'][];
    e: FeedbackTagProps['Row'][];
  };
  status: {
    i: { label: string; icon: LucideIcon }[];
    e: { label: string; icon: LucideIcon }[];
  };
  search: string;
  board: {
    i: FeedbackBoardProps['Row'][];
    e: FeedbackBoardProps['Row'][];
  };
  created_date: {
    b: string;
    a: string;
  };
  eta: {
    b: string;
    a: string;
  };
}
