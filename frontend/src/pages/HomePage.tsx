import { PageShell } from '../components/layout/PageShell';
import { About } from '../components/sections/About';
import { BlogPreview } from '../components/sections/BlogPreview';
import { ContactSection } from '../components/sections/ContactSection';
import { CredentialsSection } from '../components/sections/CredentialsSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { Hero } from '../components/sections/Hero';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { usePublicProfile } from '../features/public/queries';
import { Seo } from '../lib/seo';

export function HomePage() {
  const { data: profile } = usePublicProfile();

  const name = profile?.name ?? 'Moin Uddin';
  const headline = profile?.headline ?? 'Full-Stack MERN & TypeScript Developer';
  const description =
    profile?.intro ??
    'Full-stack developer building fast, accessible web applications with MongoDB, Express, React, Node.js, and TypeScript.';

  const sameAs = Object.values(profile?.socials ?? {}).filter(
    (url): url is string => typeof url === 'string' && url.length > 0,
  );

  return (
    <PageShell>
      <Seo
        title={`${name} — ${headline}`}
        description={description}
        canonicalPath="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name,
          jobTitle: headline,
          description,
          url: window.location.origin,
          ...(sameAs.length > 0 ? { sameAs } : {}),
        }}
      />
      <Hero />
      <About />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <CredentialsSection />
      <ServicesSection />
      <TestimonialsSection />
      <BlogPreview />
      <ContactSection />
    </PageShell>
  );
}
