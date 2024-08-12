import { NextResponse } from 'next/server';
import { deleteChangelog, updateChangelog } from '@/lib/api/changelog';

export const runtime = 'edge';

/*
    Update workspace changelog
    PUT /api/v1/workspaces/[slug]/changelogs/[id]
    {
        title: string;
        summary: string;
        content: string;
        image?: string;
        publish_date?: Date;
        published: boolean;
    }
*/
export async function PUT(req: Request, context: { params: { slug: string; id: string } }) {
  const { title, summary, content, image, publishDate, published } = await req.json();

  const { data: changelog, error } = await updateChangelog(
    context.params.id,
    context.params.slug,
    { title, summary, content, image, publish_date: publishDate, published },
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
    Delete workspace changelog
    DELETE /api/v1/workspaces/[slug]/changelogs/[id]
*/
export async function DELETE(req: Request, context: { params: { slug: string; id: string } }) {
  const { data, error } = await deleteChangelog(context.params.id, context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json(data, { status: 200 });
}
