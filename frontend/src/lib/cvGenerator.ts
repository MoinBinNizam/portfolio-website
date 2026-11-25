import type {
  AchievementItem,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProfileItem,
  ProjectItem,
  SkillItem,
} from '../features/public/types';
import { formatMonthYear } from './dates';

interface CvData {
  profile: ProfileItem | null | undefined;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
  certifications: CertificationItem[];
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildStructuredCvHtml(data: CvData): string {
  const { profile, experience, projects, skills, education, achievements, certifications } = data;
  const name = profile?.name ?? 'Moin Uddin';
  const headline =
    profile?.headline ??
    'Software Engineer | MERN · React 18 · Node.js · TypeScript | AI/LLM Integration';

  const contactParts = [
    profile?.phone ? esc(profile.phone) : null,
    profile?.email ? esc(profile.email) : 'moinuddinpkt@gmail.com',
    'moinuddinbd.com',
    profile?.socials?.linkedin ? `LinkedIn: ${esc(profile.socials.linkedin)}` : null,
    profile?.socials?.github ? `GitHub: ${esc(profile.socials.github)}` : null,
    profile?.location ? esc(profile.location) : 'Dhaka, Bangladesh',
  ].filter(Boolean);

  const keyAchievements = experience.flatMap((e) => e.achievements ?? []).slice(0, 8);

  const groupedSkills = skills.reduce<Record<string, string[]>>((acc, s) => {
    const list = acc[s.category] ?? [];
    list.push(s.name);
    acc[s.category] = list;
    return acc;
  }, {});

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(name)} — CV</title>
  <style>
    @page { size: A4; margin: 14mm 16mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #141414;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 11px;
      line-height: 1.48;
    }
    .doc { max-width: 800px; margin: 0 auto; }
    header { border-bottom: 2px solid #0b7a43; padding-bottom: 10px; margin-bottom: 14px; }
    h1 { font-size: 22px; letter-spacing: 0.04em; margin: 0; text-transform: uppercase; }
    .headline { font-size: 12.5px; font-weight: 600; color: #0b7a43; margin: 4px 0 6px; }
    .contact { font-size: 10px; color: #444444; }
    section { margin-bottom: 14px; page-break-inside: avoid; }
    h2 {
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #0b7a43;
      border-bottom: 1px solid #dad7ce;
      padding-bottom: 3px;
      margin: 0 0 8px;
    }
    .item { margin-bottom: 9px; }
    .item-head { display: flex; justify-content: space-between; gap: 12px; font-weight: 700; font-size: 11.5px; }
    .item-sub { font-size: 10.5px; color: #555555; margin-bottom: 3px; }
    ul { margin: 4px 0 0; padding-left: 16px; }
    li { margin-bottom: 2px; }
    .skill-row { margin-bottom: 3px; }
    .skill-cat { font-weight: 700; text-transform: capitalize; }
    .no-print {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 14px;
    }
    .btn {
      background: #0b7a43;
      color: #ffffff;
      border: 0;
      border-radius: 9999px;
      padding: 7px 16px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="doc">
    <div class="no-print">
      <button class="btn" onclick="window.print()">Save / Print as PDF</button>
    </div>

    <header>
      <h1>${esc(name)}</h1>
      <p class="headline">${esc(headline)}</p>
      <p class="contact">${contactParts.join(' &bull; ')}</p>
    </header>

    <section>
      <h2>Career Objective</h2>
      <p>${esc(profile?.intro ?? '')} ${esc(profile?.about ?? '')}</p>
    </section>

    ${
      keyAchievements.length > 0
        ? `<section>
      <h2>Key Achievements</h2>
      <ul>
        ${keyAchievements.map((a) => `<li>${esc(a)}</li>`).join('')}
      </ul>
    </section>`
        : ''
    }

    ${
      experience.length > 0
        ? `<section>
      <h2>Professional Experience</h2>
      ${experience
        .map(
          (e) => `<div class="item">
        <div class="item-head">
          <span>${esc(e.role)} &middot; ${esc(e.company)}</span>
          <span>${esc(formatMonthYear(e.startDate))} &ndash; ${
            e.isCurrent ? 'Present' : esc(formatMonthYear(e.endDate))
          }</span>
        </div>
        <div class="item-sub">${esc(e.location || e.employmentType)}</div>
        ${e.description ? `<p>${esc(e.description)}</p>` : ''}
        ${
          e.achievements && e.achievements.length > 0
            ? `<ul>${e.achievements.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>`
            : ''
        }
      </div>`,
        )
        .join('')}
    </section>`
        : ''
    }

    ${
      projects.length > 0
        ? `<section>
      <h2>Key Projects</h2>
      ${projects
        .map(
          (p) => `<div class="item">
        <div class="item-head">
          <span>${esc(p.title)}</span>
          <span>${esc(p.techStack.join(' · '))}</span>
        </div>
        <p>${esc(p.summary)} ${esc(p.description)}</p>
      </div>`,
        )
        .join('')}
    </section>`
        : ''
    }

    ${
      Object.keys(groupedSkills).length > 0
        ? `<section>
      <h2>Technical Skills</h2>
      ${Object.entries(groupedSkills)
        .map(
          ([cat, list]) =>
            `<div class="skill-row"><span class="skill-cat">${esc(cat)}:</span> ${esc(
              list.join(', '),
            )}</div>`,
        )
        .join('')}
    </section>`
        : ''
    }

    ${
      achievements.length > 0
        ? `<section>
      <h2>Training &amp; Professional Development</h2>
      ${achievements
        .map(
          (a) => `<div class="item">
        <div class="item-head">
          <span>${esc(a.title)}</span>
          <span>${esc(a.issuer)} &middot; ${esc(formatMonthYear(a.date))}</span>
        </div>
        ${a.description ? `<p>${esc(a.description)}</p>` : ''}
      </div>`,
        )
        .join('')}
    </section>`
        : ''
    }

    ${
      certifications.length > 0
        ? `<section>
      <h2>Certifications</h2>
      ${certifications
        .map(
          (c) => `<div class="item">
        <div class="item-head">
          <span>${esc(c.title)}</span>
          <span>${esc(c.issuer)} &middot; ${esc(formatMonthYear(c.issueDate))}</span>
        </div>
      </div>`,
        )
        .join('')}
    </section>`
        : ''
    }

    ${
      education.length > 0
        ? `<section>
      <h2>Education</h2>
      ${education
        .map(
          (ed) => `<div class="item">
        <div class="item-head">
          <span>${esc(ed.degree)}${ed.field ? ` (${esc(ed.field)})` : ''}${
            ed.grade ? ` — ${esc(ed.grade)}` : ''
          }</span>
          <span>${ed.startYear ? `${ed.startYear} &ndash; ` : ''}${ed.endYear ?? 'Present'}</span>
        </div>
        <div class="item-sub">${esc(ed.institution)}${
          ed.activities ? ` &middot; ${esc(ed.activities)}` : ''
        }</div>
      </div>`,
        )
        .join('')}
    </section>`
        : ''
    }

    <section>
      <h2>Languages</h2>
      <p><strong>English:</strong> Full professional proficiency (reading, writing, speaking) &bull; <strong>Bangla:</strong> Native fluency</p>
    </section>
  </div>
</body>
</html>`;

  return html;
}

export function downloadStructuredCv(data: CvData): void {
  const html = buildStructuredCvHtml(data);
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 250);
    return;
  }

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Moin_Uddin_CV.html';
  a.click();
  URL.revokeObjectURL(url);
}
