import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { fontMono } from '@feedbase/ui/styles/fonts';
import { getWorkspaceModuleConfig } from '@/lib/api/module';
import { getPublicWorkspaceChangelogs } from '@/lib/api/public';
import { getWorkspaceBySlug } from '@/lib/api/workspace';
import SubscribeToEmailUpdates from '@/components/modals/subscribe-email-modal';
import AnalyticsWrapper from '@/components/shared/analytics-wrapper';

type Props = {
  params: { workspace: string };
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get workspace
  const { data: workspace, error } = await getWorkspaceBySlug(params.workspace, 'server', true, false);

  // If workspace is undefined redirects to 404
  if (error?.status === 404 || !workspace) {
    notFound();
  }

  return {
    title: `Changelog - ${workspace.name}`,
    description: `All the latest updates, improvements, and fixes to ${workspace.name}.`,
  };
}

export default async function Changelogs({ params }: Props) {
  // Get changelogs
  const { data: changelogs, error } = await getPublicWorkspaceChangelogs(
    params.workspace,
    'server',
    true,
    false
  );

  // If error.status redirects to 404
  if (error?.status === 404 || !changelogs) {
    notFound();
  }

  // Sort changelogs by publish_date (newest first)
  changelogs.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Get workspace config
  const { data: workspaceConfig, error: workspaceConfigError } = await getWorkspaceModuleConfig(
    params.workspace,
    'server',
    true,
    false
  );

  // If error.status redirects to 404
  if (workspaceConfigError?.status === 404 || !workspaceConfig) {
    notFound();
  }

  // Get workspace
  const { data: workspace, error: workspaceError } = await getWorkspaceBySlug(
    params.workspace,
    'server',
    true,
    false
  );

  // If workspace is undefined redirects to 404
  if (workspaceError?.status === 404 || !workspace) {
    notFound();
  }

  return (
    <AnalyticsWrapper className='flex h-full w-full flex-col gap-9' workspaceSlug={params.workspace}>
      <div className='flex w-full flex-col gap-3 px-5 sm:px-8 lg:px-14'>
        {/* Title, Description */}
        <div className='flex w-full flex-col items-start gap-2'>
          <h1 className='font- text-xl sm:text-2xl'>Changelog</h1>
          <p className='text-secondary-foreground text-base font-normal'>
            All the latest updates, improvements, and fixes to {workspace.name}.{' '}
          </p>
        </div>

        {/* Buttons */}
        <div className='flex select-none flex-row flex-wrap items-center gap-4 text-sm'>
          {/* Email */}
          <SubscribeToEmailUpdates workspaceSlug={params.workspace}>
            <button
              type='button'
              className='hover:text-foreground/95 text-highlight transition-colors duration-200'>
              Subscribe to Updates
            </button>
          </SubscribeToEmailUpdates>

          <span className='text-foreground/70'>·</span>

          {/* Twitter */}
          {workspaceConfig?.changelog_twitter_handle ? (
            <div className='flex w-1/2 flex-row items-center gap-4 sm:w-fit'>
              <Link
                href={`https://x.com/${workspaceConfig.changelog_twitter_handle}`}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-foreground/95 text-highlight transition-colors duration-200'>
                Follow us on Twitter
              </Link>

              <span className='text-foreground/70 opacity-0 sm:opacity-100'>·</span>
            </div>
          ) : null}

          {/* RRS Update Feed */}
          <Link
            href={`/api/v1/${params.workspace}/atom`}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-foreground/95 text-highlight transition-colors duration-200'>
            Subscribe to Atom Feed
          </Link>
        </div>
      </div>

      {/* Seperator pushing down date */}
      <Separator className='bg-border/60' />

      {/* Changelogs */}
      <div className='flex flex-col'>
        {changelogs.map((changelog, i: number) => {
          return (
            <>
              {/* // Row Splitting up date and Content  */}
              <div
                className='relative flex w-full flex-col px-5 sm:px-10 md:flex-row md:px-10 lg:px-20'
                key={changelog.id}>
                {/* Date */}
                <div className='relative flex'>
                  <div className='flex w-full pb-4 md:w-[200px] md:pb-0'>
                    <p className='text-foreground/60 w-full text-sm font-light'>
                      <time className='sticky top-10' dateTime={changelog.created_at}>
                        {new Date(changelog.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </p>
                  </div>

                  <div className='relative hidden w-full md:flex md:w-[150px]'>
                    <div className='bg-foreground/70 sticky left-0 top-[46px] mt-1.5 h-1.5 w-1.5 rounded-full' />
                    <div className='bg-foreground/20 absolute left-0.5 top-1 h-full w-[1.5px]' />
                  </div>
                </div>

                {/* Content */}
                <div className='flex w-full flex-col pb-16'>
                  {/* Image */}
                  <Link href={`/changelog/${changelog.slug}`}>
                    <Image
                      src={changelog.thumbnail || ''}
                      alt='Thumbnail'
                      width={1200}
                      height={600}
                      className='rounded-lg border object-cover object-center'
                    />
                  </Link>

                  {/* Title */}
                  <div className='pb-4 pt-8'>
                    <Link href={`/changelog/${changelog.slug}`}>
                      <h1 className='text-3xl font-medium decoration-[1px] transition-all duration-1000 hover:underline'>
                        {changelog.title}
                      </h1>
                    </Link>
                  </div>

                  {/* Summary */}
                  {workspaceConfig.changelog_preview_style === 'summary' && (
                    <p className='text-foreground/70 cursor-default pb-4 text-base font-light'>
                      {changelog.summary}
                    </p>
                  )}

                  {workspaceConfig.changelog_preview_style === 'content' && (
                    <div
                      className={`${fontMono.variable} prose prose-invert prose-p:font-light prose-zinc text-foreground/70 prose-headings:font-medium prose-headings:text-foreground/80 prose-strong:text-foreground/80 prose-strong:font-normal prose-code:text-foreground/70 prose-code: prose-code:bg-foreground/10 prose-code:rounded-md prose-code:px-1 prose-code:py-0.5 prose-code:font-monospace prose-blockquote:text-foreground/80 prose-blockquote:font-normal `}
                      dangerouslySetInnerHTML={{ __html: changelog.content! }}
                    />
                  )}
                </div>
              </div>

              {/* Separator */}
              {i !== changelogs.length - 1 && <Separator className='bg-border/60 mb-16 block md:hidden' />}
            </>
          );
        })}

        {/* Empty State */}
        {changelogs.length === 0 && (
          <div className='flex h-full w-full flex-col items-center justify-center gap-3 pt-10'>
            <h1 className='text-foreground/90 text-2xl '>No changelogs yet</h1>
            <p className='text-foreground/60 text-center text-base '>
              The latest updates, improvements, and fixes will be posted here. Stay tuned!
            </p>
          </div>
        )}
      </div>
    </AnalyticsWrapper>
  );
}
