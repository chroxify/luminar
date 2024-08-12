'use client';

import { useCallback, useState } from 'react';
import { cn } from '@feedbase/ui/lib/utils';
import { CheckIcon, CopyIcon } from 'lucide-react';

export default function CopyCheckIcon({
  content,
  debounce = 2000,
  className,
  onCopy,
}: {
  content: string;
  debounce?: number;
  className?: string;
  onCopy?: () => void;
}) {
  const [hasCopied, setHasCopied] = useState<boolean>();

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content);
    setHasCopied(true);
    if (onCopy) {
      onCopy();
    }
    setTimeout(() => {
      setHasCopied(false);
    }, debounce);
  }, [content, debounce, onCopy]);

  return (
    <>
      {hasCopied ? (
        <CheckIcon className={cn('h-4 w-4 text-green-500', className)} />
      ) : (
        <CopyIcon className={cn('text-muted-foreground h-4 w-4', className)} onClick={copyToClipboard} />
      )}
    </>
  );
}
