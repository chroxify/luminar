'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@feedbase/ui/components/alert';
import { Button } from '@feedbase/ui/components/button';
import { Label } from '@feedbase/ui/components/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@feedbase/ui/components/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@feedbase/ui/components/tabs';
import { Check, Copy, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco, nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { formatRootUrl } from '@/lib/utils';
import { CodeIcon } from '@/components/shared/icons/icons-animated';
import LottiePlayer from '@/components/shared/lottie-player';

export function ApiSheet({ workspaceSlug }: { workspaceSlug: string }) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const currentTheme = useTheme();

  const tabs = [
    {
      id: 'bash',
      name: 'cURL',
      content: `curl --request GET \\
  --url ${formatRootUrl('', `/api/v1/${workspaceSlug}/changelogs`)} \\
  --header 'Content-Type: application/json'`,
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      content: `const options = {method: 'GET'};

fetch('${formatRootUrl('', `/api/v1/${workspaceSlug}/changelogs`)}', options)
  .then(response => response.json())
  .then(data => console.log(data));`,
    },
    {
      id: 'python',
      name: 'Python',
      content: `import requests

url = '${formatRootUrl('', `/api/v1/${workspaceSlug}/changelogs`)}'
response = requests.get(url)
print(response.json())`,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
          className='flex items-center gap-2'>
          <LottiePlayer lottieSrc={CodeIcon} animate={isHover} className='-ml-[2px] h-5 w-5' />
          API
        </Button>
      </SheetTrigger>
      <SheetContent className='sm:max-w-md'>
        <SheetHeader className='pt-4'>
          <SheetTitle>Changelogs API</SheetTitle>
          <SheetDescription>
            Access your changelogs using our RESTful API. You can use this API to fetch your public changelogs
            and display them customly on your website or application.
          </SheetDescription>
        </SheetHeader>
        <div className='flex flex-col gap-4 pt-4'>
          {/* Endpoint */}
          <div className='flex flex-col gap-2'>
            <Label>Public Endpoint</Label>
            <div className='flex h-8 items-center justify-between rounded-md border p-2'>
              <span className='text-foreground text-sm'>
                {formatRootUrl('', `/api/v1/${workspaceSlug}/changelogs`)}
              </span>
              <Button
                variant='ghost'
                size='icon'
                className='group -mr-1 h-6 w-6 shrink-0 hover:bg-transparent'
                data-copied='false'
                onClick={(event) => {
                  // Copy content to clipboard
                  navigator.clipboard.writeText(formatRootUrl('', `/api/v1/${workspaceSlug}/changelogs`));

                  // Store currentTarget
                  const currentTarget = event.currentTarget;
                  currentTarget.setAttribute('data-copied', 'true');
                  setTimeout(() => {
                    // Ensure that currentTarget is not null
                    if (currentTarget) {
                      currentTarget.setAttribute('data-copied', 'false');
                    }
                  }, 1000);
                }}>
                <Copy className='text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors group-data-[copied=true]:hidden' />
                <Check className='h-4 w-4 text-green-500 group-data-[copied=false]:hidden' />
              </Button>
            </div>
          </div>

          {/* Usage */}
          <div className='flex flex-col gap-2 pt-4'>
            <Label>Usage</Label>
            <Tabs defaultValue={tabs[0].id} className='h-fit rounded-md border'>
              <TabsList className='w-full justify-between border-b px-2 py-2'>
                <div className='flex w-full items-center gap-2'>
                  {tabs.map((tab) => (
                    <TabsTrigger value={tab.id} key={tab.id} asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-foreground data-[state=active]:bg-accent hover:bg-accent'
                        id={tab.id}>
                        {tab.name}
                      </Button>
                    </TabsTrigger>
                  ))}
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='group h-7 w-7  shrink-0'
                  data-copied='false'
                  onClick={(event) => {
                    // Get active tab
                    const activeTab = tabs.find(
                      (tab) => tab.id === document.querySelector('[data-state="active"]')?.getAttribute('id')
                    );
                    if (!activeTab) {
                      return;
                    }

                    // Copy content to clipboard
                    navigator.clipboard.writeText(activeTab.content);

                    // Store currentTarget
                    const currentTarget = event.currentTarget;
                    currentTarget.setAttribute('data-copied', 'true');
                    setTimeout(() => {
                      // Ensure that currentTarget is not null
                      if (currentTarget) {
                        currentTarget.setAttribute('data-copied', 'false');
                      }
                    }, 1000);
                  }}>
                  <Copy className='text-muted-foreground h-4 w-4 group-data-[copied=true]:hidden' />
                  <Check className='h-4 w-4 text-green-500 group-data-[copied=false]:hidden' />
                </Button>
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent value={tab.id} key={tab.id}>
                  <SyntaxHighlighter
                    language={tab.id}
                    className='w-full overflow-auto !bg-transparent !px-4 !py-2 text-sm'
                    style={currentTheme.theme === 'dark' ? nightOwl : docco}>
                    {tab.content}
                  </SyntaxHighlighter>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className='flex flex-col gap-2 pt-4'>
            <Alert>
              <Info className='stroke-secondary-foreground -mt-[2px] h-5 w-5' />
              <AlertTitle>Admin API</AlertTitle>
              <AlertDescription>
                If you want to also manage your changelogs or view private changelogs, you can use the Admin
                API.
              </AlertDescription>

              <Link
                href={formatRootUrl('docs', '/api-reference/endpoint/changelog')}
                target='_blank'
                rel='noopener noreferrer'>
                <Button variant='link' className='mt-2 h-fit px-0'>
                  Learn more
                </Button>
              </Link>
            </Alert>
          </div>
        </div>
        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}
