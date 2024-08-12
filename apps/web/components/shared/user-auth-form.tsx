'use client';

import Auth, { EmailSignIn, EmailSignUp, GitHub } from '../auth-modules';

export function UserAuthForm({
  authType,
  successRedirect,
}: {
  authType: 'sign-in' | 'sign-up';
  successRedirect?: string;
}) {
  return (
    <Auth successRedirect={successRedirect}>
      <div className='grid gap-4'>
        {authType === 'sign-in' ? <EmailSignIn /> : <EmailSignUp />}
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs'>
            <span className='bg-root text-muted-foreground px-2'>Or continue with</span>
          </div>
        </div>
        <GitHub />
      </div>
    </Auth>
  );
}
