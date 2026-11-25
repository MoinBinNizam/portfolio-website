import { useEffect, useState, type KeyboardEvent } from 'react';
import { usePublicTestimonials } from '../../features/public/queries';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function TestimonialsSection() {
  const { data: items, isLoading } = usePublicTestimonials();
  const list = items ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (list.length <= 1 || paused) return;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [list.length, paused]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (list.length <= 1) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % list.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
    }
  };

  const current = list[activeIndex % Math.max(1, list.length)];

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
            <Skeleton className="h-44 w-full" />
          ) : list.length === 0 || !current ? (
            <EmptyState
              title="No testimonials published yet"
              description="Verified client testimonials will appear here once published."
            />
          ) : (
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Client testimonials"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              className="rounded-card border border-border bg-surface p-6 sm:p-8"
            >
              <blockquote className="min-h-[90px]">
                <p className="max-w-[65ch] text-base text-textPrimary sm:text-lg">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-sm font-semibold text-textPrimary">{current.name}</p>
                    <p className="text-xs text-textMuted">
                      {current.role}
                      {current.company ? `, ${current.company}` : ''}
                    </p>
                  </div>
                  {current.verified ? <Badge variant="accent">Verified</Badge> : null}
                </footer>
              </blockquote>

              {list.length > 1 ? (
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {list.map((item, idx) => (
                      <button
                        key={item._id}
                        type="button"
                        aria-label={`Show testimonial ${idx + 1} of ${list.length}`}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-fast ${
                          idx === activeIndex ? 'w-6 bg-accent' : 'w-2 bg-border'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous testimonial"
                      onClick={() =>
                        setActiveIndex((prev) => (prev - 1 + list.length) % list.length)
                      }
                      className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textPrimary hover:border-accent"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      aria-label="Next testimonial"
                      onClick={() => setActiveIndex((prev) => (prev + 1) % list.length)}
                      className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textPrimary hover:border-accent"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
