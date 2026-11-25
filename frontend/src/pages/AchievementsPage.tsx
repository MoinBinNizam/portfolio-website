import { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { Tabs } from '../components/ui/Tabs';
import { useAchievementsPublicList } from '../features/achievements/queries';
import { formatMonthYear } from '../lib/dates';
import { Seo } from '../lib/seo';

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'award', label: 'Awards' },
  { id: 'competition', label: 'Competitions' },
  { id: 'publication', label: 'Publications' },
  { id: 'speaking', label: 'Speaking' },
  { id: 'other', label: 'Other' },
];

export function AchievementsPage() {
  const [category, setCategory] = useState('all');
  const { data: items, isLoading } = useAchievementsPublicList(
    category === 'all' ? undefined : category,
  );
  const list = items ?? [];

  return (
    <PageShell>
      <Seo
        title="Achievements — Moin Uddin"
        description="Awards, competitions, publications, speaking engagements, and specialized trainings."
        canonicalPath="/achievements"
      />
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Achievements"
            title="Awards &amp; recognition"
            description="Trainings, mentoring, competitions, and recognition."
          />

          <div className="mb-8">
            <Tabs items={CATEGORY_TABS} activeId={category} onChange={setCategory} />
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              title="No published achievements in this category"
              description="Try another category filter or check back after new achievements are published."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {list.map((item) => (
                <article
                  key={item._id}
                  className="rounded-card border border-border bg-surface p-6"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="accent">{item.category}</Badge>
                    <span className="text-xs text-textMuted">{formatMonthYear(item.date)}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-textPrimary">{item.title}</h2>
                  <p className="mt-1 text-xs font-medium text-textMuted">{item.issuer}</p>
                  {item.description ? (
                    <p className="mt-3 text-sm text-textMuted">{item.description}</p>
                  ) : null}
                  {item.image?.url ? (
                    <div className="mt-4 overflow-hidden rounded-media border border-border bg-surfaceAlt">
                      <img
                        src={item.image.url}
                        alt={item.image.alt || item.title}
                        width={item.image.width ?? 800}
                        height={item.image.height ?? 500}
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                  ) : null}
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-xs font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      View details &rarr;
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
