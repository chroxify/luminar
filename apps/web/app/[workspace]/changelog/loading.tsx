import { Separator } from '@feedbase/ui/components/separator';
import { Skeleton } from '@feedbase/ui/components/skeleton';

export default function ChangelogLoading() {
  return (
    <div className='flex h-full w-full flex-col gap-10'>
      <div className='flex w-full items-center px-5 sm:px-10 md:px-10 lg:px-20'>
        <div className='flex w-full flex-col items-start gap-4'>
          <h1 className='w-full max-w-[200px] text-3xl font-medium sm:text-4xl'>
            <Skeleton className='h-8 w-full' />
          </h1>
          <p className='text-foreground/70 w-full max-w-[400px] text-base font-light sm:text-lg'>
            <Skeleton className='h-5 w-full' />
          </p>
          <div className='flex w-full max-w-[425px] select-none flex-row items-center gap-4 text-sm'>
            <Skeleton className='h-5 w-1/2' />
            <Skeleton className='h-5 w-1/2' />
          </div>
        </div>
      </div>
      <Separator className='bg-border/60' />

      <div className='flex flex-col'>
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className='relative flex w-full flex-col px-5 sm:px-10 md:flex-row md:px-10 lg:px-20'>
            <div className='relative flex'>
              <div className='flex w-full pb-4 pr-5 md:w-[200px] md:pb-0'>
                <Skeleton className='h-5 w-full' />
              </div>
              <div className='relative hidden w-full md:flex md:w-[150px]'>
                <div className='bg-foreground/70 sticky left-0 top-[46px] mt-1.5 h-1.5 w-1.5 rounded-full' />
                <div className='bg-foreground/20 absolute left-0.5 top-1 h-full w-[1.5px]' />
              </div>
            </div>
            <div className='flex w-full flex-col pb-16'>
              <Skeleton className='h-36 w-full' />

              <div className='pb-4 pt-8'>
                <Skeleton className='h-8 w-[300px]' />
              </div>
              <Skeleton className='h-5 w-full' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
