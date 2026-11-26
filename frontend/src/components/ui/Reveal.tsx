import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  immediate?: boolean;
}

const CRAWLER_UA_PATTERN =
  /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebot|ia_archiver|applebot|semrushbot|ahrefsbot/i;

function isSearchCrawler(): boolean {
  if (typeof navigator === 'undefined') return false;
  return CRAWLER_UA_PATTERN.test(navigator.userAgent);
}

/**
 * Reveals a section with a short millisecond delay when scrolled into view,
 * while remaining immediately visible to search crawlers and reduced-motion users.
 */
export function Reveal({
  children,
  className = '',
  delayMs = 120,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => immediate || isSearchCrawler());

  useEffect(() => {
    if (visible) return;

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    let timerId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          if (delayMs > 0) {
            timerId = setTimeout(() => setVisible(true), delayMs);
          } else {
            setVisible(true);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [delayMs, visible]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-[0.99] opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
