import type { FontSettings } from '@portfolio/shared';

export interface FontOption {
  name: string;
  googleSpec: string;
  category: 'display' | 'sans' | 'mono';
}

export const FONT_LIBRARY: FontOption[] = [
  { name: 'Michroma', googleSpec: 'Michroma', category: 'display' },
  { name: 'Inter', googleSpec: 'Inter:wght@400;500;600;700', category: 'sans' },
  {
    name: 'Plus Jakarta Sans',
    googleSpec: 'Plus+Jakarta+Sans:wght@400;500;600;700',
    category: 'sans',
  },
  { name: 'Space Grotesk', googleSpec: 'Space+Grotesk:wght@400;500;600;700', category: 'display' },
  { name: 'Poppins', googleSpec: 'Poppins:wght@400;500;600;700', category: 'sans' },
  { name: 'Montserrat', googleSpec: 'Montserrat:wght@400;500;600;700', category: 'sans' },
  { name: 'Outfit', googleSpec: 'Outfit:wght@400;500;600;700', category: 'sans' },
  { name: 'Sora', googleSpec: 'Sora:wght@400;500;600;700', category: 'display' },
  { name: 'Syne', googleSpec: 'Syne:wght@500;600;700', category: 'display' },
  { name: 'Orbitron', googleSpec: 'Orbitron:wght@500;600;700', category: 'display' },
  { name: 'Roboto', googleSpec: 'Roboto:wght@400;500;700', category: 'sans' },
  { name: 'Open Sans', googleSpec: 'Open+Sans:wght@400;500;600;700', category: 'sans' },
  { name: 'Lato', googleSpec: 'Lato:wght@400;700', category: 'sans' },
  { name: 'JetBrains Mono', googleSpec: 'JetBrains+Mono:wght@400;500;700', category: 'mono' },
  { name: 'Fira Code', googleSpec: 'Fira+Code:wght@400;500;700', category: 'mono' },
];

export const PORTFOLIO_SECTIONS = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'about', label: 'About Me' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'projects', label: 'Portfolio & Case Studies' },
  { id: 'skills', label: 'Technical Skills' },
  { id: 'credentials', label: 'Education, Certs & Achievements' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'blog', label: 'Engineering Blog' },
  { id: 'contact', label: 'Contact' },
] as const;

function toCssFontStack(fontName: string): string {
  const clean = fontName.replace(/["'<>]/g, '').trim();
  if (!clean) return "'Michroma', sans-serif";
  const isMono = clean.toLowerCase().includes('mono') || clean.toLowerCase().includes('code');
  return `'${clean}', ${isMono ? 'monospace' : 'sans-serif'}`;
}

function isSafeStylesheetUrl(url: string): boolean {
  return /^https?:\/\/[^\s"'<>]+$/i.test(url.trim());
}

/**
 * Applies saved typography settings to CSS custom properties, loads Google Fonts,
 * optional custom font stylesheet, and per-section font overrides.
 */
export function applyFontSettings(fonts?: Partial<FontSettings> | null): void {
  if (typeof document === 'undefined') return;

  const headingFont = fonts?.headingFont?.trim() || 'Michroma';
  const bodyFont = fonts?.bodyFont?.trim() || 'Inter';
  const h1Font = fonts?.h1Font?.trim() || headingFont;
  const h2Font = fonts?.h2Font?.trim() || headingFont;
  const h3Font = fonts?.h3Font?.trim() || headingFont;
  const h4Font = fonts?.h4Font?.trim() || headingFont;
  const h5Font = fonts?.h5Font?.trim() || headingFont;
  const h6Font = fonts?.h6Font?.trim() || headingFont;
  const paragraphFont = fonts?.paragraphFont?.trim() || bodyFont;
  const sectionFonts = fonts?.sectionFonts ?? {};

  const root = document.documentElement;
  root.style.setProperty('--font-heading', toCssFontStack(headingFont));
  root.style.setProperty('--font-body', toCssFontStack(bodyFont));
  root.style.setProperty('--font-h1', toCssFontStack(h1Font));
  root.style.setProperty('--font-h2', toCssFontStack(h2Font));
  root.style.setProperty('--font-h3', toCssFontStack(h3Font));
  root.style.setProperty('--font-h4', toCssFontStack(h4Font));
  root.style.setProperty('--font-h5', toCssFontStack(h5Font));
  root.style.setProperty('--font-h6', toCssFontStack(h6Font));
  root.style.setProperty('--font-paragraph', toCssFontStack(paragraphFont));

  const usedNames = new Set<string>([
    headingFont,
    bodyFont,
    h1Font,
    h2Font,
    h3Font,
    h4Font,
    h5Font,
    h6Font,
    paragraphFont,
    ...Object.values(sectionFonts).filter(Boolean),
  ]);

  const googleSpecs = FONT_LIBRARY.filter((f) => usedNames.has(f.name)).map((f) => f.googleSpec);
  const gfHref =
    googleSpecs.length > 0
      ? `https://fonts.googleapis.com/css2?${googleSpecs.map((s) => `family=${s}`).join('&')}&display=swap`
      : '';

  let gfLink = document.getElementById('portfolio-google-fonts') as HTMLLinkElement | null;
  if (gfHref) {
    if (!gfLink) {
      gfLink = document.createElement('link');
      gfLink.id = 'portfolio-google-fonts';
      gfLink.rel = 'stylesheet';
      document.head.appendChild(gfLink);
    }
    if (gfLink.href !== gfHref) gfLink.href = gfHref;
  }

  const customUrl = fonts?.customFontUrl?.trim() ?? '';
  let customLink = document.getElementById('portfolio-custom-font') as HTMLLinkElement | null;
  if (customUrl && isSafeStylesheetUrl(customUrl)) {
    if (!customLink) {
      customLink = document.createElement('link');
      customLink.id = 'portfolio-custom-font';
      customLink.rel = 'stylesheet';
      document.head.appendChild(customLink);
    }
    if (customLink.href !== customUrl) customLink.href = customUrl;
  } else if (customLink) {
    customLink.remove();
  }

  const sectionRules = Object.entries(sectionFonts)
    .filter(([id, font]) => /^[a-z0-9-]+$/i.test(id) && Boolean(font?.trim()))
    .map(([id, font]) => {
      const stack = toCssFontStack(font);
      return `#${id}, #${id} p, #${id} li, #${id} span, #${id} a { font-family: ${stack}; }`;
    })
    .join('\n');

  let styleEl = document.getElementById('portfolio-section-fonts') as HTMLStyleElement | null;
  if (sectionRules) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'portfolio-section-fonts';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = sectionRules;
  } else if (styleEl) {
    styleEl.remove();
  }
}
