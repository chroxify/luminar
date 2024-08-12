import { Label } from '@feedbase/ui/components/label';
import { Switch } from '@feedbase/ui/components/switch';
import SettingsCard from '@/components/settings/settings-card';

export default function FeedbackSettings() {
  return (
    <SettingsCard title='Roadmap' description='Customize your workspace roadmap.'>
      <div className='-mt-1 flex w-full flex-col space-y-1'>
        <Label className='text-foreground/70 text-sm '>Disable Roadmap</Label>
        <Switch />
        <Label className='text-muted-foreground text-xs'>
          This will disable the roadmap for your workspace.
        </Label>
      </div>
    </SettingsCard>
  );
}
