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
  { label: 'Resume / CV', to: '/cv' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  const { data: profile } = usePublicProfile();

  return (
    <footer className="border-t border-border bg-surface py-10">
      <Container className="space-y-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
          <div className="flex justify-center md:justify-start">
            <BrandLogo className="h-10 w-auto sm:h-12" />
          </div>

          <nav
            aria-label="Footer pages"
            className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-center sm:grid-cols-5 md:text-left"
          >
            {PAGE_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-textMuted transition-colors duration-fast hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <p className="text-center text-xs text-textMuted sm:text-left">
              Copyright {new Date().getFullYear()} {profile?.name ?? 'Moin Uddin'}. All rights
              reserved.
            </p>
            <SocialLinksBar socials={profile?.socials} />
          </div>

          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
