# Development Plan: Moin Uddin Portfolio (Full MVP, 10 Working Days)

Project: Replace the WordPress/Elementor portfolio at moinuddinbd.com with a custom MERN + TypeScript application. The MVP includes every section and page, both themes, and admin management for Experience, Education, Certifications, Achievements, Projects, Skills, Services, Testimonials, Blog, and Contact messages.

Companion files:

- `SKILL.md` (technical specification)
- `SETUP_GUIDE.md` (folder structure, skill placement, Antigravity use)
- `.agent/skills/portfolio-crud-module/SKILL.md`, `portfolio-design-system/SKILL.md`, `portfolio-webapp-testing/SKILL.md`

---

## 1. Goals and success criteria

### Business goals

1. Present full-stack MERN and TypeScript skills clearly within 10 working days.
2. Let the owner (the only admin) keep every section current without developer help.
3. Retire the WordPress site without losing the three indexed project URLs.

### MVP success criteria (end of Day 10)

| Area                          | Target                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| All public sections and pages | Built, linked, and responsive from 360px to 1440px                                    |
| Themes                        | Dark and light, toggle works, choice persists after reload, both pass contrast checks |
| Admin                         | Owner can create, edit, reorder, publish, hide, and delete every collection           |
| Lighthouse (home, mobile)     | Performance 85+, Accessibility 95+, SEO 95+                                           |
| Accessibility                 | No critical or serious axe violations on public pages in both themes                  |
| Security                      | Admin routes protected on the server. Drafts and messages never public.               |
| Redirects                     | Three WordPress project URLs return 301                                               |

---

## 2. Scope

### In scope (MVP)

- **Public pages:** Home (all sections), About, Experience, Education, Certifications, Achievements, Projects, Project detail, Services, Blog, Blog post, Blog tag, Contact, 404.
- **Home sections:** Navbar, Hero, About, Experience summary, Projects, Skills, Education, Certifications, Achievements, Services, Testimonials, Blog preview, Contact, Footer.
- **Themes:** Dark (default) and light, with a toggle in the navbar and mobile menu.
- **Admin (owner only):** Login with lockout, dashboard, profile, Experience, Education, Certifications, Achievements, Projects, Skills, Services, Testimonials, Blog (Markdown editor), Contact messages (read and mark read).
- **Uploads:** Images and certificate PDFs to Cloudinary, with validation.
- **Contact form:** Validation, honeypot, rate limit, email notification.
- **SEO basics:** Titles, descriptions, Open Graph, sitemap, robots.txt, RSS, JSON-LD.
- **Testing:** API test suite and browser checks in both themes.
- **Deployment:** Staging and production, DNS, HTTPS, 301 redirects, backups.

### Deferred to Phase 2 (after launch)

- Scheduled blog publishing (the `scheduled` status exists in the schema but is not used)
- Blog autosave, table of contents, related posts, share buttons
- Full Playwright end-to-end suite (MVP uses a smoke suite)
- Lighthouse 90+ polish and screen reader pass
- Full WordPress blog redirect map (only if old blog URLs exist)
- Comments, newsletter, multi-language, analytics dashboard

---

## 3. Team and responsibilities

| Role                   | Person      | Responsibilities                                                                         |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| Owner and approver     | Moin Uddin  | Content, token confirmation, accounts, exit checks, final acceptance, writing blog posts |
| Developer and reviewer | Moin Uddin  | Reviews agent output, decides architecture, runs deployment                              |
| AI coding agent        | Antigravity | Builds tasks using the skills and `AGENTS.md`, opens one PR per task                     |

---

## 4. Prerequisites (complete before Day 1)

Without these, the 10-day timeline slips day for day.

