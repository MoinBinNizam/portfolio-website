import type { ReactNode } from 'react';

interface SortableItem {
  _id: string;
}

interface SortableListProps<T extends SortableItem> {
  items: T[];
  onReorder: (ids: string[]) => void;
  renderRow: (item: T, index: number) => ReactNode;
  disabled?: boolean;
}

export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  renderRow,
  disabled = false,
}: SortableListProps<T>) {
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const current = next[index];
    const swapped = next[target];
    if (!current || !swapped) return;
    next[index] = swapped;
    next[target] = current;
    onReorder(next.map((item) => item._id));
  };

  return (
    <div className="divide-y divide-border rounded-card border border-border bg-surface">
      {items.map((item, index) => (
        <div key={item._id} className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="min-w-0 flex-1">{renderRow(item, index)}</div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              disabled={disabled || index === 0}
              onClick={() => move(index, -1)}
              aria-label="Move item up"
              className="rounded-button border border-border px-2.5 py-1 text-xs font-medium text-textMuted hover:border-accent hover:text-textPrimary disabled:opacity-40"
            >
              Up
            </button>
            <button
              type="button"
              disabled={disabled || index === items.length - 1}
              onClick={() => move(index, 1)}
              aria-label="Move item down"
              className="rounded-button border border-border px-2.5 py-1 text-xs font-medium text-textMuted hover:border-accent hover:text-textPrimary disabled:opacity-40"
            >
              Down
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
