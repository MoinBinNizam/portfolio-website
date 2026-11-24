import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = '', error, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`w-full rounded-input border bg-surface px-3.5 py-2.5 text-sm text-textPrimary transition-colors duration-fast focus:border-accent ${
        error ? 'border-highlight' : 'border-border'
      } ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
});