| Item                                                                          | Owner | Required state                                                                               |
| ----------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------- |
| Design tokens confirmed (both themes, fonts)                                  | Owner | No `"estimated"` values left in `design-tokens.json`, or explicit approval to ship estimates |
| Headline, tagline, intro, about text                                          | Owner | Final                                                                                        |
| Profile photo                                                                 | Owner | 1200px wide or larger                                                                        |
| Experience (3 entries with achievements)                                      | Owner | Final                                                                                        |
| Education (1 to 2 entries)                                                    | Owner | Final                                                                                        |
| Certifications (3 or more, with PDFs or images)                               | Owner | Final                                                                                        |
| Achievements (2 or more)                                                      | Owner | Final                                                                                        |
| Projects (4 with screenshots, links, short case study)                        | Owner | Final                                                                                        |
| Skills with category and level (1 to 5)                                       | Owner | Final                                                                                        |
| Services (3 to 4 you want to sell)                                            | Owner | Final                                                                                        |
| Testimonials (3 verified, with permission)                                    | Owner | Final, or leave out and add later                                                            |
| Blog posts (2 drafts minimum)                                                 | Owner | Drafts acceptable                                                                            |
| Accounts: GitHub, MongoDB Atlas M0, Cloudinary, API host, frontend host, SMTP | Owner | Created, credentials shared securely                                                         |
| Hosting decision                                                              | Owner | Frontend and API hosts chosen                                                                |

**[OWNER DECISION]** Approve the full MVP scope in section 2 and the 10-day schedule in section 5.

---

## 5. Ten-day schedule

Working day: about 11 hours. Total: about 110 hours. Each day ends with an owner exit check of 15 to 20 minutes.

### Day 1: Foundation and themes

| Hours    | Task                                                                                                                                         | Done when                              |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 0 to 1.5 | Monorepo (pnpm workspaces), strict TypeScript, ESLint, Prettier, Husky                                                                       | `pnpm dev` starts both apps            |
| 1.5 to 3 | `design-tokens.json` with both themes, `theme/tokens.css`, Tailwind mapping                                                                  | Test page shows both themes            |
| 3 to 4   | ThemeProvider, ThemeToggle, inline theme script in `index.html`                                                                              | Toggle persists after reload, no flash |
| 4 to 6   | UI primitives: Button, Card, Badge, Input, Textarea, Select, Modal, Toast, Skeleton, Tabs, Pagination, EmptyState, Container, SectionHeading | Primitives render in both themes       |
| 6 to 8   | Express skeleton: security middleware, env validation, DB connection, `/api/health`                                                          | Health returns 200                     |
| 8 to 10  | Shared schemas for every collection (`packages/shared`) and Mongoose models                                                                  | Models save and validate test records  |
| 10 to 11 | Seed script skeleton and `create-owner.ts`                                                                                                   | Owner account created by script        |

**Exit check:** Owner compares buttons, headings, and colours in both themes with the live site.

### Day 2: Layout and home page structure

| Hours    | Task                                                                                                                    | Done when                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 0 to 2   | Router, PageShell, Navbar with anchors, MobileMenu, Footer, BackToTop                                                   | Navigation works at 360px and 1440px     |
| 2 to 4   | Hero (asymmetric layout, portrait, caption) and About section                                                           | Matches design-system rules              |
| 4 to 6   | Public API read endpoints: profile, experience, education, certifications, achievements, skills, services, testimonials | Endpoints return published items only    |
| 6 to 8   | Section scaffold for every home section with skeleton and empty states                                                  | Home renders all sections with seed data |
| 8 to 10  | SEO helper (title, description, Open Graph, Person JSON-LD)                                                             | Metadata present on home                 |
| 10 to 11 | Visual pass on home in both themes                                                                                      | No console errors                        |

**Exit check:** Owner reviews home page in both themes on phone and desktop.

### Day 3: Experience and Education (full stack)

