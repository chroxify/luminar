'use client';

import { useState } from 'react';
import { Badge } from '@feedbase/ui/components/badge';
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
import { cn } from '@feedbase/ui/lib/utils';
import { ChevronUp } from 'lucide-react';
import { WorkspaceThemeProps } from '@/lib/types';
import { hexToHSL, hslToHex } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';

// Helper component
function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className='bg-background focus-within:ring-ring ring-offset-root flex h-8 w-full rounded-md border text-sm  transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
      <div
        className={cn(
          'text-foreground/50 bg-accent flex select-none items-center justify-center rounded-l-md border-r',
          value === '' ? 'px-3' : 'px-2'
        )}>
        {value === '' ? '#' : <div className='h-3 w-3 rounded-sm' style={{ backgroundColor: value }} />}
      </div>
      <Input
        className='text-foreground/80 h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
        placeholder='000000'
        value={value}
        onChange={(e) => {
          // Cap length at 7
          if (e.target.value.length > 7) return;

          onChange(e);
        }}
      />
    </div>
  );
}

export default function CustomizeThemeModal({
  children,
  workspaceTheme,
  setWorkspaceTheme,
}: {
  children: React.ReactNode;
  workspaceTheme: WorkspaceThemeProps['Row'];
  setWorkspaceTheme: React.Dispatch<React.SetStateAction<WorkspaceThemeProps['Row']>>;
}) {
  const [colorScheme, setColorScheme] = useState<WorkspaceThemeProps['Row']>(workspaceTheme);

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:max-w-lg'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className='flex flex-row items-center gap-2'>
            Customize Theme{' '}
            <Badge variant='secondary' className='border-border rounded-md border '>
              Experimental
            </Badge>
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>Create your own color theme.</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className='grid w-full grid-cols-2 gap-4'>
          {/* Root */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Background Color</Label>
            </div>

            <ColorInput
              value={colorScheme.root || ''}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, root: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, root: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs '>Root background of page</Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Foreground Color</Label>
            </div>

            <ColorInput
              value={colorScheme.foreground || ''}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, foreground: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, foreground: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs '>Primary text color</Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Primary Color</Label>
            </div>

            <ColorInput
              value={colorScheme.background || ''}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, background: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, background: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs '>Primary background (buttons, etc.)</Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Secondary Color</Label>
            </div>

            <ColorInput
              value={colorScheme.secondary_background || ''}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, secondary_background: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, secondary_background: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs '>Secondary background (buttons, etc.)</Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Accent Color</Label>
            </div>

            <ColorInput
              value={colorScheme.accent || ''}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, accent: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, accent: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs '>Accent color (links, selection, etc.)</Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Border Color</Label>
            </div>

            <ColorInput
              value={colorScheme.border || ''}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, border: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, border: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs '>Border color for elements</Label>
          </div>
        </div>

        {/* Preview Example */}
        <div className='mt-4 flex flex-col gap-4'>
          <div className='flex flex-row items-center gap-2'>
            <Label>Preview</Label>
          </div>

          {/* Small wireframe replica of website with color scheme */}
          <div
            className='flex h-96 w-full flex-col gap-4 overflow-y-hidden rounded-md border'
            style={{ backgroundColor: colorScheme.root || '', textDecorationStyle: 'solid' }}>
            {/* Header */}
            <div
              className='flex flex-row items-center justify-between border-b p-4'
              style={{ borderColor: colorScheme.border || '' }}>
              <Icons.LogoText
                className='fill-foreground h-6 w-20'
                style={{ fill: colorScheme.foreground || '' }}
              />
              <div
                className='flex h-5 w-12 items-center justify-center rounded-md bg-white text-[10px]'
                style={{
                  backgroundColor: colorScheme.background || '',
                  color: colorScheme.foreground || '',
                }}>
                Login
              </div>
            </div>

            {/* Body */}
            <div className='flex flex-col gap-4 px-4'>
              <div className='w-full border-b px-2 pb-4' style={{ borderColor: colorScheme.border || '' }}>
                <p className='text-sm ' style={{ color: colorScheme.foreground || '' }}>
                  Feedback
                </p>
                <p
                  className='text-foreground text-xs '
                  style={{ color: colorScheme.foreground || '', opacity: 0.5 }}>
                  Have a suggestion or found a bug? Let us know!
                </p>
              </div>

              <div className='flex w-full justify-between gap-1'>
                <div className='flex gap-1'>
                  <div
                    className='flex h-5 w-10 items-center justify-center rounded-md border bg-white text-[10px]'
                    style={{
                      backgroundColor: colorScheme.secondary_background || '',
                      borderColor: colorScheme.border || '',
                      color: colorScheme.foreground || '',
                    }}>
                    New
                  </div>
                  <div
                    className='flex h-5 w-10 items-center justify-center rounded-md border bg-white text-[10px]'
                    style={{
                      backgroundColor: colorScheme.secondary_background || '',
                      borderColor: colorScheme.border || '',
                      color: colorScheme.foreground || '',
                    }}>
                    Top
                  </div>
                </div>

                <div className='flex gap-1'>
                  <div
                    className='flex h-5 w-20 items-center justify-start rounded-md border bg-white pl-1.5 text-[10px]'
                    style={{
                      backgroundColor: colorScheme.secondary_background || '',
                      borderColor: colorScheme.border || '',
                      color: colorScheme.foreground || '',
                    }}>
                    Search
                  </div>
                  <div
                    className='flex h-5 w-10 items-center justify-center rounded-md border bg-white text-[10px]'
                    style={{
                      backgroundColor: colorScheme.secondary_background || '',
                      borderColor: colorScheme.border || '',
                      color: colorScheme.foreground || '',
                    }}>
                    Post
                  </div>
                </div>
              </div>

              {[...Array(4)].map((_, i) => (
                <div
                  className='flex w-full rounded-md border'
                  key={`feedback-${i}`} // eslint-disable-line react/no-array-index-key
                  style={{ borderColor: colorScheme.border || '' }}>
                  <div
                    className='flex h-full w-6 items-center justify-center border-r'
                    style={{ borderColor: colorScheme.border || '' }}>
                    <ChevronUp
                      className='text-foreground/50 h-4 w-4'
                      style={{ color: colorScheme.foreground || '' }}
                    />
                  </div>

                  <div className='flex flex-col p-1'>
                    <p
                      className='text-foreground/80 text-[11px] '
                      style={{ color: colorScheme.foreground || '' }}>
                      Demo Feedback Idea
                    </p>
                    <p
                      className='text-foreground text-[10px] '
                      style={{ color: colorScheme.foreground || '', opacity: 0.6 }}>
                      This is a demo feedback message to test theming.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose>
            <Button variant='outline'>Cancel</Button>
          </ResponsiveDialogClose>
          <ResponsiveDialogClose>
            <Button
              type='submit'
              disabled={Object.values(colorScheme).some((prop) => prop?.length ?? 0 < 4)}
              onClick={() => {
                // Update workspace config
                setWorkspaceTheme((prev) => ({
                  ...prev,
                  theme: 'custom',
                  root: hexToHSL(colorScheme.root) || '',
                  background: hexToHSL(colorScheme.background) || '',
                  secondary_background: hexToHSL(colorScheme.secondary_background) || '',
                  foreground: hexToHSL(colorScheme.foreground) || '',
                  accent: hexToHSL(colorScheme.accent) || '',
                  border: hexToHSL(colorScheme.border) || '',
                }));
              }}>
              Set theme
            </Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
