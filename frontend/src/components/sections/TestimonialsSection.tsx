import { useEffect, useState, type KeyboardEvent } from 'react';
import { usePublicTestimonials } from '../../features/public/queries';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${clamped} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${star <= clamped ? 'fill-accent text-accent' : 'fill-none text-border'}`}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { data: items, isLoading } = usePublicTestimonials();
  const list = items ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance reviews left-to-right every 4.5s unless paused or reduced-motion is set
  useEffect(() => {
    if (list.length <= 1 || paused) return;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 4500);
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

  // Show up to 3 cards in a rotating left-to-right window on desktop
  const visibleCards =
    list.length <= 3
      ? list
      : [0, 1, 2].map((offset) => list[(activeIndex + offset) % list.length]!);

  return (
    <section id="testimonials" className="border-t border-border py-16">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Testimonials"
              icon="quote"
              title="Client &amp; Team Reviews"
              description="Verified feedback from founders, product leads, and operations managers."
            />
            {list.length > 1 ? (
              <div className="mb-8 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous testimonials"
                  onClick={() => setActiveIndex((prev) => (prev - 1 + list.length) % list.length)}
                  className="rounded-button border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-textPrimary transition-colors duration-fast hover:border-accent"
                >
                  &larr; Prev
                </button>
                <button
                  type="button"
                  aria-label="Next testimonials"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % list.length)}
                  className="rounded-button border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-textPrimary transition-colors duration-fast hover:border-accent"
                >
                  Next &rarr;
                </button>
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
            </div>
          ) : list.length === 0 ? (
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
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-3">
                {visibleCards.map((item) => (
                  <blockquote
                    key={item._id}
                    className="flex flex-col justify-between rounded-card border border-border bg-surface p-6 transition-all duration-base"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <StarRating rating={item.rating ?? 5} />
                        {item.verified ? <Badge variant="accent">Verified</Badge> : null}
                      </div>
                      <p className="text-sm leading-relaxed text-textPrimary">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    <footer className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                      {item.avatar?.url ? (
                        <img
                          src={item.avatar.url}
                          alt={item.avatar.alt || item.name}
                          className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surfaceAlt text-xs font-bold text-accent"
                        >
                          {initialsOf(item.name)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-textPrimary">
                          {item.name}
                        </p>
                        <p className="truncate text-xs text-textMuted">
                          {item.role}
                          {item.company ? ` · ${item.company}` : ''}
                        </p>
                      </div>
                    </footer>
                  </blockquote>
                ))}
              </div>

              {list.length > 1 ? (
                <div className="flex items-center justify-center gap-2">
                  {list.map((item, idx) => (
                    <button
                      key={item._id}
                      type="button"
                      aria-label={`Jump to review ${idx + 1} of ${list.length}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-fast ${
                        idx === activeIndex ? 'w-6 bg-accent' : 'w-2 bg-border'
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
