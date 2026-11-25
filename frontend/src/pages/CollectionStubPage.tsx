import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Seo } from '../lib/seo';

interface CollectionStubPageProps {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
}

export function CollectionStubPage({ eyebrow, title, description, path }: CollectionStubPageProps) {
  return (
    <PageShell>
      <Seo title={`${title} — Moin Uddin`} description={description} canonicalPath={path} />
      <section className="py-16">
        <Container>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <EmptyState
            title={`No published ${eyebrow.toLowerCase()} entries yet`}
            description="This page is wired to the router and will display full entries once published."
            action={
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-button border border-border bg-surface px-4 py-2 text-sm font-medium text-textPrimary hover:border-accent"
              >
                Return home
              </Link>
            }
          />
        </Container>
      </section>
    </PageShell>
  );
}
