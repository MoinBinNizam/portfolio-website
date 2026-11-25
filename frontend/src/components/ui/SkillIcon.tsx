import type { ReactNode } from 'react';

interface SkillIconProps {
  name: string;
  category?: string;
  className?: string;
}

function resolveSkillPath(name: string, category?: string): ReactNode {
  const key = name.toLowerCase();

  if (key.includes('react')) {
    return (
      <>
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </>
    );
  }
  if (key.includes('typescript') || key.includes('javascript')) {
    return (
      <path d="M4 4h16v16H4zM9 12v5m0-5H7m2 0h2m3 4.5c.6.5 1.5.7 2.2.3.7-.3.8-1.2.1-1.6l-1.5-.7c-.7-.4-.6-1.3.1-1.6.7-.3 1.5-.1 2 .3" />
    );
  }
  if (key.includes('tailwind') || key.includes('css') || key.includes('bootstrap')) {
    return (
      <path d="M4 10c1.5-3 3.5-4.5 6-4.5 3.5 0 4 2.5 6 3 1.5.4 2.8-.2 4-1.5-1.5 3-3.5 4.5-6 4.5-3.5 0-4-2.5-6-3-1.5-.4-2.8.2-4 1.5Zm-2 6c1.5-3 3.5-4.5 6-4.5 3.5 0 4 2.5 6 3 1.5.4 2.8-.2 4-1.5-1.5 3-3.5 4.5-6 4.5-3.5 0-4-2.5-6-3-1.5-.4-2.8.2-4 1.5Z" />
    );
  }
  if (key.includes('vite') || key.includes('next')) {
    return <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />;
  }
  if (key.includes('zustand') || key.includes('redux') || key.includes('socket')) {
    return (
      <path d="M12 3v4m0 10v4M4.9 6.5l3.5 2m7.2 4 3.5 2M4.9 17.5l3.5-2m7.2-4 3.5-2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    );
  }
  if (key.includes('node') || key.includes('express') || key.includes('php')) {
    return <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 6v8m-4-4h8" />;
  }
  if (
    key.includes('rest') ||
    key.includes('api') ||
    key.includes('openapi') ||
    key.includes('swagger')
  ) {
    return <path d="M8 7 3 12l5 5M16 7l5 5-5 5M13 5l-2 14" />;
  }
  if (
    key.includes('jwt') ||
    key.includes('rbac') ||
    key.includes('oauth') ||
    key.includes('auth')
  ) {
    return <path d="M12 2 4 6v6c0 5.2 3.4 9.7 8 11 4.6-1.3 8-5.8 8-11V6l-8-4Zm-2 10 2 2 4-4" />;
  }
  if (
    key.includes('mongo') ||
    key.includes('mysql') ||
    key.includes('sqlite') ||
    key.includes('postgres') ||
    category === 'database'
  ) {
    return (
      <path d="M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 6c0 1.7-3.6 3-8 3s-8-1.3-8-3m16 6c0 1.7-3.6 3-8 3s-8-1.3-8-3m0-9v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
    );
  }
  if (
    key.includes('rag') ||
    key.includes('agentic') ||
    key.includes('claude') ||
    key.includes('gemini') ||
    key.includes('copilot') ||
    key.includes('ai') ||
    key.includes('n8n') ||
    category === 'ai'
  ) {
    return (
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Zm6 11 1 2.2L21 17l-2 1-1 2.2-1-2.2-2-1 2-.8 1-2.2ZM5 15l.8 1.7L7.5 17.5l-1.7.8L5 20l-.8-1.7-1.7-.8 1.7-.8L5 15Z" />
    );
  }
  if (key.includes('docker')) {
    return (
      <path d="M3 13h18c0 4-3 7-8 7H9c-3.5 0-6-2.5-6-7Zm3-4h3v3H6V9Zm4 0h3v3h-3V9Zm4 0h3v3h-3V9Zm-4-4h3v3h-3V5Z" />
    );
  }
  if (key.includes('git')) {
    return (
      <path d="M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0c0 4.5-3 6-12 6" />
    );
  }
  if (key.includes('vitest') || key.includes('jest') || key.includes('testing')) {
    return <path d="M9 3h6m-5 0v5.5L5.2 17A2 2 0 0 0 7 20h10a2 2 0 0 0 1.8-3L14 8.5V3" />;
  }
  if (key.includes('figma') || key.includes('adobe') || category === 'design') {
    return (
      <path d="M12 3H8.5a3 3 0 0 0 0 6H12V3Zm0 0h3.5a3 3 0 0 1 0 6H12V3Zm0 6H8.5a3 3 0 0 0 0 6H12V9Zm0 6H8.5a3 3 0 1 0 3.5 3V15Zm3.5-6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    );
  }
  if (
    key.includes('wordpress') ||
    key.includes('elementor') ||
    key.includes('shopify') ||
    key.includes('webflow') ||
    key.includes('wix') ||
    key.includes('sharepoint') ||
    category === 'cms'
  ) {
    return (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-5.5 6h2.2l2.3 7 2-5.5-1-1.5h2.2l2 5.5 1.8-5.5" />
    );
  }

  return <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />;
}

export function SkillIcon({ name, category, className = 'h-4 w-4' }: SkillIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {resolveSkillPath(name, category)}
    </svg>
  );
}
