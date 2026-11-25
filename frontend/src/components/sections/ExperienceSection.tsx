import { Link } from 'react-router-dom';
import { usePublicExperience } from '../../features/public/queries';
import { formatMonthYear } from '../../lib/dates';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function ExperienceSection() {
  const { data: items, isLoading } = usePublicExperience();
  const latest = (items ?? []).slice(0, 3);

  return (
    <section id="experience" className="border-t border-border py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Experience"
            title="Recent roles"
            description="Selected engineering and product delivery roles."
          />
          <Link
            to="/experience"
            className="mb-8 text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            All experience &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : latest.length === 0 ? (
          <EmptyState
            title="No published experience yet"
            description="Published experience entries will appear here once added from the admin panel."
          />
        ) : (
          <ol className="relative space-y-8 border-l border-border pl-6">
            {latest.map((item) => (
              <li key={item._id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-textPrimary">
                    {item.role} &middot; <span className="text-textMuted">{item.company}</span>
                  </h3>
                  <span className="text-xs font-medium text-textMuted">
                    {formatMonthYear(item.startDate)} &ndash;{' '}
                    {item.isCurrent ? 'Present' : formatMonthYear(item.endDate)}
                  </span>
                </div>
                {item.description ? (
                  <p className="mt-2 max-w-[65ch] text-sm text-textMuted">{item.description}</p>
                ) : null}
                {item.techStack.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.techStack.slice(0, 6).map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </Container>
    </section>
  );
}
