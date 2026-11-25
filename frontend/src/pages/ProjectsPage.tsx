import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { Tabs } from '../components/ui/Tabs';
import { useProjectsPublicList } from '../features/projects/queries';
import { Seo } from '../lib/seo';

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'fullstack', label: 'Fullstack' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'wordpress', label: 'WordPress' },
  { id: 'marketing', label: 'Marketing' },
];

export function ProjectsPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { data: items, isLoading } = useProjectsPublicList({
    category: category === 'all' ? undefined : category,
    q: search.trim() || undefined,
  });
  const list = items ?? [];

  return (
    <PageShell>
      <Seo
        title="Projects — Moin Uddin"
        description="Full-stack MERN, React, TypeScript, inventory, POS, and client web applications."
        canonicalPath="/projects"
      />
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Portfolio"
            title="Full-Stack Web Applications &amp; Case Studies"
            description="Filter by category or search by project title, summary, or stack."
          />

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Tabs items={CATEGORY_TABS} activeId={category} onChange={setCategory} />
            <div className="w-full sm:w-64">
              <Input
                type="search"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              title="No matching projects found"
              description="Try clearing the search query or switching category filters."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {list.map((project) => (
                <article
                  key={project._id}
                  className="rounded-card border border-border bg-surface p-6 transition-colors duration-fast hover:border-accent"
                >
                  {project.cover?.url ? (
                    <div className="mb-4 overflow-hidden rounded-media border border-border bg-surfaceAlt">
                      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-border" />
                        <span className="h-2 w-2 rounded-full bg-border" />
                        <span className="h-2 w-2 rounded-full bg-border" />
                      </div>
                      <img
                        src={project.cover.url}
                        alt={project.cover.alt || project.title}
                        width={project.cover.width ?? 800}
                        height={project.cover.height ?? 450}
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{project.category}</Badge>
                    {project.featured ? <Badge variant="highlight">Featured</Badge> : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-textPrimary">
                    <Link to={`/projects/${project.slug}`} className="hover:underline">
                      {project.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-textMuted">{project.summary}</p>
                  {project.techStack.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 6).map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-5">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-xs font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      Read case study &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
