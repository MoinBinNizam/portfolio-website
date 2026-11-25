import { Link } from 'react-router-dom';
import { usePublicProfile } from '../../features/public/queries';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

const WORKING_PRINCIPLES = [
  {
    title: 'Clear architecture first',
    detail: 'Shared validation schemas, strict TypeScript, and predictable API boundaries.',
  },
  {
    title: 'Accessible by default',
    detail:
      'Semantic HTML, keyboard navigation, visible focus rings, and tested contrast in both themes.',
  },
  {
    title: 'Built to be maintained',
    detail: 'Owner-editable content collections so updates never require a code deploy.',
  },
];

export function About() {
  const { data: profile, isLoading } = usePublicProfile();

  return (
    <section id="about" className="border-t border-border py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="About" title="How I build software" />
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ) : (
              <p className="max-w-[65ch] text-base text-textMuted">
                {profile?.about ??
                  'I focus on practical, full-stack web engineering with TypeScript, React, Express, and MongoDB.'}
              </p>
            )}
            <div className="mt-6">
              <Link
                to="/about"
                className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                Read full biography &rarr;
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="divide-y divide-border rounded-card border border-border bg-surface">
              {WORKING_PRINCIPLES.map((item) => (
                <div key={item.title} className="p-5">
                  <h3 className="text-base font-semibold text-textPrimary">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-textMuted">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
