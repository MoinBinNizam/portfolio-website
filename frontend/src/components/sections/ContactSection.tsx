import { usePublicProfile } from '../../features/public/queries';
import { SocialLinksBar } from '../layout/SocialLinksBar';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { ContactForm } from './ContactForm';

export function ContactSection() {
  const { data: profile } = usePublicProfile();

  return (
    <section id="contact" className="border-t border-border py-16">
      <Container>
        <Reveal>
          <div className="grid gap-10 rounded-card border border-border bg-surface p-6 sm:p-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Hire &amp; Contact"
                title="Start a Web Development or Consulting Project"
                description="Send a message with your project scope, timeline, or remote role details."
              />
              <div className="space-y-4 text-sm text-textMuted">
                <div>
                  <span className="block text-xs uppercase tracking-[0.14em] text-textMuted">
                    Email
                  </span>
                  <a
                    href={`mailto:${profile?.email ?? 'moinuddinpkt@gmail.com'}`}
                    className="font-medium text-textPrimary hover:text-accent"
                  >
                    {profile?.email ?? 'moinuddinpkt@gmail.com'}
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
                <div>
                  <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-textMuted">
                    Connect
                  </span>
                  <SocialLinksBar socials={profile?.socials} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
