---
name: portfolio-crud-module
description: Add or change an owner-managed content collection in the portfolio (for example experience, education, certifications, achievements, projects, skills, or blog). Use for every new collection or any change to an existing admin list, editor, API route, or public list page, so all collections follow one consistent pattern.
---

# Portfolio CRUD Module

Use this skill whenever a collection is added or changed. Every collection follows the same steps so the owner gets a consistent admin, and so the code stays predictable.

## When to use

- Creating a new collection (for example, a new "Publications" section)
- Adding a field to an existing collection
- Building the admin list, editor, or reorder for a collection
- Building the public list and detail pages for a collection

## Inputs you need first

1. Collection name in singular and plural (for example `certification` and `certifications`)
2. Field list with types, required or optional, and maximum lengths
3. Whether it has `status` (draft or published), `order`, images or files, and Markdown fields
4. Public route and admin route

If any input is missing, ask the owner. Do not guess.

## Step 1: Shared schema (`packages/shared/src/schemas/<plural>.ts`)

- Write one Zod schema for the input (create and update share it, using `.partial()` for update).
- Export a TypeScript type with `z.infer`.
- Dates are ISO strings in the schema. Validate that `endDate` is after `startDate` when both exist.
- Text fields have explicit `min` and `max` lengths.
- Export the schema from `packages/shared/src/index.ts`.

## Step 2: Backend model (`apps/api/src/models/<Singular>.ts`)

- Mongoose schema matching the Zod shape.
- `status` enum `draft | published`, default `draft`.
- `order` number, default 0.
- Timestamps enabled.
- Index `{ status: 1, order: 1 }`.
- Image fields use the shared `ImageSchema` sub-document.

## Step 3: Backend module (`apps/api/src/modules/<plural>/`)

Create four files:

| File            | Contents                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `schema.ts`     | Re-exports the shared Zod schema and query schema                                                                     |
| `service.ts`    | `list(filter)`, `get(id)`, `create(data)`, `update(id, data)`, `remove(id)`, `reorder(ids)`. No Express objects here. |
| `controller.ts` | Thin handlers that call the service and return the envelope                                                           |
| `routes.ts`     | Public routes (published only) and admin routes behind `requireAuth`                                                  |

Rules:

- The public list route filters `status: 'published'` and sorts by `order` then the date field.
- The admin list route returns all statuses.
- `reorder` accepts an array of ids and updates `order` in one `bulkWrite`.
- Errors use `httpError(status, code, message)`. Never return raw database errors.
- Register the routes in `apps/api/src/app.ts`.

## Step 4: Backend tests (`apps/api/tests/<plural>.test.ts`)

Write at least these tests with Vitest and Supertest:

1. Anonymous request to an admin route returns 401.
2. Creating an item with invalid data returns 422 with field details.
3. A draft item does not appear on the public list.
4. A published item appears on the public list and in the correct order.
5. Reorder changes `order` for every item.

## Step 5: Upload handling (only if the collection has files or images)

- Use `POST /api/admin/uploads` and store the returned object.
- Never store raw file bytes in MongoDB.
- Delete the file from Cloudinary when its parent record is deleted (call `DELETE /api/admin/uploads/:publicId` from the service layer or a cleanup helper).

## Step 6: Frontend feature (`apps/web/src/features/<plural>/`)

- `types.ts`: re-exports the shared types.
- `queries.ts`: TanStack Query hooks: `useList`, `useItem`, `useCreate`, `useUpdate`, `useDelete`, `useReorder`.
- Mutations invalidate the list query on success.

## Step 7: Admin pages (`apps/web/src/admin/collections/<plural>/`)

- `<Plural>ListPage.tsx`: table with title, status, order, updated date, and actions. Search box. Status filter. Drag-to-reorder using the shared `SortableList` component. Create button.
- `<Singular>EditorPage.tsx`: form built from the shared Zod schema with React Hook Form. Use the shared `FormField`, `ImageField`, `MarkdownField`, `MonthPickerField`, `TagsField`, and `StatusField` components. Save as draft or publish. Delete with confirmation.
- Show a loading skeleton, an error state, and an empty state.
- Register routes in `apps/web/src/app/router.tsx` under `/admin`.

## Step 8: Public pages

- List page: `apps/web/src/pages/<Plural>Page.tsx`. Uses the public query hook. Shows an empty state when there are no published items.
- Detail page when the collection has per-item pages (blog, projects): `apps/web/src/pages/<Singular>DetailPage.tsx`.
- Home section: `apps/web/src/components/sections/<Plural>Section.tsx` shows the latest three published items with a link to the full page.
- Register routes in the router. Add the page to the sitemap generator.

## Step 9: Seed data

- Add realistic seed entries to `apps/api/scripts/seed.ts`, using real owner content or `[TODO]` markers. Never use Lorem Ipsum.
- Seed entries use `status: 'published'` only when the content is verified.

## Step 10: Checks before you report done

Run and show the output of:

```
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Then run the browser checks for the admin list, editor create and save, reorder, and the public page in both themes.

## Standard admin behaviour (must be identical across collections)

- Create, edit, delete, and reorder work for the owner.
- Save as draft is always available. Publish is a separate action.
- Changes appear on the public site after a page reload, without a rebuild.
- Deleting an item removes its uploaded files from Cloudinary.
- Forms prevent submitting invalid dates and empty required fields, with a message next to each field.

## Example: Certifications collection

- Fields: title (required, max 150), issuer (required, max 120), issueDate (required), expiryDate (optional, after issueDate), credentialId, credentialUrl (URL), certificateFile (optional PDF or image), skills (tags), order, status.
- Public page `/certifications`: grid with issuer and dates, a "View certificate" button that opens an in-page viewer for images or a new tab for PDFs, and a "Verify" link when `credentialUrl` exists.
- Home section: the three most recent certifications.

## Example: Achievements collection

- Fields: title, category (enum), issuer, date, description (Markdown), link, image (optional), order, status.
- Public page `/achievements`: filter chips by category, list sorted by date (newest first).
- Home section: the three most recent achievements.
