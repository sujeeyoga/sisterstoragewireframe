interface QuickRepliesProps {
  items: string[];
  onPick: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function QuickReplies({ items, onPick, disabled, className }: QuickRepliesProps) {
  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          disabled={disabled}
          onClick={() => onPick(item)}
          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-primary/10 disabled:opacity-50"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default QuickReplies;
