import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/layout/BrandLogo';
import { useLogout } from '../features/auth/queries';
import { ThemeToggle } from '../theme/ThemeToggle';

const ADMIN_LINKS = [
  { label: 'Dashboard', to: '/admin', exact: true },
  { label: 'Profile & Socials', to: '/admin/profile' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Skills', to: '/admin/skills' },
  { label: 'Services', to: '/admin/services' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Blog', to: '/admin/blog' },
  { label: 'Experience', to: '/admin/experience' },
  { label: 'Education', to: '/admin/education' },
  { label: 'Certifications', to: '/admin/certifications' },
  { label: 'Achievements', to: '/admin/achievements' },
  { label: 'Messages', to: '/admin/messages' },
];

function SidebarContent({
  onNavigate,
  onLogout,
}: {
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <div className="border-b border-border pb-4">
          <BrandLogo onClick={onNavigate} />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Owner Admin
          </p>
        </div>

        <nav aria-label="Admin sidebar navigation" className="mt-5 space-y-1">
          {ADMIN_LINKS.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={`block rounded-input px-3.5 py-2.5 text-sm font-medium transition-colors duration-fast ${
                  active
                    ? 'bg-accent text-accentText'
                    : 'text-textMuted hover:bg-surfaceAlt hover:text-textPrimary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border/70 pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-button border border-border/70 px-3.5 py-2 text-xs font-semibold text-textMuted transition-colors duration-fast hover:border-highlight hover:text-highlight"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
    document.title = `${title} — Admin — Moin Uddin`;
  }, [title]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background text-textPrimary">
      {/* Desktop Left Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-surface/75 backdrop-blur-md lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {/* Mobile Left Drawer */}
      {drawerOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex bg-background/80 backdrop-blur-sm lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation"
              onClick={() => setDrawerOpen(false)}
            >
              <aside
                className="h-full w-64 border-r border-border/70 bg-surface/85 shadow-xl backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                <SidebarContent onNavigate={() => setDrawerOpen(false)} onLogout={handleLogout} />
              </aside>
            </div>,
            document.body,
          )
        : null}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/70 bg-surface/75 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open admin menu"
              aria-expanded={drawerOpen}
              className="inline-flex items-center justify-center rounded-button border border-border/70 bg-background/80 p-2 text-textPrimary hover:border-accent lg:hidden"
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
            <div className="lg:hidden">
              <BrandLogo />
            </div>
            <span className="hidden text-sm font-semibold tracking-tight text-textPrimary sm:inline">
              Portfolio Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-button border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-textMuted transition-colors duration-fast hover:border-accent hover:text-accent"
            >
              View public site
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
