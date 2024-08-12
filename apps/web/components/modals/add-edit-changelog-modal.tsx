'use client';

import { useState } from 'react';
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
  ResponsiveDialogFooter,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { Textarea } from '@feedbase/ui/components/textarea';
import { format } from 'date-fns';
import { Bell, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import { ChangelogProps } from '@/lib/types';
import { fetcher } from '@/lib/utils';
import { DatePicker } from '@/components/shared/date-picker';
import FileDrop from '@/components/shared/file-drop';
import { Icons } from '@/components/shared/icons/icons-static';
import RichTextEditor from '@/components/shared/tiptap-editor';
import DefaultTooltip from '@/components/shared/tooltip';

export function AddChangelogModal({
  children,
  workspaceSlug,
  changelogData,
  isEdit,
}: {
  children: React.ReactNode;
  workspaceSlug: string;
  changelogData?: ChangelogProps['Row'];
  isEdit?: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [notifySubscribers, setNotifySubscribers] = useState<boolean>(true);
  const { data: subscribersCount } = useSWR<{ count: number }>(
    `/api/v1/workspaces/${workspaceSlug}/changelogs/subscribers/count`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [data, setData] = useState<ChangelogProps['Row']>({
    id: changelogData?.id || '',
    workspace_id: changelogData?.workspace_id || '',
    title: changelogData?.title || '',
    content: changelogData?.content || '',
    summary: changelogData?.summary || '',
    thumbnail: changelogData?.thumbnail || null,
    publish_date: changelogData?.publish_date || new Date().toISOString(),
    published: changelogData?.published || false,
    created_at: changelogData?.created_at || '',
    slug: 'dummy-slug',
    author_id: 'dummy-author',
  });

  async function onCreateChangelog(createType: 'draft' | 'publish') {
    // Make sure all required fields are filled out incase published is true
    if (createType === 'publish') {
      if (!data.title || !data.summary || !data.content || !data.thumbnail || !data.publish_date) {
        toast.error('Please fill out all required fields.');
        return;
      }
    }

    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${workspaceSlug}/changelogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title || '',
          summary: data.summary || '',
          content: data.content || '',
          image: data.thumbnail || null,
          publish_date: data.publish_date || null,
          published: createType === 'publish',
          notify_subscribers: notifySubscribers,
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
      loading: `${createType === 'publish' ? 'Publishing' : 'Creating'} changelog...`,
      success: () => {
        mutate(`/api/v1/workspaces/${workspaceSlug}/changelogs`);
        setData({
          ...data,
          title: '',
          content: '',
          summary: '',
          thumbnail: null,
          publish_date: new Date().toISOString(),
        });
        if (createType === 'publish') {
          return `Changelog was published successfully!`;
        }

        return `New draft was created successfully!`;
      },
      error: (err) => {
        return err;
      },
    });
  }

  async function onEditChangelog(updateType: 'draft' | 'publish') {
    // Make sure all required fields are filled out incase published is true
    if (updateType === 'publish') {
      if (!data.title || !data.summary || !data.content || !data.thumbnail || !data.publish_date) {
        toast.error('Please fill out all required fields.');
        return;
      }
    }

    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${workspaceSlug}/changelogs/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title || '',
          summary: data.summary || '',
          content: data.content || '',
          image: data.thumbnail || null,
          publish_date: data.publish_date || null,
          published: updateType === 'publish',
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
      loading: `${updateType === 'publish' ? 'Publishing' : 'Updating'} changelog...`,
      success: () => {
        mutate(`/api/v1/workspaces/${workspaceSlug}/changelogs`);
        setData({
          ...data,
          title: '',
          content: '',
          summary: '',
          thumbnail: null,
          publish_date: new Date().toISOString(),
        });
        return `${data.title !== '' ? data.title : 'Draft'} was updated successfully!`;
      },
      error: (err) => {
        return err;
      },
    });
  }

  function resizeTextArea() {
    const textArea = document.querySelector('textarea');
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.min(textArea.scrollHeight, 180)}px`;
    }
  }

  function findMissingFields() {
    const missingFields = [];
    if (!data.title) {
      missingFields.push('Title');
    }
    if (!data.content) {
      missingFields.push('Content');
    }
    if (!data.summary) {
      missingFields.push('Summary');
    }
    if (!data.publish_date) {
      missingFields.push('Publish Date');
    }
    if (!data.thumbnail) {
      missingFields.push('Image');
    }
    return missingFields;
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:max-w-screen-[300px] flex h-[96%] w-full flex-col justify-between px-0 sm:h-min sm:max-h-[70%] sm:min-h-[60%] sm:p-0 md:max-w-screen-md lg:max-w-screen-lg'>
        <div className='flex h-full w-full flex-row justify-between gap-8 sm:px-7 sm:pt-7'>
          <div className='flex h-full min-h-full w-full flex-col  gap-4'>
            {/* Title */}
            <Input
              placeholder='Title'
              value={data.title}
              onChange={(e) => {
                setData({ ...data, title: e.target.value });
              }}
              className='sticky rounded-none border-transparent bg-transparent p-0 text-2xl font-medium focus-visible:ring-transparent sm:top-7'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const editor = document.querySelector('.tiptap');
                  if (editor instanceof HTMLElement) {
                    editor.focus();
                  }
                }
              }}
              style={{ direction: 'ltr' }}
            />

            {/* Content Editor */}
            <RichTextEditor
              content={data.content || ''}
              setContent={(content: string) => {
                setData({ ...data, content });
              }}
              parentClassName='overflow-auto min-h-full no-scrollba h-full'
              className='prose-sm min-h-full min-w-full text-[15px]'
              placeholder='Write your changelog here...'
            />
          </div>

          <div className='mr-[1px] flex min-h-full w-full flex-col gap-4 sm:max-w-[270px] lg:max-w-[325px]'>
            {/* Image Upload */}
            <FileDrop
              image={data.thumbnail}
              setImage={(thumbnail: string | null) => {
                setData({ ...data, thumbnail });
              }}
              className='sm:h-44 lg:h-48'
              labelComponent={<Label htmlFor='image'>Cover Image</Label>}
            />

            {/* Summary */}
            <div className='space-y-1'>
              <div className='flex flex-row items-center justify-between'>
                <Label htmlFor='summary'>Changelog Summary</Label>
                <DefaultTooltip content='Generate with AI. (Coming soon)'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='text-muted-foreground hover:text-foreground h-7 w-7'>
                    <Icons.Sparkles className='h-3.5 w-3.5' />
                  </Button>
                </DefaultTooltip>
              </div>
              <Textarea
                placeholder='Write a short summary of your changelog...'
                value={data.summary || ''}
                onInput={resizeTextArea}
                onChange={(e) => {
                  setData({ ...data, summary: e.target.value });
                }}
                className='h-fit min-h-[100px] resize-none border bg-transparent focus-visible:ring-transparent'
              />
            </div>

            <div className='flex flex-row items-center justify-between'>
              <Label htmlFor='publish_date'>Publish Date</Label>
              <DatePicker
                date={new Date(data.publish_date ?? '')}
                setDate={(date: Date | undefined) => {
                  setData({ ...data, publish_date: date?.toISOString() ?? null });
                }}>
                <Button variant='ghost' className='w-fit justify-end font-normal'>
                  {data.publish_date ? (
                    <>
                      <Calendar className='text-foreground mr-2 h-4 w-4' />
                      <span>{format(new Date(data.publish_date), 'P')}</span>
                    </>
                  ) : (
                    <>
                      <Calendar className='text-muted-foreground mr-2 h-4 w-4' />
                      <span className='text-muted-foreground'>Pick a date</span>
                    </>
                  )}
                </Button>
              </DatePicker>
            </div>
          </div>
        </div>

        <ResponsiveDialogFooter className='sm:px-7 sm:pb-7'>
          <ResponsiveDialogClose>
            <Button
              variant='outline'
              onClick={() => {
                setData({
                  ...data,
                  title: '',
                  content: '',
                  summary: '',
                  thumbnail: null,
                  publish_date: new Date().toISOString(),
                });
              }}
              className='shrink-0'>
              Cancel
            </Button>
          </ResponsiveDialogClose>
          <Button
            variant='outline'
            type='submit'
            onClick={() => {
              if (isEdit) {
                onEditChangelog('draft');
              } else {
                onCreateChangelog('draft');
              }

              // Close modal
              setOpen(false);
            }}
            disabled={
              data.title === '' ||
              data.content === '' ||
              (data.title === changelogData?.title &&
                data.content === changelogData?.content &&
                data.summary === changelogData?.summary &&
                data.publish_date === changelogData?.publish_date)
            }>
            {isEdit ? 'Update' : 'Save as Draft'}
          </Button>
          <AlertDialog
            open={alertOpen}
            onOpenChange={(open) => {
              // If not all required fields are filled out, prevent the user from publishing
              if (
                findMissingFields().length > 0 ||
                (data.publish_date !== null && new Date(data.publish_date) > new Date())
              ) {
                setAlertOpen(false);
                return;
              }

              setAlertOpen(open);
            }}>
            <AlertDialogTrigger>
              <DefaultTooltip
                content={
                  findMissingFields().length > 0
                    ? `Please fill out the following fields: ${findMissingFields().join(', ')}`
                    : data.publish_date !== null && new Date(data.publish_date) > new Date()
                    ? 'Changelog scheduling is coming soon!'
                    : ''
                }
                disabled={
                  findMissingFields().length === 0 &&
                  !(data.publish_date !== null && new Date(data.publish_date) > new Date())
                }
                className='cursor-not-allowed'>
                <Button
                  disabled={
                    findMissingFields().length > 0 ||
                    (data.title === changelogData?.title &&
                      data.content === changelogData?.content &&
                      data.summary === changelogData?.summary &&
                      data.publish_date === changelogData?.publish_date) ||
                    (data.publish_date !== null && new Date(data.publish_date) > new Date())
                  }>
                  {/* If publish date is in the future, show "Schedule" else "Publish" */}
                  {data.publish_date && new Date(data.publish_date) > new Date() ? 'Schedule' : 'Publish'}
                </Button>
              </DefaultTooltip>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Publish Changelog</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to publish this changelog? This changelog will be public for everyone
                  to see.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className='flex flex-row items-center gap-2'>
                <Checkbox
                  className='text-muted-foreground hover:text-foreground'
                  id='notify_subscribers'
                  checked={notifySubscribers}
                  onCheckedChange={(checked) => {
                    checked ? setNotifySubscribers(true) : setNotifySubscribers(false);
                  }}>
                  <Bell className='h-3.5 w-3.5' />
                </Checkbox>
                <Label htmlFor='notify_subscribers' className='flex flex-row items-center'>
                  Notify{' '}
                  {!subscribersCount ? (
                    <Skeleton className='mx-1 inline-block h-5 w-5' />
                  ) : (
                    subscribersCount?.count || 0
                  )}{' '}
                  subscribers
                </Label>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (isEdit) {
                      onEditChangelog('publish');
                    } else {
                      onCreateChangelog('publish');
                    }

                    // Close modal
                    setOpen(false);
                  }}>
                  Publish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
