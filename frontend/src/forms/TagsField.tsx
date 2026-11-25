import { useState, type KeyboardEvent } from 'react';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { FormField } from './FormField';

interface TagsFieldProps {
  id: string;
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function TagsField({
  id,
  label,
  value,
  onChange,
  placeholder = 'Type item and press Enter',
  error,
}: TagsFieldProps) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <FormField id={id} label={label} error={error}>
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          error={error}
        />
        <button
          type="button"
          onClick={addTag}
          className="shrink-0 rounded-button border border-border bg-surface px-4 py-2 text-xs font-semibold text-textPrimary hover:border-accent"
        >
          Add
        </button>
      </div>
      {value.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge key={tag} className="gap-1.5 pr-1.5">
              <span>{tag}</span>
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="rounded-full px-1 text-textMuted hover:text-highlight"
              >
                &times;
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </FormField>
  );
}
