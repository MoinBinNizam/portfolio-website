import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';
import {
  useDeleteTestimonial,
  useReorderTestimonials,
  useTestimonialsAdminList,
} from '../../../features/testimonials/queries';
import { SortableList } from '../../../forms/SortableList';
import { AdminShell } from '../../AdminShell';

export function TestimonialsListPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { notify } = useToast();

  const {
    data: items,
    isLoading,
    error,
  } = useTestimonialsAdminList({
    status: statusFilter || undefined,
    q: search || undefined,
  });
  const reorderMutation = useReorderTestimonials();
  const deleteMutation = useDeleteTestimonial();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      notify('Testimonial deleted', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete testimonial', 'error');
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
    <AdminShell title="Testimonials">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Testimonials</h1>
          <p className="text-sm text-textMuted">
            Add client reviews with photo, designation, company, and star rating.
          </p>
        </div>
        <Link
          to="/admin/testimonials/new"
          className="rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
        >
          New testimonial
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            type="search"
            placeholder="Search by name or company..."
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
          title="Could not load testimonials"
          description={error instanceof Error ? error.message : 'Check the API server.'}
        />
      ) : !items || items.length === 0 ? (
        <EmptyState
          title="No testimonials found"
          description="Add your first client review or clear the active filter."
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
                  <span className="font-semibold text-textPrimary">{item.name}</span>
                  <Badge variant="accent">{item.rating}/5 stars</Badge>
                  {item.verified ? <Badge variant="accent">Verified</Badge> : null}
                  <Badge variant={item.status === 'published' ? 'accent' : 'neutral'}>
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-textMuted">
                  {item.role}
                  {item.company ? `, ${item.company}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/testimonials/${item._id}`}
                  className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textPrimary hover:border-accent"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id, item.name)}
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
