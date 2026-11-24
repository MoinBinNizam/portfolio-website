import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', error, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-input border bg-surface px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-fast focus:border-accent ${
        error ? 'border-highlight' : 'border-border'
      } ${className}`}
      {...rest}
    />
  );
});
