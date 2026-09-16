"use client";

interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface MultiChoiceGroupProps<T extends string> {
  label: string;
  hint?: string;
  options: Option<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  columns?: 1 | 2;
}

/** Mehrfachauswahl als Chips (Checkbox-Semantik). */
export function MultiChoiceGroup<T extends string>({
  label,
  hint,
  options,
  values,
  onChange,
  columns = 1,
}: MultiChoiceGroupProps<T>) {
  function toggle(value: T) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-base font-medium text-slate-900">{label}</legend>
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
      <div className={columns === 2 ? "grid grid-cols-1 gap-2 sm:grid-cols-2" : "flex flex-col gap-2"}>
        {options.map((option) => {
          const checked = values.includes(option.value);
          return (
            <label
              key={option.value}
              className={[
                "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                checked
                  ? "border-[var(--brand-600)] bg-[var(--brand-50)]"
                  : "border-slate-300 hover:border-[var(--brand-400)]",
              ].join(" ")}
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-slate-400 text-[var(--brand-600)] focus:ring-[var(--brand-500)]"
                checked={checked}
                onChange={() => toggle(option.value)}
              />
              <span>
                <span className="font-medium text-slate-900">{option.label}</span>
                {option.description && (
                  <span className="block text-xs text-slate-500">{option.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
