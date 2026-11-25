import { usePublicProfile } from '../../features/public/queries';
import { MarkdownBody } from '../../lib/markdown';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionIcon, type IconName } from '../ui/SectionIcon';
import { Skeleton } from '../ui/Skeleton';

const ENGINEERING_PILLARS: Array<{ title: string; detail: string; icon: IconName }> = [
  {
    title: 'Scalable MERN & TypeScript Architecture',
    detail:
      'End-to-end strict TypeScript, shared Zod validation, RESTful APIs, and modular React 18 applications.',
    icon: 'layers',
  },
  {
    title: 'AI-Accelerated Engineering Workflows',
    detail:
      'Integrating LLM APIs, Claude AI, and Gemini CLI into production pipelines for faster, reliable delivery.',
    icon: 'cpu',
  },
  {
    title: 'Security-First API & RBAC Design',
    detail:
      'JWT session revocation, role-based access control, input sanitisation, and auditable financial workflows.',
    icon: 'shield',
  },
  {
    title: 'Performance & Conversion Engineering',
    detail:
      'Sub-2-second page loads, React Query caching, Core Web Vitals optimization, and measurable lead growth.',
    icon: 'zap',
  },
];

export function About() {
  const { data: profile, isLoading } = usePublicProfile();

  return (
    <section id="about" className="border-t border-border py-16">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="About Moin Uddin"
                icon="user"
                title="Full-Stack MERN &amp; TypeScript Engineer"
              />
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ) : (
                <div className="space-y-4">
                  {profile?.intro ? (
                    <p className="max-w-[65ch] text-base font-medium text-textPrimary">
                      {profile.intro}
                    </p>
                  ) : null}
                  <MarkdownBody
                    content={
                      profile?.about ??
                      'Full-Stack Web Developer with 3.5+ years of experience building scalable MERN, TypeScript, and WordPress production systems.'
                    }
                  />
                  {profile?.tagline ? (
                    <p className="border-l-2 border-accent pl-4 text-sm italic text-textMuted">
                      {profile.tagline}
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <div className="divide-y divide-border rounded-card border border-border bg-surface">
                {ENGINEERING_PILLARS.map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5 p-5">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-input border border-border bg-surfaceAlt text-accent">
                      <SectionIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-textPrimary">{item.title}</h3>
                      <p className="mt-1 text-sm text-textMuted">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
