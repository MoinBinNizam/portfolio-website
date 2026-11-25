import { Link } from 'react-router-dom';
import {
  usePublicAchievements,
  usePublicCertifications,
  usePublicEducation,
  usePublicExperience,
  usePublicProfile,
  usePublicProjects,
  usePublicSkills,
} from '../../features/public/queries';
import { downloadStructuredCv } from '../../lib/cvGenerator';
import { calculateTotalExperienceDuration } from '../../lib/experience';
import { SocialLinksBar } from '../layout/SocialLinksBar';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionIcon } from '../ui/SectionIcon';
import { Skeleton } from '../ui/Skeleton';
import { TypewriterText } from '../ui/TypewriterText';

export function Hero() {
  const { data: profile, isLoading } = usePublicProfile();
  const { data: experience } = usePublicExperience();
  const { data: education } = usePublicEducation();
  const { data: projects } = usePublicProjects();
  const { data: skills } = usePublicSkills();
  const { data: achievements } = usePublicAchievements();
  const { data: certifications } = usePublicCertifications();
  const totalDuration = calculateTotalExperienceDuration(experience ?? []);

  const handleDownloadCv = () => {
    if (profile?.resumeUrl) {
      window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    downloadStructuredCv({
      profile,
      experience: experience ?? [],
      projects: projects ?? [],
      skills: skills ?? [],
      education: education ?? [],
      achievements: achievements ?? [],
      certifications: certifications ?? [],
    });
  };

  return (
    <section className="pt-0 pb-14 lg:pt-0 lg:pb-20">
      <Container>
        <Reveal>
          <div className="grid items-center gap-8 pt-6 lg:grid-cols-12 lg:gap-10">
            <div className="order-2 text-center lg:order-1 lg:col-span-7 lg:text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {profile?.location ?? 'Dhaka, Bangladesh'}
              </p>

              {isLoading ? (
                <div className="mx-auto space-y-4 lg:mx-0">
                  <Skeleton className="mx-auto h-12 w-3/4 lg:mx-0" />
                  <Skeleton className="mx-auto h-6 w-2/3 lg:mx-0" />
                  <Skeleton className="mx-auto h-20 w-full max-w-xl lg:mx-0" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold tracking-tight text-textPrimary sm:text-5xl">
                    {profile?.name ?? 'Moin Uddin'}
                  </h1>
                  <p className="mt-3 min-h-[2.75rem] text-sm font-medium text-textMuted sm:min-h-[2rem] sm:text-lg lg:text-xl">
                    <TypewriterText
                      text={profile?.headline ?? 'Full-Stack MERN & TypeScript Developer'}
                    />
                  </p>
                  <p className="mx-auto mt-4 line-clamp-3 max-w-[60ch] text-sm leading-relaxed text-textMuted sm:text-base lg:mx-0">
                    Full-Stack Web Developer
                    {totalDuration ? ` with ${totalDuration} of experience` : ''} delivering
                    scalable MERN, TypeScript, and WordPress platforms. Shipped enterprise
                    inventory, POS, and finance systems with AI-assisted workflows.
                  </p>
                </>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-button bg-accent px-6 py-3 text-sm font-semibold text-accentText transition-colors duration-fast hover:bg-accentHover"
                >
                  Contact me
                </a>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center rounded-button border border-border bg-surface px-6 py-3 text-sm font-semibold text-textPrimary transition-colors duration-fast hover:border-accent"
                >
                  View projects
                </Link>
                <button
                  type="button"
                  onClick={handleDownloadCv}
                  className="inline-flex items-center justify-center gap-2 rounded-button border border-border bg-surface px-5 py-3 text-sm font-semibold text-textPrimary transition-colors duration-fast hover:border-accent hover:text-accent"
                >
                  <SectionIcon name="download" className="h-4 w-4" />
                  <span>Download CV</span>
                </button>
              </div>

              <div className="mt-6 flex justify-center lg:justify-start">
                <SocialLinksBar socials={profile?.socials} />
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <div className="mx-auto w-full max-w-[260px] sm:max-w-[310px] lg:max-w-[380px]">
                {profile?.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.avatar.alt || `${profile.name} portrait`}
                    width={profile.avatar.width ?? 600}
                    height={profile.avatar.height ?? 700}
                    className="h-auto w-full rounded-tl-[40px] rounded-br-[40px] object-contain"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-end rounded-tl-[40px] rounded-br-[40px] bg-surfaceAlt p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                        Portrait
                      </p>
                      <p className="mt-1 text-lg font-semibold text-textPrimary">
                        {profile?.name ?? 'Moin Uddin'}
                      </p>
                      <p className="mt-1 text-xs text-textMuted">
                        Set profile portrait in Admin &rarr; Profile.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
