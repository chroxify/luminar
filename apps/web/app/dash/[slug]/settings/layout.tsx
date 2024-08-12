import {
  Blocks,
  Earth,
  GalleryVerticalEnd,
  KanbanSquare,
  RefreshCcw,
  SquareAsterisk,
  SwatchBook,
  Terminal,
  UsersRoundIcon,
  Wallet2,
  Webhook,
} from 'lucide-react';
import { SidebarTabsProps } from '@/lib/types';
import Sidebar from '@/components/layout/sidebar';

const tabs: SidebarTabsProps = {
  Workspace: [
    {
      name: 'Branding',
      customIcon: <SwatchBook className='h-4 w-4' />,
      slug: 'settings/general',
    },
    {
      name: 'Team Members',
      customIcon: <UsersRoundIcon className='h-4 w-4' />,
      slug: 'settings/team',
    },
    {
      name: 'Billing',
      customIcon: <Wallet2 className='h-4 w-4' />,
      slug: 'settings/billing',
    },
  ],
  Public: [
    {
      name: 'Domain',
      customIcon: <Earth className='h-4 w-4' />,
      slug: 'settings/domain',
    },
    {
      name: 'SSO',
      customIcon: <SquareAsterisk className='h-4 w-4' />,
      slug: 'settings/sso',
    },
  ],
  Modules: [
    {
      name: 'Feedback',
      customIcon: <GalleryVerticalEnd className='h-4 w-4' />,
      slug: 'settings/feedback',
    },
    {
      name: 'Roadmap',
      customIcon: <KanbanSquare className='h-4 w-4' />,
      slug: 'settings/roadmap',
    },
    {
      name: 'Changelog',
      customIcon: <RefreshCcw className='h-4 w-4' />,
      slug: 'settings/changelog',
    },
  ],
  Additional: [
    {
      name: 'API',
      customIcon: <Terminal className='h-4 w-4' />,
      slug: 'settings/api',
    },
    {
      name: 'Webhooks',
      customIcon: <Webhook className='h-4 w-4' />,
      slug: 'settings/webhooks',
    },
    {
      name: 'Integrations',
      customIcon: <Blocks className='h-4 w-4' />,
      slug: 'settings/integrations',
    },
  ],
};

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <main className='flex h-full w-full flex-col overflow-y-auto '>
      {/* Sidebar */}
      <Sidebar
        tabs={tabs}
        initialTab={tabs.Workspace[0]}
        subSidebar={{ backTo: `/${params.slug}/changelog`, label: 'Settings' }}
      />

      {/* Content */}
      <div className='flex h-full w-full flex-col items-center overflow-y-auto'>
        <div className='flex h-full w-full max-w-screen-lg flex-col [&>*:last-child]:border-b-0'>
          {children}
        </div>
      </div>
    </main>
  );
}
