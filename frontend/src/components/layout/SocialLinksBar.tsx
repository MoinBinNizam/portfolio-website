import type { SocialLinks } from '@portfolio/shared';
import type { ReactNode } from 'react';

type SocialKey = 'github' | 'linkedin' | 'facebook' | 'x' | 'instagram' | 'youtube' | 'behance';

const SOCIAL_META: Array<{ key: SocialKey; label: string; icon: ReactNode }> = [
  {
    key: 'github',
    label: 'GitHub',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.5l.5-3H13v-1.5c0-.28.22-.5.5-.5Z" />
      </svg>
    ),
  },
  {
    key: 'x',
    label: 'X',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77C2 8.76 2 12 2 12s0 3.24.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.24 22 12 22 12s0-3.24-.42-4.81ZM10 15V9l5.2 3L10 15Z" />
      </svg>
    ),
  },
  {
    key: 'behance',
    label: 'Behance',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M7.5 11.2c.9 0 1.5-.4 1.5-1.2 0-.8-.6-1.2-1.5-1.2H5v2.4h2.5Zm.3 4.2c1 0 1.6-.5 1.6-1.4s-.6-1.3-1.6-1.3H5v2.7h2.8ZM2 6.8h5.8c2.3 0 3.7 1.1 3.7 2.9 0 1.2-.6 2-1.6 2.4 1.3.4 2.1 1.4 2.1 2.8 0 2-1.6 3.2-4 3.2H2V6.8Zm13.2.8h4.6v1.4h-4.6V7.6Zm2.3 2.5c2.6 0 4.3 1.8 4.3 4.5v.6h-6.3c.2 1.1 1 1.8 2.2 1.8.9 0 1.6-.4 2-1l1.8 1c-.8 1.2-2.1 1.9-3.8 1.9-2.7 0-4.6-1.8-4.6-4.4s1.9-4.4 4.4-4.4Zm-1.9 3.6h3.8c-.2-1-.9-1.7-1.9-1.7s-1.7.7-1.9 1.7Z" />
      </svg>
    ),
  },
];

export function SocialLinksBar({ socials }: { socials?: SocialLinks | null }) {
  const active = SOCIAL_META.map((item) => ({
    ...item,
    url: socials?.[item.key] ?? '',
  })).filter((item) => Boolean(item.url));

  if (active.length === 0) return null;

  return (
    <div aria-label="Social media links" className="flex flex-wrap items-center gap-2">
      {active.map((item) => (
        <a
          key={item.key}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          title={item.label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-border bg-background text-textMuted transition-colors duration-fast hover:border-accent hover:text-accent"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
