'use client';

import { usePathname } from 'next/navigation';

interface TitleProviderProps {
  tabs: {
    name: string;
    icon: any;
    slug: string;
  }[];
  initialTitle: string;
  className?: string;
}

export default function TitleProvider({ tabs, initialTitle, className }: TitleProviderProps) {
  const pathname = usePathname();

  const currentTitle = tabs.find((tab) => pathname?.includes(tab.slug))?.name;

  return <div className={className}>{currentTitle || initialTitle}</div>;
}
