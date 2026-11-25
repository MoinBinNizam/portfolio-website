import type { FileAsset } from '@portfolio/shared';
import { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { CertificateViewer } from '../components/media/CertificateViewer';
import { Badge } from '../components/ui/Badge';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton } from '../components/ui/Skeleton';
import { useCertificationsPublicList } from '../features/certifications/queries';
import { formatMonthYear } from '../lib/dates';
import { Seo } from '../lib/seo';

export function CertificationsPage() {
  const { data: items, isLoading } = useCertificationsPublicList();
  const [viewerItem, setViewerItem] = useState<{ title: string; file: FileAsset } | null>(null);
  const list = items ?? [];

  return (
    <PageShell>
      <Seo
        title="Certifications — Moin Uddin"
        description="Verified professional certifications and technical credentials."
        canonicalPath="/certifications"
      />
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Certifications"
            icon="award"
            title="Verified credentials"
            description="Professional certifications with verification links and certificate scans."
          />

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              title="No published certifications yet"
              description="Certifications will appear here once uploaded and published from the admin panel."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((cert) => (
                <article
                  key={cert._id}
                  className="flex flex-col justify-between rounded-card border border-border bg-surface p-6"
                >
                  <div>
                    <p className="text-xs font-medium text-textMuted">
                      {cert.issuer} &middot; {formatMonthYear(cert.issueDate)}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-textPrimary">{cert.title}</h2>
                    {cert.credentialId ? (
                      <p className="mt-1 text-xs text-textMuted">ID: {cert.credentialId}</p>
                    ) : null}
                    {cert.skills.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {cert.skills.map((skill) => (
                          <Badge key={skill}>{skill}</Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                    {cert.certificateFile ? (
                      cert.certificateFile.mimeType === 'application/pdf' ? (
                        <a
                          href={cert.certificateFile.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-accent underline-offset-4 hover:underline"
                        >
                          View certificate (PDF) &rarr;
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setViewerItem({
                              title: cert.title,
                              file: cert.certificateFile as FileAsset,
                            })
                          }
                          className="text-xs font-semibold text-accent underline-offset-4 hover:underline"
                        >
                          View certificate &rarr;
                        </button>
                      )
                    ) : null}

                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-textMuted underline-offset-4 hover:text-textPrimary hover:underline"
                      >
                        Verify credential
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CertificateViewer
        open={Boolean(viewerItem)}
        onClose={() => setViewerItem(null)}
        title={viewerItem?.title ?? ''}
        file={viewerItem?.file ?? null}
      />
    </PageShell>
  );
}
