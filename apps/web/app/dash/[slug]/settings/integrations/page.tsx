import { Avatar, AvatarFallback, AvatarImage } from '@feedbase/ui/components/avatar';
import FeedbackModal from '@/components/modals/send-feedback-modal';
import SettingsCard from '@/components/settings/settings-card';

function IntegrationCard({
  title,
  description,
  image,
  alt,
  onClick,
}: {
  title: string;
  description: string;
  image: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <button
      className='bg-secondary col-span-1 -mt-1 flex w-full flex-row items-center gap-3 rounded-lg p-3'
      type='button'
      onClick={onClick}>
      {/* Avatar */}
      <Avatar className='rounded-md'>
        <AvatarImage src={image} alt={alt} />
        <AvatarFallback>{alt}</AvatarFallback>
      </Avatar>

      {/* Name and Description */}
      <div className='flex h-full flex-col items-start justify-center'>
        <span className='text-secondary-foreground text-sm'>{title}</span>

        <span className='text-muted-foreground text-xs'>{description}</span>
      </div>
    </button>
  );
}

export default function IntegrationSettings({ params }: { params: { slug: string } }) {
  return (
    <SettingsCard title='Integrations' description='Manage your integrations.'>
      <IntegrationCard
        title='Discord'
        description='Receive notification directly in your Discord server.'
        image='data:image/jpeg;base64,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'
        alt='D'
      />

      <IntegrationCard
        title='Slack'
        description='Receive notification directly in your Slack workspace.'
        image='https://svgl.app/library/slack.svg'
        alt='S'
      />

      <IntegrationCard
        title='Github'
        description='Automate Changelogs, Roadmaps and more with Github.'
        image='https://github.com/github.png'
        alt='G'
      />

      <IntegrationCard
        title='Linear'
        description='Connect Roadmap, Changelogs, Issues and more.'
        image='https://github.com/linear.png'
        alt='L'
      />

      <span className='text-muted-foreground col-span-2 w-full text-center text-sm'>
        More integrations coming soon! If you have a specific integration you would like to see,{' '}
        <FeedbackModal workspaceSlug={params.slug}>
          <button type='button' className='text-secondary-foreground hover:underline'>
            let us know
          </button>
        </FeedbackModal>
        !
      </span>
    </SettingsCard>
  );
}
