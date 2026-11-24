---
name: portfolio-design-system
description: Design and build the portfolio's human-centred interface in both dark and light themes, responsive from 360px to 1440px. Use for any visual or layout work, theme implementation, component styling, or design review, so the result looks made by a person with clear intent rather than generated from generic templates.
---

# Portfolio Design System

## Design direction

The portfolio should read as the work of one person who cares about craft. Target qualities:

- **Specific, not generic.** Copy, photos, and project screenshots are real. Layout choices reflect the content.
- **Warm and readable.** Generous line height (1.6 for body), comfortable measure (about 65 characters per line), and a human voice in headings and labels.
- **Editorial rhythm.** Sections vary in layout. Use a two-column intro, a wide image band, a staggered timeline, and a dense grid in different places. Do not repeat one card layout for every section.
- **Confident hierarchy.** One clear heading per section, one primary action per view, and no more than two button styles on a page.
- **Honest motion.** Short, subtle transitions (150 to 250 ms). Respect `prefers-reduced-motion`. No looping decoration.

## Avoid these patterns (they read as machine-generated)

- Purple or blue gradients, glowing blobs, or decorative orbs behind content
- Centred hero with three identical feature cards below it
- Icon-in-a-circle grids for every list
- Emoji used as icons or bullets
- Stock photography or abstract 3D illustrations as the main visual
- Identical card height and padding everywhere
- Lorem Ipsum or filler copy
- Equal-weight text everywhere (use scale and spacing to rank content)
- Animated text that rewrites itself or typewriter effects
- Generic taglines such as "Building the future" or "Passionate developer"

## Use these patterns instead

- Left-aligned headings with a small eyebrow label above (for example "Experience" in the accent colour)
- Real project screenshots in browser-style frames with a thin border
- Timelines drawn with a single vertical line and small date labels, not icons
- Achievements and certifications shown as document-like cards with a subtle paper tone in light mode
- Asymmetric hero: text left, portrait right, with a short caption under the photo
- Section dividers made from space and a hairline border, not from decorative shapes
- Hover states that change the border or underline, not the whole card

## Theme implementation

Define tokens in `apps/web/src/theme/tokens.css`:

```css
:root,
[data-theme='dark'] {
  --color-background: #0e0e0e;
  --color-surface: #161616;
  --color-surface-alt: #1f1f1f;
  --color-border: #2a2a28;
  --color-text: #f4f4f2;
  --color-text-muted: #9a9a96;
  --color-accent: #22e37a;
  --color-accent-text: #0e0e0e;
  --color-accent-hover: #1bc868;
  --color-highlight: #e8501a;
}
[data-theme='light'] {
  --color-background: #f7f6f2;
  --color-surface: #ffffff;
  --color-surface-alt: #efede6;
  --color-border: #dad7ce;
  --color-text: #141414;
  --color-text-muted: #5b5b57;
  --color-accent: #0b7a43;
  --color-accent-text: #ffffff;
  --color-accent-hover: #08643a;
  --color-highlight: #d9480f;
}
```

Map these in `tailwind.config.ts` (for example `background: 'var(--color-background)'`). Use only the semantic names in components.

Theme provider rules:

- Apply `data-theme` to `<html>` before first paint (small inline script in `index.html`) to avoid a flash of the wrong theme.
- Read `localStorage` inside a try/catch. Default to dark, or to `prefers-color-scheme` if no choice is stored.
- Toggle button has `aria-label` that names the target theme and `aria-pressed` is not used (it is not a toggle state button).

## Responsive rules

- Mobile first. Breakpoints: 640px, 768px, 1024px, 1280px.
- Container: maximum 1200px with 20px side padding on mobile, 40px on desktop.
- Navigation: below 1024px use a menu button that opens a full-height panel with the theme toggle inside.
- Images: `max-width: 100%`, `height: auto`, and `aspect-ratio` set to prevent layout shift.
- Tables (for example in admin) scroll horizontally inside their own container.
- Test at 360px, 768px, and 1440px in both themes.

## Accessibility checks

- Body text contrast at least 4.5:1 in both themes. Large text at least 3:1.
- Focus ring: 2px outline in the accent colour with 2px offset. Never remove focus outlines.
- Form errors shown as text next to the field, not only as colour.
- Carousels pause on hover and focus, and can be operated with arrow keys.
- Images have alt text. Decorative images use an empty alt attribute.

## Review checklist (run before every UI task is reported done)

- [ ] Both themes checked at 360px, 768px, and 1440px
- [ ] No hex values in components
- [ ] No avoided patterns from the list above
- [ ] Each section has a distinct layout, not a copy of the previous one
- [ ] Real content only (no filler text)
- [ ] Contrast checked for body text and buttons in both themes
- [ ] Theme choice persists after reload
- [ ] Reduced motion setting disables non-essential transitions
