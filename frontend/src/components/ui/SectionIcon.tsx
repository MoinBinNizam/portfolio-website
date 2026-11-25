import type { ReactNode } from 'react';

export type IconName =
  | 'user'
  | 'briefcase'
  | 'code'
  | 'layers'
  | 'graduation'
  | 'award'
  | 'shield'
  | 'cpu'
  | 'zap'
  | 'quote'
  | 'book'
  | 'mail'
  | 'download'
  | 'shopping-cart'
  | 'boxes'
  | 'receipt'
  | 'megaphone'
  | 'share-2';

const ICONS: Record<IconName, ReactNode> = {
  user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  briefcase: (
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
  ),
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  layers: <path d="m12 2 10 5-10 5L2 7l10-5Zm0 10 10 5-10 5-10-5 10-5Z" />,
  graduation: <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5Zm4 2v5c3 2 9 2 12 0v-5" />,
  award: <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-3.8-.9L7 22l5-3 5 3-1.2-7.9" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  cpu: (
    <path d="M9 9h6v6H9V9Zm-5 1h2m-2 4h2m12-4h2m-2 4h2M10 4v2m4-2v2m-4 12v2m4-2v2M6 6h12v12H6V6Z" />
  ),
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />,
  quote: (
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21Zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3Z" />
  ),
  book: <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />,
  mail: (
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm18 2-10 7L2 6" />
  ),
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  'shopping-cart': (
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0" />
  ),
  boxes: (
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
  ),
  receipt: (
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Zm4 6h8M8 12h8M8 16h5" />
  ),
  megaphone: <path d="m3 11 18-5v12L3 13v-2Zm8 2v6a2 2 0 0 1-4 0v-5" />,
  'share-2': (
    <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.59 13.51l6.83 3.98m-.01-10.98-6.82 3.98" />
  ),
};

export function SectionIcon({
  name,
  className = 'h-4 w-4',
}: {
  name: IconName | string;
  className?: string;
}) {
  const path = ICONS[name as IconName] ?? ICONS.code;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {path}
    </svg>
  );
}
