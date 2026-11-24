import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-6 transition-colors duration-fast ${className}`}
    >
      {children}
    </div>
  );
}
