export function Stat({
  label,
  value,
  code = false,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  code?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-l border-border pl-3">
      <span className="text-[10px] font-medium uppercase tracking-wider text-fg-dim">
        {label}
      </span>
      <span
        className={`${code ? "code" : ""} truncate text-sm text-fg`}
        title={hint}
      >
        {value ?? <span className="text-fg-dim">—</span>}
      </span>
    </div>
  );
}