| Hours   | Task                                                                                                                           | Done when                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| 0 to 3  | Backend module for Experience and Education per `portfolio-crud-module`: service, controller, routes, reorder, tests           | API tests pass                                 |
| 3 to 5  | Admin list and editor for Experience and Education with the shared form fields (month picker, Markdown, tags, status, reorder) | Owner creates, edits, reorders, hides, deletes |
| 5 to 7  | Public pages `/experience` and `/education`, plus home sections                                                                | Pages show published items in order            |
| 7 to 9  | Timeline component (single vertical line, date labels)                                                                         | Responsive, both themes                        |
| 9 to 11 | Fixes from testing, tests for visibility and reorder                                                                           | Gates pass                                     |

**Exit check:** Owner adds one experience entry and one education entry from the admin, then sees them on the public pages.

### Day 4: Certifications and Achievements (full stack)

| Hours    | Task                                                                                          | Done when                        |
| -------- | --------------------------------------------------------------------------------------------- | -------------------------------- |
| 0 to 2   | Upload service: MIME and magic-byte checks, 10 MB limit, Cloudinary, delete on record removal | Upload tests pass                |
| 2 to 4   | Backend modules for Certifications and Achievements                                           | API tests pass                   |
| 4 to 6   | Admin list and editor for both, with file field and category filter                           | Owner uploads a PDF and an image |
| 6 to 8   | Public `/certifications` (grid, verify link, viewer) and `/achievements` (category chips)     | Viewer opens images and PDFs     |
| 8 to 10  | Home sections for both                                                                        | Latest three show on home        |
| 10 to 11 | Light-mode treatment for scans and document cards                                             | Both themes checked              |

**Exit check:** Owner uploads a certificate, sees it on the page, and deletes it.

### Day 5: Authentication, admin shell, and uploads

| Hours   | Task                                                                                                            | Done when                               |
| ------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 0 to 3  | Auth module: login, bcrypt, JWT cookie, lockout after 5 failures for 15 minutes, logout, `/auth/me`             | Auth tests pass                         |
| 3 to 5  | Admin layout: sidebar, mobile drawer, RequireOwner guard, LoginPage                                             | Logged-out visits redirect to login     |
| 5 to 7  | Dashboard with counts and unread messages; Profile page (name, headline, intro, about, socials, avatar, resume) | Owner edits profile and sees it on home |
| 7 to 9  | Shared admin fields: ImageField (resize to 2000px, WebP), FileField, MarkdownField with preview, TagsField      | Fields tested in an editor              |
| 9 to 11 | Rate limits (login, contact, uploads), security headers, error handler                                          | Security checklist items done           |

**Exit check:** Owner logs in, updates the profile, and sees the change on the home page. Lockout works after five wrong passwords.

### Day 6: Projects and Skills

| Hours   | Task                                                                                                                                        | Done when                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 0 to 3  | Projects backend (slug, category, gallery, reorder) and tests                                                                               | Drafts hidden publicly                |
| 3 to 5  | Projects admin list and editor (gallery uploads, case study Markdown, featured flag)                                                        | Owner creates and publishes a project |
| 5 to 7  | `/projects` with category filter and search; `/projects/:slug` with gallery, stack, links, related projects; browser-style screenshot frame | Filter and detail page work           |
| 7 to 9  | Skills backend and admin (grouped by category, level 1 to 5, reorder)                                                                       | Owner edits skills                    |
| 9 to 11 | Skills section on home (level indicators, not percentages); Projects section on home                                                        | Both render in both themes            |

**Exit check:** Owner publishes a project with three screenshots and checks the detail page on phone.

### Day 7: Services, Testimonials, and Contact

| Hours    | Task                                                                                                                  | Done when                     |
| -------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 0 to 2.5 | Services backend and admin, plus Services section on home                                                             | Owner edits services          |
| 2.5 to 5 | Testimonials backend and admin (rating, avatar, verified flag)                                                        | Owner adds a testimonial      |
| 5 to 7   | Testimonial carousel: keyboard arrows, pause on focus and hover, reduced-motion support                               | Carousel accessible           |
| 7 to 9   | Contact backend (validation, honeypot, 5 per hour rate limit, email notification) and public Contact form and section | Test email received           |
| 9 to 11  | Messages admin (list, read, mark read)                                                                                | Owner sees and marks messages |

