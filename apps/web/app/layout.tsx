import './globals.css';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { cn } from '@feedbase/ui/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'sonner';
import { formatRootUrl } from '@/lib/utils';
import { ThemeProvider as NextThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Feedbase',
  description: 'Collect feedback & communicate product updates with ease.',
  metadataBase: new URL(formatRootUrl()),
  openGraph: {
    images: [
      {
        url: '/og-image.png',
      },
    ],
  },
  // PWA
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/favicon.ico',
    },
  ],
};

export const viewport: Viewport = {
  // Prevents auto-zoom on mobile for input fields
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#06060A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='feedbase-hub'>
        {process.env.NODE_ENV === 'production' && (
          <Script
            defer
            src='https://eu.umami.is/script.js'
            data-website-id='3b6e5bd9-a7f1-41fe-9486-740daf1adaee'
          />
        )}
        <SpeedInsights />
        <Toaster closeButton />
        <NextThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <main className={cn('bg-root flex min-h-screen w-full flex-col items-center', GeistSans.className)}>
            {children}
          </main>
        </NextThemeProvider>
      </body>
    </html>
  );
}
