// Playwright smoke test specification for public pages (#69)
// Run with: pnpm exec playwright test (after installing @playwright/test)
export const PUBLIC_SMOKE_ROUTES = [
  '/',
  '/about',
  '/experience',
  '/education',
  '/certifications',
  '/achievements',
  '/projects',
  '/services',
  '/blog',
  '/contact',
];

export const VIEWPORTS = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
