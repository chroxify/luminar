import { Input } from '@feedbase/ui/components/input';
import { cn } from '@feedbase/ui/lib/utils';

type InputGroupProps = {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  groupClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputGroup({
  prefix,
  suffix,
  placeholder,
  value,
  onChange,
  groupClassName,
  ...props
}: InputGroupProps) {
  return (
    <div className='bg-background focus-within:ring-ring ring-offset-root flex h-8 w-full rounded-md border  text-sm transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
      {prefix ? (
        <div
          className={cn(
            'text-muted-foreground bg-muted dark:bg-accent flex select-none items-center justify-center rounded-l-md border-r p-2 px-2.5',
            groupClassName
          )}>
          {prefix}
        </div>
      ) : null}
      <Input
        className='font-base h-full w-full border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {suffix ? (
        <div
          className={cn(
            'text-foreground/50 bg-muted dark:bg-accent flex select-none items-center justify-center rounded-r-md border-l px-2.5 py-2',
            groupClassName
          )}>
          {suffix}
        </div>
      ) : null}
    </div>
  );
}
