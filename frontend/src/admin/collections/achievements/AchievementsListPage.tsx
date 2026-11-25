import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';
import {
  useAchievementsAdminList,
  useDeleteAchievement,
  useReorderAchievements,
} from '../../../features/achievements/queries';
import { SortableList } from '../../../forms/SortableList';
import { formatMonthYear } from '../../../lib/dates';
import { AdminShell } from '../../AdminShell';

export function AchievementsListPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const { notify } = useToast();

  const {
    data: items,
    isLoading,
    error,
  } = useAchievementsAdminList({
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
    q: search || undefined,
  });
  const reorderMutation = useReorderAchievements();
  const deleteMutation = useDeleteAchievement();

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      notify('Achievement deleted', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete achievement', 'error');
    }
  };

  const handleReorder = async (ids: string[]) => {
    try {
      await reorderMutation.mutateAsync(ids);
      notify('Order updated', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to reorder', 'error');
    }
  };

  return (
    <AdminShell title="Achievements">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Achievements</h1>
          <p className="text-sm text-textMuted">
            Manage awards, competitions, publications, speaking, and trainings.
          </p>
        </div>
        <Link
          to="/admin/achievements/new"
          className="rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
        >
          New achievement
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            type="search"
            placeholder="Search by title or issuer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-44">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
            <option value="award">Award</option>
            <option value="competition">Competition</option>
            <option value="publication">Publication</option>
            <option value="speaking">Speaking</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div className="w-40">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : error ? (
        <EmptyState
          title="Could not load achievements"
          description={error instanceof Error ? error.message : 'Sign in or check the API server.'}
        />
      ) : !items || items.length === 0 ? (
        <EmptyState
          title="No achievements found"
          description="Create an achievement or clear the active filter."
        />
      ) : (
        <SortableList
          items={items}
          onReorder={handleReorder}
          disabled={reorderMutation.isPending}
          renderRow={(item) => (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-textPrimary">{item.title}</span>
                  <Badge>{item.category}</Badge>
                  <Badge variant={item.status === 'published' ? 'accent' : 'neutral'}>
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-textMuted">
                  {item.issuer} &middot; {formatMonthYear(item.date)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/achievements/${item._id}`}
                  className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textPrimary hover:border-accent"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id, item.title)}
                  className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-highlight hover:border-highlight"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        />
      )}
    </AdminShell>
  );
}
