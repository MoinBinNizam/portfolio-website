import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accentText hover:bg-accentHover border border-transparent',
  secondary: 'bg-surface text-textPrimary border border-border hover:border-accent',
  ghost: 'bg-transparent text-textPrimary border border-transparent hover:bg-surfaceAlt',
};

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-button px-5 py-2.5 text-sm font-semibold transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
