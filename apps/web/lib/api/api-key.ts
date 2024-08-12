import { withWorkspaceAuth } from '@/lib/auth';
import { ApiKeyPermissions, WorkspaceApiKeyProps, WorkspaceApiKeyWithTokenProps } from '@/lib/types';

// Create new API key
export const createWorkspaceApiKey = (
  slug: string,
  data: { name: string; permission: ApiKeyPermissions },
  cType: 'server' | 'route'
) =>
  withWorkspaceAuth<WorkspaceApiKeyWithTokenProps>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Validate permission
    if (!['full_access', 'public_access'].includes(data.permission)) {
      return {
        data: null,
        error: { message: 'permission must be one of: full_access, public_access', status: 400 },
      };
    }

    // Get all API keys for workspace
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('workspace_api_key')
      .select()
      .eq('workspace_id', workspace!.id);

    // Check for errors
    if (apiKeysError) {
      return { data: null, error: { message: apiKeysError.message, status: 500 } };
    }

    // Check if API key name already exists
    if (apiKeys.some((item) => item.name === data.name)) {
      return { data: null, error: { message: 'api key name already exists', status: 400 } };
    }

    // Check if it's more than 3 API keys
    if (apiKeys.length >= 3) {
      return { data: null, error: { message: 'maximum of 3 api keys reached', status: 400 } };
    }

    // Create API key
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('workspace_api_key')
      .insert({
        workspace_id: workspace!.id,
        name: data.name,
        permission: data.permission,
        creator_id: user!.id,
      })
      .select()
      .single();

    // Check for errors
    if (apiKeyError) {
      return { data: null, error: { message: apiKeyError.message, status: 500 } };
    }

    // Get api key secret
    const { data: secret, error: secretError } = await supabase
      .rpc('get_workspace_api_key_secret', { api_key_id: apiKey.id })
      .single();

    if (secretError) {
      return { data: null, error: { message: secretError.message, status: 500 } };
    }

    // Return API key
    return { data: { ...apiKey, token: secret }, error: null };
  })(slug, cType);

// Get all API keys for workspace
export const getWorkspaceApiKeys = withWorkspaceAuth<WorkspaceApiKeyProps['Row'][]>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get all API keys for workspace
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('workspace_api_key')
      .select()
      .eq('workspace_id', workspace!.id);

    // Check for errors
    if (apiKeysError) {
      return { data: null, error: { message: apiKeysError.message, status: 500 } };
    }

    // Return API keys
    return { data: apiKeys, error: null };
  }
);

// Delete API key for workspace
export const deleteWorkspaceApiKey = (slug: string, keyId: string, cType: 'server' | 'route') =>
  withWorkspaceAuth<WorkspaceApiKeyProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get API key
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('workspace_api_key')
      .select()
      .eq('workspace_id', workspace!.id)
      .eq('id', keyId)
      .single();

    // Check for errors
    if (apiKeyError || !apiKey) {
      return { data: null, error: { message: 'invalid api key', status: 400 } };
    }

    // Delete API key
    const { data: deletedApiKey, error: deleteError } = await supabase
      .from('workspace_api_key')
      .delete()
      .eq('id', apiKey.id)
      .select()
      .single();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return deleted API key
    return { data: deletedApiKey, error: null };
  })(slug, cType);
