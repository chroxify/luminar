import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies, headers } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { PostgrestError, SupabaseClient, UserMetadata } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import {
  ApiResponse,
  ErrorProps,
  FeedbackBoardProps,
  FeedbackProps,
  WorkspaceApiKeyProps,
  WorkspaceModuleProps,
  WorkspaceProps,
} from '@/lib/types';

export interface ClientCookiesConfig {
  cookies: {
    get?: (name: string) => string | undefined;
    set?: (name: string, value: string, options: CookieOptions) => void;
    remove?: (name: string, options: CookieOptions) => void;
  };
}

// Helper function to create a config object for the Supabase client
function createCookiesConfig(
  cookieStore: ReadonlyRequestCookies,
  operations: ('get' | 'set' | 'remove')[]
): ClientCookiesConfig {
  const config: ClientCookiesConfig = {
    cookies: {},
  };

  operations.forEach((operation) => {
    switch (operation) {
      case 'get':
        config.cookies.get = (name: string) => cookieStore.get(name)?.value;
        break;
      case 'set':
        config.cookies.set = (name: string, value: string, options: CookieOptions) =>
          cookieStore.set({ name, value, ...options });
        break;
      case 'remove':
        config.cookies.remove = (name: string, options: CookieOptions) =>
          cookieStore.set({ name, value: '', ...options });
        break;
      default:
        throw new Error(`Invalid operation: ${operation as string}`);
    }
  });

  return config;
}

// Create Supabase Client for needed client type
// Also returns the current user
// cType: 'server' | 'route'
export async function createClient(
  cType: 'server' | 'route',
  isPublic = false
): Promise<{
  supabase: SupabaseClient<Database>;
  user: UserMetadata;
}> {
  const headerStore = headers();
  const cookieStore = cookies();
  const authHeader = headerStore.get('authorization');

  // Create client
  const supabase =
    cType === 'server'
      ? createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          createCookiesConfig(cookieStore, ['get'])
        )
      : createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            ...createCookiesConfig(cookieStore, ['get', 'set', 'remove']),
            global: {
              headers: {
                fbkey: authHeader ? authHeader.split(' ')[1] : '',
              },
            },
          }
        );

  // If auth header exists, validate api key
  if (authHeader) {
    // Get api key from auth header
    const apiKey = authHeader.split(' ')[1];

    // Fetch api key
    const { data: workspaceApiKey, error } = (await supabase
      .rpc('get_workspace_api_key', {
        api_key_secret: apiKey,
      })
      .single()) as { data: WorkspaceApiKeyProps['Row']; error: PostgrestError | null };

    // If error is not null, then the api key is invalid
    if (error || !workspaceApiKey.id) {
      return {
        supabase,
        user: { data: null, error: { message: 'unauthorized, invalid api key.', status: 401 } },
      };
    }

    // Get api key data
    // TODO: Expand this further, also supporting public access for feedback etc.
    if (workspaceApiKey.permission === 'public_access' && !isPublic) {
      return {
        supabase,
        user: { data: null, error: { message: 'unauthorized, missing permissions.', status: 403 } },
      };
    }

    // Get user from api key
    const { data: user, error: userError } = (await supabase
      .from('profile')
      .select()
      .eq('id', workspaceApiKey.creator_id)
      .single()) as { data: UserMetadata; error: PostgrestError | null };

    // If error is not null, then the user does not exist
    if (userError) {
      return {
        supabase,
        user: { data: null, error: { message: 'user not found.', status: 404 } },
      };
    }

    return { supabase, user: { data: user, error: null } };
  }

  const user = await supabase.auth.getUser();

  return { supabase, user };
}

type WithWorkspaceAuthHandler<T> = (
  user: UserMetadata | null,
  supabase: SupabaseClient<Database>,
  workspace: WorkspaceProps['Row'] | null,
  error: ErrorProps | null,
  allowPublic?: boolean
) => ApiResponse<T>;

// withWorkspaceAuth is a helper function that can be used to wrap API routes
// Ensures that the user is logged in and is a member of the workspace with the given slug
// allowAnonAccess = true bypasses complete user auth and workspace auth checks
// requireLogin = true requires the user to be logged in, even if allowAnonAccess is true
export const withWorkspaceAuth = <T>(handler: WithWorkspaceAuthHandler<T>) => {
  return async (slug: string, cType: 'server' | 'route', allowAnonAccess = false, requireLogin = true) => {
    // Get the user from the session
    const { supabase, user } = await createClient(cType, allowAnonAccess);

    // If user.error is not null, then the user is likely not logged in
    if ((user.error !== null && requireLogin) || user.data === null) {
      return handler(null, supabase, null, {
        message:
          user.error?.message === 'invalid claim: missing sub claim'
            ? 'unauthorized, login required.'
            : user.error?.message,
        status: user.error?.status || 401,
      });
    }

    // Get workspace from database
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspace')
      .select()
      .eq('slug', slug)
      .single();

    // If error is not null, then the workspace does not exist
    if (workspaceError) {
      return handler(user.data.user, supabase, workspace, { message: 'workspace not found.', status: 404 });
    }

    // Make sure user is a member of the workspace
    if (!allowAnonAccess) {
      const { data: isMember, error: memberError } = await supabase
        .from('workspace_member')
        .select()
        .eq('workspace_id', workspace.id)
        .eq('member_id', user.data.user.id)
        .single();

      // If error is not null, then the user is not a member of the workspace
      if (memberError || !isMember) {
        return handler(user.data.user, supabase, workspace, {
          message: 'unauthorized, user is not a member of the workspace.',
          status: 403,
        });
      }
    }

    return handler(user.data.user, supabase, workspace, null, allowAnonAccess);
  };
};

