import { useEffect, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { ThemeToggle } from '../../theme/ThemeToggle';

export interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  onItemClick?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export function MobileMenu({ open, onClose, items, onItemClick }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-xs flex-col border-l border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="inline-flex items-center justify-center rounded-button border border-border bg-surface p-2 text-textPrimary transition-colors duration-fast hover:border-accent"
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
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <nav
          aria-label="Mobile links"
          className="mt-6 flex flex-1 flex-col gap-2.5 overflow-y-auto"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (onItemClick) {
                  onItemClick(e, item.href);
                } else {
                  onClose();
                }
              }}
              className="block rounded-card border border-border bg-surface px-4 py-3 text-base font-medium text-textPrimary transition-colors duration-fast hover:border-accent hover:bg-surfaceAlt hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-textMuted">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </div>,
    document.body,
  );
}
