import type { ReactNode } from 'react';

export interface TimelineEntry {
  id: string;
  dateLabel: string;
  title: string;
  subtitle?: string;
  meta?: string;
  body?: ReactNode;
  footer?: ReactNode;
}

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <ol className="relative space-y-8 border-l border-border pl-6 sm:pl-8">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent sm:-left-[37px]"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div>
              <h3 className="text-lg font-semibold text-textPrimary">{entry.title}</h3>
              {entry.subtitle ? (
                <p className="text-sm font-medium text-textMuted">{entry.subtitle}</p>
              ) : null}
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-accent">{entry.dateLabel}</span>
              {entry.meta ? (
                <span className="ml-2 text-xs text-textMuted">&middot; {entry.meta}</span>
              ) : null}
            </div>
          </div>
          {entry.body ? <div className="mt-3">{entry.body}</div> : null}
          {entry.footer ? <div className="mt-3">{entry.footer}</div> : null}
        </li>
      ))}
    </ol>
  );
}
