# Project Rules: Moin Uddin Portfolio

These rules apply to every task in this repository. Read them before writing code.

## Required reading before any task

1. `portfolio-agent-skill/SKILL.md`: technical specification (models, API, admin, security).
2. `portfolio-agent-skill/DEVELOPMENT_PLAN.md`: the 10-day MVP schedule. Build only the task you were given.
3. `design-tokens.json`: the only source of colours, fonts, radii, and buttons. Both themes are defined here.
4. `.agent/skills/portfolio-design-system/SKILL.md`: required for any UI work.
5. `.agent/skills/portfolio-crud-module/SKILL.md`: required for any owner-managed collection.
6. `.agent/skills/portfolio-webapp-testing/SKILL.md`: required before reporting any UI task complete.

## Hard rules

- Strict TypeScript. No `any`.
- Validate all input with Zod at the API boundary and in forms (schemas live in `packages/shared`).
- Admin routes are protected on the server. Only the single owner account can access them.
- Public endpoints never return drafts, hidden items, or contact messages.
- No hardcoded hex colours in components. Use semantic theme classes.
- Both themes must work for every change.
- No placeholder text (for example "Lorem Ipsum") in any public page or seed data.
- If a design value is marked `"estimated"` in `design-tokens.json`, flag it in your summary.
- Ask before adding a dependency, and explain why.
- No secrets in code or git. Commit only `.env.example`.

## Before you report a task complete

Run and show the output of:

```
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For UI changes, run the browser checks from `portfolio-webapp-testing` in both themes at 360px and 1440px, and list the screenshot paths.

After completing any task, always provide a brief Conventional Commits message referencing the GitHub issue `#id` (for example, `feat(public): implement home page sections (#15)`).

## Scope

Work one task at a time. Keep changes small. Stop and ask if a task is unclear, conflicts with the plan, or needs an owner decision.
