---
name: portfolio-mern-admin
description: Build and maintain Moin Uddin's portfolio website (React, TypeScript, Tailwind on the frontend; Express, MongoDB on the backend) with a responsive dark and light theme, a human-centred design, and an owner-only admin panel for projects, experience, education, certifications, achievements, skills, and blog posts.
---

# Portfolio MERN Admin: Agent Skill

## 1. Purpose

Build a custom portfolio that replaces the WordPress/Elementor site at moinuddinbd.com. It must:

- Be responsive from 360px to 1440px and wider.
- Support two themes (dark and light) with a visible toggle that remembers the choice.
- Use the human-centred design direction in `.agent/skills/portfolio-design-system/SKILL.md`. It must not look generic or machine-generated.
- Provide complete public sections and pages: Home, About, Experience, Education, Certifications, Achievements, Projects, Project detail, Blog, Blog post, Contact.
- Provide an owner-only admin panel where the owner (the only admin) keeps every section current, including experience, education, certifications, and achievements.

Where this file conflicts with `DEVELOPMENT_PLAN.md`, the plan controls the MVP scope and timing. This file controls how things are built.

## 2. Non-negotiable rules

1. **Never invent design values.** Use `design-tokens.json` only. Mark any `"estimated"` value in the PR and ask the owner before shipping it as final.
2. **Two themes, one source.** Colors come from CSS variables defined per theme in `theme/tokens.css`. Components use semantic Tailwind classes (`bg-background`, `text-textPrimary`, `text-accent`). Never write hex values in components.
3. **Strict TypeScript.** No `any`. Shared types and Zod schemas live in `packages/shared`.
4. **Validate all input** with Zod at the API boundary and in every admin form.
5. **Server-enforced auth.** Every admin endpoint runs `requireAuth`. Hiding a button is not security.
6. **Public endpoints return published content only.** Drafts, hidden items, and contact messages never leave the API through public routes.
7. **No placeholder text** (for example "Lorem Ipsum") in any seed data or template. Use real content or `[TODO]` markers that block publishing.
8. **Secrets stay on the server.** Only `VITE_*` variables reach the browser. Never commit `.env`.
9. **Accessibility.** Semantic HTML, alt text required on every image, visible focus rings, keyboard-operable menus, modals, and carousels, and contrast of at least 4.5:1 in both themes. Respect `prefers-reduced-motion`.
10. **Repetitive collections use the CRUD module skill.** New collections follow `.agent/skills/portfolio-crud-module/SKILL.md` so every collection behaves the same way.

## 3. Tech stack

| Layer             | Choice                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Frontend          | React 18, Vite, TypeScript, Tailwind CSS, React Router v6                                                                           |
| Forms             | React Hook Form with Zod resolvers                                                                                                  |
| Server state      | TanStack Query                                                                                                                      |
| Rich text         | Markdown stored in the database. Rendered with `react-markdown`, `remark-gfm`, `rehype-sanitize`, `rehype-slug`. Raw HTML disabled. |
| Code highlighting | `shiki`                                                                                                                             |
| Backend           | Node.js 20+, Express, TypeScript                                                                                                    |
| Database          | MongoDB Atlas with Mongoose                                                                                                         |
| Auth              | One owner account created by script. bcrypt hash. JWT in an httpOnly, Secure, SameSite=Lax cookie. No public sign-up.               |
| Files and images  | Cloudinary for images and certificate files (PDF or image). Store `url`, `publicId`, `mimeType`, `width`, `height`, `alt`.          |
| Email             | Nodemailer over SMTP for contact notifications                                                                                      |
| Testing           | Vitest and Supertest (API), Playwright (browser checks, see the testing skill)                                                      |
| Quality           | ESLint, Prettier, Husky, lint-staged                                                                                                |
| Monorepo          | pnpm workspaces: `apps/web`, `apps/api`, `packages/shared`                                                                          |

## 4. Repository layout

The full tree, with the purpose of each folder, is in `SETUP_GUIDE.md` section 3. Summary:

- **Frontend:** `apps/web/src/` contains `theme/`, `components/` (ui, layout, media, sections, blog), `pages/` (public pages), `admin/` (owner panel), `features/` (queries and types per domain), `forms/`, and `lib/`.
- **Backend:** `apps/api/src/` contains `config/`, `models/`, `modules/` (one folder per domain), `middleware/`, `utils/`, `jobs/`, and `app.ts`/`server.ts`. Scripts are in `apps/api/scripts/`.
- **Shared:** `packages/shared/src/` contains Zod schemas and TypeScript types used by both sides.

## 5. Themes

