import { Skeleton } from '@feedbase/ui/components/skeleton';

export default function IntegrationsLoading() {
  return (
    <div className='flex h-full w-full flex-col space-y-6 overflow-y-auto'>
      <Skeleton className='h-72 w-full' />
    </div>
  );
}
