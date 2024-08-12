'use client';

import { createContext, useContext, useState } from 'react';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Icons } from './shared/icons/icons-static';

interface AuthContextValue {
  supabase: SupabaseClient;
  successRedirect?: string;
}

// Create a context to share state and dependencies
const AuthContext = createContext<AuthContextValue | null>(null);

// Utility component to consume the context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const Auth = ({ successRedirect, children }: { successRedirect?: string; children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Figure out issue with cookieOptions setting and set at root level instead of individually like rn
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const value = { isLoading, setIsLoading, supabase, successRedirect };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const EmailSignIn = ({ label = 'Continue with Email' }: { label?: string }) => {
  const [loading, setLoading] = useState(false);
  const { supabase, successRedirect } = useAuth();
  const [email, setEmail] = useState('');

  const handleMailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error('Please enter your email!');
      setLoading(false);
      return;
    }

    // Check if user exists
    const { data: user } = await supabase.from('profiles').select('*').eq('email', email).single();

    if (!user) {
      toast.error('No account found with this email address.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?successRedirect=${
          successRedirect || location.origin
        }`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Magic link has been sent to your email!');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleMailSignIn}>
      <div className='grid gap-3'>
        <div className='gap- grid gap-2'>
          <Label className='sr-only' htmlFor='email'>
            Email
          </Label>
          <Input
            id='email'
            placeholder='name@example.com'
            type='email'
            autoCapitalize='none'
            autoComplete='email'
            autoCorrect='off'
            disabled={loading}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
            }}
          />
        </div>
        <Button disabled={loading}>
          {loading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
          {label}
        </Button>
      </div>
    </form>
  );
};

const EmailSignUp = ({ label = 'Continue with Email' }: { label?: string }) => {
  const [loading, setLoading] = useState(false);
  const { supabase, successRedirect } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleMailSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!name) {
      toast.error('Please enter your name!');
      setLoading(false);
      return;
    } else if (!email) {
      toast.error('Please enter your email!');
      setLoading(false);
      return;
    }

    // Check if user exists
    const { data: user } = await supabase.from('profiles').select('*').eq('email', email).single();

    if (user) {
      toast.error('An account with this email address already exists.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?successRedirect=${
          successRedirect || location.origin
        }`,
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Magic link has been sent to your email!');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleMailSignUp}>
      <div className='grid gap-3'>
        <div className='gap- grid gap-2'>
          <Label className='sr-only' htmlFor='email'>
            Full Name
          </Label>
          <Input
            id='name'
            placeholder='Full Name'
            type='name'
            autoCapitalize='none'
            autoComplete='name'
            autoCorrect='off'
            disabled={loading}
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
          />
          <Label className='sr-only' htmlFor='email'>
            Email
          </Label>
          <Input
            id='email'
            placeholder='name@example.com'
            type='email'
            autoCapitalize='none'
            autoComplete='email'
            autoCorrect='off'
            disabled={loading}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
            }}
          />
        </div>
        <Button disabled={loading}>
          {loading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
          {label}
        </Button>
      </div>
    </form>
  );
};

const GitHub = () => {
  const [loading, setLoading] = useState(false);
  const { supabase, successRedirect } = useAuth();

  const handleGitHubSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback?successRedirect=${successRedirect || location.origin}`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <Button variant='outline' type='button' disabled={loading} onClick={handleGitHubSignIn}>
      {loading ? (
        <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <Icons.Github className='mr-2 h-4 w-4' />
      )}{' '}
      Github
    </Button>
  );
};

export default Auth;
export { GitHub, EmailSignUp, EmailSignIn };
