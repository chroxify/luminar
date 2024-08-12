'use client';

import { useEffect, useState } from 'react';
import { Button } from '@feedbase/ui/components/button';
import { Switch } from '@feedbase/ui/components/switch';
import { cn } from '@feedbase/ui/lib/utils';
import { Icons } from '../shared/icons/icons-static';

export default function SettingsCard({
  title,
  description,
  children,
  className,
  showSave,
  onSave,
  onCancel,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  showSave?: boolean;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(showSave);

  useEffect(() => {
    setShowSaveButton(showSave);
  }, [showSave]);

  return (
    <div className='flex h-fit w-full flex-col justify-between gap-6 p-7'>
      <div className='flex w-full items-center justify-between border-b pb-5'>
        <div className='flex w-full flex-col items-start gap-2'>
          <h2 className='text-lg font-normal leading-none tracking-tight'>{title}</h2>
          <p className='text-foreground/50 text-sm '>{description}</p>
        </div>

        {onCheckedChange || checked !== undefined ? (
          <Switch
            className='mr-5'
            checked={checked}
            onCheckedChange={(c) => {
              if (!onCheckedChange) return;
              onCheckedChange(c);
            }}
          />
        ) : null}
      </div>
      <div className={cn('grid w-full grid-cols-2 flex-col items-end justify-center gap-5', className)}>
        {children}

        {showSaveButton ? (
          <div className='col-span-2 flex w-full gap-2'>
            <Button
              variant='default'
              onClick={async () => {
                if (!onSave) return;
                setLoading(true);
                await onSave();
                setLoading(false);
                setShowSaveButton(false);
              }}>
              {loading ? <Icons.Spinner className='mr-2 h-3.5 w-3.5 animate-spin' /> : null}
              Save
            </Button>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
