import { usePublicTestimonials } from '../../features/public/queries';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function TestimonialsSection() {
  const { data: items, isLoading } = usePublicTestimonials();
  const visible = (items ?? []).slice(0, 3);

  return (
    <section id="testimonials" className="border-t border-border py-16">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Client &amp; Team Feedback"
            description="Notes from founders and teams I have delivered software for."
          />

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              title="No testimonials published yet"
              description="Verified client testimonials will appear here once published."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {visible.map((item) => (
                <blockquote
                  key={item._id}
                  className="flex flex-col justify-between rounded-card border border-border bg-surface p-6"
                >
                  <p className="text-sm text-textPrimary">&ldquo;{item.quote}&rdquo;</p>
                  <footer className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
                    <div>
                      <p className="text-sm font-semibold text-textPrimary">{item.name}</p>
                      <p className="text-xs text-textMuted">
                        {item.role}
                        {item.company ? `, ${item.company}` : ''}
                      </p>
                    </div>
                    {item.verified ? <Badge variant="accent">Verified</Badge> : null}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
