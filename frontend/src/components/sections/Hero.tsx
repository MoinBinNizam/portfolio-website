import { Link } from 'react-router-dom';
import { usePublicProfile } from '../../features/public/queries';
import { Container } from '../ui/Container';
import { Skeleton } from '../ui/Skeleton';

export function Hero() {
  const { data: profile, isLoading } = usePublicProfile();

  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {profile?.location ?? 'Dhaka, Bangladesh'}
            </p>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-20 w-full max-w-xl" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold tracking-tight text-textPrimary sm:text-5xl">
                  {profile?.name ?? 'Moin Uddin'}
                </h1>
                <p className="mt-3 text-xl font-medium text-textMuted sm:text-2xl">
                  {profile?.headline ?? 'Full-Stack MERN & TypeScript Developer'}
                </p>
                <p className="mt-5 max-w-[65ch] text-base text-textMuted">
                  {profile?.intro ??
                    'Full-stack developer building fast, accessible web applications with MongoDB, Express, React, Node.js, and TypeScript.'}
                </p>
              </>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
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
                    <p className="mt-1 text-xs text-textMuted">
                      Upload profile photo from the admin panel.
                    </p>
                  </div>
                </div>
              )}
              <figcaption className="mt-3 px-1 text-xs text-textMuted">
                {profile?.headline ?? 'Full-Stack MERN & TypeScript Developer'}
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
