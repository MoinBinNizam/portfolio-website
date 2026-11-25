import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';
import { Seo } from '../lib/seo';

export function NotFoundPage() {
  return (
    <PageShell>
      <Seo
        title="Page Not Found — Moin Uddin"
        description="The requested page could not be found."
      />
      <section className="py-20">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">404</p>
          <h1 className="mt-2 text-3xl font-bold text-textPrimary sm:text-4xl">Page not found</h1>
          <p className="mt-3 max-w-md text-base text-textMuted">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-accentText hover:bg-accentHover"
            >
              Back to home
            </Link>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
