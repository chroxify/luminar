import { getChangelogSubscribers } from '@/lib/api/changelog';

/*
  Download changelog subscribers
  GET /api/v1/workspaces/:slug/changelogs/subscribers/download
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: subscribers, error } = await getChangelogSubscribers(context.params.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return new Response(error.message, { status: error.status });
  }

  // Create CSV
  const csv = `Email\n${subscribers
    .map((subscriber) => {
      return `${subscriber.email}\n`;
    })
    .join('')}`;

  // Return CSV
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=subscribers.csv',
    },
  });
}
