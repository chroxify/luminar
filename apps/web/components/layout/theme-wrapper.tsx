'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { createStyleRegistry, StyleRegistry } from 'styled-jsx';
import { WorkspaceThemeProps } from '@/lib/types';

export default function CustomThemeWrapper({
  children,
  workspaceTheme,
}: {
  children: React.ReactNode;
  workspaceTheme: WorkspaceThemeProps['Row'];
}) {
  // eslint-disable-next-line react/hook-use-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <div className='h-full w-full'>{styles}</div>;
  });

  return (
    <StyleRegistry registry={jsxStyleRegistry}>
      <main className='feedbase-hub bg-root flex min-h-screen min-w-full flex-col justify-between'>
        {workspaceTheme.theme === 'custom' && (
          <style jsx global>{`
            .feedbase-hub {
              --root-background: ${workspaceTheme.root};

              --background: ${workspaceTheme.secondary_background};
              --foreground: ${workspaceTheme.foreground};

              --popover: ${workspaceTheme.root};
              --card: ${workspaceTheme.root};

              --primary: ${workspaceTheme.background};
              --primary-foreground: ${workspaceTheme.root};

              --secondary: ${workspaceTheme.secondary_background};

              --accent: ${workspaceTheme.secondary_background} / 0.3;

              --muted: ${workspaceTheme.secondary_background} / 0.5;

              --highlight: ${workspaceTheme.accent};

              --ring: ${workspaceTheme.accent} / 0.3;
              --border: ${workspaceTheme.border};
              --input: ${workspaceTheme.border};
            }
          `}</style>
        )}
        {children}
      </main>
    </StyleRegistry>
  );
}
