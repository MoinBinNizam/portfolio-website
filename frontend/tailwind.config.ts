import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        surfaceAlt: 'var(--color-surface-alt)',
        border: 'var(--color-border)',
        textPrimary: 'var(--color-text)',
        textMuted: 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
        accentText: 'var(--color-accent-text)',
        accentHover: 'var(--color-accent-hover)',
        highlight: 'var(--color-highlight)',
      },
      borderRadius: {
        button: 'var(--radius-button)',
        card: 'var(--radius-card)',
        media: 'var(--radius-media)',
        input: 'var(--radius-input)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
      },
    },
  },
  plugins: [],
};

export default config;
