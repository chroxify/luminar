import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@feedbase/ui/components/tooltip';
import { cn } from '@feedbase/ui/lib/utils';

export default function DefaultTooltip({
  children,
  content,
  disabled,
  className,
  side = undefined,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left' | undefined;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip open={disabled ? false : undefined}>
        <TooltipTrigger className={cn('select-none', className)}>{children}</TooltipTrigger>
        <TooltipContent className='z-50 flex h-7 items-center justify-center px-2' side={side}>
          <span className='text-foreground/50 text-xs font-normal'>{content}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