**Exit check:** Owner submits a contact form from a second device, receives the email, and marks the message read.

### Day 8: Blog

| Hours     | Task                                                                                                                                                     | Done when                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 0 to 2.5  | Blog backend: slug, excerpt, reading time, tags, publish and unpublish, search, pagination                                                               | Drafts hidden publicly          |
| 2.5 to 5  | Blog admin list and Markdown editor with live preview, toolbar, image upload with required alt text, cover image, SEO panel                              | Owner creates a post with image |
| 5 to 7    | `/blog` (cards, tag filter, search, pagination), `/blog/:slug` (cover, metadata, sanitized body, code highlighting, previous and next), `/blog/tag/:tag` | Post renders safely             |
| 7 to 8.5  | Blog preview on home                                                                                                                                     | Latest three show               |
| 8.5 to 10 | `BlogPosting` JSON-LD, sitemap entries for published posts, `/rss.xml`                                                                                   | Feed validates                  |
| 10 to 11  | Test: `<script>` in Markdown does not run                                                                                                                | Test passes                     |

**Exit check:** Owner writes a post with an image, previews it, publishes it, and sees it on `/blog`.

### Day 9: Polish, SEO, accessibility, and full tests

| Hours     | Task                                                                                                 | Done when                          |
| --------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 0 to 2    | Responsive pass at 360px, 768px, 1440px in both themes; fix issues                                   | No layout breaks                   |
| 2 to 3.5  | Accessibility: axe on every public page in both themes, keyboard checks, focus rings, contrast fixes | No critical or serious violations  |
| 3.5 to 5  | SEO: per-page metadata, sitemap includes all public pages, robots.txt, 404 page                      | Metadata checked on all pages      |
| 5 to 6.5  | Complete API test suite (auth, visibility, every collection, uploads, contact, blog)                 | All pass                           |
| 6.5 to 8  | Browser smoke suite (`e2e/public.spec.ts`, `e2e/admin.spec.ts`) in both themes, screenshots          | All pass                           |
| 8 to 9.5  | Performance pass: image sizes, code splitting for admin, font preload                                | Lighthouse performance 85+ locally |
| 9.5 to 11 | Quality gates: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`                              | All pass, output shown             |

**Exit check:** Owner reviews screenshots from the test run in both themes.

### Day 10: Content, deployment, and acceptance

| Hours      | Task                                                                                             | Done when                         |
| ---------- | ------------------------------------------------------------------------------------------------ | --------------------------------- |
| 0 to 2     | Load real content through the admin (not through seed files)                                     | Every section has real content    |
| 2 to 3     | Create owner account on production, change password, enable Atlas backups                        | Login works on production         |
| 3 to 4.5   | Deploy API and frontend to production; DNS for both domains; HTTPS                               | Both domains load over HTTPS      |
| 4.5 to 5.5 | Three 301 redirects for WordPress project URLs                                                   | `curl -I` shows 301               |
| 5.5 to 6.5 | Production smoke test: home, each section page, one project, one post, contact form, admin login | All pass                          |
| 6.5 to 7.5 | Owner acceptance walkthrough, fixes                                                              | Owner signs checklist (section 8) |
| 7.5 to 8.5 | Submit sitemap to Search Console; keep WordPress backup for 30 days                              | Search Console accepted sitemap   |
| 8.5 to 10  | One-page admin guide, credentials in password manager, known-issues list                         | Owner has the guide               |

**Exit check:** Owner signs the acceptance checklist.

---

## 6. Fallback plan

If a day runs over by more than 2 hours, apply these cuts in order. Do not cut auth, draft visibility, or redirects.

1. Remove the testimonial carousel and show testimonials as a static list (Day 7).
2. Remove the blog preview from home (Day 8).
3. Replace the browser smoke suite with manual checks recorded in a checklist (Day 9).
4. Move Services admin to Phase 2 and keep services as seed content (Day 7).

If the schedule slips by more than 2 days in total, the owner chooses which sections launch first. Sections not ready go live in a week-two release.

---

## 7. Risk register

| Risk                                              | Likelihood | Impact | Mitigation                                                                         |
| ------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------- |
| Prerequisites not ready on Day 1                  | High       | High   | Section 4 checklist. Day 1 does not start without it.                              |
| Estimated design tokens differ from the live site | Medium     | Medium | Day 1 and Day 2 exit checks. Confirm before Day 3.                                 |
| Scope creep                                       | High       | High   | Only section 2 items are built. Other ideas go to Phase 2.                         |
| Antigravity quota runs out mid-day                | Medium     | High   | Flash for routine work. One task per conversation. Commit after each task.         |
| Agent skips quality gates                         | Medium     | High   | Standard prompt in SETUP_GUIDE 7.1 requires gate output. Review before merge.      |
| Cloudinary or Atlas free tier limits              | Low        | Medium | Compress images before upload. Check usage weekly.                                 |
| SEO drop after migration                          | Medium     | High   | Redirects on Day 10. Sitemap submitted same day. Watch Search Console for 30 days. |
| Owner unavailable for exit checks                 | Medium     | High   | Book all 10 checks in advance, 20 minutes each.                                    |
| Hosting cannot run Node.js                        | High       | Low    | API on Render, Railway, or VPS. Frontend on current host or static host.           |

---

## 8. Owner acceptance checklist (Day 10)

### Design and themes

- [ ] Colours match the current site in dark theme
- [ ] Light theme is readable and on-brand
- [ ] Theme toggle works on desktop and mobile, and persists after reload
- [ ] Layout works at 360px, 768px, and 1440px
- [ ] Design does not look like a template (real photos, real screenshots, varied layouts)

### Content

- [ ] No placeholder or Lorem Ipsum text
- [ ] Headline, intro, and about text are final
- [ ] Experience, education, certifications, and achievements are complete and correct
- [ ] Each project has screenshots, links, and a case study
- [ ] Services and testimonials are approved
- [ ] Contact details and social links are correct

### Functionality

- [ ] Every anchor on the home page works
- [ ] Every public page loads and links back correctly
- [ ] Project filter and search work
- [ ] Blog listing, search, tags, and post pages work
- [ ] Contact form sends an email
- [ ] Owner can create, edit, reorder, hide, and delete every collection
- [ ] Changes appear on the public site after reload
- [ ] Admin login locks after five wrong passwords
- [ ] Drafts and hidden items do not appear publicly

### SEO and launch

- [ ] Page titles and descriptions set on every page
- [ ] Three project URLs redirect (301)
- [ ] Sitemap and RSS work and are submitted
- [ ] Atlas backups enabled
- [ ] Admin password changed and stored in a password manager

---

## 9. Phase 2 (after launch, about 4 to 5 working days)

1. Scheduled blog publishing with a server job
2. Blog autosave, table of contents, related posts, share buttons
3. Full Playwright suite for every admin flow
4. Lighthouse 90+ and full screen reader pass
5. Any WordPress blog URL redirects (if old posts exist)
6. Optional: analytics, newsletter, comments

---

## 10. Definition of done (per task)

1. The acceptance criterion for the task is met.
2. `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass, with output shown.
3. Code that handles auth, uploads, or visibility has tests.
4. UI is checked in both themes at 360px and 1440px.
5. No hardcoded colours, no placeholder text, no committed secrets.
6. The commit message follows Conventional Commits.
7. The owner has reviewed the change.

---

## 11. Working agreement with the agent

1. Every task starts with the standard prompt in `SETUP_GUIDE.md` section 7.1.
2. The agent reads `AGENTS.md`, `SKILL.md`, `design-tokens.json`, and the skills listed in `AGENTS.md`.
3. One task per conversation. Commit after each task.
4. If the agent is unsure about a design value or content, it stops and asks.
5. Requests outside section 2 go to the Phase 2 list.
