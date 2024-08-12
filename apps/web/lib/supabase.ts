export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      changelog: {
        Row: {
          author_id: string;
          content: string | null;
          created_at: string;
          id: string;
          publish_date: string | null;
          published: boolean;
          slug: string;
          summary: string | null;
          thumbnail: string | null;
          title: string;
          workspace_id: string;
        };
        Insert: {
          author_id: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          publish_date?: string | null;
          published: boolean;
          slug?: string;
          summary?: string | null;
          thumbnail?: string | null;
          title?: string;
          workspace_id: string;
        };
        Update: {
          author_id?: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          publish_date?: string | null;
          published?: boolean;
          slug?: string;
          summary?: string | null;
          thumbnail?: string | null;
          title?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'changelogs_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'changelogs_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'changelogs_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      changelog_subscriber: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'changelog_subscribers_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'changelog_subscribers_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      comment: {
        Row: {
          content: string;
          created_at: string;
          feedback_id: string;
          id: string;
          reply_to_id: string | null;
          upvotes: number;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          feedback_id: string;
          id?: string;
          reply_to_id?: string | null;
          upvotes?: number;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          feedback_id?: string;
          id?: string;
          reply_to_id?: string | null;
          upvotes?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_comments_feedback_id_fkey';
            columns: ['feedback_id'];
            isOneToOne: false;
            referencedRelation: 'feedback';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_comments_reply_to_id_fkey';
            columns: ['reply_to_id'];
            isOneToOne: false;
            referencedRelation: 'comment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      comment_upvoter: {
        Row: {
          comment_id: string;
          created_at: string;
          id: string;
          profile_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          id?: string;
          profile_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_comment_upvoter_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'comment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_comment_upvoter_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback: {
        Row: {
          board_id: string;
          comment_count: number;
          content: string;
          created_at: string;
          id: string;
          raw_tags: Json[] | null;
          status: Database['public']['Enums']['status_type'];
          title: string;
          upvotes: number;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          board_id: string;
          comment_count?: number;
          content: string;
          created_at?: string;
          id?: string;
          raw_tags?: Json[] | null;
          status?: Database['public']['Enums']['status_type'];
          title: string;
          upvotes?: number;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          board_id?: string;
          comment_count?: number;
          content?: string;
          created_at?: string;
          id?: string;
          raw_tags?: Json[] | null;
          status?: Database['public']['Enums']['status_type'];
          title?: string;
          upvotes?: number;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_feedback_board_id_fkey';
            columns: ['board_id'];
            isOneToOne: false;
            referencedRelation: 'feedback_board';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback_board: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          private: boolean;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          private?: boolean;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          private?: boolean;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_feedback_board_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_feedback_board_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback_tag: {
        Row: {
          color: string;
          created_at: string;
          id: string;
          name: string;
          workspace_id: string;
        };
        Insert: {
          color: string;
          created_at?: string;
          id?: string;
          name: string;
          workspace_id: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: string;
          name?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_tags_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_tags_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback_upvoter: {
        Row: {
          created_at: string;
          feedback_id: string;
          id: string;
          profile_id: string;
        };
        Insert: {
          created_at?: string;
          feedback_id: string;
          id?: string;
          profile_id: string;
        };
        Update: {
          created_at?: string;
          feedback_id?: string;
          id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_upvoters_feedback_id_fkey';
            columns: ['feedback_id'];
            isOneToOne: false;
            referencedRelation: 'feedback';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_upvoters_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      notification: {
        Row: {
          comment_id: string | null;
          created_at: string;
          feedback_id: string;
          has_archived: string[] | null;
          id: string;
          initiator_id: string;
          type: Database['public']['Enums']['notification_type'];
          workspace_id: string;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string;
          feedback_id: string;
          has_archived?: string[] | null;
          id?: string;
          initiator_id: string;
          type: Database['public']['Enums']['notification_type'];
          workspace_id: string;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string;
          feedback_id?: string;
          has_archived?: string[] | null;
          id?: string;
          initiator_id?: string;
          type?: Database['public']['Enums']['notification_type'];
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'comment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_feedback_id_fkey';
            columns: ['feedback_id'];
            isOneToOne: false;
            referencedRelation: 'feedback';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_initiator_id_fkey';
            columns: ['initiator_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      profile: {
        Row: {
          avatar_url: string | null;
          email: string;
          full_name: string;
          id: string;
          is_anonymous: boolean;
        };
        Insert: {
          avatar_url?: string | null;
          email: string;
          full_name: string;
          id?: string;
          is_anonymous?: boolean;
        };
        Update: {
          avatar_url?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          is_anonymous?: boolean;
        };
        Relationships: [];
      };
      workspace: {
        Row: {
          created_at: string;
          custom_domain: string | null;
          custom_domain_redirect: Database['public']['Enums']['domain_redirect_type'];
          custom_domain_verified: boolean;
          icon: string | null;
          icon_radius: Database['public']['Enums']['icon_radius_type'];
          icon_redirect_url: string | null;
          id: string;
          name: string;
          opengraph_image: string | null;
          slug: string;
          sso_auth_enabled: boolean;
          sso_auth_secret_id: string | null;
          sso_auth_url: string | null;
        };
        Insert: {
          created_at?: string;
          custom_domain?: string | null;
          custom_domain_redirect?: Database['public']['Enums']['domain_redirect_type'];
          custom_domain_verified?: boolean;
          icon?: string | null;
          icon_radius?: Database['public']['Enums']['icon_radius_type'];
          icon_redirect_url?: string | null;
          id?: string;
          name: string;
          opengraph_image?: string | null;
          slug: string;
          sso_auth_enabled?: boolean;
          sso_auth_secret_id?: string | null;
          sso_auth_url?: string | null;
        };
        Update: {
          created_at?: string;
          custom_domain?: string | null;
          custom_domain_redirect?: Database['public']['Enums']['domain_redirect_type'];
          custom_domain_verified?: boolean;
          icon?: string | null;
          icon_radius?: Database['public']['Enums']['icon_radius_type'];
          icon_redirect_url?: string | null;
          id?: string;
          name?: string;
          opengraph_image?: string | null;
          slug?: string;
          sso_auth_enabled?: boolean;
          sso_auth_secret_id?: string | null;
          sso_auth_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workspace_sso_auth_secret_id_fkey';
            columns: ['sso_auth_secret_id'];
            isOneToOne: false;
            referencedRelation: 'decrypted_secrets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workspace_sso_auth_secret_id_fkey';
            columns: ['sso_auth_secret_id'];
            isOneToOne: false;
            referencedRelation: 'secrets';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_api_key: {
        Row: {
          created_at: string;
          creator_id: string;
          id: string;
          name: string;
          permission: Database['public']['Enums']['api_token_type'];
          short_token: string | null;
          token_id: string | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          name: string;
          permission: Database['public']['Enums']['api_token_type'];
          short_token?: string | null;
          token_id?: string | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          name?: string;
          permission?: Database['public']['Enums']['api_token_type'];
          short_token?: string | null;
          token_id?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workspace_api_keys_creator_id_fkey';
            columns: ['creator_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_api_keys_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_api_keys_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_integration: {
        Row: {
          created_at: string;
          discord_enabled: boolean;
          discord_role_id: number | null;
          discord_webhook: string | null;
          id: string;
          slack_enabled: boolean;
          slack_webhook: string | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          discord_enabled?: boolean;
          discord_role_id?: number | null;
          discord_webhook?: string | null;
          id?: string;
          slack_enabled?: boolean;
          slack_webhook?: string | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          discord_enabled?: boolean;
          discord_role_id?: number | null;
          discord_webhook?: string | null;
          id?: string;
          slack_enabled?: boolean;
          slack_webhook?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workspace_integration_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: true;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workspace_integration_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: true;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_invite: {
        Row: {
          accepted: boolean;
          created_at: string;
          creator_id: string;
          email: string;
          id: string;
          workspace_id: string;
        };
        Insert: {
          accepted?: boolean;
          created_at?: string;
          creator_id: string;
          email: string;
          id?: string;
          workspace_id: string;
        };
        Update: {
          accepted?: boolean;
          created_at?: string;
          creator_id?: string;
          email?: string;
          id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workspace_invites_creator_id_fkey';
            columns: ['creator_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_invites_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_invites_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_member: {
        Row: {
          created_at: string;
          id: string;
          member_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          member_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          member_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workspace_members_member_id_fkey';
            columns: ['member_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_members_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_members_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_module: {
        Row: {
          changelog_enabled: boolean;
          changelog_preview_style: Database['public']['Enums']['changelog_style_type'];
          changelog_twitter_handle: string | null;
          created_at: string;
          feedback_anon_posting: boolean;
          feedback_anon_upvoting: boolean;
          feedback_default_board_id: string;
          id: string;
          workspace_id: string;
        };
        Insert: {
          changelog_enabled?: boolean;
          changelog_preview_style?: Database['public']['Enums']['changelog_style_type'];
          changelog_twitter_handle?: string | null;
          created_at?: string;
          feedback_anon_posting?: boolean;
          feedback_anon_upvoting?: boolean;
          feedback_default_board_id: string;
          id?: string;
          workspace_id: string;
        };
        Update: {
          changelog_enabled?: boolean;
          changelog_preview_style?: Database['public']['Enums']['changelog_style_type'];
          changelog_twitter_handle?: string | null;
          created_at?: string;
          feedback_anon_posting?: boolean;
          feedback_anon_upvoting?: boolean;
          feedback_default_board_id?: string;
          id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workspace_module_feedback_default_board_id_fkey';
            columns: ['feedback_default_board_id'];
            isOneToOne: true;
            referencedRelation: 'feedback_board';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workspace_module_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: true;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workspace_module_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: true;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_theme: {
        Row: {
          accent: string | null;
          background: string | null;
          border: string | null;
          created_at: string;
          foreground: string | null;
          id: string;
          root: string | null;
          secondary_background: string | null;
          theme: Database['public']['Enums']['theme_type'];
          workspace_id: string;
        };
        Insert: {
          accent?: string | null;
          background?: string | null;
          border?: string | null;
          created_at?: string;
          foreground?: string | null;
          id?: string;
          root?: string | null;
          secondary_background?: string | null;
          theme?: Database['public']['Enums']['theme_type'];
          workspace_id: string;
        };
        Update: {
          accent?: string | null;
          background?: string | null;
          border?: string | null;
          created_at?: string;
          foreground?: string | null;
          id?: string;
          root?: string | null;
          secondary_background?: string | null;
          theme?: Database['public']['Enums']['theme_type'];
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_workspace_theme_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: true;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_workspace_theme_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: true;
            referencedRelation: 'workspace_view';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      workspace_view: {
        Row: {
          icon: string | null;
          icon_radius: Database['public']['Enums']['icon_radius_type'] | null;
          id: string | null;
          name: string | null;
          opengraph_image: string | null;
          slug: string | null;
        };
        Insert: {
          icon?: string | null;
          icon_radius?: Database['public']['Enums']['icon_radius_type'] | null;
          id?: string | null;
          name?: string | null;
          opengraph_image?: string | null;
          slug?: string | null;
        };
        Update: {
          icon?: string | null;
          icon_radius?: Database['public']['Enums']['icon_radius_type'] | null;
          id?: string | null;
          name?: string | null;
          opengraph_image?: string | null;
          slug?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_secret_by_id: {
        Args: {
          secret_id: string;
        };
        Returns: {
          id: string;
          name: string;
          decrypted_secret: string;
          description: string;
          created_at: string;
          updated_at: string;
        }[];
      };
      get_workspace_api_key: {
        Args: {
          api_key_secret: string;
        };
        Returns: {
          created_at: string;
          creator_id: string;
          id: string;
          name: string;
          permission: Database['public']['Enums']['api_token_type'];
          short_token: string | null;
          token_id: string | null;
          workspace_id: string;
        };
      };
      get_workspace_api_key_secret: {
        Args: {
          api_key_id: string;
        };
        Returns: string;
      };
      insert_secret: {
        Args: {
          secret_value: string;
          secret_name?: string;
          description?: string;
        };
        Returns: string;
      };
      is_allowed_api_token: {
        Args: {
          apitoken: string;
          tokentype: Database['public']['Enums']['api_token_type'][];
          workspace_id: string;
        };
        Returns: boolean;
      };
      is_workspace_member: {
        Args: {
          p_workspace_id: string;
          p_user_id?: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      api_token_type: 'full_access' | 'public_access';
      changelog_style_type: 'summary' | 'content';
      domain_redirect_type: 'no_redirect' | 'direct_redirect' | 'root_redirect';
      icon_radius_type: 'rounded-full' | 'rounded-none' | 'rounded-md';
      notification_type: 'comment' | 'post';
      status_type: 'in review' | 'planned' | 'in progress' | 'completed' | 'rejected';
      theme_type: 'dark' | 'light' | 'custom';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
