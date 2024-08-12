'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
import { Badge } from '@feedbase/ui/components/badge';
import { Button } from '@feedbase/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDestructiveItem,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { Separator } from '@feedbase/ui/components/separator';
import { Skeleton } from '@feedbase/ui/components/skeleton';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { AlertCircle, Copy, Edit, MoreVertical, Trash } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { ChangelogProps } from '@/lib/types';
import { fetcher } from '@/lib/utils';
import { AddChangelogModal } from '@/components/modals/add-edit-changelog-modal';
import AnimatedTabs from '@/components/shared/animated-tabs';

export default function ChangelogList({ workspaceSlug }: { workspaceSlug: string }) {
  const [tab, setTab] = useState('Drafts');
  const [changelogs, setChangelogs] = useState<ChangelogProps['Row'][]>();

  const {
    data: changelogsData,
    error,
    isLoading,
    mutate,
  } = useSWR<ChangelogProps['Row'][]>(`/api/v1/workspaces/${workspaceSlug}/changelogs`, fetcher);

  async function onDeleteChangelog(changelog: ChangelogProps['Row']) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${workspaceSlug}/changelogs/${changelog.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
      loading: 'Deleting changelog...',
      success: `Changelog deleted successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      mutate();
    });
  }

  async function onDuplicateChangelog(changelog: ChangelogProps['Row']) {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces/${workspaceSlug}/changelogs`, {
        method: 'POST',
        body: JSON.stringify({
          title: changelog.title,
          summary: changelog.summary,
          content: changelog.content,
          image: changelog.thumbnail,
          publish_date: new Date().toISOString(),
          published: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
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
      loading: 'Duplicating changelog...',
      success: `Changelog duplicated successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      mutate();
    });
  }

  useEffect(() => {
    if (changelogsData) {
      if (tab) {
        const filteredChangelogs = changelogsData.filter((changelog) => {
          if (tab === 'Drafts') {
            return !changelog.published;
          } else if (tab === 'Scheduled') {
            return (
              changelog.published &&
              changelog.publish_date &&
              changelog.publish_date > new Date().toISOString()
            );
          } else if (tab === 'Published') {
            return (
              changelog.published &&
              changelog.publish_date &&
              changelog.publish_date <= new Date().toISOString()
            );
          }
          return false;
        });

        // Sort by publish date (newest first)
        filteredChangelogs.sort((a, b) => {
          return new Date(b.publish_date!).getTime() - new Date(a.publish_date!).getTime();
        });

        setChangelogs(filteredChangelogs);
      } else {
        setChangelogs(changelogsData);
      }
    }
  }, [changelogsData, tab]);

  return (
    <>
      {/* Header tabs */}
      <AnimatedTabs
        tabs={[
          {
            label: 'Drafts',
          },
          {
            label: 'Scheduled',
          },
          {
            label: 'Published',
          },
        ]}
        selectedTab={tab}
        setSelectedTab={setTab}
      />

      <Separator />

      <div className='flex h-full w-full flex-col items-center justify-start gap-4 overflow-y-auto p-5'>
        {isLoading
          ? [...Array(5)].map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={`skeleton-${index}`} className='h-32 w-full' />
            ))
          : null}

        {/* Error State */}
        {error && !isLoading ? (
          <div className='flex flex-col items-center gap-4 p-10'>
            <AlertCircle className='text-secondary-foreground h-7 w-7 stroke-[1.5px]' />
            <div className='space-y-1.5 text-center'>
              <div className='text-secondary-foreground text-center'>
                Failed to load changelogs. Please try again.
              </div>
              {/* Show error message - only hsow if error.message is of type json */}
              {(() => {
                try {
                  return (
                    <p className='text-muted-foreground text-center'>{JSON.parse(error.message)?.error}</p>
                  );
                } catch (parseError) {
                  return null;
                }
              })()}
            </div>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => {
                mutate();
              }}>
              Try Again
            </Button>
          </div>
        ) : null}

        {/* Empty State */}
        {changelogs && changelogs.length === 0 && !error ? (
          <div className='flex flex-col items-center justify-center gap-4 pt-20'>
            <div className='flex flex-col items-center justify-center gap-1'>
              <h3 className='text-foreground text-center text-2xl font-medium'>No changelogs found.</h3>
              <p className='text-muted-foreground text-center'>Create a new changelog to get started.</p>
            </div>
            <AddChangelogModal workspaceSlug={workspaceSlug}>
              <Button size='sm'>Create Changelog</Button>
            </AddChangelogModal>
          </div>
        ) : null}

        {/* Changelogs */}
        {changelogs?.map((changelog) => (
          <div
            className='bg-card text-card-foreground flex min-h-[8rem] w-full gap-5 rounded-lg border p-2.5 shadow-sm'
            key={changelog.id}>
            {/* Image */}
            <div className='flex h-full min-w-[190px] flex-col items-center justify-center'>
              {changelog.thumbnail ? (
                <div className='border-input bg-background hover:bg-accent group relative h-full w-full flex-col items-center justify-center rounded-md border shadow-sm transition-all'>
                  <div className='absolute h-full w-full rounded-md'>
                    <Image
                      src={changelog.thumbnail}
                      alt='Preview Image'
                      fill
                      sizes='100%'
                      className='rounded-md object-cover'
                    />
                  </div>
                </div>
              ) : (
                <div className='border-input bg-background hover:bg-accent group relative flex h-full w-full flex-col items-center justify-center rounded-md border shadow-sm transition-all'>
                  <div className='bg-background absolute flex h-full w-full items-center justify-center rounded-md'>
                    <div className='flex flex-col items-center justify-center'>
                      <PhotoIcon className='text-foreground/50 h-8 w-8' />
                      <p className='text-foreground/50 text-sm'>No image</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className='flex h-full w-full flex-col gap-2'>
              {/* Tags */}
              <div className='flex flex-row gap-2'>
                {/* If published is true, show published badge, else show Draft badge */}
                <Badge variant='secondary' className='self-start border'>
                  {changelog.published ? 'Published' : 'Draft'}
                </Badge>

                {/* If date is not undefined, show date */}
                {changelog.publish_date ? (
                  <Badge variant='secondary' className='shrink-0 self-start'>
                    {new Date(changelog.publish_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Badge>
                ) : null}
              </div>

              {/* Title and Summary */}
              <div className='flex flex-col'>
                <span className='text-1xl font-medium'>{changelog.title ? changelog.title : 'Untitled'}</span>
                <div className='text-foreground/60 line-clamp-2 text-sm'>
                  {changelog.summary ? changelog.summary : 'No changelog summary provided.'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-foreground/50 hover:text-foreground h-7 w-4'>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=' justify-between' align='end'>
                <AddChangelogModal workspaceSlug={workspaceSlug} changelogData={changelog} isEdit>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                </AddChangelogModal>
                <DropdownMenuItem
                  onSelect={() => {
                    onDuplicateChangelog(changelog);
                    if (changelog.published) {
                      setTab('Drafts');
                    }
                  }}>
                  <Copy className='mr-2 h-4 w-4' />
                  {changelog.published ? 'Duplicate in Drafts' : 'Duplicate'}
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuDestructiveItem
                      onSelect={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}>
                      <Trash className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuDestructiveItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Changelog</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this changelog? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        onClick={() => onDeleteChangelog(changelog)}>
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </>
  );
}
