import { Link } from 'react-router-dom';
import { usePublicServices } from '../../features/public/queries';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function ServicesSection() {
  const { data: items, isLoading } = usePublicServices();
  const visible = (items ?? []).slice(0, 4);

  return (
    <section id="services" className="border-t border-border py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Services"
            title="How we can work together"
            description="Focused engineering engagements from architecture to launch."
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
              <div key={service._id} className="rounded-card border border-border bg-surface p-6">
                <h3 className="text-lg font-semibold text-textPrimary">{service.title}</h3>
                <p className="mt-2 text-sm text-textMuted">{service.summary}</p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
