import { Link, useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useProjectBySlug, useProjectsPublicList } from '../features/projects/queries';
import { MarkdownBody } from '../lib/markdown';
import { Seo } from '../lib/seo';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: project, isLoading, isError } = useProjectBySlug(slug);
  const { data: allProjects } = useProjectsPublicList();

  const related = (allProjects ?? []).filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <PageShell>
      <Seo
        title={project ? `${project.title} — Moin Uddin` : 'Project — Moin Uddin'}
        description={project?.summary ?? 'Full-stack project case study.'}
        canonicalPath={`/projects/${slug ?? ''}`}
      />
      <section className="py-16">
        <Container className="space-y-12">
          <div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-accent underline-offset-4 hover:underline"
            >
              &larr; All projects
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : isError || !project ? (
            <EmptyState
              title="Project not found"
              description="This project may have been moved or is not published."
              action={
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center rounded-button bg-accent px-4 py-2 text-sm font-semibold text-accentText"
                >
                  Browse projects
                </Link>
              }
            />
          ) : (
            <article className="space-y-8">
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{project.category}</Badge>
                  {project.featured ? <Badge variant="highlight">Featured</Badge> : null}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-textPrimary sm:text-4xl">
                  {project.title}
                </h1>
                <p className="max-w-[65ch] text-base text-textMuted">{project.summary}</p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
                    >
                      Visit live site
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-button border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-textPrimary hover:border-accent"
                    >
                      View repository
                    </a>
                  ) : null}
                </div>
              </header>

              {project.cover?.url ? (
                <div className="overflow-hidden rounded-card border border-border bg-surface">
                  <div className="flex items-center gap-1.5 border-b border-border bg-surfaceAlt px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  </div>
                  <img
                    src={project.cover.url}
                    alt={project.cover.alt || project.title}
                    width={project.cover.width ?? 1200}
                    height={project.cover.height ?? 675}
                    className="w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="grid gap-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                  <section>
                    <h2 className="text-xl font-semibold text-textPrimary">Overview</h2>
                    <div className="mt-3">
                      <MarkdownBody content={project.description} />
                    </div>
                  </section>

                  {project.caseStudy ? (
                    <section>
                      <h2 className="text-xl font-semibold text-textPrimary">Case Study</h2>
                      <div className="mt-3">
                        <MarkdownBody content={project.caseStudy} />
                      </div>
                    </section>
                  ) : null}
                </div>

                <aside className="lg:col-span-4">
                  <div className="rounded-card border border-border bg-surface p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">
                      Tech Stack
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              {project.gallery && project.gallery.length > 0 ? (
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-textPrimary">Screenshots</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {project.gallery.map((shot, idx) => (
                      <figure
                        key={`${shot.publicId}-${idx}`}
                        className="overflow-hidden rounded-card border border-border bg-surface"
                      >
                        <div className="flex items-center gap-1.5 border-b border-border bg-surfaceAlt px-3 py-2">
                          <span className="h-2 w-2 rounded-full bg-border" />
                          <span className="h-2 w-2 rounded-full bg-border" />
                          <span className="h-2 w-2 rounded-full bg-border" />
                        </div>
                        <img
                          src={shot.url}
                          alt={shot.alt || `${project.title} screenshot ${idx + 1}`}
                          className="aspect-video w-full object-cover"
                        />
                        {shot.alt ? (
                          <figcaption className="border-t border-border px-3 py-2 text-xs text-textMuted">
                            {shot.alt}
                          </figcaption>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}
            </article>
          )}

          {related.length > 0 ? (
            <section className="border-t border-border pt-10">
              <h2 className="mb-6 text-xl font-semibold text-textPrimary">Related projects</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    to={`/projects/${item.slug}`}
                    className="block rounded-card border border-border bg-surface p-5 transition-colors duration-fast hover:border-accent"
                  >
                    <Badge variant="accent">{item.category}</Badge>
                    <h3 className="mt-2 text-base font-semibold text-textPrimary">{item.title}</h3>
                    <p className="mt-1 text-sm text-textMuted">{item.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </Container>
      </section>
    </PageShell>
  );
}
