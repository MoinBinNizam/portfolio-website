import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { SocialLinksBar } from '../components/layout/SocialLinksBar';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { usePublicProfile } from '../features/public/queries';
import { MarkdownBody } from '../lib/markdown';
import { Seo } from '../lib/seo';

export function AboutPage() {
  const { data: profile, isLoading } = usePublicProfile();

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
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="About"
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
                  {profile?.intro ? (
                    <p className="max-w-[65ch] text-base font-medium text-textPrimary">
                      {profile.intro}
                    </p>
                  ) : null}
                  <MarkdownBody
                    content={
                      profile?.about ??
                      'Full-stack developer building scalable web applications with MongoDB, Express, React, Node.js, and TypeScript.'
                    }
                  />
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

            <div className="lg:col-span-5">
              <figure className="rounded-card border border-border bg-surface p-3">
                {profile?.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.avatar.alt || `${profile.name} portrait`}
                    width={profile.avatar.width ?? 600}
                    height={profile.avatar.height ?? 700}
                    className="aspect-[4/5] w-full rounded-media object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-end rounded-media border border-border bg-surfaceAlt p-6">
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
              </figure>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
