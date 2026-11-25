import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ id, label, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-textPrimary">
        {label}
        {required ? <span className="ml-1 text-highlight">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-textMuted">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs font-medium text-highlight">
          {error}
        </p>
      ) : null}
    </div>
  );
}
