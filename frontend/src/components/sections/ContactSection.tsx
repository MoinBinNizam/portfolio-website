import { Link } from 'react-router-dom';
import { usePublicProfile } from '../../features/public/queries';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function ContactSection() {
  const { data: profile } = usePublicProfile();

  return (
    <section id="contact" className="border-t border-border py-16">
      <Container>
        <div className="grid gap-8 rounded-card border border-border bg-surface p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <SectionHeading
              eyebrow="Contact"
              title="Have a project in mind?"
              description="Send a message with your timeline and goals, and I will reply by email."
            />
            <div className="flex flex-wrap gap-6 text-sm text-textMuted">
              <div>
                <span className="block text-xs uppercase tracking-[0.14em] text-textMuted">
                  Email
                </span>
                <a
                  href={`mailto:${profile?.email ?? 'contact@moinuddinbd.com'}`}
                  className="font-medium text-textPrimary hover:text-accent"
                >
                  {profile?.email ?? 'contact@moinuddinbd.com'}
                </a>
              </div>
              {profile?.location ? (
                <div>
                  <span className="block text-xs uppercase tracking-[0.14em] text-textMuted">
                    Location
                  </span>
                  <span className="font-medium text-textPrimary">{profile.location}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex lg:col-span-4 lg:justify-end">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-button bg-accent px-6 py-3 text-sm font-semibold text-accentText transition-colors duration-fast hover:bg-accentHover"
            >
              Open contact form
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
