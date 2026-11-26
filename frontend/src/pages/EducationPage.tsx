import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { Timeline, type TimelineEntry } from '../components/ui/Timeline';
import { useEducationPublicList } from '../features/education/queries';
import { Seo } from '../lib/seo';

export function EducationPage() {
  const { data: items, isLoading } = useEducationPublicList();
  const list = items ?? [];

  const entries: TimelineEntry[] = list.map((item) => ({
    id: item._id,
    title: item.degree,
    subtitle: `${item.institution}${item.field ? ` · Field: ${item.field}` : ''}`,
    dateLabel: `${item.startYear ? `${item.startYear} – ` : ''}${item.endYear ?? 'Present'}`,
    meta: item.grade || undefined,
    body: item.activities ? (
      <p className="max-w-[65ch] text-sm text-textMuted">{item.activities}</p>
    ) : null,
  }));

  return (
    <PageShell>
      <Seo
        title="Education — Moin Uddin"
        description="Academic qualifications, degrees, and institutions."
        canonicalPath="/education"
      />
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Education"
            icon="graduation"
            title="Academic Background"
            description="Degrees, grades, and academic activities."
          />

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              title="No published education yet"
              description="Published education entries will appear here once added from the admin panel."
            />
          ) : (
            <Timeline entries={entries} />
          )}
        </Container>
      </section>
    </PageShell>
  );
}
