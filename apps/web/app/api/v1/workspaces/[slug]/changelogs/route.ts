import { NextResponse } from 'next/server';
import { createChangelog, getAllWorkspaceChangelogs } from '@/lib/api/changelog';
import { ChangelogProps } from '@/lib/types';

export const runtime = 'edge';

/* 
    Create Changelog
    POST /api/v1/workspaces/[slug]/changelogs
    {
        title: string;
        summary: string;
        content: string;
        image?: string;
        publish_date?: Date;
        published: boolean;
    }
*/
export async function POST(req: Request, context: { params: { slug: string } }) {
  const {
    title,
    summary,
    content,
    thumbnail,
    publish_date: publishDate,
    published,
    notify_subscribers: notifySubscribers,
  } = (await req.json()) as ChangelogProps['Insert'] & { notify_subscribers: boolean };

  // Validate Request Body
  if (published) {
    if (!title || !summary || !content) {
      return NextResponse.json(
        { error: 'title, summary, and content are required when publishing a changelog.' },
        { status: 400 }
      );
    }
  }

  const { data: changelog, error } = await createChangelog(
    context.params.slug,
    {
      title: title || '',
      summary: summary || '',
      content: content || '',
      thumbnail: thumbnail || null,
      publish_date: publishDate || null,
      published: published || false,
      workspace_id: 'dummy-id',
      slug: 'dummy-slug',
      author_id: 'dummy-author',
    },
    notifySubscribers,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return changelog
  return NextResponse.json(changelog, { status: 200 });
}

/*
    Get workspace changelogs
    GET /api/v1/workspaces/[slug]/changelogs
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: changelogs, error } = await getAllWorkspaceChangelogs(context.params.slug, 'route', true);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return changelogs
  return NextResponse.json(changelogs, { status: 200 });
}
