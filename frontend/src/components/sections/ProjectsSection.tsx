import { Link } from 'react-router-dom';
import { usePublicProjects } from '../../features/public/queries';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function ProjectsSection() {
  const { data: items, isLoading } = usePublicProjects({ featured: true });
  const visible = (items ?? []).slice(0, 4);

  return (
    <section id="projects" className="border-t border-border py-16">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Portfolio &amp; Case Studies"
              title="Featured Full-Stack Web Applications &amp; Client Builds"
              description="Production MERN, React, TypeScript, inventory, POS, and compliance platforms."
            />
            <Link
              to="/projects"
              className="mb-8 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              All projects &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              title="No featured projects published yet"
              description="Featured projects will appear here once published from the admin panel."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {visible.map((project) => (
                <article
                  key={project._id}
                  className="rounded-card border border-border bg-surface p-5 transition-colors duration-fast hover:border-accent"
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

                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="accent">{project.category}</Badge>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-textPrimary">
                    <Link to={`/projects/${project.slug}`} className="hover:underline">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-textMuted">{project.summary}</p>
                  {project.techStack.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
