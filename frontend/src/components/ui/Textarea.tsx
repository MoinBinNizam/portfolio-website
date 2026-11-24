import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className = '', error, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={`w-full rounded-input border bg-surface px-3.5 py-2.5 text-sm text-textPrimary placeholder:text-textMuted transition-colors duration-fast focus:border-accent ${
        error ? 'border-highlight' : 'border-border'
      } ${className}`}
      {...rest}
    />
  );
});
