'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
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
import { RadioGroup, RadioGroupItem } from '@feedbase/ui/components/radio-group';
import { cn } from '@feedbase/ui/lib/utils';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import BentoCardWrapper from '@/components/home/spotlight-card';
import { Icons } from '../shared/icons/icons-static';

export default function DashboardSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [requested, setRequested] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mail, setMail] = useState('');
  const [logo, setLogo] = useState({
    url: '',
    radius: '',
  });
  const [colorScheme, setColorScheme] = useState({
    primary: '',
    accent: '',
  });
  const [lastChanges, setLastChanges] = useState({
    logo,
    colorScheme,
  });

  const onChangePicture = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogo((prev) => ({ ...prev, url: e.target!.result as string }));
        };
        reader.readAsDataURL(file);
      }
    },
    [setLogo]
  );

  return (
    <div className='flex h-full w-full flex-col items-center justify-start gap-2'>
      <span className='select-none bg-gradient-to-t from-[#c7d2fe] to-[#8678f9] bg-clip-text text-lg text-transparent sm:text-xl'>
        Manage & Customize
      </span>

      {/* TODO: Fidn fuckign better heading and desc and go over all texts */}
      <h1 className='text-foreground gap-2 text-center text-3xl font-medium leading-tight sm:text-4xl'>
        Have full control from a single dashboard
      </h1>

      <p className='text-foreground/60 mt-2 w-[800px] max-w-full text-center text-sm  sm:text-base'>
        Enhance your workflow from a centralized dashboard - analyze feedback, prepare updates, respond to
        user inquiries, and more!
      </p>

      {/* Bento  */}
      <div className='mt-10 flex w-full flex-col items-center justify-center gap-5 xl:flex-row'>
        <div className='flex w-full flex-col items-center justify-center gap-5 md:flex-row xl:w-fit'>
          {/* Customization */}
          <BentoCardWrapper className='h-[295px] w-full min-w-[350px]'>
            <div className='p-7'>
              <h1 className='text-lg font-medium text-white'>Fully customizable</h1>
              <p className='mt-2 text-sm  text-white/60'>
                Customize your hub to reflect your brand&apos;s unique identity and style.
              </p>

              {/* Workspace Logo */}
              <div className='mt-2 flex h-full w-full flex-row items-center justify-between'>
                <div className='space-y-1'>
                  <Label className='text-foreground/70 text-sm '>Logo</Label>

                  {/* File Upload */}
                  <div className='group flex h-[65px] w-[65px] items-center justify-center transition-all'>
                    <label
                      htmlFor='dropzone-file'
                      className={cn(
                        'bg-background hover:bg-background/90 group-hover:bg-background/90 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border',
                        logo.radius
                      )}>
                      <p className='absolute hidden text-xs text-gray-500 group-hover:block group-hover:transition-all group-hover:duration-300 dark:text-gray-400'>
                        Upload
                      </p>

                      {logo.url ? (
                        <Image
                          src={logo.url}
                          alt='Preview'
                          width={45}
                          height={45}
                          className={cn(
                            'h-full w-full rounded-md object-cover group-hover:opacity-0',
                            logo.radius
                          )}
                        />
                      ) : (
                        <p className='absolute text-xs text-gray-500 group-hover:hidden dark:text-gray-400'>
                          Upload
                        </p>
                      )}
                      <input id='dropzone-file' type='file' className='hidden' onChange={onChangePicture} />
                    </label>
                  </div>
                </div>

                {/* Logo Radius */}
                <div className='space-y-1 pt-1'>
                  <Label className='text-foreground/70 text-sm '>Logo Radius</Label>

                  <RadioGroup
                    defaultValue='rounded-md'
                    className='flex flex-col gap-1'
                    onValueChange={(value) => {
                      setLogo((prev) => ({ ...prev, radius: value }));
                    }}>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='rounded-none' id='square' className='h-[14px] w-[14px]' />
                      <Label htmlFor='square'>Square</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='rounded-md' id='rounded' className='h-[14px] w-[14px]' />
                      <Label htmlFor='rounded'>Rounded</Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='rounded-full' id='circle' className='h-[14px] w-[14px]' />
                      <Label htmlFor='circle'>Circle</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Color */}
                <div className='space-y-1 pt-1'>
                  <Label className='text-foreground/70 text-sm '>Theme</Label>

                  <div className='bg-background focus-within:ring-ring ring-offset-root flex h-8 w-full max-w-[125px] rounded-md border text-sm font-light transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
                    <div
                      className={cn(
                        'text-foreground/50 bg-accent flex select-none items-center justify-center rounded-l-md border-r',
                        colorScheme.primary === '' ? 'px-3' : 'px-2'
                      )}>
                      {colorScheme.primary === '' ? (
                        '#'
                      ) : (
                        <div
                          className='h-3 w-3 rounded-sm'
                          style={{ backgroundColor: colorScheme.primary }}
                        />
                      )}
                    </div>
                    <Input
                      className='text-foreground/80 h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                      placeholder='primary'
                      value={colorScheme.primary}
                      onChange={(e) => {
                        // Cap length at 7
                        if (e.target.value.length > 7) return;

                        // if first character is not #, add it
                        if (!e.target.value.startsWith('#')) {
                          setColorScheme((prev) => ({ ...prev, primary: `#${e.target.value}` }));
                          return;
                        }

                        setColorScheme((prev) => ({ ...prev, primary: e.target.value }));
                      }}
                    />
                  </div>
                  <div className='bg-background focus-within:ring-ring ring-offset-root flex h-8 w-full max-w-[125px] rounded-md border text-sm font-light transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
                    <div
                      className={cn(
                        'text-foreground/50 bg-accent flex select-none items-center justify-center rounded-l-md border-r',
                        colorScheme.accent === '' ? 'px-3' : 'px-2'
                      )}>
                      {colorScheme.accent === '' ? (
                        '#'
                      ) : (
                        <div className='h-3 w-3 rounded-sm' style={{ backgroundColor: colorScheme.accent }} />
                      )}
                    </div>
                    <Input
                      className='text-foreground/80 h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                      placeholder='accent'
                      value={colorScheme.accent}
                      onChange={(e) => {
                        // Cap length at 7
                        if (e.target.value.length > 7) return;

                        // if first character is not #, add it
                        if (!e.target.value.startsWith('#')) {
                          setColorScheme((prev) => ({ ...prev, accent: `#${e.target.value}` }));
                          return;
                        }

                        setColorScheme((prev) => ({ ...prev, accent: e.target.value }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <Button
                className='mt-4 h-8'
                disabled={
                  ((logo.url === '' || logo.radius === '') &&
                    colorScheme.accent.length < 4 &&
                    colorScheme.accent !== '') ||
                  (colorScheme.primary.length < 4 && colorScheme.primary !== '') ||
                  (lastChanges.logo === logo && lastChanges.colorScheme === colorScheme)
                }
                onClick={() => {
                  toast.promise(
                    new Promise<void>((resolve) => {
                      setTimeout(() => {
                        resolve();
                      }, 1750);
                    }),
                    {
                      loading: 'Saving changes...',
                      success: () => {
                        setLastChanges({
                          logo,
                          colorScheme,
                        });
                        return 'Changes saved!';
                      },
                      error: 'Failed to save.',
                    }
                  );
                }}>
                Save Changes
              </Button>
            </div>
          </BentoCardWrapper>

          {/* Teams */}
          <BentoCardWrapper className='h-[295px] w-full min-w-[350px]'>
            <div className='h-full w-full p-7'>
              <h1 className='text-lg font-medium text-white'>Teams</h1>
              <p className='mt-2 text-sm  text-white/60'>
                Invite your team members for seamless collaborative hub management.
              </p>

              <div className='mt-3 space-y-1'>
                <Label className='text-foreground/70 text-sm '>Email</Label>
                <Input
                  className=''
                  placeholder='Email'
                  value={mail}
                  onChange={(e) => {
                    setMail(e.target.value);
                  }}
                />
                <Label className='text-foreground/50 text-xs font-light'>
                  Your team member&apos;s email address.
                </Label>
              </div>

              <div className='mt-5 flex  items-center'>
                <Button
                  className='h-8'
                  disabled={mail === ''}
                  onClick={() => {
                    // Check if email is valid with regex
                    const regex = /\S+@\S+\.\S+/;
                    const isValid = regex.test(mail);

                    if (!isValid) {
                      toast.error('Please enter a valid email address.');
                      return;
                    }

                    toast.promise(
                      new Promise<void>((resolve) => {
                        setTimeout(() => {
                          resolve();
                        }, 1750);
                      }),
                      {
                        loading: 'Sending invitation...',
                        success: () => {
                          setMail('');
                          return 'Invitation sent!';
                        },
                        error: 'Failed to send invitation.',
                      }
                    );
                  }}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </BentoCardWrapper>
        </div>

        {/* Integrations */}
        <BentoCardWrapper className='h-full min-h-[295px] w-full min-w-[350px] xl:w-1/3'>
          <div className='p-7'>
            <h1 className='text-lg font-medium text-white'>Integrations</h1>
            <p className='mt-2 text-sm  text-white/60'>
              Connect your favorite tools for maximum productivity.
            </p>

            <div className='col-span-2 mt-5 flex h-full w-full flex-row items-center justify-between rounded-md border p-4 sm:col-span-1'>
              <div className='flex flex-row items-center space-x-2'>
                {/* Avatar */}
                <Avatar className='rounded-md'>
                  <AvatarImage src='https://github.com/linear.png' alt='github' />
                  <AvatarFallback>LN</AvatarFallback>
                </Avatar>

                {/* Name and Description */}
                <div className='flex flex-col'>
                  <span className='text-foreground/70 text-sm'>Linear</span>

                  <span className={cn('text-foreground/50 text-xs ', connected && 'text-green-500')}>
                    {connected ? 'Connected' : 'Issue Tracking'}
                  </span>
                </div>
              </div>

              <Button
                variant='outline'
                className={cn('text-foreground/70 h-9 font-normal', connected && 'hidden')}
                onClick={() => {
                  setIsLoading(true);

                  setTimeout(() => {
                    setIsLoading(false);
                    setConnected(true);
                  }, 2000);
                }}
                disabled={isLoading || connected}>
                {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
                Connect
              </Button>

              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild className={cn(!connected && 'hidden')}>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-foreground/50 hover:text-foreground h-8 w-5'>
                    <MoreVertical className='h-5 w-5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={cn('justify-between', !connected && 'hidden')} align='end'>
                  <DropdownMenuItem
                    className='text-destructive focus:text-destructive/90'
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsLoading(true);

                      setTimeout(() => {
                        setIsLoading(false);
                        setConnected(false);
                        setMenuOpen(false);
                      }, 1000);
                    }}
                    disabled={isLoading || !connected}>
                    {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className='col-span-2 mt-3 flex h-full w-full flex-row items-center justify-between rounded-md border p-4 sm:col-span-1'>
              <div className='flex flex-row items-center space-x-2'>
                {/* Avatar */}
                <Avatar className='rounded-md'>
                  <AvatarImage src='https://avatars.githubusercontent.com/u/9919?s=200&v=3' alt='github' />
                  <AvatarFallback>GH</AvatarFallback>
                </Avatar>

                {/* Name and Description */}
                <div className='flex flex-col'>
                  <span className='text-foreground/70 text-sm'>GitHub</span>

                  <span className='text-foreground/50 text-xs '>Version Control</span>
                </div>
              </div>

              <Button
                variant='outline'
                className='text-foreground/70 h-9 font-normal disabled:font-normal'
                onClick={() => {
                  setRequested(true);
                }}
                disabled={requested}>
                {requested ? 'Requested' : 'Request'}
              </Button>
            </div>
          </div>
        </BentoCardWrapper>
      </div>
    </div>
  );
}
