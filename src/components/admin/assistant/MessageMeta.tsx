export function MessageMeta({ time, align }: { time: Date; align: 'left' | 'right' }) {
  const label = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return (
    <p
      className={`mt-1 text-[11px] text-muted-foreground ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      {label}
    </p>
  );
}

export default MessageMeta;
