import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { Container } from '../ui/Container';
import { MobileMenu, type NavItem } from './MobileMenu';

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container className="flex items-center justify-between py-4">
        <Link
          to="/"
          className="text-base font-bold tracking-tight text-textPrimary transition-colors duration-fast hover:text-accent"
        >
          Moin Uddin
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-textMuted transition-colors duration-fast hover:text-textPrimary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            className="rounded-button border border-border bg-surface px-3.5 py-2 text-sm font-medium text-textPrimary hover:border-accent lg:hidden"
          >
            Menu
          </button>
        </div>
      </Container>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={NAV_ITEMS} />
    </header>
  );
}
