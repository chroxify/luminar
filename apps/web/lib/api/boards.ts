import { withWorkspaceAuth } from '../auth';
import { FeedbackBoardProps } from '../types';

// Create workspace board
export const createWorkspaceBoard = (
  workspaceSlug: string,
  data: FeedbackBoardProps['Insert'],
  cType: 'server' | 'route'
) =>
  withWorkspaceAuth<FeedbackBoardProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Create board
    const { data: board, error: boardError } = await supabase
      .from('feedback_board')
      .insert({ ...data, workspace_id: workspace!.id })
      .single();

    // Check for errors
    if (boardError) {
      return { data: null, error: { message: boardError.message, status: 500 } };
    }

    // Return board
    return { data: board, error: null };
  })(workspaceSlug, cType);

// Get workspace boards
export const getWorkspaceBoards = withWorkspaceAuth<FeedbackBoardProps['Row'][]>(
  async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get boards
    const { data: boards, error: boardsError } = await supabase
      .from('feedback_board')
      .select()
      .eq('workspace_id', workspace!.id);

    // Check for errors
    if (boardsError) {
      return { data: null, error: { message: boardsError.message, status: 500 } };
    }

    // Return boards
    return { data: boards, error: null };
  }
);

// Update workspace board by id
export const updateWorkspaceBoard = (
  id: string,
  workspaceSlug: string,
  data: FeedbackBoardProps['Update'],
  cType: 'server' | 'route'
) =>
  withWorkspaceAuth<FeedbackBoardProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Update board
    const { data: board, error: boardError } = await supabase
      .from('feedback_board')
      .update(data)
      .eq('id', id)
      .single();

    // Check for errors
    if (boardError) {
      return { data: null, error: { message: boardError.message, status: 500 } };
    }

    // Return board
    return { data: board, error: null };
  })(workspaceSlug, cType);

// Delete workspace board by id
export const deleteWorkspaceBoard = (id: string, workspaceSlug: string, cType: 'server' | 'route') =>
  withWorkspaceAuth<FeedbackBoardProps['Row']>(async (user, supabase, workspace, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Delete board
    const { data: board, error: boardError } = await supabase
      .from('feedback_board')
      .delete()
      .eq('id', id)
      .single();

    // Check for errors
    if (boardError) {
      return { data: null, error: { message: boardError.message, status: 500 } };
    }

    // Return board
    return { data: board, error: null };
  })(workspaceSlug, cType);
