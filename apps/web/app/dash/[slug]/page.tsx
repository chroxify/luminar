import { redirect } from 'next/navigation';

export default async function WorkspacePage({ params }: { params: { slug: string } }) {
  // Redirect to changelog
  redirect(`/${params.slug}/changelog`);
}
