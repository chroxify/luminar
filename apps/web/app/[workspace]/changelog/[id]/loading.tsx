import { Separator } from '@feedbase/ui/components/separator';
import { Skeleton } from '@feedbase/ui/components/skeleton';

export default function ChangelogPageLoading() {
  return (
    <div
      className='relative flex w-full flex-col px-5 sm:px-10 md:flex-row md:px-10 lg:px-20'
      key={0 /* Provide a unique key for each skeleton */}>
      {/* Back Button */}
      <div className='relative flex'>
        <div className='flex w-full pb-4 pr-5 md:w-[200px] md:pb-0'>
          <Skeleton className='h-5 w-full' />
        </div>
      </div>

      {/* Content */}
      <div className='flex w-full flex-col'>
        {/* Title */}
        <h1 className='cursor-default pb-6 text-3xl font-medium'>
          <Skeleton className='h-8 w-1/2' />
        </h1>

        {/* Image */}
        <Skeleton className='h-[600px] w-full rounded-lg' />

        {/* Author & Share */}
        <div className='flex w-full flex-row items-center justify-between pb-6 pt-4'>
          <div className='flex flex-row items-center gap-3'>
            {/* Author Avatar */}
            <Skeleton className='h-10 w-10 rounded-full' />

            {/* Name & Date */}
            <div className='flex w-44 flex-col gap-1'>
              <p className='text-foreground/90 text-sm font-medium'>
                <Skeleton className='h-4 w-full' />
              </p>
              <p className='text-foreground/70 w-1/2 text-sm '>
                <Skeleton className='h-4 w-full' />
              </p>
            </div>
          </div>

          {/* Share */}
          <div className='text-foreground/70 flex select-none flex-row items-center gap-2 text-sm'>
            <Skeleton className='h-8 w-8' />
          </div>
        </div>

        {/* Content as html */}
        <div className='flex w-full flex-col gap-3'>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Skeleton className='h-5 w-full' key={index} />
          ))}
        </div>

        {/* Separator */}
        <Separator className='bg-border/60 mt-8' />

        {/* Next & Previous */}
        <div className='flex w-full flex-row items-center justify-between py-8'>
          {/* Previous */}
          <div>
            <Skeleton className='h-5 w-36' />
          </div>

          {/* Next */}
          <div>
            <Skeleton className='h-5 w-36' />
          </div>
        </div>
      </div>
    </div>
  );
}
