'use client';

import { useState } from 'react';
import { Button } from '@feedbase/ui/components/button';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@feedbase/ui/components/responsive-dialog';
import Auth, { EmailSignIn, EmailSignUp, GitHub } from '../auth-modules';

export default function AuthModal({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const [authType, setAuthType] = useState<'sign-in' | 'sign-up'>('sign-in');

  return (
    <ResponsiveDialog open={disabled ? false : undefined}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>

      <ResponsiveDialogContent className='gap-5 p-6 sm:max-w-[350px]'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{authType === 'sign-in' ? 'Sign In' : 'Sign Up'}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <Auth>
          {authType === 'sign-in' ? (
            <EmailSignIn label='Sign in with Email' />
          ) : (
            <EmailSignUp label='Register with Email' />
          )}
          <Button
            onClick={() => {
              setAuthType(authType === 'sign-in' ? 'sign-up' : 'sign-in');
            }}
            variant='outline'
            className='-mt-3'>
            {authType === 'sign-in' ? 'Register with Email' : 'Sign in with Email'}
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='bg-root text-muted-foreground px-2'>Or continue with</span>
            </div>
          </div>
          <GitHub />
        </Auth>

        <span className='text-foreground/60 text-center text-xs'>
          We&apos;re using Feedbase to collect feedback and improve our product.
        </span>
        <ResponsiveDialogClose className='absolute' />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
