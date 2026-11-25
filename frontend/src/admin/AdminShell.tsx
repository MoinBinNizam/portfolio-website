import { useEffect, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/layout/BrandLogo';
import { Container } from '../components/ui/Container';
import { useLogout } from '../features/auth/queries';
import { ThemeToggle } from '../theme/ThemeToggle';

const ADMIN_LINKS = [
  { label: 'Dashboard', to: '/admin', exact: true },
  { label: 'Profile', to: '/admin/profile' },
  { label: 'Experience', to: '/admin/experience' },
  { label: 'Education', to: '/admin/education' },
  { label: 'Certifications', to: '/admin/certifications' },
  { label: 'Achievements', to: '/admin/achievements' },
  { label: 'Messages', to: '/admin/messages' },
];

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const location = useLocation();
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

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      <header className="border-b border-border bg-surface">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <BrandLogo />
            <nav aria-label="Admin navigation" className="flex flex-wrap items-center gap-4">
              {ADMIN_LINKS.map((item) => {
                const active = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`text-sm font-medium ${
                      active ? 'text-accent' : 'text-textMuted hover:text-textPrimary'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs font-medium text-textMuted hover:text-textPrimary">
              View site
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textMuted hover:border-highlight hover:text-highlight"
            >
              Sign out
            </button>
          </div>
        </Container>
      </header>
      <main className="py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
