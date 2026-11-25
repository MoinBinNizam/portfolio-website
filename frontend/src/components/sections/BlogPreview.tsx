import { Link } from 'react-router-dom';
import { usePublicPosts } from '../../features/public/queries';
import { formatShortDate } from '../../lib/dates';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function BlogPreview() {
  const { data, isLoading } = usePublicPosts({ page: 1, limit: 3 });
  const posts = data?.data ?? [];

  return (
    <section id="blog" className="border-t border-border py-12 lg:py-14">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Engineering Blog"
              icon="book"
              title="Technical Articles on MERN, TypeScript &amp; System Architecture"
              description="Notes on full-stack TypeScript, APIs, and performance."
            />
            <Link
              to="/blog"
              className="mb-8 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              All posts &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              title="No articles published yet"
              description="Published blog posts will appear here once written in the admin panel."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="group block h-full rounded-card focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-colors duration-fast group-hover:border-accent">
                    {post.coverImage?.url ? (
                      <img
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        width={post.coverImage.width ?? 640}
                        height={post.coverImage.height ?? 360}
                        className="aspect-[16/9] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[16/9] w-full items-end bg-surfaceAlt p-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                          {post.category || 'Engineering Article'}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2 text-xs text-textMuted">
                        <Badge variant="accent">{post.category || 'Article'}</Badge>
                        <span>{formatShortDate(post.publishedAt ?? post.createdAt)}</span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-textPrimary group-hover:text-accent">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-textMuted">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-textMuted">
                        <span>{post.readingTime ?? 1} min read</span>
                        <span className="font-semibold text-accent">Read article &rarr;</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
