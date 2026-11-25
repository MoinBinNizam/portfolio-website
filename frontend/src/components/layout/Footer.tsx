import { Link } from 'react-router-dom';
import { usePublicProfile } from '../../features/public/queries';
import { Container } from '../ui/Container';
import { BackToTop } from './BackToTop';
import { BrandLogo } from './BrandLogo';
import { SocialLinksBar } from './SocialLinksBar';

const PAGE_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Experience', to: '/experience' },
  { label: 'Education', to: '/education' },
  { label: 'Certifications', to: '/certifications' },
  { label: 'Achievements', to: '/achievements' },
  { label: 'Projects', to: '/projects' },
  { label: 'Services', to: '/services' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  const { data: profile } = usePublicProfile();

  return (
    <footer className="border-t border-border bg-surface py-10">
      <Container className="space-y-8">
        <div className="grid items-center gap-6 md:grid-cols-12">
          <div className="flex justify-center md:col-span-3 md:justify-start">
            <BrandLogo />
          </div>

          <p className="text-center text-sm text-textMuted md:col-span-4">
            {profile?.headline ?? 'Full-Stack MERN & TypeScript Developer'}
          </p>

          <nav
            aria-label="Footer pages"
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:col-span-5 md:justify-end"
          >
            {PAGE_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-textMuted transition-colors duration-fast hover:text-textPrimary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <p className="text-center text-xs text-textMuted sm:text-left">
              &copy; {new Date().getFullYear()} {profile?.name ?? 'Moin Uddin'}. Designed, developed
              &amp; maintained with care. All rights reserved.
            </p>
            <SocialLinksBar socials={profile?.socials} />
          </div>

          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
