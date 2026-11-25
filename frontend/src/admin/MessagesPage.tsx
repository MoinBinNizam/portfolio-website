import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useAdminMessages, useMarkMessageRead } from '../features/auth/queries';
import { formatShortDate } from '../lib/dates';
import { AdminShell } from './AdminShell';

export function MessagesPage() {
  const { data: messages, isLoading } = useAdminMessages();
  const markReadMutation = useMarkMessageRead();
  const { notify } = useToast();

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      await markReadMutation.mutateAsync({ id, read: !currentRead });
      notify(!currentRead ? 'Marked as read' : 'Marked as unread', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update message', 'error');
    }
  };

  return (
    <AdminShell title="Messages">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-textPrimary">Contact Messages</h1>
        <p className="text-sm text-textMuted">Messages submitted from the public contact form.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : !messages || messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Submissions from the public contact form will appear here."
        />
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <article key={msg._id} className="rounded-card border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-textPrimary">{msg.name}</h2>
                    <Badge variant={msg.read ? 'neutral' : 'highlight'}>
                      {msg.read ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                  <p className="text-xs text-textMuted">
                    <a href={`mailto:${msg.email}`} className="hover:text-accent">
                      {msg.email}
                    </a>{' '}
                    &middot; {formatShortDate(msg.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(msg._id, msg.read)}
                  className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textPrimary hover:border-accent"
                >
                  {msg.read ? 'Mark unread' : 'Mark read'}
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-textPrimary">{msg.message}</p>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
