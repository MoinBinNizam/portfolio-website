# CV to Website Content Map (updated with owner decisions)

Source: `Moin_Uddin_Full-Stack_Web_Developer_CV.pdf` and owner answers.
Target: `content/seed.json`, loaded by the seed script (issue #8, completed).

---

## 1. Decisions applied

| Topic                  | Decision                          | Applied in seed.json                                                                   |
| ---------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| CV versus current site | CV is correct                     | Maxwell Group, Amar-E-BD, and TechVelly use CV titles and dates. Freelance role added. |
| Metrics in CV          | CV is correct                     | Published as written, with no "verify" marks                                           |
| BSc grade              | UK standard                       | "Upper Second Class (2:1)"                                                             |
| Skill levels           | Set from CV                       | Levels 1 to 5, using the scale in `_levelScale`                                        |
| Employment types       | Set from CV                       | TechVelly, Maxwell Group, Amar-E-BD: full-time. Freelance: contract.                   |
| Client work            | Permission given for case studies | All four projects published                                                            |
| Services               | Owner list (7)                    | Seven services with descriptions and icons                                             |
| Testimonials           | Static                            | Three sample entries, flagged `_sample`                                                |
| Certificates           | Admin adds later                  | Empty. The section and page are still built, with empty states.                        |
| Blog                   | Dummy posts                       | Two posts, flagged `_dummy`                                                            |

---

## 2. Section map

| Website section | Source                         | Seed key             |
| --------------- | ------------------------------ | -------------------- |
| Hero            | Name, headline, tagline        | `profile`            |
| About           | Career objective               | `profile.about`      |
| Experience      | 4 roles                        | `experience`         |
| Education       | 3 entries                      | `education`          |
| Certifications  | None (admin adds later)        | `certifications: []` |
| Achievements    | 2 trainings, 1 volunteer role  | `achievements`       |
| Projects        | 4 projects                     | `projects`           |
| Skills          | Technical skills, 4 categories | `skills`             |
| Services        | Owner list                     | `services`           |
| Testimonials    | Static samples                 | `testimonials`       |
| Blog            | Dummy posts                    | `posts`              |
| Contact         | Email, LinkedIn, GitHub        | `profile`            |

---

## 3. Items still open

| Item                                                 | Why                                  | Needed from                   |
| ---------------------------------------------------- | ------------------------------------ | ----------------------------- |
| Phone number                                         | Not decided                          | Owner                         |
| Resume PDF                                           | Not uploaded                         | Owner (upload in admin)       |
| Real testimonials                                    | Samples only                         | Owner, with client permission |
| Dummy blog posts                                     | Placeholder content                  | Owner to replace or delete    |
| Project screenshots and case studies                 | Not provided                         | Owner, in admin               |
| Exact month for two trainings and the volunteer role | CV gives years only                  | Owner                         |
| Skill levels                                         | Set by analysis of the CV            | Owner to adjust               |
| Next.js level (2) and PostgreSQL level (2)           | Listed in the CV without project use | Owner to confirm              |

---

## 4. Rules for the seed script

1. Read `content/seed.json`.
2. Skip any key starting with `_`.
3. Insert items with their `status`.
4. Before launch, remove every item with `_sample: true` or `_dummy: true`. Replace them with real content.
5. Keep `profile.phone` empty on the public site until the owner decides.

---

## 5. Changes to the development plan

- **Testimonials:** Static. The admin testimonials module from Day 7 is no longer needed. Remove it from the plan, and render testimonials from a static file. This saves about 2 hours.
- **Certificates:** The admin module stays (Day 4), since you will add certificates later. The public page shows an empty state until then.
- **Services:** Admin module stays (Day 7), so you can edit the seven services later.
- **Blog:** Dummy posts are for testing the layout. The blog admin module (Day 8) stays.

---

## 6. Launch checklist

- [ ] Replace or remove the three sample testimonials
- [ ] Replace or remove the two dummy blog posts
- [ ] Upload the CV PDF as the resume
- [ ] Decide on the phone number
- [ ] Upload project screenshots
- [ ] Set the exact months for the trainings and the volunteer role
- [ ] Review skill levels
- [ ] Rewrite the About text in your own voice, if you want
