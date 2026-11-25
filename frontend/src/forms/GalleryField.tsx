import type { ImageAsset } from '@portfolio/shared';
import { useState, type ChangeEvent } from 'react';
import { Input } from '../components/ui/Input';
import { uploadAsset } from '../lib/uploads';
import { FormField } from './FormField';

interface GalleryFieldProps {
  id: string;
  label: string;
  value: ImageAsset[];
  onChange: (items: ImageAsset[]) => void;
  error?: string;
}

export function GalleryField({ id, label, value, onChange, error }: GalleryFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadAsset(file, file.name.replace(/\.[^.]+$/, '') || 'Screenshot')),
      );
      onChange([...value, ...uploaded]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const updateAlt = (index: number, alt: string) => {
    const next = value.map((item, i) => (i === index ? { ...item, alt } : item));
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <FormField
      id={id}
      label={label}
      hint="Upload one or more screenshots (auto-compressed to WebP, max 2000px)."
      error={error || uploadError || undefined}
    >
      <div className="space-y-4 rounded-card border border-border bg-surface p-4">
        <input
          id={id}
          type="file"
          multiple
          accept="image/*"
          disabled={uploading}
          onChange={handleFiles}
          className="block w-full text-xs text-textMuted file:mr-3 file:rounded-button file:border file:border-border file:bg-surfaceAlt file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-textPrimary"
        />
        {uploading ? <p className="text-xs text-accent">Uploading screenshots...</p> : null}
        {value.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {value.map((img, idx) => (
              <div
                key={`${img.publicId}-${idx}`}
                className="space-y-2 rounded-input border border-border bg-background p-3"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="aspect-video w-full rounded-media object-cover"
                />
                <Input
                  type="text"
                  value={img.alt}
                  placeholder="Alt text"
                  onChange={(e) => updateAlt(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="text-xs font-medium text-highlight hover:underline"
                >
                  Remove screenshot
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </FormField>
  );
}
