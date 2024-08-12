import { CheckCircle2, CircleDashed, CircleDot, CircleDotDashed, XCircle } from 'lucide-react';

export const DASH_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://dash.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    : 'http://dash.localhost:3000';

export const PROSE_CN =
  'prose prose-invert prose-zinc text-foreground/70  prose-headings:font-medium prose-headings:text-foreground/80 prose-strong:text-foreground/80 prose-strong:font-normal prose-code:text-foreground/70 prose-code: prose-code:font-monospace prose-blockquote:text-foreground/80 prose-blockquote:font-normal';

export const STATUS_OPTIONS = [
  {
    label: 'In Review',
    icon: CircleDashed,
  },
  {
    label: 'Planned',
    icon: CircleDotDashed,
  },
  {
    label: 'In Progress',
    icon: CircleDot,
  },
  {
    label: 'Completed',
    icon: CheckCircle2,
  },
  {
    label: 'Rejected',
    icon: XCircle,
  },
];
