import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function Seo({ title, description, canonicalPath = '/', jsonLd }: SeoProps) {
  useEffect(() => {
    const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined) || window.location.origin;
    const fullUrl = `${siteUrl.replace(/\/$/, '')}${canonicalPath}`;

    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', fullUrl);

    const scriptId = 'seo-json-ld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, canonicalPath, jsonLd]);

  return null;
}
