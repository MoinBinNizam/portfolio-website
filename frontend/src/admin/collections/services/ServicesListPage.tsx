import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';
import {
  useDeleteService,
  useReorderServices,
  useServicesAdminList,
} from '../../../features/services/queries';
import { SortableList } from '../../../forms/SortableList';
import { AdminShell } from '../../AdminShell';

export function ServicesListPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { notify } = useToast();

  const {
    data: items,
    isLoading,
    error,
  } = useServicesAdminList({
    status: statusFilter || undefined,
    q: search || undefined,
  });
  const reorderMutation = useReorderServices();
  const deleteMutation = useDeleteService();

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete service "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      notify('Service deleted', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete service', 'error');
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
    <AdminShell title="Services">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Services</h1>
          <p className="text-sm text-textMuted">Manage services offered to clients.</p>
        </div>
        <Link
          to="/admin/services/new"
          className="rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
        >
          New service
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            type="search"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : error ? (
        <EmptyState
          title="Could not load services"
          description={error instanceof Error ? error.message : 'Check the API server.'}
        />
      ) : !items || items.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Create your first service or clear the active filter."
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
                  <Badge variant={item.status === 'published' ? 'accent' : 'neutral'}>
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-textMuted">{item.summary || item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/services/${item._id}`}
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
