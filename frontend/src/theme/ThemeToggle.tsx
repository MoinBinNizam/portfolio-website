import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const targetTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${targetTheme} theme`}
      className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-3.5 py-2 text-sm font-medium text-textPrimary transition-colors duration-fast hover:border-accent"
    >
      <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
