import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { useAdminDashboard } from '../features/auth/queries';
import { AdminShell } from './AdminShell';

export function DashboardPage() {
  const { data, isLoading } = useAdminDashboard();
  const counts = data?.counts;

  const cards = [
    { label: 'Experience', count: counts?.experience ?? 0, to: '/admin/experience' },
    { label: 'Education', count: counts?.education ?? 0, to: '/admin/education' },
    { label: 'Certifications', count: counts?.certifications ?? 0, to: '/admin/certifications' },
    { label: 'Achievements', count: counts?.achievements ?? 0, to: '/admin/achievements' },
    { label: 'Projects', count: counts?.projects ?? 0, to: '/admin/projects' },
    { label: 'Skills', count: counts?.skills ?? 0, to: '/admin/skills' },
    { label: 'Services', count: counts?.services ?? 0, to: '/#services' },
    { label: 'Blog Posts', count: counts?.posts ?? 0, to: '/blog' },
    {
      label: 'Unread Messages',
      count: counts?.unreadMessages ?? 0,
      to: '/admin/messages',
      highlight: (counts?.unreadMessages ?? 0) > 0,
    },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Owner Dashboard</h1>
          <p className="text-sm text-textMuted">
            Overview of portfolio collections, profile, and contact messages.
          </p>
        </div>
        <Link
          to="/admin/profile"
          className="rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
        >
          Edit profile &amp; socials
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((item) => (
            <Link key={item.label} to={item.to} className="block">
              <Card className="hover:border-accent">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-textMuted">
                  {item.label}
                </p>
                <p
                  className={`mt-2 text-3xl font-bold ${
                    item.highlight ? 'text-highlight' : 'text-textPrimary'
                  }`}
                >
                  {item.count}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
