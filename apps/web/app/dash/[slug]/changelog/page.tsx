import { Button } from '@feedbase/ui/components/button';
import { Separator } from '@feedbase/ui/components/separator';
import { Plus } from 'lucide-react';
import { ApiSheet } from '@/components/changelog/api-sheet';
import ChangelogList from '@/components/changelog/changelog-list';
import { AddChangelogModal } from '@/components/modals/add-edit-changelog-modal';

export default function Changelog({ params }: { params: { slug: string } }) {
  return (
    <div className='flex h-full w-full flex-col'>
      {/* Header */}
      <div className='flex h-[52px] w-full flex-row items-center justify-between px-5 pt-5'>
        <h2 className='text-2xl font-medium'>Changelogs</h2>

        <div className='flex items-center gap-3'>
          {/* Api Docs Button */}
          <ApiSheet workspaceSlug={params.slug} />

          {/* Seperator Line */}
          <Separator orientation='vertical' className='h-6' />

          {/* Create new Button */}
          <AddChangelogModal workspaceSlug={params.slug}>
            <Button variant='default' className='flex items-center gap-1'>
              <Plus className='-ml-[2px] inline-flex h-[18px] w-[18px]' />
              New Changelog
            </Button>
          </AddChangelogModal>
        </div>
      </div>

      {/* Changelogs */}
      <ChangelogList workspaceSlug={params.slug} />
    </div>
  );
}
