export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>
          Schritt {current + 1} von {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[var(--brand-500)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
