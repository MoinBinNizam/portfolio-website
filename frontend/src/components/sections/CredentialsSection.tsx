import { Link } from 'react-router-dom';
import {
  usePublicAchievements,
  usePublicCertifications,
  usePublicEducation,
} from '../../features/public/queries';
import { formatMonthYear } from '../../lib/dates';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { EmptyState } from '../ui/EmptyState';
import { SectionHeading } from '../ui/SectionHeading';
import { Skeleton } from '../ui/Skeleton';

export function CredentialsSection() {
  const { data: education, isLoading: eduLoading } = usePublicEducation();
  const { data: certifications, isLoading: certLoading } = usePublicCertifications();
  const { data: achievements, isLoading: achLoading } = usePublicAchievements();

  const eduList = (education ?? []).slice(0, 3);
  const certList = (certifications ?? []).slice(0, 3);
  const achList = (achievements ?? []).slice(0, 3);

  return (
    <section id="credentials" className="border-t border-border py-16">
      <Container className="space-y-14">
        {/* Education */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Education" title="Academic background" />
            <Link
              to="/education"
              className="mb-8 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              All education &rarr;
            </Link>
          </div>
          {eduLoading ? (
            <Skeleton className="h-28 w-full" />
          ) : eduList.length === 0 ? (
            <EmptyState
              title="No education entries published yet"
              description="Published education records will appear here."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {eduList.map((item) => (
                <div key={item._id} className="rounded-card border border-border bg-surface p-5">
                  <p className="text-xs font-medium text-textMuted">
                    {item.startYear ? `${item.startYear} – ` : ''}
                    {item.endYear ?? 'Present'}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-textPrimary">
                    {item.degree}
                    {item.field && !item.degree.toLowerCase().includes(item.field.toLowerCase())
                      ? ` in ${item.field}`
                      : ''}
                  </h3>
                  <p className="mt-1 text-sm text-textMuted">{item.institution}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Certifications" title="Verified credentials" />
            <Link
              to="/certifications"
              className="mb-8 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              All certifications &rarr;
            </Link>
          </div>
          {certLoading ? (
            <Skeleton className="h-28 w-full" />
          ) : certList.length === 0 ? (
            <EmptyState
              title="No certifications published yet"
              description="Published certifications will appear here."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {certList.map((item) => (
                <div key={item._id} className="rounded-card border border-border bg-surface p-5">
                  <p className="text-xs font-medium text-textMuted">
                    {item.issuer} &middot; {formatMonthYear(item.issueDate)}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-textPrimary">{item.title}</h3>
                  {item.credentialUrl ? (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-xs font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      Verify credential &rarr;
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Achievements" title="Awards &amp; recognition" />
            <Link
              to="/achievements"
              className="mb-8 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              All achievements &rarr;
            </Link>
          </div>
          {achLoading ? (
            <Skeleton className="h-28 w-full" />
          ) : achList.length === 0 ? (
            <EmptyState
              title="No achievements published yet"
              description="Published achievements will appear here."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {achList.map((item) => (
                <div key={item._id} className="rounded-card border border-border bg-surface p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge>{item.category}</Badge>
                    <span className="text-xs text-textMuted">{formatMonthYear(item.date)}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-textPrimary">{item.title}</h3>
                  <p className="mt-1 text-xs text-textMuted">{item.issuer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
