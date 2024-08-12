import { Input } from '@feedbase/ui/components/input';
import { Label } from '@feedbase/ui/components/label';
import SettingsCard from '@/components/settings/settings-card';

export default function FeedbackSettings() {
  return (
    <SettingsCard title='Boards' description='Manage your feedback boards.'>
      <div className='-mt-1 w-full space-y-1'>
        <Label className='text-foreground/70 text-sm '>Name</Label>
        <Input className='w-full' />
        <Label className='text-muted-foreground text-xs'>This is the name of your feedback board.</Label>
      </div>
    </SettingsCard>
  );
}
