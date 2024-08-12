import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser, getUserWorkspaces } from '@/lib/api/user';
import { DASH_DOMAIN } from '@/lib/constants';
import { SidebarTabsProps } from '@/lib/types';
import DashboardHeader from '@/components/layout/header';
import NavbarMobile from '@/components/layout/nav-bar-mobile';
import Sidebar from '@/components/layout/sidebar';
import {
  AnalyticsIcon,
  CalendarIcon,
  FeedbackIcon,
  SettingsIcon,
  TagLabelIcon,
} from '@/components/shared/icons/icons-animated';

const tabs: SidebarTabsProps = {
  Modules: [
    {
      name: 'Changelog',
      icon: TagLabelIcon,
      slug: 'changelog',
    },
    {
      name: 'Feedback',
      icon: FeedbackIcon,
      slug: 'feedback',
    },
    {
      name: 'Roadmap',
      icon: CalendarIcon,
      slug: 'roadmap',
    },
  ],
  Insights: [
    {
      name: 'Analytics',
      icon: AnalyticsIcon,
      slug: 'analytics',
    },
  ],
  Workspace: [
    {
      name: 'Settings',
      icon: SettingsIcon,
      slug: 'settings/general',
    },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Headers
  const headerList = headers();
  const workspaceSlug = headerList.get('x-workspace');
  const pathname = headerList.get('x-pathname');

  // Fetch user
  const { data: user } = await getCurrentUser('server');

  if (!user) {
    return redirect(`${DASH_DOMAIN}/login`);
  }

  // Fetch the user's workspaces
  const { data: workspaces } = await getUserWorkspaces('server');

  // Check if the user has any workspaces
  if (!workspaces || workspaces.length === 0) {
    return redirect(`${DASH_DOMAIN}`);
  }

  // Get the workspace with the current slug
  const currentWorkspace = workspaces.find((workspace) => workspace.slug === workspaceSlug);

  // If currentWorkspace is undefined, redirect to the first workspace
  if (!currentWorkspace) {
    return redirect(`/${workspaces[0].slug}`);
  }

  // Retrieve the currently active tab
  const activeTab = Object.values(tabs)
    .flatMap((tabArray) => tabArray)
    .find((tab) => pathname?.includes(tab.slug));

  return (
    <main className='bg-root flex h-full min-h-screen w-full min-w-full flex-col items-center'>
      {/* Header with logo and hub button */}
      {/* BUG: Find a way to solve issue of scroll bar getting removed on avatar dialog open */}
      {/* https://github.com/radix-ui/primitives/discussions/1100 */}
      <DashboardHeader user={user} workspaces={workspaces} currentWorkspace={currentWorkspace} />

      {/* Sidebar */}
      <Sidebar tabs={tabs} initialTab={activeTab || tabs.Modules[0]} />

      {/* Main content */}
      <div className='absolute right-0 top-14 flex h-[calc(100%-3.5rem)] w-[calc(100%-240px)] flex-col items-start justify-start overflow-auto pb-20 md:pb-0'>
        {children}
      </div>

      {/* Navbar (mobile) */}
      <NavbarMobile
        tabs={tabs}
        initialTab={activeTab || tabs.Modules[0]}
        currentWorkspace={currentWorkspace}
      />
    </main>
  );
}
