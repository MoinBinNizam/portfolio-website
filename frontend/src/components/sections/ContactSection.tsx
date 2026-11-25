import { usePublicProfile } from '../../features/public/queries';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ContactForm } from './ContactForm';

export function ContactSection() {
  const { data: profile } = usePublicProfile();

  return (
    <section id="contact" className="border-t border-border py-16">
      <Container>
        <div className="grid gap-10 rounded-card border border-border bg-surface p-6 sm:p-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact"
              title="Have a project in mind?"
              description="Send a message with your timeline and goals, and I will reply by email."
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
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
