'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@feedbase/ui/components/alert-dialog';
import { Button } from '@feedbase/ui/components/button';
import { Checkbox } from '@feedbase/ui/components/checkbox';
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
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import useWorkspace from '@/lib/swr/use-workspace';
import { actionFetcher, formatRootUrl } from '@/lib/utils';
import SettingsCard from '@/components/settings/settings-card';
import CopyCheckIcon from '@/components/shared/copy-check-icon';
import FetchError from '@/components/shared/fetch-error';
import { Icons } from '@/components/shared/icons/icons-static';
import InputGroup from '@/components/shared/input-group';

export default function SSOSettings({ params }: { params: { slug: string } }) {
  const [ssoConfig, setSsoConfig] = useState<{
    enabled: boolean;
    url: string | null | undefined;
    secret: string | null | undefined;
  }>({
    enabled: false,
    url: null,
    secret: '',
  });
  const [hasCopied, setHasCopied] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);
  const { workspace, loading, error, mutate } = useWorkspace();

  const { trigger: updateWorkspaceSSO, isMutating: isUpdatingWorkspaceSSO } = useSWRMutation(
    `/api/v1/workspaces/${params.slug}/sso`,
    actionFetcher,
    {
      onSuccess: () => {
        mutate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const { trigger: generateJwtSecret, isMutating: isGenerating } = useSWRMutation(
    `/api/v1/workspaces/${params.slug}/sso/secret`,
    actionFetcher,
    {
      onSuccess: (data: { secret: string }) => {
        setSsoConfig({ ...ssoConfig, secret: data.secret });
        setOpen(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  useEffect(() => {
    if (workspace) {
      setSsoConfig({
        enabled: workspace.sso_auth_enabled,
        url: workspace.sso_auth_url,
        secret: workspace.sso_auth_secret_id ? 'dummy-secret' : undefined,
      });
    }
  }, [workspace]);

  // Loading state
  if (loading && !error) {
    return (
      <SettingsCard
        title='Single Sign-On'
        checked={false}
        description={
          <>
            Configure single sign-on for your workspace.{' '}
            <Link href={formatRootUrl('docs')} className='hover:text-foreground underline transition-colors'>
              Learn more
            </Link>
            .
          </>
        }>
        <Skeleton className='col-span-2 h-80 w-full' />
      </SettingsCard>
    );
  }

  // Error state
  if (error) {
    return (
      <SettingsCard
        title='Single Sign-On'
        description={
          <>
            Configure single sign-on for your workspace.{' '}
            <Link href={formatRootUrl('docs')} className='hover:text-foreground underline transition-colors'>
              Learn more
            </Link>
            .
          </>
        }>
        <div className='col-span-2 h-full w-full'>
          <FetchError error={error} mutate={mutate} name='workspace' isValidating={isUpdatingWorkspaceSSO} />
        </div>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard
      title='Single Sign-On'
      checked={ssoConfig.enabled}
      onCheckedChange={async (checked) => {
        setSsoConfig({ ...ssoConfig, enabled: checked });
        toast.promise(updateWorkspaceSSO({ method: 'PATCH', enabled: checked }), {
          loading: ssoConfig.enabled ? `Disabling Single Sign-On` : `Enabling Single Sign-On`,
          success: ssoConfig.enabled ? `Single Sign-On disabled` : `Single Sign-On enabled`,
          error: () => {
            setSsoConfig({ ...ssoConfig, enabled: !checked });
            return `Failed to ${ssoConfig.enabled ? 'disable' : 'enable'} Single Sign-On`;
          },
        });
      }}
      description={
        <>
          Configure single sign-on for your workspace.{' '}
          <Link href={formatRootUrl('docs')} className='hover:text-foreground underline transition-colors'>
            Learn more
          </Link>
          .
        </>
      }
      showSave={workspace?.sso_auth_url !== ssoConfig.url}
      onCancel={() => {
        setSsoConfig({ ...ssoConfig, url: workspace?.sso_auth_url });
      }}
      onSave={async () => {
        await updateWorkspaceSSO({
          method: 'PATCH',
          enabled: ssoConfig.enabled,
          url: ssoConfig.url,
          secret: ssoConfig.secret,
        });
      }}>
      <div className='col-span-1 -mt-1 w-full space-y-1'>
        <Label className='text-foreground/70 text-sm '>Login Url</Label>
        <Input
          className='w-full'
          placeholder='https://example.com/fb/login'
          disabled={isUpdatingWorkspaceSSO}
          value={ssoConfig.url || ''}
          onChange={(e) => {
            setSsoConfig({ ...ssoConfig, url: e.target.value });
          }}
        />
        <Label className='text-muted-foreground text-xs'>
          The url where users will be redirected to login.
        </Label>
      </div>

      <div className='col-span-1 -mt-1 flex h-full w-full flex-col space-y-1'>
        <Label className='text-foreground/70 text-sm '>JWT Secret</Label>

        <ResponsiveDialog open={open} onOpenChange={setOpen}>
          <ResponsiveDialogTrigger asChild>
            <AlertDialog>
              <AlertDialogTrigger asChild disabled={!ssoConfig.secret}>
                <Button
                  variant='outline'
                  className='w-fit'
                  onClick={async (e) => {
                    setHasCopied(false);
                    if (!ssoConfig.secret) {
                      e.preventDefault();
                      await generateJwtSecret({});
                      setOpen(true);
                    }
                  }}
                  disabled={isGenerating || isUpdatingWorkspaceSSO}>
                  {isGenerating ? <Icons.Spinner className='mr-2 h-3.5 w-3.5 animate-spin' /> : null}
                  {ssoConfig.secret ? 'Regenerate' : 'Generate'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will generate a new secret for your Single Sign-On
                    configuration and invalidate the previous one.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await generateJwtSecret({});
                    }}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className='sm:max-w-[425px]'>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Token Created</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                This token can not be shown again. Please copy it and store it in a safe place.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <div className='space-y-1 pb-2'>
              <Label className='text-foreground/70 text-sm'>Token</Label>
              <InputGroup
                value={ssoConfig.secret || ''}
                groupClassName='px-2 cursor-pointer'
                readOnly
                suffix={
                  <CopyCheckIcon
                    content={ssoConfig.secret || ''}
                    className='h-3.5 w-3.5'
                    onCopy={() => {
                      setHasCopied(true);
                    }}
                  />
                }
              />
            </div>

            <ResponsiveDialogFooter className='items-center border-t p-4 px-5 sm:justify-between'>
              <div className='inline-flex flex-row items-center gap-2'>
                <Checkbox
                  checked={hasCopied}
                  onCheckedChange={() => {
                    setHasCopied(!hasCopied);
                  }}
                  id='copied'
                />
                <Label htmlFor='copied' className='text-secondary-foreground cursor-default text-sm'>
                  I have copied this token
                </Label>
              </div>
              <ResponsiveDialogClose hideCloseButton disabled={!hasCopied}>
                <Button
                  variant='default'
                  disabled={!hasCopied}
                  onClick={() => {
                    toast.success('Token copied to clipboard');
                  }}>
                  Done
                </Button>
              </ResponsiveDialogClose>
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialog>

        <Label className='text-muted-foreground text-xs'>
          The secret used to sign the JWT token on your server.
        </Label>
      </div>
    </SettingsCard>
  );
}
