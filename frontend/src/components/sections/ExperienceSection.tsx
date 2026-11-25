import { Link } from 'react-router-dom';
import { usePublicExperience } from '../../features/public/queries';
import type { ExperienceItem } from '../../features/public/types';
import { formatMonthYear } from '../../lib/dates';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

function calculateTotalExperience(items: ExperienceItem[]): string {
  if (items.length === 0) return '';
  const ranges = items
    .map((item) => {
      const start = Date.parse(item.startDate);
      const end = item.isCurrent || !item.endDate ? Date.now() : Date.parse(item.endDate);
      return Number.isNaN(start) || Number.isNaN(end)
        ? null
        : ([start, Math.max(start, end)] as const);
    })
    .filter((r): r is readonly [number, number] => r !== null)
    .sort((a, b) => a[0] - b[0]);

  if (ranges.length === 0) return '';

  const merged: Array<[number, number]> = [];
  for (const [s, e] of ranges) {
    const last = merged[merged.length - 1];
    if (!last || s > last[1]) {
      merged.push([s, e]);
    } else {
      last[1] = Math.max(last[1], e);
    }
  }

  const totalMonths = merged.reduce((acc, [s, e]) => {
    const months = (e - s) / (1000 * 60 * 60 * 24 * 30.4375);
    return acc + Math.max(1, Math.round(months));
  }, 0);

  const years = Math.floor(totalMonths / 12);
  const remMonths = totalMonths % 12;
  if (years > 0 && remMonths > 0) return `${years} yrs ${remMonths} mos total experience`;
  if (years > 0) return `${years}+ yrs total experience`;
  return `${remMonths} mos total experience`;
}

export function ExperienceSection() {
  const { data: items, isLoading } = usePublicExperience();
  const all = items ?? [];
  const latest = all.slice(0, 3);
  const totalLabel = calculateTotalExperience(all);

  return (
    <section id="experience" className="border-t border-border py-12 lg:py-14">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionHeading
                eyebrow="Work Experience"
                icon="briefcase"
                title="Full-Stack MERN &amp; Web Engineering Experience"
                description="Recent roles and core production technologies."
              />
              {totalLabel ? (
                <div className="-mt-4 mb-6">
                  <Badge variant="accent">{totalLabel}</Badge>
                </div>
              ) : null}
            </div>
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
                    <p className="mt-2 line-clamp-2 max-w-[65ch] text-sm text-textMuted">
                      {item.description}
                    </p>
                  ) : null}
                  {item.techStack.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.techStack.slice(0, 4).map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
