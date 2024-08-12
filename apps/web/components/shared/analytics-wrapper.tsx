'use client';

import { useEffect } from 'react';
import { cn } from '@feedbase/ui/lib/utils';

export default function AnalyticsWrapper({
  children,
  workspaceSlug,
  feedbackId,
  changelogId,
  className,
}: {
  children: React.ReactNode;
  workspaceSlug: string;
  feedbackId?: string;
  changelogId?: string;
  className?: string;
}) {
  // Register View
  useEffect(() => {
    fetch(`/api/v1/${workspaceSlug}/views`, {
      method: 'POST',
      body: JSON.stringify({
        feedbackId,
        changelogId,
      }),
    });
  }, [workspaceSlug, feedbackId, changelogId]);

  return <div className={cn('flex h-full w-full flex-col', className)}>{children}</div>;
}
