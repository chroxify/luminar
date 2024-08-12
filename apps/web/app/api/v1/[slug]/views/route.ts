import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/tinybird';

/*
  Record page view
  POST /api/v1/[workspace]/views
  {
    "feedbackId": "string",
    "changelogId": "string",
  }
*/
export async function POST(req: NextRequest, context: { params: { slug: string } }) {
  const { feedbackId, changelogId } = await req.json();

  // Check for Tinybird env vars
  if (!process.env.TINYBIRD_API_URL || !process.env.TINYBIRD_API_KEY) {
    return NextResponse.json({ error: 'Tinybird environment variables not set' }, { status: 500 });
  }

  const data = await recordClick({
    req,
    workspaceId: context.params.slug,
    feedbackId,
    changelogId,
  });

  return NextResponse.json({ data }, { status: 200 });
}
