import { Button } from '@feedbase/ui/components/button';
import { AlertCircle } from 'lucide-react';
import { KeyedMutator } from 'swr';
import { Icons } from './icons/icons-static';

export default function FetchError({
  name,
  error,
  mutate,
  isValidating,
}: {
  name: string;
  error: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  mutate: KeyedMutator<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  isValidating?: boolean;
}) {
  return (
    <div className='flex flex-col items-center gap-3 p-10'>
      <AlertCircle className='text-secondary-foreground h-7 w-7 stroke-[1.5px]' />
      <div className='space-y-1.5 text-center'>
        <div className='text-secondary-foreground text-center'>Failed to load {name}. Please try again.</div>
        {/* Show error message - only hsow if error.message is of type json */}
        {(() => {
          try {
            return <p className='text-muted-foreground text-center'>{JSON.parse(error.message)?.error}</p>;
          } catch (parseError) {
            return null;
          }
        })()}
      </div>
      <Button
        size='sm'
        variant='secondary'
        disabled={isValidating}
        onClick={() => {
          mutate();
        }}>
        {isValidating ? (
          <Icons.Spinner className='text-muted-foreground mr-2 h-3.5 w-3.5 animate-spin' />
        ) : null}
        Try again
      </Button>
    </div>
  );
}
