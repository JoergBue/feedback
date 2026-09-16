"use client";

import type { ChangeEvent } from "react";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  /** Zeigt einen "Keine Angabe"-Schalter, der das Feld leert und deaktiviert. */
  allowNA?: boolean;
  rows?: number;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  minLength,
  allowNA,
  rows = 4,
}: TextAreaFieldProps) {
  const isNA = allowNA && value === "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-base font-medium text-slate-900">{label}</label>
        {allowNA && (
          <button
            type="button"
            onClick={() => onChange("")}
            className={[
              "rounded-full border px-3 py-1 text-xs transition-colors",
              isNA
                ? "border-slate-500 bg-slate-100 text-slate-700"
                : "border-slate-200 text-slate-500 hover:border-slate-400",
            ].join(" ")}
          >
            Keine Angabe
          </button>
        )}
      </div>
      <textarea
        className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      />
      {typeof minLength === "number" && (
        <p
          className={[
            "text-xs",
            value.trim().length >= minLength ? "text-[var(--brand-600)]" : "text-slate-400",
          ].join(" ")}
        >
          {value.trim().length} / {minLength} Zeichen mindestens
        </p>
      )}
    </div>
  );
}
