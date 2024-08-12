'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { cn } from '@feedbase/ui/lib/utils';
import { Check, ChevronsUpDownIcon } from 'lucide-react';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import useWorkspace from '@/lib/swr/use-workspace';
import useWorkspaceTheme from '@/lib/swr/use-workspace-theme';
import { WorkspaceProps, WorkspaceThemeProps } from '@/lib/types';
import { actionFetcher, areObjectsEqual } from '@/lib/utils';
import SettingsCard from '@/components/settings/settings-card';
import FetchError from '@/components/shared/fetch-error';
import FileDrop from '@/components/shared/file-drop';
import InputGroup from '@/components/shared/input-group';

export default function GeneralSettings({ params }: { params: { slug: string } }) {
  const {
    workspace: workspaceData,
    loading: workspaceLoading,
    error: workspaceError,
    mutate: workspaceMutate,
  } = useWorkspace();
  const {
    workspaceTheme: workspaceThemeData,
    loading: workspaceThemeLoading,
    error: workspaceThemeError,
    mutate: workspaceThemeMutate,
  } = useWorkspaceTheme();

  const [workspace, setWorkspace] = useState<WorkspaceProps['Row']>();
  const [workspaceTheme, setWorkspaceTheme] = useState<WorkspaceThemeProps['Row']>();

  const { trigger: updateWorkspace } = useSWRMutation(`/api/v1/workspaces/${params.slug}`, actionFetcher, {
    onSuccess: () => {
      // Check if slug has changed
      if (workspace?.slug !== workspaceData?.slug) {
        // Redirect to new slug
        window.location.href = `/${workspace?.slug}/settings/general`;
      }

      workspaceMutate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { trigger: updateWorkspaceTheme } = useSWRMutation(
    `/api/v1/workspaces/${params.slug}/theme`,
    actionFetcher,
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  useEffect(() => {
    setWorkspace(workspaceData);
    setWorkspaceTheme(workspaceThemeData);
  }, [workspaceData, workspaceThemeData]);

  if (workspaceError || workspaceThemeError) {
    return (
      <FetchError
        name='branding settings'
        error={workspaceError !== null ? workspaceError : workspaceThemeError}
        mutate={workspaceError !== null ? workspaceMutate : workspaceThemeMutate}
        isValidating={workspaceError !== null ? workspaceLoading : workspaceThemeLoading}
      />
    );
  }

  if (workspaceLoading || workspaceThemeLoading) {
    return (
      <>
        <SettingsCard title='Branding' description='Customize your workspace branding.'>
          <Skeleton className='col-span-2 h-96 w-full' />
        </SettingsCard>
        <SettingsCard title='Theme' description='Customize your workspace theme.' className='grid-cols-3'>
          <Skeleton className='h-44 w-full' />
          <Skeleton className='h-44 w-full' />
          <Skeleton className='h-44 w-full' />
        </SettingsCard>
        <SettingsCard title='Danger Zone' description='Permanently delete your workspace.'>
          <Skeleton className='col-span-2 h-32 w-full' />
        </SettingsCard>
      </>
    );
  }

  if (workspace && workspaceTheme) {
    return (
      <>
        <SettingsCard
          title='Branding'
          description='Customize your workspace branding.'
          showSave={!areObjectsEqual(workspace, workspaceData)}
          onSave={async () => {
            await updateWorkspace({ method: 'PATCH', ...workspace });
          }}
          onCancel={() => {
            setWorkspace(workspaceData);
          }}>
          <div className='-mt-1 w-full space-y-1'>
            <Label className='text-foreground/70 text-sm'>Name</Label>
            <Input
              className='w-full'
              value={workspace.name}
              onChange={(e) => {
                setWorkspace({
                  ...workspace,
                  name: e.target.value,
                });
              }}
            />
            <Label className='text-muted-foreground text-xs'>This is the name of your workspace.</Label>
          </div>

          <div className='-mt-1 w-full space-y-1'>
            <Label className='text-foreground/70 text-sm '>Slug</Label>

            <InputGroup
              value={workspace.slug}
              onChange={(e) => {
                setWorkspace({
                  ...workspace,
                  slug: e.target.value,
                });
              }}
              suffix={`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
              placeholder='feedbase'
            />

            <Label className='text-muted-foreground text-xs'>This is the subdomain of your workspace.</Label>
          </div>

          {/* Workspace Logo */}
          <div className='col-span-1 flex h-full w-full flex-col gap-1'>
            <Label className='text-foreground/70 text-sm '>Logo</Label>

            {/* File Upload */}
            <div className='flex items-center gap-2.5'>
              <Avatar className={cn('h-12 w-12', workspace.icon_radius)}>
                <AvatarImage src={workspace.icon || ''} alt={workspace.name} />
                <AvatarFallback className={cn('bg-muted select-none text-sm', workspace.icon_radius)}>
                  {workspace.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-1'>
                  <Label
                    className='bg-secondary text-secondary-foreground hover:bg-secondary/80 flex h-7 w-fit items-center justify-center rounded-md px-2 hover:cursor-pointer'
                    htmlFor='icon-upload'>
                    Upload
                  </Label>
                  <input
                    type='file'
                    id='icon-upload'
                    className='hidden'
                    onChange={(event) => {
                      // Set the icon to the uploaded file
                      if (event.target.files?.[0]) {
                        // Check if the file is an image, image/png, image/jpeg, etc.
                        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(event.target.files[0].type)) {
                          toast.error('Please upload a valid image.');
                          return;
                        }

                        // Read the file as a data URL
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setWorkspace({
                            ...workspace,
                            icon: e.target?.result as string,
                          });
                        };
                        reader.readAsDataURL(event.target.files[0]);
                      }
                    }}
                  />
                  {workspace.icon ? (
                    <Button
                      variant='destructive'
                      size='sm'
                      className='w-fit'
                      onClick={() => setWorkspace({ ...workspace, icon: '' })}>
                      Remove
                    </Button>
                  ) : null}
                </div>
                <Label className='text-muted-foreground text-xs'>Recommended size is 256x256.</Label>
              </div>
            </div>
          </div>

          <div className='flex h-full w-full flex-col items-start space-y-1'>
            <Label className='text-foreground/70 text-sm '>Radius</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-fit font-normal'>
                  {workspace.icon_radius === 'rounded-md'
                    ? 'Rounded'
                    : workspace.icon_radius === 'rounded-full'
                    ? 'Circle'
                    : 'Square'}
                  <ChevronsUpDownIcon className='text-secondary-foreground ml-2 h-3.5 w-3.5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuItem
                  onClick={() => {
                    setWorkspace({
                      ...workspace,
                      icon_radius: 'rounded-md',
                    });
                  }}>
                  Rounded
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setWorkspace({
                      ...workspace,
                      icon_radius: 'rounded-full',
                    });
                  }}>
                  Circle
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setWorkspace({
                      ...workspace,
                      icon_radius: 'rounded-none',
                    });
                  }}>
                  Square
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Label className='text-muted-foreground text-xs'>This is the radius of your workspace.</Label>
          </div>

          <div className='col-span-1 -mt-1 w-full space-y-1'>
            <Label className='text-foreground/70 text-sm '>Redirect URL</Label>
            <Input
              className='w-full'
              value={workspace.icon_redirect_url || ''}
              onChange={(e) => {
                setWorkspace({
                  ...workspace,
                  icon_redirect_url: e.target.value,
                });
              }}
              placeholder='Leave blank to use default'
            />
            <Label className='text-muted-foreground text-xs'>
              This is the redirect URL of your workspace.
            </Label>
          </div>

          {/* OG Image */}
          <div className='col-span-2 space-y-1'>
            <FileDrop
              labelComponent={<Label className='text-foreground/70 text-sm'>OG Image</Label>}
              image={workspace.opengraph_image}
              setImage={(e: string | null) => {
                setWorkspace({
                  ...workspace,
                  opengraph_image: e,
                });
              }}
              className='h-40 w-80'
            />

            <Label className='text-foreground/50 text-xs'>
              The OG Image used when sharing your workspace.
            </Label>
          </div>
        </SettingsCard>

        <SettingsCard title='Theme' description='Customize your workspace theme.' className='grid-cols-3'>
          {/* Thanks to https://github.com/openstatushq for the inspiration of the theme previews */}
          <button
            className='flex h-full w-full flex-col items-center gap-2'
            onClick={() => {
              toast.promise(updateWorkspaceTheme({ method: 'PATCH', theme: 'light' }), {
                loading: 'Updating theme...',
                success: 'Theme updated successfully.',
                error: 'Failed to update theme.',
              });
              setWorkspaceTheme({ ...workspaceTheme, theme: 'light' });
            }}
            type='button'>
            <div
              className={cn(
                'border-border/50 relative h-full w-full items-center rounded-md border-2 p-1',
                workspaceTheme.theme === 'light' &&
                  'ring-ring ring-offset-root ring-2 ring-offset-2 transition-shadow'
              )}>
              <div className='space-y-2 rounded-sm bg-[#F4F4F5] p-2'>
                <div className='space-y-2  rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                  <div className='h-2 w-[80px] rounded-lg bg-[#F4F4F5]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                </div>
                <div className='flex items-center  space-x-2 rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                  <div className='h-4 w-4 rounded-full bg-[#F4F4F5]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                </div>
                <div className='flex items-center  space-x-2 rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                  <div className='h-4 w-4 rounded-full bg-[#F4F4F5]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                </div>
              </div>

              <div
                className={cn(
                  'absolute bottom-3 right-3 h-5 w-5 items-center justify-center rounded-full bg-[#0D0D0E]',
                  workspaceTheme.theme === 'light' ? 'flex' : 'hidden'
                )}>
                <Check className='h-3.5 w-3.5 text-white' />
              </div>
            </div>

            <span className='text-muted-foreground text-sm '>Light</span>
          </button>

          <button
            className='flex h-full w-full flex-col items-center gap-2'
            onClick={() => {
              toast.promise(updateWorkspaceTheme({ method: 'PATCH', theme: 'dark' }), {
                loading: 'Updating theme...',
                success: 'Theme updated successfully.',
                error: 'Failed to update theme.',
              });
              setWorkspaceTheme({ ...workspaceTheme, theme: 'dark' });
            }}
            type='button'>
            <div
              className={cn(
                'border-border/50 bg-root relative h-full w-full items-center rounded-md border-2 p-1',
                workspaceTheme.theme === 'dark' &&
                  'ring-ring ring-offset-root ring-2 ring-offset-2 transition-shadow'
              )}>
              <div className='space-y-2 rounded-sm bg-[#0D0D0E] p-2'>
                <div className='space-y-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                  <div className='h-2 w-[80px] rounded-lg bg-[#121416]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                </div>
                <div className='flex items-center space-x-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                  <div className='h-4 w-4 rounded-full bg-[#121416]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                </div>
                <div className='flex items-center space-x-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                  <div className='h-4 w-4 rounded-full bg-[#121416]' />
                  <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                </div>
              </div>

              <div
                className={cn(
                  'absolute bottom-3 right-3 h-5 w-5 items-center justify-center rounded-full bg-white',
                  workspaceTheme.theme === 'dark' ? 'flex' : 'hidden'
                )}>
                <Check className='h-3.5 w-3.5 text-black' />
              </div>
            </div>
            <span className='text-muted-foreground text-sm'>Dark</span>
          </button>

          <button
            type='button'
            className='flex h-full w-full flex-col items-center gap-2'
            onClick={() => {
              toast.promise(updateWorkspaceTheme({ method: 'PATCH', theme: 'custom' }), {
                loading: 'Updating theme...',
                success: 'Theme updated successfully.',
                error: 'Failed to update theme.',
              });
              setWorkspaceTheme({ ...workspaceTheme, theme: 'custom' });
            }}>
            <div className='relative h-full w-full'>
              <div
                className={cn(
                  'border-border/50 bg-root relative items-center rounded-md border-2 p-1',
                  workspaceTheme.theme === 'custom' &&
                    'ring-ring ring-offset-root ring-2 ring-offset-2 transition-shadow'
                )}>
                <div className='space-y-2 rounded-sm bg-[#F4F4F5] p-2'>
                  <div className='space-y-2  rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                    <div className='h-2 w-[80px] rounded-lg bg-[#F4F4F5]' />
                    <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                  </div>
                  <div className='flex items-center  space-x-2 rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                    <div className='h-4 w-4 rounded-full bg-[#F4F4F5]' />
                    <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                  </div>
                  <div className='flex items-center  space-x-2 rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm'>
                    <div className='h-4 w-4 rounded-full bg-[#F4F4F5]' />
                    <div className='h-2 w-[100px] rounded-lg bg-[#F4F4F5]' />
                  </div>
                </div>
              </div>
              <div
                className='absolute bottom-0 left-0 right-0 top-0'
                style={{ clipPath: 'polygon(100% 0px, 0px 0px, 100% 100%)' }}>
                <div className='border-muted bg-root items-center rounded-md border-2 p-1'>
                  <div className='space-y-2 rounded-sm bg-[#0D0D0E] p-2'>
                    <div className='space-y-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                      <div className='h-2 w-[80px] rounded-lg bg-[#121416]' />
                      <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                    </div>
                    <div className='flex items-center space-x-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                      <div className='h-4 w-4 rounded-full bg-[#121416]' />
                      <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                    </div>
                    <div className='flex items-center space-x-2 rounded-md border border-[#2D2E34] bg-[#26272C] p-2 shadow-sm'>
                      <div className='h-4 w-4 rounded-full bg-[#121416]' />
                      <div className='h-2 w-[100px] rounded-lg bg-[#121416]' />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'absolute bottom-3 right-3 h-5 w-5 items-center justify-center rounded-full bg-white',
                  workspaceTheme.theme === 'custom' ? 'flex' : 'hidden'
                )}>
                <Check className='h-3.5 w-3.5 text-black' />
              </div>
            </div>
            <span className='text-muted-foreground text-sm '>System</span>
          </button>
        </SettingsCard>

        <SettingsCard title='Danger Zone' description='Permanently delete your workspace.'>
          <div className='-mt-1 flex w-full flex-col space-y-1'>
            <Button variant='destructive' className='w-fit'>
              Delete this Workspace
            </Button>
          </div>
        </SettingsCard>
      </>
    );
  }
}
