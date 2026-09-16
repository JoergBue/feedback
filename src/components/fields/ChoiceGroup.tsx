"use client";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface ChoiceGroupProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: 1 | 2;
}

/** Einfachauswahl als Pill-Buttons (Radiogroup-Semantik). */
export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-base font-medium text-slate-900">{label}</legend>
      <div
        role="radiogroup"
        aria-label={label}
        className={columns === 2 ? "grid grid-cols-2 gap-2 sm:grid-cols-3" : "flex flex-col gap-2"}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={[
              "rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors",
              value === option.value
                ? "border-[var(--brand-600)] bg-[var(--brand-500)] text-white"
                : "border-slate-300 text-slate-700 hover:border-[var(--brand-400)]",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
