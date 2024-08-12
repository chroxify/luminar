import Link from 'next/link';
import { Background } from '@feedbase/ui/components/background/background';
import { Button } from '@feedbase/ui/components/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { formatRootUrl } from '@/lib/utils';
import ChangelogSection from '@/components/home/changelog-section';
import DashboardSection from '@/components/home/dashboard-section';
import FeedbackSection from '@/components/home/feedback-section';
import HomeFooter from '@/components/home/footer';

export default function Landing() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center px-5 lg:px-10'>
      <Background />

      {/* Title */}
      <div className='flex h-screen w-full flex-col items-center justify-center xl:gap-2'>
        <h1 className='text-foreground flex w-fit max-w-full shrink-0 flex-col items-center justify-center gap-2 text-center text-3xl font-bold sm:text-5xl md:text-5xl lg:text-6xl'>
          {/* Collect Feedback and Share Product Updates in One Central Place */}
          <span>
            Collect Feedback <span className='hidden sm:inline-block'>and</span>
          </span>

          <span className='block sm:hidden'>and Share Updates</span>
          <span className='hidden sm:block'>Share Product Updates</span>

          <span>in One Central Place</span>
        </h1>

        <p className='text-foreground/60 mt-5 max-w-xs text-center text-sm  sm:block sm:max-w-lg sm:text-lg md:max-w-xl'>
          Feedbase simplifies feedback collection, feature prioritization, and product update sharing,
          allowing you to focus on building.
        </p>

        <div className='mt-5 flex w-full flex-row items-center justify-center gap-5'>
          <Link href={formatRootUrl('dash', '/signup')}>
            <Button className='border-background inline-flex rounded-full border'>Get Started</Button>
          </Link>

          <Link href='/github'>
            <button
              className='hover:animate-background-shine text-foreground inline-flex h-9 items-center justify-center rounded-full border bg-[linear-gradient(110deg,#06060A,90%,#1e2631,95%,#06060A)] bg-[length:225%_100%] px-4 py-1 text-sm  transition-colors'
              type='button'>
              Star on GitHub
            </button>
          </Link>
        </div>

        <Link
          href={formatRootUrl('hub')}
          className='text-foreground/60 hover:text-foreground/90 group relative mt-4 flex w-fit flex-row items-center justify-center p-1 text-center text-sm '>
          <p className='mr-1 '>See it in action</p>
          <ArrowRight className='relative mb-[1px] inline h-4 w-0 transition-all group-hover:w-4' />
          <ChevronRight className='relative mb-[1px] inline h-4 w-4 transition-all group-hover:w-0' />
        </Link>
      </div>

      {/* Feedback Features */}
      <FeedbackSection />

      {/* Changelog */}
      <ChangelogSection />

      {/* Dashboard */}
      <DashboardSection />

      {/* Sign up 2 */}
      <div className='my-10 flex h-[60vh] w-full flex-col items-center justify-center'>
        <div className='absolute -z-10 h-2/3 w-full'>
          <div className='absolute h-full w-full bg-[radial-gradient(#2e2e2f_0.5px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_40%_40%_at_50%_50%,#000_70%,transparent_100%)]' />
        </div>
        <h1 className='text-foreground gap-2 text-center text-3xl font-medium leading-tight sm:text-5xl'>
          Create your feedback
          <br /> community today.
        </h1>
        <p className='text-foreground/60 mt-5 w-full text-center text-sm  sm:text-lg'>
          Capture feedback, post updates, and engage
          <br /> with your users in one central place.
        </p>

        <div className='mt-10 flex w-full flex-row items-center justify-center gap-5'>
          <Link href={formatRootUrl('dash', '/signup')}>
            <Button className='border-background inline-flex border'>Get Started</Button>
          </Link>

          <Link
            href={formatRootUrl('hub')}
            className='group relative grid h-9 items-center overflow-hidden rounded-md px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200'>
            <span className='backdrop bg-root group-hover:bg-accent absolute inset-[1px] rounded-md transition-colors duration-200' />
            <span className='z-10 py-0.5 text-sm text-neutral-100'>View Demo</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
