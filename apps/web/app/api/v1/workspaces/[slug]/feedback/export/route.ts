import { getAllWorkspaceFeedback } from '@/lib/api/feedback';
import { formatRootUrl } from '@/lib/utils';

/*
  Export all feedback for a workspace
  GET /api/v1/workspaces/:slug/feedback/export
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: feedback, error } = await getAllWorkspaceFeedback(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return new Response(error.message, { status: error.status });
  }

  // Create CSV
  const csv = `ID,Link,Title,Content,Status,Upvotes,Comment Count,User ID,User Name,User Email,User Avatar,Tags,Created At\n${feedback
    .map((feedback) => {
      return `${feedback.id},${formatRootUrl(
        context.params.slug,
        `/feedback/${feedback.id}`
      )},"${feedback.title.replace(/"/g, '""')}","${feedback.content.replace(/"/g, '""')}",${
        feedback.status
      },${feedback.upvotes},${feedback.comment_count},${feedback.user_id},"${feedback.user.full_name.replace(
        /"/g,
        '""'
      )}","${feedback.user.email.replace(/"/g, '""')}",${
        feedback.user.avatar_url ? `"${feedback.user.avatar_url.replace(/"/g, '""')}"` : ''
      },${feedback.tags ? feedback.tags.map((tag) => tag.name.replace(/"/g, '""')).join(',') : ''},${
        feedback.created_at
      }\n`;
    })
    .join('')}`;

  // Return CSV
  const timestamp = new Date().getTime();
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${context.params.slug}-${timestamp}.csv`,
    },
  });
}
