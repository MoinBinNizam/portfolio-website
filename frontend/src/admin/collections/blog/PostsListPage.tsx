import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';
import {
  useBlogAdminList,
  useDeletePost,
  usePublishPost,
  useUnpublishPost,
} from '../../../features/blog/queries';
import { formatShortDate } from '../../../lib/dates';
import { AdminShell } from '../../AdminShell';

export function PostsListPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { notify } = useToast();

  const {
    data: items,
    isLoading,
    error,
  } = useBlogAdminList({
    status: statusFilter || undefined,
    q: search || undefined,
  });
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();
  const deleteMutation = useDeletePost();

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await unpublishMutation.mutateAsync(id);
        notify('Post moved to draft', 'success');
      } else {
        await publishMutation.mutateAsync(id);
        notify('Post published', 'success');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Action failed', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete post "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      notify('Post deleted', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  return (
    <AdminShell title="Blog">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Blog Posts</h1>
          <p className="text-sm text-textMuted">Write, preview, publish, and manage articles.</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
        >
          New post
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : error ? (
        <EmptyState
          title="Could not load posts"
          description={error instanceof Error ? error.message : 'Check the API server.'}
        />
      ) : !items || items.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Write your first blog post or clear the active filter."
        />
      ) : (
        <div className="divide-y divide-border rounded-card border border-border bg-surface">
          {items.map((post) => (
            <div key={post._id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-textPrimary">{post.title}</span>
                  <Badge variant={post.status === 'published' ? 'accent' : 'neutral'}>
                    {post.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-textMuted">
                  /blog/{post.slug} &middot; {post.readingTime ?? 1} min read &middot;{' '}
                  {formatShortDate(post.publishedAt ?? post.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(post._id, post.status === 'published')}
                  className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textPrimary hover:border-accent"
                >
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <Link
                  to={`/admin/blog/${post._id}`}
                  className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textPrimary hover:border-accent"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post._id, post.title)}
                  className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-highlight hover:border-highlight"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
