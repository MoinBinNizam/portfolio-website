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

export interface CvData {
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

function cleanHumanText(value: string): string {
  return value.replace(/\u2014|\u2013/g, ' - ').replace(/,\s+etc\b/gi, ' etc');
}

export function buildStructuredCvHtml(data: CvData): string {
  const { profile, experience, projects, skills, education, achievements, certifications } = data;
  const name = profile?.name ?? 'Moin Uddin';
  const headline =
    profile?.headline ??
    'Software Engineer | MERN, React 18, Node.js, TypeScript | AI/LLM Integration';

  const liveOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin.replace(/^https?:\/\//, '')
      : 'moinuddinbd.com';

  const phone = profile?.cvPhone || profile?.phone || '';
  const contactLine1 = [
    phone ? esc(phone) : null,
    profile?.email ? esc(profile.email) : 'moinuddinpkt@gmail.com',
    esc(liveOrigin),
  ]
    .filter(Boolean)
    .join(' | ');

  const contactLine2 = [
    profile?.socials?.linkedin ? `LinkedIn: ${esc(profile.socials.linkedin)}` : null,
    profile?.socials?.github ? `GitHub: ${esc(profile.socials.github)}` : null,
    profile?.location ? esc(profile.location) : 'Dhaka, Bangladesh',
  ]
    .filter(Boolean)
    .join(' | ');

  const keyAchievements = experience.flatMap((e) => e.achievements ?? []).slice(0, 8);

  const groupedSkills = skills.reduce<Record<string, string[]>>((acc, s) => {
    const list = acc[s.category] ?? [];
    list.push(s.name);
    acc[s.category] = list;
    return acc;
  }, {});

  const references = profile?.references ?? [];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(name)} - CV</title>
  <style>
    @page { size: A4; margin: 12mm 14mm; }
    * { box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #141414;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      font-size: 10.5px;
      line-height: 1.42;
    }
    .doc { max-width: 790px; margin: 0 auto; }
    header {
      text-align: center;
      border-bottom: 1.5px solid #141414;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    h1 {
      font-size: 20px;
      letter-spacing: 0.05em;
      margin: 0;
      text-transform: uppercase;
    }
    .headline {
      font-size: 11.5px;
      font-weight: 700;
      color: #0b7a43;
      margin: 3px 0 4px;
    }
    .contact {
      font-size: 9.8px;
      color: #333333;
      margin: 2px 0 0;
    }
    section { margin-bottom: 10px; }
    h2 {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #0b7a43;
      border-bottom: 1px solid #cccccc;
      padding-bottom: 2px;
      margin: 0 0 6px;
      break-after: avoid;
    }
    .item { margin-bottom: 7px; break-inside: avoid; }
    .item-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-weight: 700;
      font-size: 10.8px;
    }
    .item-sub { font-size: 10px; color: #444444; margin-bottom: 2px; }
    p { margin: 0 0 4px; }
    ul { margin: 3px 0 0; padding-left: 16px; }
    li { margin-bottom: 2px; }
    .skill-row { margin-bottom: 2px; }
    .skill-cat { font-weight: 700; text-transform: capitalize; }
    .no-print {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 12px;
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
      <button class="btn" onclick="window.print()">Download / Save as PDF</button>
    </div>

    <header>
      <h1>${esc(name)}</h1>
      <p class="headline">${esc(cleanHumanText(headline))}</p>
      <p class="contact">${contactLine1}</p>
      <p class="contact">${contactLine2}</p>
    </header>

    <section>
      <h2>Career Objective</h2>
      <p>${esc(cleanHumanText(profile?.intro ?? ''))} ${esc(cleanHumanText(profile?.about ?? ''))}</p>
    </section>

    ${
      keyAchievements.length > 0
        ? `<section>
      <h2>Key Achievements</h2>
      <ul>
        ${keyAchievements.map((a) => `<li>${esc(cleanHumanText(a))}</li>`).join('')}
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
          <span>${esc(cleanHumanText(e.role))} | ${esc(cleanHumanText(e.company))}</span>
          <span>${esc(formatMonthYear(e.startDate))} - ${
            e.isCurrent ? 'Present' : esc(formatMonthYear(e.endDate))
          }</span>
        </div>
        <div class="item-sub">${esc(e.location || e.employmentType)}</div>
        ${e.description ? `<p>${esc(cleanHumanText(e.description))}</p>` : ''}
        ${
          e.achievements && e.achievements.length > 0
            ? `<ul>${e.achievements.map((a) => `<li>${esc(cleanHumanText(a))}</li>`).join('')}</ul>`
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
          <span>${esc(cleanHumanText(p.title))}</span>
          <span>${esc(p.techStack.join(', '))}</span>
        </div>
        <p>${esc(cleanHumanText(p.summary))} ${esc(cleanHumanText(p.description))}</p>
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
          <span>${esc(cleanHumanText(a.title))}</span>
          <span>${esc(a.issuer)} | ${esc(formatMonthYear(a.date))}</span>
        </div>
        ${a.description ? `<p>${esc(cleanHumanText(a.description))}</p>` : ''}
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
          <span>${esc(cleanHumanText(c.title))}</span>
          <span>${esc(c.issuer)} | ${esc(formatMonthYear(c.issueDate))}</span>
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
          <span>${esc(ed.degree)}${ed.field ? ` - ${esc(ed.field)}` : ''}${
            ed.grade ? ` (${esc(ed.grade)})` : ''
          }</span>
          <span>${ed.startYear ? `${ed.startYear} - ` : ''}${ed.endYear ?? 'Present'}</span>
        </div>
        <div class="item-sub">${esc(ed.institution)}${
          ed.activities ? ` | ${esc(cleanHumanText(ed.activities))}` : ''
        }</div>
      </div>`,
        )
        .join('')}
    </section>`
        : ''
    }

    <section>
      <h2>Languages</h2>
      <p><strong>English:</strong> Full professional proficiency (reading, writing, speaking) | <strong>Bangla:</strong> Native fluency</p>
    </section>

    ${
      profile?.currentAddress || profile?.permanentAddress
        ? `<section>
      <h2>Personal Information</h2>
      ${
        profile.currentAddress
          ? `<p><strong>Current Address:</strong> ${esc(profile.currentAddress)}</p>`
          : ''
      }
      ${
        profile.permanentAddress
          ? `<p><strong>Permanent Address:</strong> ${esc(profile.permanentAddress)}</p>`
          : ''
      }
    </section>`
        : ''
    }

    ${
      references.length > 0
        ? `<section>
      <h2>References</h2>
      ${references
        .map(
          (r) => `<div class="item">
        <div class="item-head">
          <span>${esc(r.name)} - ${esc(r.title)}${
            r.organization ? `, ${esc(r.organization)}` : ''
          }</span>
        </div>
        <div class="item-sub">${[r.email ? esc(r.email) : null, r.phone ? esc(r.phone) : null]
          .filter(Boolean)
          .join(' | ')}</div>
      </div>`,
        )
        .join('')}
    </section>`
        : ''
    }
  </div>
</body>
</html>`;
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
