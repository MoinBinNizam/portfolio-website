import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { Timeline, type TimelineEntry } from '../components/ui/Timeline';
import { useExperiencePublicList } from '../features/experience/queries';
import { formatMonthYear } from '../lib/dates';
import { formatEmploymentType } from '../lib/labels';
import { Seo } from '../lib/seo';

export function ExperiencePage() {
  const { data: items, isLoading } = useExperiencePublicList();
  const list = items ?? [];

  const entries: TimelineEntry[] = list.map((item) => ({
    id: item._id,
    title: item.role,
    subtitle: `${item.company}${item.location ? ` · ${item.location}` : ''}`,
    dateLabel: `${formatMonthYear(item.startDate)} – ${
      item.isCurrent ? 'Present' : formatMonthYear(item.endDate)
    }`,
    meta: formatEmploymentType(item.employmentType),
    body: (
      <div className="space-y-3">
        {item.description ? (
          <p className="max-w-[65ch] text-sm text-textMuted">{item.description}</p>
        ) : null}
        {item.achievements.length > 0 ? (
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-textPrimary">
            {item.achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        ) : null}
      </div>
    ),
    footer:
      item.techStack.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {item.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      ) : null,
  }));

  return (
    <PageShell>
      <Seo
        title="Experience — Moin Uddin"
        description="Full-stack web development roles, key achievements, and technical stack."
        canonicalPath="/experience"
      />
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Experience"
            icon="briefcase"
            title="Work History"
            description="Roles, measurable outcomes, and production technologies."
          />

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              title="No published experience yet"
              description="Published experience entries will appear here once added from the admin panel."
            />
          ) : (
            <Timeline entries={entries} />
          )}
        </Container>
      </section>
    </PageShell>
  );
}
