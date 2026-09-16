import type { Config } from "tailwindcss";

// Hinweis: Es gibt bewusst keine statische "brand"-Farbpalette mehr hier.
// Das Farbschema wird pro Reisebüro zur Laufzeit aus brandColor (HashKey-
// Antwort) abgeleitet und als CSS-Custom-Properties (--brand-50 … --brand-900)
// gesetzt - siehe src/lib/colorScale.ts und src/app/globals.css (Fallback).
// Die Tailwind-Klassen greifen per Arbitrary-Value darauf zu, z.B.
// `bg-[var(--brand-600)]`.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
