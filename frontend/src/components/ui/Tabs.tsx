interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`rounded-button border px-3.5 py-1.5 text-sm font-medium transition-colors duration-fast ${
              isActive
                ? 'border-accent bg-accent text-accentText'
                : 'border-border bg-surface text-textMuted hover:border-accent hover:text-textPrimary'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
