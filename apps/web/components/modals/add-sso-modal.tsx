'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Icons } from '@/components/shared/icons/icons-static';

export default function AddSSOAuthModal({
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
  const [loginUrl, setLoginUrl] = useState<string>('');
  const [jwtSecret, setJwtSecret] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate random jwt secret
  const generateJwtSecret = () => {
    // 46 characters long random string
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomString = Array(32)
      .fill(null)
      .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
      .join('');

    setJwtSecret(randomString);
  };

  useEffect(() => {
    generateJwtSecret();
  }, []);

  // Enable SSO
  async function enableSSO() {
    setIsLoading(true);

    // Send request
    const res = await fetch(`/api/v1/workspaces/${workspaceSlug}/config/integrations/sso`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: true,
        url: loginUrl,
        secret: jwtSecret,
      }),
    });

    // Check for errors
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error);
      setIsLoading(false);
      return;
    }

    // Update enabled integrations
    setEnabledIntegrations([...enabledIntegrations, 'sso']);

    // Close modal
    setOpen(false);
    setIsLoading(false);
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
          <ResponsiveDialogTitle>Enable Single Sign-On</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Allow your users to sign in with their existing accounts.
            <br />
            Visit the{' '}
            <Link
              className='text-foreground/80 hover:text-foreground  hover:underline'
              href='https://docs.feedbase.app/integrations/sso'>
              documentation
            </Link>{' '}
            for more information.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Login Url */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='login'>Custom Login Url</Label>
            </div>

            <Input
              id='login'
              placeholder='https://yourdomain.com/sso/feedbase'
              value={loginUrl}
              onChange={(event) => {
                setLoginUrl(event.target.value);
              }}
              className='col-span-3'
            />

            <Label className='text-foreground/50 text-xs '>
              The url to redirect users to when they click the login button.
            </Label>
          </div>

          {/* Role */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='jwt'>JWT Secret</Label>
            </div>

            <div className='flex flex-row items-center gap-2'>
              <div className='bg-background flex h-9 w-full flex-row items-center justify-between rounded-md border px-3'>
                <span className='text-foreground/50 flex items-center justify-center text-sm '>
                  {jwtSecret}
                </span>

                <div className='flex flex-row items-center gap-2'>
                  <button
                    className='text-foreground/50 inline-flex h-9 w-5 cursor-pointer items-center justify-center'
                    onClick={() => {
                      navigator.clipboard.writeText(jwtSecret);
                      setCopied(true);

                      setTimeout(() => {
                        setCopied(false);
                      }, 2000);
                    }}
                    type='button'>
                    {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
                  </button>
                  <button
                    className='text-foreground/50 inline-flex h-9 w-5 cursor-pointer items-center justify-center'
                    onClick={generateJwtSecret}
                    type='button'>
                    <RefreshCcw className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>

            <Label className='text-foreground/50 text-xs '>
              The secret used to sign the JWT token on your server.
            </Label>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose>
            <Button
              variant='outline'
              onClick={() => {
                setLoginUrl('');
              }}>
              Cancel
            </Button>
          </ResponsiveDialogClose>
          <Button
            type='submit'
            onClick={enableSSO}
            disabled={
              loginUrl === '' ||
              jwtSecret === '' ||
              (!loginUrl.startsWith('http://') && !loginUrl.startsWith('https://')) ||
              isLoading
            }>
            {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
            Enable
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
