import { Link } from 'react-router-dom';
import { usePublicServices } from '../../features/public/queries';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionIcon } from '../ui/SectionIcon';
import { Skeleton } from '../ui/Skeleton';

export function ServicesSection() {
  const { data: items, isLoading } = usePublicServices();
  const visible = (items ?? []).slice(0, 4);

  return (
    <section id="services" className="border-t border-border py-12 lg:py-14">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Services"
              icon="zap"
              title="Custom Software, E-Commerce, Inventory &amp; POS Development"
              description="End-to-end delivery from architecture to launch."
            />
            <Link
              to="/services"
              className="mb-8 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              All services &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              title="No services published yet"
              description="Published services will appear here once added from the admin panel."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {visible.map((service) => (
                <div
                  key={service._id}
                  className="rounded-card border border-border bg-surface p-5 transition-colors duration-fast hover:border-accent"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-input border border-border bg-surfaceAlt text-accent">
                      <SectionIcon name={service.icon || 'code'} className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-semibold text-textPrimary">{service.title}</h3>
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-sm text-textMuted">
                    {service.summary || service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
