import { useState, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { Container } from '../ui/Container';
import { BrandLogo } from './BrandLogo';
import { MobileMenu, type NavItem } from './MobileMenu';

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Services', href: '/#services' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    event.preventDefault();
    const sectionId = href.slice(hashIndex + 1);
    const scrollToTarget = () => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    if (location.pathname === '/') {
      scrollToTarget();
    } else {
      navigate('/');
      window.setTimeout(scrollToTarget, 80);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <Container className="flex items-center justify-between gap-4 py-3">
          <BrandLogo className="h-8 w-auto shrink-0 sm:h-9" />

          <div className="ml-auto flex items-center gap-6">
            <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-medium text-textMuted transition-colors duration-fast hover:text-textPrimary"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="inline-flex items-center justify-center rounded-button border border-border bg-surface p-2 text-textPrimary transition-colors duration-fast hover:border-accent lg:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={NAV_ITEMS}
        onItemClick={handleNavClick}
      />
    </>
  );
}
