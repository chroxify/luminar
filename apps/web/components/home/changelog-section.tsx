'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Label } from '@feedbase/ui/components/label';
import { cn } from '@feedbase/ui/lib/utils';
import { MailIcon, RssIcon } from 'lucide-react';
import { PROSE_CN } from '@/lib/constants';
import { formatRootUrl } from '@/lib/utils';
import BentoCardWrapper from '@/components/home/spotlight-card';
import { Icons } from '../shared/icons/icons-static';
import RichTextEditor from '../shared/tiptap-editor';

export default function ChangelogSection() {
  const [changelogContent, setChangelogContent] = useState(
    '<h4>Release 1.82</h4><p>We&apos;ve fixed <em>a bunch</em> of annoying bugs with this release and also added a few new animations to improve UX. </p><p>Who can spot them? 👀</p></div>'
  );

  return (
    <div className='flex h-full w-full flex-col items-center justify-start gap-2 pb-60'>
      <span className='select-none bg-gradient-to-t from-[#c7d2fe] to-[#8678f9] bg-clip-text text-lg text-transparent sm:text-xl'>
        Share what&apos;s new
      </span>

      <h1 className='text-foreground gap-2 text-center text-3xl font-medium leading-tight sm:text-4xl'>
        Keep your users in the loop
      </h1>

      <p className='text-foreground/60 mt-2 w-[800px] max-w-full text-center text-sm  sm:text-base'>
        Feedbase adds a touch of enjoyment to help you keep your users informed through an appealing changelog
        that&apos;s simple to create and distribute.
      </p>

      {/* CTA */}
      <Link
        href={formatRootUrl('dash', '/signup')}
        className='group relative mt-3 grid h-[36px] overflow-hidden rounded-md px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200'>
        <span>
          <span className="spark mask-gradient animate-flip before:animate-rotate absolute inset-0 h-[100%] w-[100%] overflow-hidden rounded-md [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
        </span>
        <span className='backdrop bg-root group-hover:bg-accent absolute inset-[1px] rounded-md transition-colors duration-200' />
        <span className='z-10 py-0.5 text-sm text-neutral-100'>Get Started for Free</span>
      </Link>

      {/* Bento  */}
      <div className='mt-10 flex w-full flex-col items-center justify-center gap-5 xl:flex-row'>
        {/* OG Images */}
        <div className='flex w-full flex-col items-center justify-center gap-5 md:flex-row xl:w-fit'>
          <BentoCardWrapper className='h-[465px] w-full min-w-[350px]'>
            <div className='p-7'>
              <h1 className='text-foreground text-lg font-medium'>OG Image support</h1>
              <p className='text-foreground/60 mt-2 text-sm '>
                Set OG image for your changelog posts to make them look great when shared on social media.
              </p>

              <div className='mt-5 flex flex-col items-start justify-start rounded-md border'>
                <Image
                  src='/og-image.png'
                  width={500}
                  height={100}
                  alt='OG Image'
                  className='rounded-t-md border-b'
                />

                <div className='bg-background flex flex-col gap-1.5 rounded-b-md p-3'>
                  {/* url */}
                  <span className='text-foreground/60 text-sm '>hub.feedbase.app</span>

                  {/* Title */}
                  <span className='text-foreground text-sm font-medium'>OG Image support</span>

                  {/* Description */}
                  <span className='text-foreground/60 text-sm '>
                    Easily set an OG image for your changelog posts to make them look great when shared on
                    social media.
                  </span>
                </div>
              </div>
            </div>
          </BentoCardWrapper>

          {/* Markdown */}
          <BentoCardWrapper className='h-full min-h-[465px] w-full min-w-[350px]'>
            <div className='h-full p-7'>
              <h1 className='text-foreground text-lg font-medium'>Markdown support</h1>
              <p className='text-foreground/60 mt-2 text-sm '>
                Write changelog posts in markdown and Feedbase will automatically convert it to HTML.
              </p>

              {/* Markdown */}
              <div className='mt-5 flex h-[313px] flex-col gap-1.5'>
                <Label className='text-foreground/60 text-sm '>Editor</Label>
                <div className='flex h-1/2 flex-col gap-1.5 overflow-auto rounded-md border p-3'>
                  <RichTextEditor content={changelogContent} setContent={setChangelogContent} />
                </div>

                {/* Preview */}
                <Label className='text-foreground/60 text-sm '>Preview</Label>
                <div
                  className={cn(
                    'flex h-1/2 flex-col justify-start overflow-x-auto rounded-md border px-3 text-sm',
                    PROSE_CN
                  )}>
                  <div dangerouslySetInnerHTML={{ __html: changelogContent }} />
                </div>
              </div>
            </div>
          </BentoCardWrapper>
        </div>

        {/* And much more */}
        <BentoCardWrapper className='h-full min-h-[465px] w-full min-w-[350px] xl:w-1/3'>
          <div className='p-7'>
            <h1 className='text-foreground text-lg font-medium'>Receive Updates</h1>
            <p className='text-foreground/60 mt-2 text-sm '>
              Users can subscribe to your changelog to automatically get notified when you post an update.
            </p>

            {/* Platforms */}
            <div className='mt-5 flex h-[280px] flex-col items-start justify-evenly'>
              {/* Twitter */}
              <div className='flex h-14 flex-row items-center gap-5'>
                <div className='border-border/50 flex h-full min-w-[56px] items-center justify-center rounded-lg border bg-[#1DA1F2]/10'>
                  <Icons.Twitter className='h-8 w-8 text-[#1DA1F2]/80' />
                </div>

                {/* Title & Description */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-foreground text-sm font-medium'>Twitter</span>
                  <span className='text-foreground/60 text-sm '>
                    Account that users can follow to get updates.
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className='flex h-14 flex-row items-center gap-5'>
                <div className='border-border/50 flex h-full min-w-[56px] items-center justify-center rounded-lg border bg-[#D44638]/10'>
                  <MailIcon className='h-8 w-8 stroke-[1.5px] text-[#D44638]/80' />
                </div>

                {/* Title & Description */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-foreground text-sm font-medium'>Email</span>
                  <span className='text-foreground/60 text-sm '>Email that users can subscribe to.</span>
                </div>
              </div>

              {/* RSS */}
              <div className='flex h-14 flex-row items-center gap-5'>
                <div className='border-border/50 flex h-full min-w-[56px] items-center justify-center rounded-lg border bg-[#FFA500]/10'>
                  <RssIcon className='h-8 w-8 stroke-[1.5px] text-[#FFA500]/80' />
                </div>

                {/* Title & Description */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-foreground text-sm font-medium'>RSS</span>
                  <span className='text-foreground/60 text-sm '>RSS feed that users can subscribe to.</span>
                </div>
              </div>
            </div>

            <span className='text-foreground/60 text-sm '>And much more...</span>
          </div>
        </BentoCardWrapper>
      </div>
    </div>
  );
}
