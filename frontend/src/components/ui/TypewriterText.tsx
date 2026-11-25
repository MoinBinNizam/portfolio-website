import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
}

/**
 * Cycles a typing and erasing animation for the given text while respecting
 * reduced-motion preferences and keeping the full string accessible to screen readers.
 */
export function TypewriterText({ text, className = '' }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState(text);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing' | 'waiting'>('pausing');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, 42);
      } else {
        setPhase('pausing');
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => {
        setPhase('erasing');
      }, 2200);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length - 1));
        }, 22);
      } else {
        setPhase('waiting');
      }
    } else {
      timeout = setTimeout(() => {
        setPhase('typing');
      }, 350);
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, reducedMotion, text]);

  useEffect(() => {
    setDisplayed(reducedMotion ? text : '');
    setPhase(reducedMotion ? 'pausing' : 'typing');
  }, [text, reducedMotion]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      {!reducedMotion ? (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-middle"
        />
      ) : null}
    </span>
  );
}
