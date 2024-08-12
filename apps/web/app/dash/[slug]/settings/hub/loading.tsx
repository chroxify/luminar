import { Skeleton } from '@feedbase/ui/components/skeleton';

export default function HubLoading() {
  return (
    // 3 cards with loading state
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      <Skeleton className='h-[650px] w-full' />
      <Skeleton className='h-72 w-full' />
    </div>
  );
}
