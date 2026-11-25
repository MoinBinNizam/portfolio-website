import { PageShell } from '../components/layout/PageShell';
import { ContactForm } from '../components/sections/ContactForm';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { usePublicProfile } from '../features/public/queries';
import { Seo } from '../lib/seo';

export function ContactPage() {
  const { data: profile } = usePublicProfile();

  return (
    <PageShell>
      <Seo
        title="Contact — Moin Uddin"
        description="Send a message to discuss full-stack web development, consulting, or remote opportunities."
        canonicalPath="/contact"
      />
      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Contact"
                icon="mail"
                title="Get in touch"
                description="Use the form to send a message directly, or reach out by email."
              />
              <div className="space-y-4 rounded-card border border-border bg-surface p-5 text-sm">
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

            <div className="rounded-card border border-border bg-surface p-6 sm:p-8 lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
