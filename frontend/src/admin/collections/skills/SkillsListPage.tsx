import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';
import {
  useDeleteSkill,
  useReorderSkills,
  useSkillsAdminList,
} from '../../../features/skills/queries';
import { SortableList } from '../../../forms/SortableList';
import { AdminShell } from '../../AdminShell';

export function SkillsListPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const { notify } = useToast();

  const {
    data: items,
    isLoading,
    error,
  } = useSkillsAdminList({
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
    q: search || undefined,
  });
  const reorderMutation = useReorderSkills();
  const deleteMutation = useDeleteSkill();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete skill "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      notify('Skill deleted', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete skill', 'error');
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
    <AdminShell title="Skills">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Skills</h1>
          <p className="text-sm text-textMuted">
            Manage skills grouped by category with 1–5 proficiency levels.
          </p>
        </div>
        <Link
          to="/admin/skills/new"
          className="rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
        >
          New skill
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            type="search"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="tools">Tools</option>
            <option value="design">Design</option>
            <option value="cms">CMS</option>
          </Select>
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
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : error ? (
        <EmptyState
          title="Could not load skills"
          description={error instanceof Error ? error.message : 'Check the API server.'}
        />
      ) : !items || items.length === 0 ? (
        <EmptyState
          title="No skills found"
          description="Create your first skill or clear the active filter."
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
                  <Badge>{item.category}</Badge>
                  <Badge variant="accent">Level {item.level}/5</Badge>
                  <Badge variant={item.status === 'published' ? 'accent' : 'neutral'}>
                    {item.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/skills/${item._id}`}
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
