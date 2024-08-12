import Link from 'next/link';
import { Button } from '@feedbase/ui/components/button';
import HomeFooter from '@/components/home/footer';

export default function Deploy() {
  return (
    <>
      <div className='flex h-full w-full flex-col items-center justify-center overflow-auto p-5 pt-32'>
        <h1 className='text-foreground gap-2 text-center text-4xl font-bold leading-tight'>
          Deploy Feedbase to Vercel
        </h1>
        <p className='text-foreground/60 mt-2 text-center  md:w-2/3'>
          You can deploy your own hosted instance of Feedbase to Vercel, for free, in just a few clicks.
        </p>

        {/* Steps */}
        <div className='mb-16 mt-20 flex w-full flex-col items-center justify-center'>
          {/* Supabase */}
          <div className='group relative flex w-full flex-col items-center gap-6 pb-16 md:gap-6 md:pb-24'>
            <span className='absolute top-4 h-full w-0.5 bg-gradient-to-b from-[#8F9EFF]/60 via-[#8F9EFF]/20 to-transparent' />
            <span className='bg-background relative z-10 flex h-8 w-8 select-none items-center justify-center rounded-full border border-[#8F9EFF]/80 text-sm text-[#8F9EFF]/80 shadow-lg shadow-[#8F9EFF]/50 transition-all group-hover:border-[#8F9EFF] group-hover:text-[#8F9EFF] group-hover:shadow-[#8F9EFF]/80'>
              1
            </span>

            <div className='z-10 flex w-full flex-col items-center justify-center gap-3'>
              <h1 className='text-foreground/80 group-hover:text-foreground select-none text-center text-2xl font-medium leading-tight transition-colors'>
                Create a Supabase project
              </h1>

              <p className='text-foreground/60 group-hover:text-foreground/70 select-none text-center text-sm  transition-colors md:w-2/4'>
                Supabase is an open source Firebase alternative. It provides a database, auth, and storage.
              </p>

              <Link href='https://supabase.com/dashboard/new/_' target='_blank' rel='noopener noreferrer'>
                <Button size='sm' className='border-background mt-3 border'>
                  Create a Supabase project
                </Button>
              </Link>
            </div>
          </div>

          {/* Migration */}
          <div className='md:gap8 group relative flex w-full flex-col items-center gap-6 pb-16 md:pb-24'>
            <span className='absolute top-4 h-full w-0.5 bg-gradient-to-b from-[#8F9EFF]/60 via-[#8F9EFF]/20 to-transparent' />
            <span className='bg-background relative z-10 flex h-8 w-8 select-none items-center justify-center rounded-full border border-[#8F9EFF]/80 text-sm text-[#8F9EFF]/80 shadow-lg shadow-[#8F9EFF]/50 transition-all group-hover:border-[#8F9EFF] group-hover:text-[#8F9EFF] group-hover:shadow-[#8F9EFF]/80'>
              2
            </span>

            <div className='z-10 flex w-full flex-col items-center justify-center gap-3'>
              <h1 className='text-foreground/80 group-hover:text-foreground select-none text-center text-2xl font-medium leading-tight transition-colors'>
                Fork the Supabase database
              </h1>

              <p className='text-foreground/60 group-hover:text-foreground/70 select-none text-center text-sm  transition-colors md:w-2/4'>
                Once you have your Supabase project, you can fork the Feedbase database schemas to your own
                project.
              </p>

              <Link
                href='https://supafork.com/new?repository_url=https://github.com/chroxify/feedbase'
                target='_blank'
                rel='noopener noreferrer'>
                <Button size='sm' className='border-background mt-3 border'>
                  Fork Supabase database
                </Button>
              </Link>
            </div>
          </div>

          {/* Environment Variables */}
          <div className='md:gap8 group relative flex w-full flex-col items-center gap-6 pb-16 md:pb-24'>
            <span className='absolute top-4 h-full w-0.5 bg-gradient-to-b from-[#8F9EFF]/60 via-[#8F9EFF]/20 to-transparent' />
            <span className='bg-background relative z-10 flex h-8 w-8 select-none items-center justify-center rounded-full border border-[#8F9EFF]/80 text-sm text-[#8F9EFF]/80 shadow-lg shadow-[#8F9EFF]/50 transition-all group-hover:border-[#8F9EFF] group-hover:text-[#8F9EFF] group-hover:shadow-[#8F9EFF]/80'>
              3
            </span>

            <div className='z-10 flex w-full flex-col items-center justify-center gap-3'>
              <h1 className='text-foreground/80 group-hover:text-foreground select-none text-center text-2xl font-medium leading-tight transition-colors'>
                Prepare your environment variables
              </h1>

              <p className='text-foreground/60 group-hover:text-foreground/70 select-none text-center text-sm  transition-colors md:w-2/4'>
                After setting up your Supabase project, check the example configuration to see where you can
                find the necessary environment variables.
              </p>

              <Link
                href='https://github.com/chroxify/feedbase/blob/main/.env.example'
                target='_blank'
                rel='noopener noreferrer'>
                <Button size='sm' className='border-background mt-3 border'>
                  View example configuration
                </Button>
              </Link>
            </div>
          </div>

          {/* Deploy */}
          <div className='md:gap8 group relative flex w-full flex-col items-center gap-6 pb-16 md:pb-24'>
            <span className='absolute top-4 h-full w-0.5 bg-gradient-to-b from-[#8F9EFF]/60 via-[#8F9EFF]/20 to-transparent' />
            <span className='bg-background relative z-10 flex h-8 w-8 select-none items-center justify-center rounded-full border border-[#8F9EFF]/80 text-sm text-[#8F9EFF]/80 shadow-lg shadow-[#8F9EFF]/50 transition-all group-hover:border-[#8F9EFF] group-hover:text-[#8F9EFF] group-hover:shadow-[#8F9EFF]/80'>
              4
            </span>

            <div className='group z-10 flex w-full flex-col items-center justify-center gap-3'>
              <h1 className='text-foreground/80 group-hover:text-foreground select-none text-center text-2xl font-medium leading-tight transition-colors'>
                Deploy to Vercel
              </h1>

              <p className='text-foreground/60 group-hover:text-foreground/70 select-none text-center text-sm  transition-colors md:w-2/4'>
                Once you have your environment variables, you can deploy to Vercel.
              </p>

              <Link href='/deploy-vercel' target='_blank' rel='noopener noreferrer'>
                <Button size='sm' className='border-background mt-3 border'>
                  Deploy to Vercel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <HomeFooter />
    </>
  );
}
