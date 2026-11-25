import { useState } from 'react';
import { Textarea } from '../components/ui/Textarea';
import { MarkdownBody } from '../lib/markdown';
import { FormField } from './FormField';

interface MarkdownFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  error?: string;
}

export function MarkdownField({
  id,
  label,
  value,
  onChange,
  rows = 12,
  required,
  error,
}: MarkdownFieldProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const insertSnippet = (snippet: string) => {
    onChange(value ? `${value}\n${snippet}` : snippet);
  };

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <div className="rounded-card border border-border bg-surface p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('write')}
              className={`rounded-button px-3 py-1 text-xs font-semibold ${
                mode === 'write'
                  ? 'bg-accent text-accentText'
                  : 'border border-border text-textMuted hover:text-textPrimary'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`rounded-button px-3 py-1 text-xs font-semibold ${
                mode === 'preview'
                  ? 'bg-accent text-accentText'
                  : 'border border-border text-textMuted hover:text-textPrimary'
              }`}
            >
              Preview
            </button>
          </div>

          {mode === 'write' ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => insertSnippet('## Section heading')}
                className="rounded border border-border px-2 py-0.5 text-xs text-textMuted hover:border-accent hover:text-textPrimary"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('- List item')}
                className="rounded border border-border px-2 py-0.5 text-xs text-textMuted hover:border-accent hover:text-textPrimary"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('```ts\n// code\n```')}
                className="rounded border border-border px-2 py-0.5 text-xs text-textMuted hover:border-accent hover:text-textPrimary"
              >
                Code
              </button>
            </div>
          ) : null}
        </div>

        {mode === 'write' ? (
          <Textarea
            id={id}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error}
          />
        ) : (
          <div className="min-h-[220px] rounded-input border border-border bg-background p-4">
            {value.trim() ? (
              <MarkdownBody content={value} />
            ) : (
              <p className="text-xs text-textMuted">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}
