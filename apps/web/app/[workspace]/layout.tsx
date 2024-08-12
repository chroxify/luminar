import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Separator } from '@feedbase/ui/components/separator';
import { getWorkspaceBoards } from '@/lib/api/boards';
import { getWorkspaceModuleConfig } from '@/lib/api/module';
import { getWorkspaceTheme } from '@/lib/api/theme';
import { getCurrentUser } from '@/lib/api/user';
import { getWorkspaceBySlug } from '@/lib/api/workspace';
import Header from '@/components/layout/nav-bar';
import CustomThemeWrapper from '@/components/layout/theme-wrapper';
import { ThemeProvider as NextThemeProvider } from '@/components/theme-provider';

type Props = {
  children: React.ReactNode;
  params: { workspace: string };
  searchParams: Record<string, string | string[] | undefined>;
};

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get workspace
  const { data: workspace, error } = await getWorkspaceBySlug(params.workspace, 'server', true, false);

  // If workspace is undefined redirects to 404
  if (error?.status === 404 || !workspace) {
    notFound();
  }

  return {
    title: workspace.name,
    description: `Discover the latest updates, roadmaps, submit feedback, and explore more about ${workspace.name}.`,
    icons: workspace.icon,
    openGraph: {
      images: [
        {
          url: workspace.opengraph_image || '',
          width: 1200,
          height: 600,
          alt: workspace.name,
        },
      ],
    },
  };
}

const tabs: { name: string; link: string; items?: { name: string; link: string }[] }[] = [
  {
    name: 'Boards',
    link: '/',
    items: [],
  },
  {
    name: 'Roadmap',
    link: '/roadmap',
  },
  {
    name: 'Changelog',
    link: '/changelog',
  },
];

export default async function HubLayout({ children, params, searchParams }: Props) {
  const headerList = headers();
  const pathname = headerList.get('x-pathname');
  const hostname = headerList.get('host');

  // Get workspace data
  const { data: workspace, error } = await getWorkspaceBySlug(params.workspace, 'server', true, false);

  if (error?.status === 404 || !workspace) {
    notFound();
  }

  // Get workspace boards
  const { data: boards, error: boardsError } = await getWorkspaceBoards(
    params.workspace,
    'server',
    true,
    false
  );

  if (boardsError || !boards) {
    notFound();
  }

  // Set workspace boards to tabs
  tabs[0].items = boards.map((board) => ({
    name: board.name,
    link: `/board/${board.name.toLowerCase().replace(/\s+/g, '-')}`,
  }));

  // Get workspace config
  const { data: config } = await getWorkspaceModuleConfig(params.workspace, 'server', true, false);

  // Get workspace theme
  const { data: workspaceTheme } = await getWorkspaceTheme(params.workspace, 'server', true, false);

  if (!config || !workspaceTheme) {
    notFound();
  }

  // Get current user
  const { data: user } = await getCurrentUser('server');

  // Check if custom domain is set and redirect to it
  if (workspace.custom_domain && workspace.custom_domain_verified && hostname !== workspace.custom_domain) {
    // Validate redirect rules
    switch (workspace.custom_domain_redirect) {
      case 'root_redirect':
        return redirect(`https://${workspace.custom_domain}`);
      case 'direct_redirect':
        return redirect(`https://${workspace.custom_domain}${pathname}`);
      case 'no_redirect':
        break;
    }
  }

  // Get current tab
  const currentTab = tabs.find((tab) => {
    if (tab.link === pathname) {
      return true;
    }
    if (tab.items) {
      const subItem = tab.items.find((item) => item.link === pathname);
      if (subItem) {
        // Return the subitem directly
        return subItem;
      }
    }
    return false;
  });

  // Extract subItem if found, otherwise use the main tab
  const foundItem = currentTab?.items?.find((item) => item.link === pathname) || currentTab;

  // Check if any modules are disabled and remove them from the tabs
  if (!config.changelog_enabled) {
    tabs.splice(1, 1);
  }

  return (
    // <CustomThemeWrapper >
    <div className='flex h-full w-full flex-col items-center'>
      {/* Header */}
      <Header
        tabs={tabs}
        intialTab={foundItem || tabs[0]}
        workspace={workspace}
        user={user}
        workspaceTheme={workspaceTheme}
      />

      {/* Main content */}
      <div className='flex h-full w-full flex-col items-start justify-start py-8 pt-[5.5rem] lg:max-w-screen-xl'>
        {children}
      </div>
    </div>
  );
}