- Default theme: dark (`defaultTheme` in `design-tokens.json`). On first visit, follow `prefers-color-scheme` if the viewer has no saved choice.
- Toggle: a button in the navbar with an accessible label ("Switch to light theme"). It is also available in the mobile menu.
- Persistence: save the choice in `localStorage` under `theme`. Read it inside a try/catch, and fall back to the default if storage is unavailable.
- Implementation: set `data-theme="dark"` or `data-theme="light"` on `<html>`. `theme/tokens.css` defines the variables under each selector. Tailwind maps the variables to semantic colors.
- Images: photos and certificate scans keep their natural colors in both themes. Add a subtle border or background in light mode so white scans do not disappear.
- Test both themes at every review.

## 6. Public site

### Home (single page with anchors)

1. Navbar: logo, anchor links (About, Experience, Projects, Skills, Blog, Contact), theme toggle, mobile menu.
2. Hero: name, role, one-paragraph introduction in the owner's voice, primary button "Contact me", secondary link to Projects, profile photo.
3. About: short introduction, "How I work" points written by the owner, link to the full About page.
4. Experience summary: latest three entries, link to `/experience`.
5. Projects: featured projects with category filter, link to `/projects`.
6. Skills: grouped by category with level indicators (5 steps, not percentages).
7. Education, certifications, and achievements: latest entries from each collection, each with a link to its page.
8. Blog preview: latest three published posts.
9. Contact: short form and contact details.
10. Footer: social links, copyright, back to top.

### Dedicated pages

| Route             | Content                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `/about`          | Full biography, photo, values, and the owner's working approach                                                                        |
| `/experience`     | All experience entries, newest first. Each entry shows role, company, dates, location, description, achievements list, and tech stack. |
| `/education`      | All education entries with institution, degree, field, years, grade, and activities                                                    |
| `/certifications` | Grid of certifications with issuer, dates, credential link, and a viewer for the certificate file                                      |
| `/achievements`   | Filterable list by category (award, competition, publication, speaking, other)                                                         |
| `/projects`       | All published projects with category filter and search                                                                                 |
| `/projects/:slug` | Case study with gallery, stack, links, and related projects                                                                            |
| `/blog`           | Published posts with tag filter, search, and pagination (9 per page)                                                                   |
| `/blog/:slug`     | Post with cover, reading time, table of contents, body, previous and next                                                              |
| `/blog/tag/:tag`  | Posts with one tag                                                                                                                     |
| `/contact`        | Full contact form and details                                                                                                          |
| `*`               | Branded 404 page                                                                                                                       |

Every collection page shows an empty state with a short message when nothing is published.

## 7. Data models

```ts
// Image (embedded)
{ url, publicId, width, height, alt, mimeType }

// Profile (singleton)
{ name, headline, tagline, intro (markdown), about (markdown), email, phone, officeAddress, location,
  resumeUrl, avatar: Image, socials: { facebook, x, linkedin, instagram, youtube, behance, github } }

// Experience
{ company, role, employmentType: 'full-time' | 'part-time' | 'contract' | 'internship',
  location, companyUrl, startDate, endDate (null when current), isCurrent: boolean,
  description (markdown), achievements: string[], techStack: string[], order, status }

// Education
{ institution, degree, field, grade, startYear, endYear, activities (markdown), logo: Image, order, status }

// Certification
{ title, issuer, issueDate, expiryDate (nullable), credentialId, credentialUrl,
  certificateFile: { url, publicId, mimeType, width, height, alt } (nullable),
  skills: string[], order, status }

// Achievement
{ title, category: 'award' | 'competition' | 'publication' | 'speaking' | 'other',
  issuer, date, description (markdown), link, image: Image (nullable), order, status }

// Project
{ slug (unique), title, summary, category: 'fullstack' | 'frontend' | 'backend' | 'wordpress' | 'marketing',
  description (markdown), caseStudy (markdown), cover: Image, gallery: Image[],
  techStack: string[], liveUrl, repoUrl, featured, order, status }

// Skill
{ name, category: 'frontend' | 'backend' | 'database' | 'tools' | 'design' | 'cms', level: 1-5, order, status }

// Post
{ title, slug (unique), excerpt (max 240 chars), body (markdown), coverImage: Image, tags: string[],
  category, status: 'draft' | 'published' | 'scheduled', publishedAt, scheduledAt, readingTime,
  seo: { metaTitle, metaDescription, ogImage }, featured }

// ContactMessage
{ name, email, message, read: boolean, createdAt, ipHash }

// User (owner only)
{ email, passwordHash, failedLogins, lockedUntil }
```

