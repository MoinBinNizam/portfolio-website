export function BackToTop() {
  const handleClick = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className="rounded-button border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-textMuted transition-colors duration-fast hover:border-accent hover:text-textPrimary"
    >
      Back to top
    </button>
  );
}
