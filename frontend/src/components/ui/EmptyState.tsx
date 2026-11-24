import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-card border border-dashed border-border bg-surface p-8 text-left">
      <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
      <p className="mt-2 max-w-prose text-sm text-textMuted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
