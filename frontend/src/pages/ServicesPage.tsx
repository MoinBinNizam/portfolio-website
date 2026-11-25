import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { useServicesPublicList } from '../features/services/queries';
import { Seo } from '../lib/seo';

export function ServicesPage() {
  const { data: items, isLoading } = useServicesPublicList();
  const list = items ?? [];

  return (
    <PageShell>
      <Seo
        title="Services — Moin Uddin"
        description="Custom software, MERN web applications, e-commerce, inventory, POS systems, and ICT training."
        canonicalPath="/services"
      />
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Software Development, E-Commerce, Inventory &amp; POS"
            description="End-to-end full-stack delivery and technical consulting."
          />

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              title="No published services yet"
              description="Services will appear here once published from the admin panel."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {list.map((service) => (
                <article
                  key={service._id}
                  className="flex flex-col justify-between rounded-card border border-border bg-surface p-6 transition-colors duration-fast hover:border-accent"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-textPrimary">{service.title}</h2>
                    <p className="mt-2 text-sm text-textMuted">
                      {service.summary || service.description}
                    </p>
                    {service.deliverables && service.deliverables.length > 0 ? (
                      <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-textPrimary">
                        {service.deliverables.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <div className="mt-5 border-t border-border pt-4">
                    <Link
                      to="/contact"
                      className="text-xs font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      Request this service &rarr;
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
