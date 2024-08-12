import * as React from 'react';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
} from '@react-email/components';
import { formatRootUrl } from '@/lib/utils';

interface ChangelogEmailProps {
  subId: string;
  workspaceSlug: string;
  changelog: {
    title: string;
    content: string;
    publish_date: string;
    summary: string;
    thumbnail: string;
    slug: string;
    author: {
      full_name: string;
      avatar_url: string;
    };
  };
}

export default function ChangelogEmail({ subId, workspaceSlug, changelog }: ChangelogEmailProps) {
  return (
    <Html>
      <Preview>{changelog.summary}</Preview>
      <Tailwind>
        <Head />
        <Body className='mx-auto my-auto bg-white p-3 font-sans'>
          <Container>
            {/* Title */}
            <Heading className='cursor-default text-3xl font-medium text-black'>{changelog.title}</Heading>

            {/* Image */}
            <Img
              src={changelog.thumbnail || ''}
              alt='Thumbnail'
              className='aspect-auto w-full rounded-lg object-cover object-center'
            />

            {/* Author & Share */}
            <Section className='pb-6 pt-4'>
              <Row>
                <Column className='min-w-10'>
                  <Img
                    src={changelog.author.avatar_url || ''}
                    alt={changelog.author.full_name}
                    className='h-10 w-10 rounded-full'
                  />
                </Column>
                <Column className='w-full pl-3'>
                  <Row>
                    <span className='text-sm font-medium text-black/90'>{changelog.author.full_name}</span>

                    <Column className='text-sm text-black/70'>
                      <time className='sticky top-10' dateTime={changelog.publish_date}>
                        {new Date(changelog.publish_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </Column>
                  </Row>
                </Column>
                <Column>
                  <Link
                    className='text-black/[85%]'
                    href={`https://twitter.com/intent/tweet?text=Make sure to check out ${
                      changelog.title
                    } by ${changelog.author.full_name}!&url=${formatRootUrl(
                      workspaceSlug,
                      `/changelog/${changelog.slug}`
                    )}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Img src='https://svgl.app/library/twitter.svg' className='h-6 w-6' />
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Content as html */}
            <div
              className='prose prose-zinc prose-headings:font-medium prose-headings:text-black/80 prose-strong:text-black/80 prose-strong:font-normal prose-code:text-black/70 prose-code:font-normal prose-blockquote:text-black/80 prose-blockquote:font-normal w-0 min-w-full font-normal text-black/70'
              dangerouslySetInnerHTML={{ __html: changelog.content }}
            />

            {/* Separetor */}
            <Hr className='mt-8 border-black/20' />

            <div className='flex w-full flex-row items-center justify-center gap-5 py-4'>
              <Link
                href={formatRootUrl(workspaceSlug, `/changelog/unsubscribe?subId=${subId}`)}
                className='flex items-center gap-2 text-sm text-black/70 underline'>
                Unsubscribe
              </Link>
              <span className='text-sm font-normal text-black/70'>•</span>
              <Link
                href={formatRootUrl(workspaceSlug, `/changelog/${changelog.slug}`)}
                className='flex items-center gap-2 text-sm text-black/70 underline'>
                View in browser
              </Link>
            </div>

            <div className='flex w-full flex-row items-center justify-center'>
              <Link
                href='https://feedbase.app'
                className='flex items-center gap-2 text-sm font-normal text-black/70'>
                <Img
                  src='https://feedbase.app/icon-512x512.png'
                  alt='Feedbase'
                  className='h-8 w-8 rounded-md'
                />
                Powered by Feedbase
              </Link>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
