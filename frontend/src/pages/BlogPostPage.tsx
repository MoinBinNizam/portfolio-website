import { Link, useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useBlogPostBySlug } from '../features/blog/queries';
import { formatShortDate } from '../lib/dates';
import { MarkdownBody } from '../lib/markdown';
import { Seo } from '../lib/seo';

export function BlogPostPage() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useBlogPostBySlug(slug);

  return (
    <PageShell>
      <Seo
        title={post ? `${post.seo?.metaTitle || post.title} — Moin Uddin` : 'Article — Moin Uddin'}
        description={post?.seo?.metaDescription || post?.excerpt || 'Technical blog post.'}
        canonicalPath={`/blog/${slug ?? ''}`}
        jsonLd={
          post
            ? {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.excerpt,
                datePublished: post.publishedAt ?? post.createdAt,
                author: {
                  '@type': 'Person',
                  name: 'Moin Uddin',
                },
              }
            : undefined
        }
      />
      <section className="py-16">
        <Container className="max-w-3xl space-y-8">
          <div>
            <Link
              to="/blog"
              className="text-xs font-semibold text-accent underline-offset-4 hover:underline"
            >
              &larr; All articles
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : isError || !post ? (
            <EmptyState
              title="Article not found"
              description="This article may be a draft or has been moved."
            />
          ) : (
            <article className="space-y-6">
              <header className="space-y-3 border-b border-border pb-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-textMuted">
                  <span>{post.category}</span>
                  <span>&middot;</span>
                  <span>{formatShortDate(post.publishedAt ?? post.createdAt)}</span>
                  <span>&middot;</span>
                  <span>{post.readingTime ?? 1} min read</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-textPrimary sm:text-4xl">
                  {post.title}
                </h1>
                <p className="text-base text-textMuted">{post.excerpt}</p>
                {post.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((t) => (
                      <Link key={t} to={`/blog/tag/${encodeURIComponent(t)}`}>
                        <Badge>{t}</Badge>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </header>

              {post.coverImage?.url ? (
                <img
                  src={post.coverImage.url}
                  alt={post.coverImage.alt || post.title}
                  className="aspect-video w-full rounded-card border border-border object-cover"
                />
              ) : null}

              <MarkdownBody content={post.body} />
            </article>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
