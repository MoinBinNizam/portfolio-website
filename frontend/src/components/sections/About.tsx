import { usePublicExperience, usePublicProfile } from '../../features/public/queries';
import { calculateTotalExperienceDuration, formatAboutWithExperience } from '../../lib/experience';
import { MarkdownBody } from '../../lib/markdown';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionIcon, type IconName } from '../ui/SectionIcon';
import { Skeleton } from '../ui/Skeleton';

const ENGINEERING_PILLARS: Array<{
  step: string;
  title: string;
  detail: string;
  icon: IconName;
}> = [
  {
    step: '01',
    title: 'Full-Stack MERN & TypeScript',
    detail: 'React 18, Node.js, Express, MongoDB, and strict Zod validation.',
    icon: 'layers',
  },
  {
    step: '02',
    title: 'RAG, Claude & Agentic AI',
    detail: 'AI automation and LLM workflows cutting delivery cycles by 40%.',
    icon: 'cpu',
  },
  {
    step: '03',
    title: 'Security & Access Control',
    detail: 'JWT session revocation, RBAC permissions, and API hardening.',
    icon: 'shield',
  },
  {
    step: '04',
    title: 'Production Performance',
    detail: 'Sub-2s page loads, React Query caching, and Core Web Vitals.',
    icon: 'zap',
  },
];

const FALLBACK_ABOUT =
  "I'm **Moin Uddin**, a **Full-Stack Web Developer** building scalable **MERN, TypeScript, and WordPress** applications. My journey started with WordPress, PHP, and MySQL business platforms, grew through conversion-focused web engineering, and expanded into **React 18, Node.js, Express, and MongoDB** systems including **enterprise inventory, POS, and cooperative finance platforms**.\n\nI am also skilled in **RAG, AI Automation, Claude, and Agentic AI development**, cutting delivery cycles by up to **40%** while maintaining **sub-2-second load times** and strict security. Alongside shipping products at **TechVelly** and for remote clients, I've mentored learners in **programming, school ICT, and web development**.\n\n**Great software feels effortless to use and easy to maintain.** That's what drives me every day.";

export function About() {
  const { data: profile, isLoading } = usePublicProfile();
  const { data: experience } = usePublicExperience();
  const totalDuration = calculateTotalExperienceDuration(experience ?? []);
  const aboutContent = formatAboutWithExperience(profile?.about ?? FALLBACK_ABOUT, totalDuration);

  return (
    <section id="about" className="border-t border-border py-12 lg:py-14">
      <Container>
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="About Me"
                icon="user"
                title="A Developer Who Loves to Build &amp; Share"
              />
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ) : (
                <div className="space-y-4">
                  <MarkdownBody content={aboutContent} />
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {ENGINEERING_PILLARS.map((item) => (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-card border border-border bg-surface p-5 transition-colors duration-fast hover:border-accent"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-input border border-border bg-surfaceAlt text-accent">
                        <SectionIcon name={item.icon} className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-textMuted">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-textPrimary">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-textMuted">{item.detail}</p>
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
