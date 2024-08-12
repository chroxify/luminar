import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@feedbase/ui/components/card';
import { createServerClient } from '@supabase/ssr';
import { UserAuthForm } from '@/components/shared/user-auth-form';

export const metadata: Metadata = {
  title: 'Sign up to Feedbase',
  description: 'Sign up for a new Feedbase account.',
};

export default async function SignUp() {
  // Create a Supabase client configured to use cookies
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Retrieve possible session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If there is a session, redirect to workspaces
  if (user) {
    redirect('/');
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className='w-full max-w-md p-5 sm:p-6'>
        <CardHeader className='flex flex-col items-center space-y-2'>
          <CardTitle>Sign up</CardTitle>
          <CardDescription className='text-center'>
            Sign up with your email address to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className='px-2'>
          <UserAuthForm authType='sign-up' />
        </CardContent>
        <CardFooter className='flex flex-col items-center'>
          <CardDescription className='text-center'>
            Already have an account?{' '}
            <Link href='/login' className='font-medium hover:underline'>
              Sign In
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
