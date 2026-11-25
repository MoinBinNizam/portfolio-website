import type { FileAsset } from '@portfolio/shared';
import { useState, type ChangeEvent } from 'react';
import { Input } from '../components/ui/Input';
import { uploadAsset } from '../lib/uploads';
import { FormField } from './FormField';

interface FileFieldProps {
  id: string;
  label: string;
  value: FileAsset | null | undefined;
  onChange: (value: FileAsset | null) => void;
  accept?: string;
  hint?: string;
  error?: string;
}

export function FileField({
  id,
  label,
  value,
  onChange,
  accept = 'image/png,image/jpeg,image/webp,application/pdf',
  hint = 'PNG, JPG, WebP, or PDF up to 10 MB.',
  error,
}: FileFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [altText, setAltText] = useState(value?.alt ?? '');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const uploaded = await uploadAsset(file, altText || file.name);
      onChange(uploaded);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <FormField id={id} label={label} hint={hint} error={error || uploadError || undefined}>
      <div className="space-y-3 rounded-card border border-border bg-surface p-4">
        <Input
          type="text"
          placeholder="Alt text / document description"
          value={value?.alt ?? altText}
          onChange={(e) => {
            setAltText(e.target.value);
            if (value) {
              onChange({ ...value, alt: e.target.value });
            }
          }}
        />
        <input
          id={id}
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={handleFileChange}
          className="block w-full text-xs text-textMuted file:mr-3 file:rounded-button file:border file:border-border file:bg-surfaceAlt file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-textPrimary"
        />
        {uploading ? <p className="text-xs text-accent">Uploading...</p> : null}
        {value ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-input border border-border bg-background p-3 text-xs">
            <a
              href={value.url}
              target="_blank"
              rel="noreferrer"
              className="truncate font-medium text-accent hover:underline"
            >
              {value.mimeType === 'application/pdf' ? 'Uploaded PDF' : 'Uploaded Image'} (
              {value.alt})
            </a>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="font-medium text-highlight hover:underline"
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </FormField>
  );
}
