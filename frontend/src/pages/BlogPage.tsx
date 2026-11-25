import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { useBlogPublicList, useBlogTags } from '../features/blog/queries';
import { formatShortDate } from '../lib/dates';
import { Seo } from '../lib/seo';

export function BlogPage({ initialTag }: { initialTag?: string }) {
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState(initialTag ?? '');
  const [search, setSearch] = useState('');

  const { data: tagsData } = useBlogTags();
  const { data, isLoading } = useBlogPublicList({
    page,
    limit: 9,
    tag: tag || undefined,
    q: search.trim() || undefined,
  });

  const posts = data?.data ?? [];
  const meta = data?.meta;
  const tags = tagsData ?? [];

  return (
    <PageShell>
      <Seo
        title={tag ? `${tag} Articles — Moin Uddin` : 'Blog — Moin Uddin'}
        description="Technical articles on MERN, TypeScript, system architecture, and web performance."
        canonicalPath={tag ? `/blog/tag/${tag}` : '/blog'}
      />
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Engineering Blog"
            title={tag ? `Articles tagged "${tag}"` : 'Technical Articles & Notes'}
            description="Practical lessons on full-stack TypeScript, API design, and web performance."
          />

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTag('');
                  setPage(1);
                }}
                className={`rounded-button border px-3 py-1.5 text-xs font-medium ${
                  !tag
                    ? 'border-accent bg-accent text-accentText'
                    : 'border-border bg-surface text-textMuted hover:border-accent'
                }`}
              >
                All
              </button>
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTag(t);
                    setPage(1);
                  }}
                  className={`rounded-button border px-3 py-1.5 text-xs font-medium ${
                    tag === t
                      ? 'border-accent bg-accent text-accentText'
                      : 'border-border bg-surface text-textMuted hover:border-accent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <Input
                type="search"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              title="No matching articles found"
              description="Try clearing the search query or selecting a different tag."
            />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="flex flex-col justify-between rounded-card border border-border bg-surface p-5 transition-colors duration-fast hover:border-accent"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-textMuted">
                        <span>{formatShortDate(post.publishedAt ?? post.createdAt)}</span>
                        <span>{post.readingTime ?? 1} min read</span>
                      </div>
                      <h2 className="mt-3 text-lg font-semibold text-textPrimary">
                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-2 text-sm text-textMuted">{post.excerpt}</p>
                    </div>
                    {post.tags.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.map((t) => (
                          <Link key={t} to={`/blog/tag/${encodeURIComponent(t)}`}>
                            <Badge>{t}</Badge>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>

              {meta ? (
                <div className="mt-10">
                  <Pagination
                    page={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              ) : null}
            </>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
