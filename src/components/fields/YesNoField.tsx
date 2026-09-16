"use client";

import type { YesNoOrNA } from "@/lib/types";

interface YesNoFieldProps {
  label: string;
  value: YesNoOrNA;
  onChange: (value: YesNoOrNA) => void;
  allowNA?: boolean;
}

export function YesNoField({ label, value, onChange, allowNA = true }: YesNoFieldProps) {
  const options: { value: YesNoOrNA; text: string }[] = [
    { value: "ja", text: "Ja" },
    { value: "nein", text: "Nein" },
    ...(allowNA ? [{ value: null, text: "Keine Angabe" }] : []),
  ];

  return (
    <fieldset className="space-y-2">
      <legend className="text-base font-medium text-slate-900">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={[
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              value === option.value
                ? "border-[var(--brand-600)] bg-[var(--brand-500)] text-white"
                : "border-slate-300 text-slate-700 hover:border-[var(--brand-400)]",
            ].join(" ")}
          >
            {option.text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
