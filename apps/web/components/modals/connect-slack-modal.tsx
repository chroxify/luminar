'use client';

import { useState } from 'react';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import { toast } from 'sonner';
// import { sendSlackConfirmation } from '@/lib/api/integration';
import { Icons } from '@/components/shared/icons/icons-static';

export default function SlackIntegrationModal({
  workspaceSlug,
  enabledIntegrations,
  setEnabledIntegrations,
}: {
  workspaceSlug: string;
  enabledIntegrations: string[];
  setEnabledIntegrations: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [webhook, setWebhook] = useState<string>('');

  async function onConnectSlack() {
    setIsLoading(true);

    // Validate webhook
    const webhookValid = await fetch(webhook, {
      method: 'GET',
    }).then((res) => res.status === 400);

    if (!webhookValid) {
      setIsLoading(false);
      toast.error('Invalid webhook url.');
      return;
    }

    // Close modal
    setOpen(false);

    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${workspaceSlug}/config/integrations/slack`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: true,
          webhook,
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

    toast.promise(promise, {
      loading: 'Connecting Slack...',
      success: () => {
        setIsLoading(false);
        setEnabledIntegrations([...enabledIntegrations, 'slack']);
        // sendSlackConfirmation(workspaceSlug, webhook);
        return 'Slack integration connected successfully.';
      },
      error: (err) => {
        return err;
      },
    });
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant='outline' disabled={isLoading} className='text-foreground/70 font-normal'>
          {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
          Connect
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:max-w-[450px]'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Connect Slack Integration</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Receive notifications directly in your Slack workspace.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Webhook */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='webhook'>Webhook Url</Label>
            </div>

            <Input
              id='webhook'
              placeholder='https://hooks.slack.com/services/...'
              value={webhook}
              onChange={(event) => {
                setWebhook(event.target.value);
              }}
              className='col-span-3'
            />

            <Label className='text-foreground/50 text-xs '>
              The Slack webhook url to send notifications to.
            </Label>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose>
            <Button
              variant='outline'
              onClick={() => {
                setWebhook('');
              }}>
              Cancel
            </Button>
          </ResponsiveDialogClose>
          <Button
            type='submit'
            onClick={(event) => {
              event.preventDefault();
              onConnectSlack();
            }}
            disabled={
              webhook === '' || !webhook.startsWith('https://hooks.slack.com/services/') || isLoading
            }>
            {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
            Connect
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
