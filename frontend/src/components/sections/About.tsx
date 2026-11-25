import { usePublicProfile } from '../../features/public/queries';
import { MarkdownBody } from '../../lib/markdown';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionIcon, type IconName } from '../ui/SectionIcon';
import { Skeleton } from '../ui/Skeleton';

const ENGINEERING_PILLARS: Array<{ title: string; detail: string; icon: IconName }> = [
  {
    title: 'Clean MERN & TypeScript',
    detail: 'Strict types, Zod validation, modular React 18.',
    icon: 'layers',
  },
  {
    title: 'AI-Ready Workflows',
    detail: 'LLM APIs, Claude & Gemini automation.',
    icon: 'cpu',
  },
  {
    title: 'Security-First APIs',
    detail: 'JWT auth, RBAC, auditable data flows.',
    icon: 'shield',
  },
  {
    title: 'Fast Web Performance',
    detail: 'Sub-2s loads, Core Web Vitals, SEO.',
    icon: 'zap',
  },
];

export function About() {
  const { data: profile, isLoading } = usePublicProfile();

  return (
    <section id="about" className="border-t border-border py-12 lg:py-14">
      <Container>
        <Reveal>
          <div className="grid items-start gap-8 lg:grid-cols-12">
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
                  <MarkdownBody
                    content={
                      profile?.about ??
                      "I'm Moin Uddin, a Full-Stack Web Developer with over 3.5 years of hands-on experience building scalable MERN, TypeScript, and WordPress applications. I genuinely enjoy turning complex business ideas into clean, fast, and reliable software.\n\nOver the years I've worked on everything from custom business websites and WooCommerce stores to full-scale inventory, POS, and compliance platforms. Alongside shipping products, I've mentored learners in Python, Django, web design, and freelancing, helping students build real-world technical confidence.\n\nFrom leading full-stack delivery at TechVelly and collaborating with engineering teams in Dhaka to supporting international clients, every project has taught me to value readable architecture and thoughtful user experience.\n\nGreat software feels effortless to use and easy to maintain. That's what drives me every day."
                    }
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <div className="divide-y divide-border rounded-card border border-border bg-surface">
                {ENGINEERING_PILLARS.map((item) => (
                  <div key={item.title} className="flex items-center gap-3.5 p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-input border border-border bg-surfaceAlt text-accent">
                      <SectionIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-textPrimary">{item.title}</h3>
                      <p className="text-xs text-textMuted">{item.detail}</p>
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