Every collection with `status` supports: `draft` or `published` (or `scheduled` for posts). Public reads filter to `published`. `order` drives display sequence. Indexes: unique slugs, and `{ status: 1, order: 1 }` on each public collection.

## 8. API contract

Envelope: `{ data, meta? }` on success and `{ error: { code, message, details? } }` on failure.

Public (read only):

```
GET  /api/profile
GET  /api/experience
GET  /api/education
GET  /api/certifications
GET  /api/achievements?category=
GET  /api/projects?category=&featured=
GET  /api/projects/:slug
GET  /api/skills
GET  /api/blog?page=&limit=&tag=&q=
GET  /api/blog/:slug
GET  /api/blog/tags
POST /api/contact
GET  /api/health
```

Admin (owner session required):

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/admin/profile
CRUD   /api/admin/experience            + PATCH /api/admin/experience/reorder
CRUD   /api/admin/education             + PATCH /api/admin/education/reorder
CRUD   /api/admin/certifications        + PATCH /api/admin/certifications/reorder
CRUD   /api/admin/achievements          + PATCH /api/admin/achievements/reorder
CRUD   /api/admin/projects              + PATCH /api/admin/projects/reorder
CRUD   /api/admin/skills                + PATCH /api/admin/skills/reorder
CRUD   /api/admin/blog
POST   /api/admin/blog/:id/publish
POST   /api/admin/blog/:id/unpublish
GET    /api/admin/messages
PATCH  /api/admin/messages/:id
POST   /api/admin/uploads               (multipart: images and PDFs, validated)
DELETE /api/admin/uploads/:publicId
```

## 9. Admin panel

- Login at `/admin/login`. Lock the account for 15 minutes after 5 failed attempts.
- Only one owner account exists. There is no sign-up, no roles, and no other users.
- Dashboard: counts for each collection, unread messages, recent edits, and quick links.
- Every collection uses the CRUD module pattern: list with search, status filter, and drag-to-reorder; editor with Zod validation; publish toggle; delete with confirmation.
- **Experience, Education, Certifications, and Achievements must be fully editable.** The owner can add, change, reorder, hide, or delete any entry at any time. The public pages update on the next load.
- Certificate uploads accept PDF, PNG, JPG, or WebP up to 10 MB. Images are resized to a 2000px maximum width. PDFs are stored as received.
- Form fields for dates use a month-and-year picker. If `isCurrent` is set, `endDate` is disabled.
- Markdown editor with live preview for every long-text field.
- Toast on save. Unsaved-changes warning on navigation.
- Admin routes send `noindex` and are excluded from the sitemap.

## 10. Security checklist

- [ ] Helmet with a strict Content Security Policy
- [ ] CORS limited to the site origin
- [ ] JSON body limit of 1 MB
- [ ] Rate limits on login (5 per 15 minutes), contact (5 per hour per IP), and uploads
- [ ] NoSQL injection blocked (Zod schemas and `express-mongo-sanitize`)
- [ ] Cookies: httpOnly, Secure, SameSite=Lax
- [ ] Upload validation by MIME type and magic bytes, with size limits
- [ ] Markdown sanitized, raw HTML disabled
- [ ] Production error handler hides stack traces
- [ ] `pnpm audit` run before each release
- [ ] Owner password changed after first login

## 11. Quality gates

Before reporting any task complete, run and show the output of:

```
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For UI work, run the browser checks in `.agent/skills/portfolio-webapp-testing/SKILL.md` in both themes at 375px and 1440px, and list the screenshot paths.

Required tests:

- API: login and lockout, logout, public routes never return drafts, admin routes reject anonymous requests, upload validation, contact validation, blog publish and schedule.
- Web: theme toggle persists after reload, both themes render without console errors, every collection page shows its empty state.

## 12. Deployment

- Frontend: static build on the current host (if subdomains are supported) or Netlify, Vercel, or Cloudflare Pages.
- Backend: Node.js on Render, Railway, or a VPS.
- Database: MongoDB Atlas.
- Domains: `moinuddinbd.com` (site), `api.moinuddinbd.com` (API).
- Redirects: keep WordPress live until the new site is verified, then add 301 redirects from the old project URLs.

## 13. Workflow for the agent

1. Read `AGENTS.md`, this file, `DEVELOPMENT_PLAN.md`, `design-tokens.json`, and the two skills in `.agent/skills/`.
2. Confirm open token and content questions before building UI.
3. Build shared types and schemas first, then the backend module, then the frontend feature, then the tests.
4. For each new collection, follow the CRUD module skill exactly.
5. Report what was done, what remains, and every decision needing the owner's input.
