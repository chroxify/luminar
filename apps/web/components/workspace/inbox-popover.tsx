'use client';

import Link from 'next/link';
import { Avatar, AvatarImage } from '@feedbase/ui/components/avatar';
import { Button } from '@feedbase/ui/components/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@feedbase/ui/components/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@feedbase/ui/components/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@feedbase/ui/components/tabs';
import useMediaQuery from '@feedbase/ui/lib/hooks/use-media-query';
import { Archive, Bell } from 'lucide-react';
import useSWR from 'swr';
import { NotificationProps, ProfileProps } from '@/lib/types';
import { fetcher, formatRootUrl } from '@/lib/utils';
import { Icons } from '../shared/icons/icons-static';

// Helper function to format time ago
function formatTimeAgo(date: Date) {
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();

  const times = [
    { unit: 'year', value: 1000 * 60 * 60 * 24 * 365 },
    { unit: 'month', value: 1000 * 60 * 60 * 24 * 30 },
    { unit: 'day', value: 1000 * 60 * 60 * 24 },
    { unit: 'hour', value: 1000 * 60 * 60 },
    { unit: 'minute', value: 1000 * 60 },
    { unit: 'second', value: 1000 },
  ];

  for (const unit of times) {
    const value = Math.floor(timeDiff / unit.value);
    if (value >= 1) {
      return `${value} ${unit.unit}${value > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

// Utils component to render a list of notifications
function renderNotifications({
  notifications,
  isLoading,
  archiveNotification,
  archiveButton,
}: {
  notifications: NotificationProps[] | null | undefined;
  isLoading: boolean;
  archiveNotification: (notificationId: string) => void;
  archiveButton: boolean;
}) {
  return (
    <>
      {isLoading ? (
        <div className='flex min-h-[450px] w-full flex-col items-center justify-center gap-2'>
          <Icons.Spinner className='text-foreground/60 h-7 w-7 animate-spin ' />
          <p className='text-foreground/60 text-center text-sm '>Loading notifications</p>
        </div>
      ) : null}

      {notifications?.length === 0 && (
        <div className='flex min-h-[450px] w-full flex-col items-center justify-center gap-2'>
          <Bell className='text-foreground/60 h-7 w-7' />
          <p className='text-foreground/60 text-center text-sm '>No notifications</p>
        </div>
      )}

      {notifications?.map((notification) => (
        <Link
          href={formatRootUrl(
            notification.workspace.slug,
            `/feedback/${notification.feedback_id}${
              notification.type === 'comment' ? `?comment=${notification.comment_id}` : ''
            }`
          )}
          key={notification.id}
          className='min-h-16 hover:bg-foreground/5 flex h-full w-full flex-row items-center gap-2 border-b px-3 py-5 last:border-b-0'>
          {/* Icon */}
          {notification.workspace.icon ? (
            <Avatar className='h-[40px] w-[40px] border hover:cursor-pointer'>
              <AvatarImage src={notification.workspace.icon || ''} alt={notification.workspace.name} />
            </Avatar>
          ) : (
            <div className='text-foreground/60 text-light flex transform-none flex-row items-center justify-center rounded-full border p-2.5'>
              <Bell className='h-[18px] w-[18px]' />
            </div>
          )}

          <div className='flex w-full flex-col'>
            {/* Title */}
            <div className='flex flex-row items-center justify-between'>
              {notification.type === 'post' ? (
                <p className='text-foreground/90 text-sm '>
                  New Feedback submitted by{' '}
                  <span className='text-foreground font-medium'>{notification.initiator.full_name}</span>
                </p>
              ) : (
                <p className='text-foreground/90 text-sm '>
                  <span className='text-foreground font-medium'>{notification.initiator.full_name}</span>{' '}
                  posted a new comment
                </p>
              )}
            </div>

            <p className='text-foreground/60 text-sm '>{formatTimeAgo(new Date(notification.created_at))}</p>
          </div>

          {archiveButton ? (
            <Button
              variant='ghost'
              size='icon'
              className='text-foreground/70 hover:text-foreground h-fit w-fit rounded-full border p-2'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                archiveNotification(notification.id);
              }}>
              <Archive className='h-4 w-4' />
            </Button>
          ) : null}
        </Link>
      ))}
    </>
  );
}

export default function InboxPopover({ user }: { user: ProfileProps['Row'] }) {
  const { isMobile } = useMediaQuery();

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    mutate,
  } = useSWR<NotificationProps[]>(`/api/v1/profile/notifications`, fetcher);

  // Archive notification
  // TODO: use mutate with optimistic ui here for smoother experience
  async function archiveNotification(notificationId: string) {
    await fetcher(`/api/v1/profile/notifications/${notificationId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        archived: true,
      }),
    });

    mutate();
  }

  // Archived notifications - add if current user id is in has_archived array
  const archivedNotifications = isLoading
    ? null
    : notifications?.filter((notification) => notification.has_archived?.includes(user.id));

  // Inbox notifications - add if current user id is not in has_archived array
  const inboxNotifications = isLoading
    ? null
    : notifications?.filter((notification) => !notification.has_archived?.includes(user.id));

  // Sort notifications by created_at (newest first)
  inboxNotifications?.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Sort archived notifications by created_at (newest first)
  archivedNotifications?.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // If mobile, render a button instead of a popover
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger>
          <Button
            variant='ghost'
            size='icon'
            className='text-foreground/70 hover:text-foreground relative h-8 w-8 rounded-full border'>
            <Bell className='h-4 w-4' />
            {inboxNotifications?.length !== 0 && !isLoading && (
              <span className='bg-foreground absolute -right-[1px] -top-[1px] h-2.5 w-2.5 rounded-full' />
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className='h-full max-h-[80%] w-full max-w-full p-0' hideDragger>
          <Tabs defaultValue='inbox' className='h-full w-full'>
            <TabsList className='h-fit w-full justify-start gap-3 rounded-none border-b bg-transparent p-0 px-3'>
              <TabsTrigger
                value='inbox'
                className='data-[state=active]:text-foreground data-[state=active]:border-foreground rounded-none px-2 py-3  data-[state=active]:border-b data-[state=active]:bg-transparent'>
                Inbox
              </TabsTrigger>
              <TabsTrigger
                value='archive'
                className='data-[state=active]:text-foreground data-[state=active]:border-foreground rounded-none px-2 py-3  data-[state=active]:border-b data-[state=active]:bg-transparent'>
                Archive
              </TabsTrigger>
            </TabsList>
            <TabsContent value='inbox' className='mt-0 max-h-[540px] min-h-[450px] overflow-auto'>
              {renderNotifications({
                notifications: inboxNotifications,
                isLoading,
                archiveNotification,
                archiveButton: true,
              })}
            </TabsContent>
            <TabsContent value='archive' className='mt-0 max-h-full overflow-auto pb-12'>
              {renderNotifications({
                notifications: archivedNotifications,
                isLoading,
                archiveNotification,
                archiveButton: false,
              })}
            </TabsContent>
          </Tabs>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant='ghost'
          size='icon'
          className='text-foreground/70 hover:text-foreground relative h-8 w-8 rounded-full border'>
          <Bell className='h-4 w-4' />
          {inboxNotifications?.length !== 0 && !isLoading && (
            <span className='bg-foreground absolute -right-[1px] -top-[1px] h-2.5 w-2.5 rounded-full' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='min-h-[450px] w-[400px] p-0'>
        <Tabs defaultValue='inbox' className='h-full w-full'>
          <TabsList className='h-fit w-full justify-start gap-3 rounded-none border-b bg-transparent p-0 px-3'>
            <TabsTrigger
              value='inbox'
              className='data-[state=active]:text-foreground data-[state=active]:border-foreground rounded-none px-2 py-3  data-[state=active]:border-b data-[state=active]:bg-transparent'>
              Inbox
            </TabsTrigger>
            <TabsTrigger
              value='archive'
              className='data-[state=active]:text-foreground data-[state=active]:border-foreground rounded-none px-2 py-3  data-[state=active]:border-b data-[state=active]:bg-transparent'>
              Archive
            </TabsTrigger>
          </TabsList>
          <TabsContent value='inbox' className='mt-0 max-h-[540px] min-h-[450px] overflow-auto'>
            {renderNotifications({
              notifications: inboxNotifications,
              isLoading,
              archiveNotification,
              archiveButton: true,
            })}
          </TabsContent>
          <TabsContent value='archive' className='mt-0 max-h-[540px] min-h-[450px] overflow-auto'>
            {renderNotifications({
              notifications: archivedNotifications,
              isLoading,
              archiveNotification,
              archiveButton: false,
            })}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
