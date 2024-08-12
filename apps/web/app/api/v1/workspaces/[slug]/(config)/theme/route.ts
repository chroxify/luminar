import { NextResponse } from 'next/server';
import { getWorkspaceTheme, updateWorkspaceTheme } from '@/lib/api/theme';

/*
  Get workspace theme
  GET /api/v1/workspaces/:slug/theme
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  // Get workspace theme
  const { data: theme, error } = await getWorkspaceTheme(context.params.slug, 'route');

  if (error) {
    return NextResponse.json(error, { status: error.status });
  }

  return NextResponse.json(theme, { status: 200 });
}

/*
  Update workspace theme
  PATCH /api/v1/workspaces/:slug/theme
  {
    "accent": "string",
    "background": "string",
    "border": "string",
    "foreground": "string",
    "root": "string",
    "secondary_background": "string",
    "theme": "string"
  }
*/
export async function PATCH(req: Request, context: { params: { slug: string } }) {
  const {
    accent,
    background,
    border,
    foreground,
    root,
    secondary_background: secondaryBackground,
    theme,
  } = await req.json();

  // Update workspace theme
  const { data: updatedTheme, error } = await updateWorkspaceTheme(
    context.params.slug,
    {
      accent,
      background,
      border,
      foreground,
      root,
      secondary_background: secondaryBackground,
      theme,
    },
    'route'
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(updatedTheme, { status: 200 });
}
