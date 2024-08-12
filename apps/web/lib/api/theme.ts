import { withWorkspaceAuth } from '@/lib/auth';
import { WorkspaceThemeProps } from '@/lib/types';

// Get workspace theme by slug
export const getWorkspaceTheme = withWorkspaceAuth<WorkspaceThemeProps['Row']>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get workspace theme
    const { data: theme, error: themeError } = await supabase
      .from('workspace_theme')
      .select()
      .eq('workspace_id', workspace!.id)
      .single();

    // Check for errors
    if (themeError) {
      return { data: null, error: { message: themeError.message, status: 500 } };
    }

    // Return theme
    return { data: theme, error: null };
  }
);

// Update workspace theme by slug
export const updateWorkspaceTheme = (
  slug: string,
  data: WorkspaceThemeProps['Update'],
  cType: 'server' | 'route'
) =>
  withWorkspaceAuth<WorkspaceThemeProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Update workspace theme
    const { data: updatedTheme, error: updateError } = await supabase
      .from('workspace_theme')
      .update(data)
      .eq('workspace_id', workspace!.id)
      .select()
      .single();

    // Check for errors
    if (updateError) {
      return { data: null, error: { message: updateError.message, status: 500 } };
    }

    // Return updated theme
    return { data: updatedTheme, error: null };
  })(slug, cType);
