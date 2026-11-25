import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { SectionIcon, type IconName } from '../components/ui/SectionIcon';
import { Skeleton } from '../components/ui/Skeleton';
import { useAdminDashboard } from '../features/auth/queries';
import { AdminShell } from './AdminShell';

interface StatItem {
  label: string;
  count: number;
  to: string;
  icon: IconName;
  highlight?: boolean;
}

export function DashboardPage() {
  const { data, isLoading } = useAdminDashboard();
  const counts = data?.counts;

  const stats: StatItem[] = [
    { label: 'Projects', count: counts?.projects ?? 0, to: '/admin/projects', icon: 'layers' },
    { label: 'Blog Posts', count: counts?.posts ?? 0, to: '/admin/blog', icon: 'book' },
    {
      label: 'Experience',
      count: counts?.experience ?? 0,
      to: '/admin/experience',
      icon: 'briefcase',
    },
    { label: 'Skills', count: counts?.skills ?? 0, to: '/admin/skills', icon: 'code' },
    { label: 'Services', count: counts?.services ?? 0, to: '/admin/services', icon: 'zap' },
    {
      label: 'Education',
      count: counts?.education ?? 0,
      to: '/admin/education',
      icon: 'graduation',
    },
    {
      label: 'Certificates',
      count: counts?.certifications ?? 0,
      to: '/admin/certifications',
      icon: 'award',
    },
    {
      label: 'Achievements',
      count: counts?.achievements ?? 0,
      to: '/admin/achievements',
      icon: 'shield',
    },
    {
      label: 'Unread Inbox',
      count: counts?.unreadMessages ?? 0,
      to: '/admin/messages',
      icon: 'mail',
      highlight: (counts?.unreadMessages ?? 0) > 0,
    },
    {
      label: 'Total Inbox',
      count: counts?.totalMessages ?? 0,
      to: '/admin/messages',
      icon: 'megaphone',
    },
  ];

  const distribution = stats.slice(0, 8);
  const totalContentItems = distribution.reduce((sum, item) => sum + item.count, 0);
  const maxContentCount = Math.max(1, ...distribution.map((item) => item.count));
  const unreadCount = counts?.unreadMessages ?? 0;
  const totalMessages = counts?.totalMessages ?? 0;

  return (
    <AdminShell title="Dashboard">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Owner Dashboard</h1>
          <p className="text-sm text-textMuted">
            Portfolio health, content distribution, inbox status, and quick actions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/projects/new"
            className="rounded-button border border-border bg-surface px-4 py-2 text-xs font-semibold text-textPrimary transition-colors duration-fast hover:border-accent"
          >
            + New project
          </Link>
          <Link
            to="/admin/blog/new"
            className="rounded-button border border-border bg-surface px-4 py-2 text-xs font-semibold text-textPrimary transition-colors duration-fast hover:border-accent"
          >
            + New article
          </Link>
          <Link
            to="/admin/profile"
            className="rounded-button bg-accent px-4 py-2 text-xs font-semibold text-accentText transition-colors duration-fast hover:bg-accentHover"
          >
            Edit profile &amp; CV
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="grid gap-5 lg:grid-cols-12">
            <Skeleton className="h-64 w-full lg:col-span-7" />
            <Skeleton className="h-64 w-full lg:col-span-5" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((item) => (
              <Link key={item.label} to={item.to} className="group block">
                <Card className="!p-4 hover:border-accent">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-textMuted">
                      {item.label}
                    </span>
                    <SectionIcon
                      name={item.icon}
                      className={`h-4 w-4 shrink-0 ${
                        item.highlight ? 'text-highlight' : 'text-accent'
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-2 text-2xl font-bold tracking-tight ${
                      item.highlight ? 'text-highlight' : 'text-textPrimary'
                    }`}
                  >
                    {item.count}
                  </p>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            <Card className="lg:col-span-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-textPrimary">
                    Portfolio Content Distribution
                  </h2>
                  <p className="text-xs text-textMuted">
                    {totalContentItems} total records across 8 portfolio collections
                  </p>
                </div>
                <Badge variant="accent">{totalContentItems} items</Badge>
              </div>

              <div className="space-y-3">
                {distribution.map((item) => {
                  const pct = Math.round((item.count / maxContentCount) * 100);
                  return (
                    <Link key={item.label} to={item.to} className="group block">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-textPrimary group-hover:text-accent">
                          {item.label}
                        </span>
                        <span className="font-semibold text-textMuted">{item.count}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surfaceAlt">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-300"
                          style={{ width: `${Math.max(pct, item.count > 0 ? 6 : 0)}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>

            <div className="space-y-5 lg:col-span-5">
              <Card>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-textPrimary">Inbox &amp; Leads</h2>
                  <Badge variant={unreadCount > 0 ? 'highlight' : 'accent'}>
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-textMuted">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread inquiry message${unreadCount === 1 ? '' : 's'} out of ${totalMessages} total.`
                    : `All ${totalMessages} contact message${totalMessages === 1 ? '' : 's'} have been reviewed.`}
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/messages"
                    className="inline-flex items-center text-xs font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    Open contact inbox &rarr;
                  </Link>
                </div>
              </Card>

              <Card>
                <h2 className="text-base font-semibold text-textPrimary">Site Readiness</h2>
                <ul className="mt-3 space-y-2 text-xs text-textMuted">
                  <li className="flex items-center justify-between">
                    <span>Case studies &amp; projects</span>
                    <Badge variant={(counts?.projects ?? 0) > 0 ? 'accent' : 'neutral'}>
                      {(counts?.projects ?? 0) > 0 ? 'Active' : 'Empty'}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Engineering articles</span>
                    <Badge variant={(counts?.posts ?? 0) > 0 ? 'accent' : 'neutral'}>
                      {(counts?.posts ?? 0) > 0 ? 'Active' : 'Empty'}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Service offerings</span>
                    <Badge variant={(counts?.services ?? 0) > 0 ? 'accent' : 'neutral'}>
                      {(counts?.services ?? 0) > 0 ? 'Active' : 'Empty'}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Certifications</span>
                    <Badge variant={(counts?.certifications ?? 0) > 0 ? 'accent' : 'neutral'}>
                      {(counts?.certifications ?? 0) > 0 ? 'Visible' : 'Auto-hidden'}
                    </Badge>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
