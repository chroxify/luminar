'use client';

import React, { useState } from 'react';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import { Textarea } from '@feedbase/ui/components/textarea';
import { toast } from 'sonner';
import { Icons } from '@/components/shared/icons/icons-static';

export default function FeedbackModal({
  children,
  workspaceSlug,
}: {
  children: React.ReactNode;
  workspaceSlug: string;
}) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    // Set loading
    setIsLoading(true);

    // Create promise
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${workspaceSlug}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: description,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message);
        });
    });

    promise
      .then(() => {
        // Close modal
        setOpen(false);

        // Set loading
        setIsLoading(false);

        toast.success('Thanks for your feedback!');
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='testa bg-root w-full gap-6 overflow-hidden border-none ring ring-white/10 ring-opacity-60 sm:max-w-[400px] sm:rounded-lg'>
        <ResponsiveDialogHeader className='space-y-2 sm:text-left'>
          <ResponsiveDialogTitle>Send Feedback</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Share your feedback, suggestions, or feature ideas.
            <br />
            We read every piece of feedback submitted!
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className='flex flex-col items-center gap-3'>
          <Input
            className='bg-root h-10 rounded-lg py-2 '
            placeholder='Feedback Title'
            value={title}
            onChange={(event) => {
              setTitle(event.currentTarget.value);
            }}
          />
          <Textarea
            className='bg-root min-h-[120px] rounded-lg p-4 '
            placeholder="I'd love to see..."
            value={description}
            onChange={(event) => {
              setDescription(event.currentTarget.value);
            }}
          />
        </div>

        <ResponsiveDialogFooter className='flex justify-end'>
          <Button
            variant='default'
            disabled={isLoading || !title || !description}
            className='h-10 w-full transform-gpu rounded-lg transition-transform duration-200 active:scale-95'
            onClick={handleClick}>
            {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : 'Send Feedback'}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
