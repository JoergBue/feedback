"use client";

import { RATING_OPTIONS } from "@/lib/options";
import type { Rating, RatingOrNA } from "@/lib/types";

interface RatingScaleProps {
  label: string;
  value: RatingOrNA;
  onChange: (value: RatingOrNA) => void;
  allowNA?: boolean;
  hint?: string;
}

/**
 * Die "6 leere Kreise"-Bewertungsskala: Klick auf Kreis N füllt die Kreise
 * 1..N. Optional gibt es daneben eine "Keine Angabe"-Option, die die Skala
 * zurücksetzt (value = null).
 */
export function RatingScale({ label, value, onChange, allowNA, hint }: RatingScaleProps) {
  const selectedIndex = value ? RATING_OPTIONS.findIndex((o) => o.value === value) : -1;
  const selectedLabel = selectedIndex >= 0 ? RATING_OPTIONS[selectedIndex].label : null;

  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-medium text-slate-900">{label}</legend>
      {hint && <p className="text-sm text-slate-500">{hint}</p>}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2" role="radiogroup" aria-label={label}>
          {RATING_OPTIONS.map((option, index) => {
            const filled = selectedIndex >= 0 && index <= selectedIndex;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={value === option.value}
                aria-label={option.label}
                title={option.label}
                onClick={() => onChange(option.value as Rating)}
                className={[
                  "h-8 w-8 rounded-full border-2 transition-colors",
                  filled
                    ? "border-[var(--brand-600)] bg-[var(--brand-500)]"
                    : "border-slate-300 bg-white hover:border-[var(--brand-400)]",
                ].join(" ")}
              />
            );
          })}
        </div>

        {allowNA && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className={[
              "ml-2 rounded-full border px-3 py-1 text-sm transition-colors",
              value === null
                ? "border-slate-500 bg-slate-100 text-slate-700"
                : "border-slate-200 text-slate-500 hover:border-slate-400",
            ].join(" ")}
          >
            Keine Angabe
          </button>
        )}
      </div>

      <div className="flex justify-between text-xs text-slate-400">
        <span>{RATING_OPTIONS[0].label}</span>
        <span>{RATING_OPTIONS[RATING_OPTIONS.length - 1].label}</span>
      </div>

      {selectedLabel && (
        <p className="text-sm font-medium text-[var(--brand-700)]">Ausgewählt: {selectedLabel}</p>
      )}
    </fieldset>
  );
}
