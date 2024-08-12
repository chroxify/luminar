import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { JwtPayload, verify } from 'jsonwebtoken';
import { getWorkspaceBySlug } from '@/lib/api/workspace';

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const redirectTo = req.nextUrl.searchParams.get('redirect_to');
  const jwtPayload = req.nextUrl.searchParams.get('jwt');

  if (!redirectTo || !jwtPayload) {
    return NextResponse.json({ error: 'Missing redirect_to or jwt param' }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY env variable' }, { status: 500 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Get workspace by slug
  const { data: workspace, error: workspaceError } = await getWorkspaceBySlug(
    context.params.slug,
    'route',
    true,
    false
  );

  if (workspaceError) {
    return NextResponse.json(workspaceError, { status: 500 });
  }

  // Get workspaces jwt secret
  const { data: workspaceConfig, error: workspaceConfigError } = await supabase
    .from('workspace_configs')
    .select('integration_sso_secret')
    .eq('workspace_id', workspace.id)
    .single();

  if (workspaceConfigError) {
    return NextResponse.json(workspaceConfigError.message, { status: 500 });
  }

  // Verify jwt
  let payload: JwtPayload;
  try {
    const decoded = verify(jwtPayload, workspaceConfig?.integration_sso_secret as string);
    payload = decoded as JwtPayload;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Invalid jwt' }, { status: 500 });
  }

  // Validate payload
  if (!payload.email || !payload.name) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 500 });
  }

  const email = (payload.email as string).replace('@', `+${workspace.id}@`);

  // Create user based on jwt payload
  const { error } = await supabase.auth.admin.createUser({
    email,
    password: email,
    user_metadata: { full_name: payload.name, avatar_url: payload.avatar_url ? payload.avatar_url : null },
    email_confirm: true,
  });

  if (error) {
    if (!error.message.includes('already been registered')) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }

  const { data: user, error: userError } = await supabase.auth.signInWithPassword({
    email,
    password: email,
  });

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // Parse user session
  const sessionEncoded = JSON.stringify(user.session);

  // Set auth token cookie
  cookies().set(
    `sb-${
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SUPABASE_URL!.split('.')[0].replace('https://', '')
        : 'localhost'
    }-auth-token`,
    sessionEncoded,
    {
      path: '/',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    }
  );

  return NextResponse.redirect(redirectTo, { status: 302 });
}