type WithFeedbackBoardAuthHandler<T> = (
  user: UserMetadata | null,
  supabase: SupabaseClient<Database>,
  board: FeedbackBoardProps['Row'] | null,
  error: ErrorProps | null
) => ApiResponse<T>;

// withFeedbackBoardAuth is a helper function that can be used to wrap API routes
// Ensures that the user is logged in and is authorized to access the feedback board with the given slug
export const withFeedbackBoardAuth = <T>(handler: WithFeedbackBoardAuthHandler<T>) => {
  return async (
    boardId: string | undefined,
    workspaceSlug: string | null | undefined,
    cType: 'server' | 'route',
    requireLogin = true
  ) => {
    // Get the user from the session
    const { supabase, user } = await createClient(cType);

    // If user.error is not null, then the user is likely not logged in
    if ((user.error !== null && requireLogin) || user.data === null) {
      return handler(null, supabase, null, {
        message:
          user.error?.message === 'invalid claim: missing sub claim'
            ? 'unauthorized, login required.'
            : user.error?.message,
        status: user.error?.status || 401,
      });
    }

    // Get feedback board from database
    let board: FeedbackBoardProps['Row'] | null;
    let error: PostgrestError | null;

    if (boardId !== undefined) {
      const { data, error: boardError } = await supabase
        .from('feedback_board')
        .select()
        .eq('id', boardId)
        .single();

      board = data;
      error = boardError;
    } else {
      if (!workspaceSlug) {
        return handler(user.data.user, supabase, null, {
          message: 'workspace slug or board id is required.',
          status: 400,
        });
      }

      // Get workspace id
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspace')
        .select('id')
        .eq('slug', workspaceSlug)
        .single();

      // If error is not null, then the workspace does not exist
      if (workspaceError) {
        return handler(user.data.user, supabase, null, {
          message: 'workspace not found.',
          status: 404,
        });
      }

      const { data: workspaceModuleConfig, error: configError } = (await supabase
        .from('workspace_module')
        .select('*, board:feedback_default_board_id (*)')
        .eq('workspace_id', workspace.id)
        .single()) as {
        data: WorkspaceModuleProps['Row'] & { board: FeedbackBoardProps['Row'] };
        error: PostgrestError | null;
      };

      board = workspaceModuleConfig.board;
      error = configError;
    }

    // If error is not null, then the feedback board does not exist
    if (error || !board) {
      return handler(user.data.user, supabase, null, {
        message: 'feedback board not found.',
        status: 404,
      });
    }

    // check if private board
    if (board.private) {
      // Make sure user is a member of the workspace
      const { data: isMember, error: memberError } = await supabase
        .from('workspace_member')
        .select()
        .eq('workspace_id', board.workspace_id)
        .eq('user_id', user.data.user.id)
        .single();

      // If error is not null, then the user is not a member of the workspace
      if (memberError || !isMember) {
        return handler(user.data.user, supabase, null, {
          message: 'unauthorized, user is not a member of the workspace.',
          status: 403,
        });
      }
    }

    return handler(user.data.user, supabase, board, null);
  };
};

type WithFeedbackAuthHandler<T> = (
  user: UserMetadata | null,
  supabase: SupabaseClient<Database>,
  feedback: FeedbackProps['Row'] | null,
  workspace: WorkspaceProps['Row'] | null,
  error: ErrorProps | null
) => ApiResponse<T>;

// withFeedbackAuth is a helper function that can be used to wrap API routes
// Ensures that the user is logged in and is authorized to access the feedback post with the given id
export const withFeedbackAuth = <T>(handler: WithFeedbackAuthHandler<T>) => {
  return async (id: string, slug: string, cType: 'server' | 'route', requireLogin = true) => {
    // Get the user from the session
    const { supabase, user } = await createClient(cType);

    // If user.error is not null, then the user is likely not logged in
    if ((user.error !== null && requireLogin) || user.data === null) {
      return handler(null, supabase, null, null, {
        message:
          user.error?.message === 'invalid claim: missing sub claim'
            ? 'unauthorized, login required.'
            : user.error?.message,
        status: user.error?.status || 401,
      });
    }

    // Get workspace from database
    const { data: workspace, error } = await supabase.from('workspace').select().eq('slug', slug).single();

    // If error is not null, then the workspace does not exist
    if (error) {
      return handler(user.data.user, supabase, null, workspace, {
        message: 'workspace not found.',
        status: 404,
      });
    }

    // Check if feedback exists
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*, user:user_id (*)')
      .eq('id', id)
      .single();

    // If not null, feedback does not exist
    if (feedbackError) {
      return handler(user.data.user, supabase, null, null, {
        message: 'feedback not found.',
        status: 404,
      });
    }

    // Return feedback
    return handler(user.data.user, supabase, feedback, workspace, null);
  };
};

type WithUserAuthHandler<T> = (
  user: UserMetadata | null,
  supabase: SupabaseClient<Database>,
  error: ErrorProps | null
) => ApiResponse<T>;

// withUserAuth is a helper function that can be used to wrap API routes
// Ensures that the user is logged in
export const withUserAuth = <T>(handler: WithUserAuthHandler<T>) => {
  return async (cType: 'server' | 'route') => {
    // Get the user from the session
    const { supabase, user } = await createClient(cType);

    // If user.error is not null, then the user is likely not logged in
    if (user.error !== null) {
      return handler(null, supabase, {
        message:
          user.error?.message === 'invalid claim: missing sub claim'
            ? 'unauthorized, login required.'
            : user.error?.message,
        status: user.error?.status || 401,
      });
    }

    return handler(user.data.user, supabase, null);
  };
};
