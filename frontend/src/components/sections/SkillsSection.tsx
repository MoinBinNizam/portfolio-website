import { usePublicSkills } from '../../features/public/queries';
import type { SkillItem } from '../../features/public/types';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionIcon, type IconName } from '../ui/SectionIcon';
import { Skeleton } from '../ui/Skeleton';
import { SkillIcon } from '../ui/SkillIcon';

const CATEGORY_META: Record<string, { label: string; icon: IconName }> = {
  frontend: { label: 'Frontend', icon: 'layers' },
  backend: { label: 'Backend', icon: 'code' },
  database: { label: 'Database', icon: 'boxes' },
  ai: { label: 'AI, RAG & Automation', icon: 'cpu' },
  tools: { label: 'Tools & DevOps', icon: 'zap' },
  design: { label: 'Design', icon: 'award' },
  cms: { label: 'CMS', icon: 'book' },
};

export function SkillsSection() {
  const { data: items, isLoading } = usePublicSkills();
  const skills = items ?? [];

  const grouped = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    const list = acc[skill.category] ?? [];
    list.push(skill);
    acc[skill.category] = list;
    return acc;
  }, {});

  return (
    <section id="skills" className="border-t border-border py-12 lg:py-14">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Technical Skills"
            icon="code"
            title="React, TypeScript, Node.js, MongoDB &amp; AI Workflow Stack"
            description="Core production technologies grouped by domain."
          />

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : skills.length === 0 ? (
            <EmptyState
              title="No skills published yet"
              description="Published skills will appear here once added from the admin panel."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(grouped).map(([category, list]) => {
                const meta = CATEGORY_META[category] ?? {
                  label: category,
                  icon: 'code' as IconName,
                };
                return (
                  <div
                    key={category}
                    className="rounded-card border border-border bg-surface p-5 transition-colors duration-fast hover:border-accent"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-input border border-border bg-surfaceAlt text-accent">
                          <SectionIcon name={meta.icon} className="h-4 w-4" />
                        </span>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-textPrimary">
                          {meta.label}
                        </h3>
                      </div>
                      <Badge variant="neutral">{list.length}</Badge>
                    </div>

                    <ul className="mt-3.5 space-y-2">
                      {list.slice(0, 7).map((skill) => (
                        <li
                          key={skill._id}
                          className="flex items-center justify-between gap-2 rounded-input bg-surfaceAlt/45 px-2.5 py-1.5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <SkillIcon
                              name={skill.name}
                              category={category}
                              className="h-3.5 w-3.5 shrink-0 text-accent"
                            />
                            <span className="truncate text-xs font-medium text-textPrimary sm:text-sm">
                              {skill.name}
                            </span>
                          </div>
                          <span
                            aria-label={`Level ${skill.level} of 5`}
                            className="flex shrink-0 items-center gap-1"
                          >
                            {[1, 2, 3, 4, 5].map((step) => (
                              <span
                                key={step}
                                className={`h-1.5 w-2 rounded-sm ${
                                  step <= skill.level ? 'bg-accent' : 'bg-border'
                                }`}
                              />
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
