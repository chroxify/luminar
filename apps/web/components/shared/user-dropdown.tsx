'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@feedbase/ui/components/dropdown-menu';
import { createBrowserClient } from '@supabase/ssr';
import { ProfileProps } from '@/lib/types';
import UpdateProfileModal from '../modals/edit-profile-modal';
import FeedbackModal from '../modals/send-feedback-modal';
import { ChatIcon, LogoutIcon, ProfileIcon } from './icons/icons-animated';
import LottiePlayer from './lottie-player';

export default function UserDropdown({
  user,
  rediretOnLogout,
  iconColor,
}: {
  user: ProfileProps['Row'];
  rediretOnLogout?: string;
  iconColor?: string | null;
}) {
  const [isHover, setIsHover] = useState<string>('');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  function handleLogout() {
    supabase.auth.signOut();

    // Redirect to login page
    window.location.href = rediretOnLogout || location.origin;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='h-8 w-8 border hover:cursor-pointer'>
          <AvatarImage src={user.avatar_url || ''} alt={user.full_name} />
          <AvatarFallback className='select-none text-sm '>{user.full_name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        {/* Profile */}
        <UpdateProfileModal user={user}>
          <DropdownMenuItem
            className='flex flex-row items-center justify-start gap-2 hover:cursor-pointer'
            onMouseEnter={() => {
              setIsHover('Profile');
            }}
            onMouseLeave={() => {
              setIsHover('');
            }}
            onSelect={(e) => {
              e.preventDefault();
            }}>
            <LottiePlayer
              lottieSrc={ProfileIcon}
              animate={isHover === 'Profile'}
              className='h-5 w-5'
              initialColor={iconColor || undefined}
              animationColor={iconColor || undefined}
            />

            <div className='text-foreground/[85%] pb-[2px]'>Profile</div>
          </DropdownMenuItem>
        </UpdateProfileModal>

        {/* Feedback */}
        <FeedbackModal workspaceSlug='hub'>
          <DropdownMenuItem
            className='flex flex-row items-center justify-start gap-2 hover:cursor-pointer'
            onMouseEnter={() => {
              setIsHover('Feedback');
            }}
            onMouseLeave={() => {
              setIsHover('');
            }}
            onSelect={(e) => {
              e.preventDefault();
            }}>
            <LottiePlayer
              lottieSrc={ChatIcon}
              animate={isHover === 'Feedback'}
              className='h-5 w-5'
              initialColor={iconColor || undefined}
              animationColor={iconColor || undefined}
            />

            <div className='text-foreground/[85%] pb-[2px]'>Feedback</div>
          </DropdownMenuItem>
        </FeedbackModal>

        {/* Logout */}
        <DropdownMenuItem
          className='flex flex-row items-center justify-start gap-2 hover:cursor-pointer'
          onMouseEnter={() => {
            setIsHover('Logout');
          }}
          onMouseLeave={() => {
            setIsHover('');
          }}
          onClick={handleLogout}>
          <LottiePlayer
            lottieSrc={LogoutIcon}
            animate={isHover === 'Logout'}
            className='h-5 w-5'
            initialColor={iconColor || undefined}
            animationColor={iconColor || undefined}
          />

          <div className='text-foreground/[85%] pb-[2px]'>Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
