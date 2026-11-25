import type { ContentStatus } from '@portfolio/shared';
import { Select } from '../components/ui/Select';
import { FormField } from './FormField';

interface StatusFieldProps {
  value: ContentStatus;
  onChange: (value: ContentStatus) => void;
  error?: string;
}

export function StatusField({ value, onChange, error }: StatusFieldProps) {
  return (
    <FormField id="status" label="Visibility Status" error={error}>
      <Select
        id="status"
        value={value}
        onChange={(e) => onChange(e.target.value as ContentStatus)}
        error={error}
      >
        <option value="draft">Draft (hidden from public site)</option>
        <option value="published">Published (visible on public site)</option>
      </Select>
    </FormField>
  );
}
