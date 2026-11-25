import { usePublicSkills } from '../../features/public/queries';
import type { SkillItem } from '../../features/public/types';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Tools & DevOps',
  design: 'Design',
  cms: 'CMS',
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : skills.length === 0 ? (
            <EmptyState
              title="No skills published yet"
              description="Published skills will appear here once added from the admin panel."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(grouped).map(([category, list]) => (
                <div key={category} className="rounded-card border border-border bg-surface p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                    {CATEGORY_LABELS[category] ?? category}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {list.slice(0, 6).map((skill) => (
                      <li key={skill._id} className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-textPrimary">{skill.name}</span>
                        <span
                          aria-label={`Level ${skill.level} of 5`}
                          className="flex items-center gap-1"
                        >
                          {[1, 2, 3, 4, 5].map((step) => (
                            <span
                              key={step}
                              className={`h-1.5 w-2.5 rounded-sm ${
                                step <= skill.level ? 'bg-accent' : 'bg-surfaceAlt'
                              }`}
                            />
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
