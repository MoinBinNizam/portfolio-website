import { useEffect } from 'react';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { BrandLogo } from './BrandLogo';

export interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
}

export function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background p-6 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <BrandLogo onClick={onClose} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="rounded-button border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-textPrimary hover:border-accent"
        >
          Close
        </button>
      </div>

      <nav aria-label="Mobile links" className="mt-8 flex flex-1 flex-col gap-4">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="border-b border-border/60 pb-3 text-lg font-medium text-textPrimary transition-colors duration-fast hover:text-accent"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-textMuted">Appearance</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
