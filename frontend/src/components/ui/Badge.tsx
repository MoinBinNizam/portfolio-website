import type { ReactNode } from 'react';

type BadgeVariant = 'neutral' | 'accent' | 'highlight';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeClasses: Record<BadgeVariant, string> = {
  neutral: 'border-border bg-surfaceAlt text-textMuted',
  accent: 'border-accent/40 bg-accent/10 text-accent',
  highlight: 'border-highlight/40 bg-highlight/10 text-highlight',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-button border px-2.5 py-0.5 text-xs font-medium ${badgeClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
