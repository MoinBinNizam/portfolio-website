import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SectionIcon } from '../components/ui/SectionIcon';
import {
  usePublicAchievements,
  usePublicCertifications,
  usePublicEducation,
  usePublicExperience,
  usePublicProfile,
  usePublicProjects,
  usePublicSkills,
} from '../features/public/queries';
import { buildStructuredCvHtml, downloadStructuredCv } from '../lib/cvGenerator';
import { Seo } from '../lib/seo';

export function CvPage() {
  const { data: profile } = usePublicProfile();
  const { data: experience } = usePublicExperience();
  const { data: projects } = usePublicProjects();
  const { data: skills } = usePublicSkills();
  const { data: education } = usePublicEducation();
  const { data: achievements } = usePublicAchievements();
  const { data: certifications } = usePublicCertifications();

  const cvData = {
    profile,
    experience: experience ?? [],
    projects: projects ?? [],
    skills: skills ?? [],
    education: education ?? [],
    achievements: achievements ?? [],
    certifications: certifications ?? [],
  };

  const previewHtml = buildStructuredCvHtml(cvData);

  return (
    <PageShell>
      <Seo
        title={`${profile?.name ?? 'Moin Uddin'} - Curriculum Vitae`}
        description="Up-to-date structured CV generated directly from live portfolio records."
        canonicalPath="/cv"
      />
      <section className="py-12">
        <Container className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-textPrimary">Curriculum Vitae</h1>
              <p className="text-sm text-textMuted">
                Live ATS-friendly CV generated from current portfolio records.
              </p>
            </div>
            <Button onClick={() => downloadStructuredCv(cvData)}>
              <SectionIcon name="download" className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>

          <iframe
            title="Live CV Preview"
            srcDoc={previewHtml}
            className="h-[85vh] w-full rounded-card border border-border bg-surface"
          />
        </Container>
      </section>
    </PageShell>
  );
}
