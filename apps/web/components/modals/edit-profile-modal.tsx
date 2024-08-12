'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import { toast } from 'sonner';
import { ProfileProps } from '@/lib/types';

export default function UpdateProfileModal({
  user,
  children,
}: {
  user: ProfileProps['Row'];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [name, setName] = useState<string>(user.full_name);
  const [avatar, setAvatar] = useState<string>(user.avatar_url || '');

  async function onUpdateProfile() {
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: name === user.full_name ? undefined : name,
          avatar_url: avatar === user.avatar_url ? undefined : avatar,
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
      loading: 'Updating profile...',
      success: () => {
        router.refresh();
        return 'Profile updated successfully';
      },
      error: (err) => {
        return err;
      },
    });
  }

  const onChangePicture = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatar(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [setAvatar]
  );

  // Set user data to the new one (due to data://urls)
  useEffect(() => {
    setName(user.full_name);
    setAvatar(user.avatar_url || '');
  }, [user]);

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='w-full max-w-[475px] '>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Edit Profile</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Profile Picture */}
          <div className='space-y-1'>
            <Label className='text-foreground/70 text-sm '>Avatar</Label>

            {/* File Upload */}
            <div className='group flex h-[65px] w-[65px] items-center justify-center transition-all'>
              <label
                htmlFor='dropzone-file'
                className='bg-background hover:bg-background/90 group-hover:bg-background/90 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border'>
                <p className='text-foreground/70 absolute hidden text-xs group-hover:block group-hover:transition-all group-hover:duration-300'>
                  Upload
                </p>

                {avatar ? (
                  <img
                    src={avatar}
                    alt='Preview'
                    width={45}
                    height={45}
                    className='h-full w-full rounded-md object-cover group-hover:opacity-0'
                  />
                ) : (
                  <p className='text-foreground/70 absolute text-xs group-hover:hidden'>Upload</p>
                )}
                <input id='dropzone-file' type='file' className='hidden' onChange={onChangePicture} />
              </label>
            </div>

            <Label className='text-foreground/50 text-xs '>Your profile picture, displayed publicly.</Label>
          </div>

          {/* Full Name */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='name'>Full Name</Label>
            </div>

            <Input
              id='name'
              placeholder='John Doe'
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              className='col-span-3'
              tabIndex={-1}
            />

            <Label className='text-foreground/50 text-xs '>Your full name, displayed publicly.</Label>
          </div>

          {/* Workspace Slug */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='email'>Email</Label>
            </div>

            <Input id='email' value={user.email} disabled className='col-span-3' />

            <Label className='text-foreground/50 text-xs '>Your email address used to login.</Label>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose>
            <Button variant='secondary'>Cancel</Button>
          </ResponsiveDialogClose>
          <Button
            type='submit'
            onClick={onUpdateProfile}
            disabled={name === '' || (name === user.full_name && avatar === user.avatar_url)}>
            Update Profile
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
