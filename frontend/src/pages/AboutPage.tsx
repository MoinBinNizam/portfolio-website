import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { SocialLinksBar } from '../components/layout/SocialLinksBar';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { usePublicExperience, usePublicProfile } from '../features/public/queries';
import { calculateTotalExperienceDuration, formatAboutWithExperience } from '../lib/experience';
import { MarkdownBody } from '../lib/markdown';
import { Seo } from '../lib/seo';

export function AboutPage() {
  const { data: profile, isLoading } = usePublicProfile();
  const { data: experience } = usePublicExperience();
  const totalDuration = calculateTotalExperienceDuration(experience ?? []);
  const aboutContent = formatAboutWithExperience(
    profile?.about ??
      "I'm **Moin Uddin**, a **Full-Stack Web Developer** building scalable **MERN, TypeScript, and WordPress** applications. I genuinely enjoy turning complex business ideas into clean, fast, and reliable software.\n\nMy journey started with WordPress, PHP, and MySQL business platforms, grew through conversion-focused web engineering, and expanded into full-stack **React 18, Node.js, Express, and MongoDB** systems including **enterprise inventory, POS, and cooperative finance platforms**. I am also skilled in **RAG, AI Automation, Claude, and Agentic AI development** for safer, faster software delivery.\n\nAlongside shipping products, I've mentored learners in **programming, school ICT, and web development**, helping students build real-world technical confidence. From leading full-stack delivery at **TechVelly** and collaborating with engineering teams in Dhaka to supporting remote clients, every project has taught me to value readable architecture and thoughtful user experience.\n\n**Great software feels effortless to use and easy to maintain.** That's what drives me every day.",
    totalDuration,
  );

  return (
    <PageShell>
      <Seo
        title={`About ${profile?.name ?? 'Moin Uddin'} — Full-Stack MERN & TypeScript Developer`}
        description={
          profile?.intro ??
          'Biography, engineering values, and full-stack MERN & TypeScript approach.'
        }
        canonicalPath="/about"
      />
      <section className="py-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <SectionHeading
                eyebrow="About Me"
                icon="user"
                title={profile?.name ?? 'Moin Uddin'}
                description={profile?.headline ?? 'Full-Stack MERN & TypeScript Developer'}
              />

              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ) : (
                <div className="space-y-6">
                  <MarkdownBody content={aboutContent} />
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
                >
                  Contact me
                </Link>
                <SocialLinksBar socials={profile?.socials} />
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <div className="mx-auto w-full max-w-[230px] sm:max-w-[270px] lg:max-w-[340px]">
                {profile?.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.avatar.alt || `${profile.name} portrait`}
                    width={profile.avatar.width ?? 600}
                    height={profile.avatar.height ?? 700}
                    className="h-auto w-full object-contain"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-end rounded-card bg-surfaceAlt p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                        Portrait
                      </p>
                      <p className="mt-1 text-lg font-semibold text-textPrimary">
                        {profile?.name ?? 'Moin Uddin'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
