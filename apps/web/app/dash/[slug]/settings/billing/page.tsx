import Link from 'next/link';
import { Button } from '@feedbase/ui/components/button';
import { Label } from '@feedbase/ui/components/label';
import { LucideExternalLink } from 'lucide-react';
import SettingsCard from '@/components/settings/settings-card';

export default function BillingSettings() {
  return (
    <SettingsCard title='Billing' description='Manage your billing information and subscription.'>
      <div className='bg-muted col-span-2 -mt-1 flex w-full items-center justify-between space-y-1 rounded-md p-4'>
        <div className='flex flex-col gap-1'>
          <Label className='text-secondary-foreground text-sm'>
            Current plan: <span className='text-foreground font-medium'>Starter</span>
          </Label>
          <Link
            href='/dashboard/settings/billing/plan'
            className='text-muted-foreground hover:text-foreground inline-flex items-center justify-start text-sm transition-colors hover:underline'>
            View plans
            <LucideExternalLink className='ml-1 inline-block h-4 w-4' />
          </Link>
        </div>
        <div className='flex gap-2'>
          <Button variant='default'>Change plan</Button>
          <Button variant='outline'>Get in touch</Button>
        </div>
      </div>
    </SettingsCard>
  );
}
