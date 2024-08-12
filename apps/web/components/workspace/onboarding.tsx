'use client';

import { useState } from 'react';
import { Button } from '@feedbase/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@feedbase/ui/components/card';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import { toast } from 'sonner';

export default function Onboarding() {
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');

  function handleSlugChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Replace spaces with dashes
    event.target.value = event.target.value.replace(/\s+/g, '-').toLowerCase();

    setSlug(event.target.value);
  }

  async function onCreateWorkspace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
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
      loading: 'Creating workspace...',
      success: `${name} was created successfully!`,
      error: (err) => {
        return err;
      },
    });

    promise.then(() => {
      window.location.href = `/${slug}`;
    });
  }

  return (
    <form onSubmit={onCreateWorkspace}>
      <Card className='px-3 py-4'>
        <CardHeader>
          <CardTitle>Create your first workspace</CardTitle>
          <CardDescription>Create a new workspace to get rolling.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            {/* Workspace Name */}
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row items-center gap-2'>
                <Label htmlFor='name'>Workspace Name</Label>
              </div>

              <Input
                id='name'
                placeholder='Feedbase'
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                className='col-span-3'
              />

              <Label className='text-foreground/50 text-xs '>The name of your workspace.</Label>
            </div>

            {/* Workspace Slug */}
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row items-center gap-2'>
                <Label htmlFor='slug'>Workspace Slug</Label>
              </div>

              <div className='bg-background focus-within:ring-ring ring-offset-root flex h-9 w-full rounded-md border text-sm  transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
                <Input
                  className='h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                  placeholder='feedbase'
                  value={slug}
                  onChange={handleSlugChange}
                />
                <div className='text-foreground/50 bg-accent flex select-none items-center rounded-r-md border-l px-3 py-2'>
                  .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                </div>
              </div>

              <Label className='text-foreground/50 text-xs '>The subdomain of your workspace.</Label>
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex flex-row items-center justify-end gap-2'>
          <Button type='submit' disabled={name === '' || slug === ''}>
            Create First Workspace
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
