import { withWorkspaceAuth } from '@/lib/auth';
import { WorkspaceModuleProps } from '@/lib/types';

// Get workspace module by slug
export const getWorkspaceModuleConfig = withWorkspaceAuth<WorkspaceModuleProps['Row']>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get workspace module
    const { data: module, error: moduleError } = await supabase
      .from('workspace_module')
      .select()
      .eq('workspace_id', workspace!.id)
      .single();

    // Check for errors
    if (moduleError) {
      return { data: null, error: { message: moduleError.message, status: 500 } };
    }

    // Return module
    return { data: module, error: null };
  }
);

// Update workspace module by slug
export const updateWorkspaceModuleConfig = (
  slug: string,
  data: WorkspaceModuleProps['Update'],
  cType: 'server' | 'route'
) =>
  withWorkspaceAuth<WorkspaceModuleProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Update workspace module
    const { data: updatedModule, error: updateError } = await supabase
      .from('workspace_module')
      .update(data)
      .eq('workspace_id', workspace!.id)
      .single();

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return module
    return { data: updatedModule, error: null };
  })(slug, cType);
