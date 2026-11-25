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
    <section id="blog" className="border-t border-border py-16">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Engineering Blog"
              icon="book"
              title="Technical Articles on MERN, TypeScript &amp; System Architecture"
              description="Practical notes on full-stack architecture, validation, and web performance."
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
                <article
                  key={post._id}
                  className="rounded-card border border-border bg-surface p-5 transition-colors duration-fast hover:border-accent"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-textMuted">
                    <span>{formatShortDate(post.publishedAt ?? post.createdAt)}</span>
                    <span>{post.readingTime ?? 1} min read</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-textPrimary">
                    <Link to={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-textMuted">{post.excerpt}</p>
                  {post.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
