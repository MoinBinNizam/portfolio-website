import { useState, type FormEvent } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../components/ui/Toast';
import { useAdminMessages, useMarkMessageRead, useReplyToMessage } from '../features/auth/queries';
import { formatShortDate } from '../lib/dates';
import { AdminShell } from './AdminShell';

export function MessagesPage() {
  const { data: messages, isLoading } = useAdminMessages();
  const markReadMutation = useMarkMessageRead();
  const replyMutation = useReplyToMessage();
  const { notify } = useToast();

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      await markReadMutation.mutateAsync({ id, read: !currentRead });
      notify(!currentRead ? 'Marked as read' : 'Marked as unread', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update message', 'error');
    }
  };

  const openReply = (id: string, senderName: string) => {
    setReplyingToId(id);
    setReplySubject(`Re: Your inquiry to Moin Uddin`);
    setReplyBody(`Hi ${senderName},\n\nThank you for reaching out.\n\n`);
  };

  const handleSendReply = async (e: FormEvent, id: string) => {
    e.preventDefault();
    try {
      await replyMutation.mutateAsync({
        id,
        subject: replySubject.trim(),
        message: replyBody.trim(),
      });
      notify('Reply sent to sender email', 'success');
      setReplyingToId(null);
      setReplySubject('');
      setReplyBody('');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to send reply', 'error');
    }
  };

  return (
    <AdminShell title="Messages">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-textPrimary">Contact Messages</h1>
        <p className="text-sm text-textMuted">
          Messages from the public contact form. Reply directly here or from your Gmail inbox.
        </p>
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
          {messages.map((msg) => {
            const isReplying = replyingToId === msg._id;
            const replies = msg.replies ?? [];

            return (
              <article key={msg._id} className="rounded-card border border-border bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-textPrimary">{msg.name}</h2>
                      <Badge variant={msg.read ? 'neutral' : 'highlight'}>
                        {msg.read ? 'Read' : 'Unread'}
                      </Badge>
                      {replies.length > 0 ? <Badge variant="accent">Replied</Badge> : null}
                    </div>
                    <p className="mt-0.5 text-xs text-textMuted">
                      <a href={`mailto:${msg.email}`} className="hover:text-accent">
                        {msg.email}
                      </a>{' '}
                      &middot; {formatShortDate(msg.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        isReplying ? setReplyingToId(null) : openReply(msg._id, msg.name)
                      }
                      className="rounded-button bg-accent px-3 py-1.5 text-xs font-semibold text-accentText hover:bg-accentHover"
                    >
                      {isReplying ? 'Cancel' : 'Reply'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleRead(msg._id, msg.read)}
                      className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-textPrimary hover:border-accent"
                    >
                      {msg.read ? 'Mark unread' : 'Mark read'}
                    </button>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm text-textPrimary">{msg.message}</p>

                {replies.length > 0 ? (
                  <div className="mt-4 space-y-2 border-t border-border pt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                      Sent Replies ({replies.length})
                    </p>
                    {replies.map((rep, idx) => (
                      <div
                        key={idx}
                        className="rounded-input border border-border bg-background p-3 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 text-textMuted">
                          <span className="font-semibold text-textPrimary">{rep.subject}</span>
                          <span>{formatShortDate(rep.sentAt)}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-textMuted">{rep.message}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {isReplying ? (
                  <form
                    onSubmit={(e) => handleSendReply(e, msg._id)}
                    className="mt-4 space-y-3 border-t border-border pt-4"
                  >
                    <div>
                      <label
                        htmlFor={`reply-subject-${msg._id}`}
                        className="mb-1 block text-xs font-medium text-textMuted"
                      >
                        Subject
                      </label>
                      <Input
                        id={`reply-subject-${msg._id}`}
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`reply-body-${msg._id}`}
                        className="mb-1 block text-xs font-medium text-textMuted"
                      >
                        Reply to {msg.email}
                      </label>
                      <Textarea
                        id={`reply-body-${msg._id}`}
                        rows={4}
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="submit" disabled={replyMutation.isPending}>
                        {replyMutation.isPending ? 'Sending...' : 'Send reply'}
                      </Button>
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(replySubject)}`}
                        className="text-xs font-medium text-textMuted hover:text-accent"
                      >
                        Open in mail app &rarr;
                      </a>
                    </div>
                  </form>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
