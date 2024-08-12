import { NextResponse } from 'next/server';
import { deleteFeedbackTagByName } from '@/lib/api/feedback';

/*
    Delete tag by name
    DELETE /api/v1/workspaces/:slug/feedback/tags/:name
*/
export async function DELETE(req: Request, context: { params: { slug: string; name: string } }) {
  const { data: tag, error } = await deleteFeedbackTagByName(
    context.params.slug,
    context.params.name,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return tag
  return NextResponse.json(tag, { status: 200 });
}
