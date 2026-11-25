import { Link } from 'react-router-dom';
import { usePublicProfile } from '../../features/public/queries';
import { Container } from '../ui/Container';
import { BackToTop } from './BackToTop';
import { BrandLogo } from './BrandLogo';

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
  const socials = profile?.socials;

  const socialEntries = [
    { label: 'GitHub', url: socials?.github },
    { label: 'LinkedIn', url: socials?.linkedin },
    { label: 'X', url: socials?.x },
    { label: 'YouTube', url: socials?.youtube },
    { label: 'Behance', url: socials?.behance },
  ].filter((item): item is { label: string; url: string } => Boolean(item.url));

  return (
    <footer className="border-t border-border bg-surface py-10">
      <Container className="space-y-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="max-w-sm">
            <BrandLogo />
            <p className="mt-2 text-sm text-textMuted">
              {profile?.headline ?? 'Full-Stack MERN & TypeScript Developer'}
            </p>
          </div>

          <nav aria-label="Footer pages" className="flex flex-wrap gap-x-5 gap-y-2">
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

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs text-textMuted">
              &copy; {new Date().getFullYear()} {profile?.name ?? 'Moin Uddin'}. All rights
              reserved.
            </p>
            {socialEntries.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-textMuted underline-offset-4 hover:text-accent hover:underline"
              >
                {item.label}
              </a>
            ))}
          </div>

          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
