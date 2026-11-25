import type { ImageAsset } from '@portfolio/shared';
import { FileField } from './FileField';

interface ImageFieldProps {
  id: string;
  label: string;
  value: ImageAsset | null | undefined;
  onChange: (value: ImageAsset | null) => void;
  error?: string;
}

export function ImageField({ id, label, value, onChange, error }: ImageFieldProps) {
  return (
    <FileField
      id={id}
      label={label}
      value={value}
      onChange={(next) => onChange(next)}
      accept="image/*"
      hint="Any image format; automatically resized to 2000px max width and compressed to WebP."
      error={error}
    />
  );
}
