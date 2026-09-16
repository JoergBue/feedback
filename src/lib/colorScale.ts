// Leitet aus einer einzelnen Hex-Farbe (z.B. "#1C448C") eine 10-stufige
// Farbskala ab - wie eine Tailwind-Farbpalette (50 hell … 900 dunkel).
// Die Eingabefarbe selbst landet exakt auf Stufe 600, hellere Stufen werden
// linear mit Weiß gemischt, dunklere mit Schwarz. Damit lässt sich pro
// Reisebüro (aus der HashKey-Antwort) zur Laufzeit ein eigenes Farbschema
// erzeugen, ohne dass Tailwind zur Build-Zeit alle Farben kennen müsste -
// die Werte werden als CSS-Custom-Properties gesetzt, auf die die
// Tailwind-Klassen per Arbitrary-Value (z.B. `bg-[var(--brand-600)]`)
// zugreifen.

interface Rgb {
  r: number;
  g: number;
  b: number;
}

export const BRAND_SHADE_KEYS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const;

export type BrandShadeKey = (typeof BRAND_SHADE_KEYS)[number];
export type BrandScale = Record<BrandShadeKey, string>;

/** Standardfarbe, falls die HashKey-Antwort keine/keine gültige Farbe liefert. */
export const DEFAULT_BRAND_COLOR = "#2f6a61";

const HEX_PATTERN = /^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/;

/** Prüft, ob ein String ein gültiger Hex-Farbwert ist (mit/ohne "#", 3-/6-stellig). */
export function isValidHexColor(value: string): boolean {
  return HEX_PATTERN.test(value.trim());
}

function hexToRgb(hex: string): Rgb {
  const clean = hex.trim().replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(a: Rgb, b: Rgb, ratioOfB: number): Rgb {
  return {
    r: a.r + (b.r - a.r) * ratioOfB,
    g: a.g + (b.g - a.g) * ratioOfB,
    b: a.b + (b.b - a.b) * ratioOfB,
  };
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

// Anteil Weiß/Schwarz je Stufe. Stufe 600 fehlt hier bewusst - sie
// entspricht exakt der Eingabefarbe (kein Mischen).
const LIGHT_RATIOS: Partial<Record<BrandShadeKey, number>> = {
  "50": 0.95,
  "100": 0.9,
  "200": 0.75,
  "300": 0.6,
  "400": 0.3,
  "500": 0.15,
};
const DARK_RATIOS: Partial<Record<BrandShadeKey, number>> = {
  "700": 0.15,
  "800": 0.3,
  "900": 0.45,
};

/**
 * Baut aus einer Basisfarbe die 10-stufige Skala. Ungültige Eingaben fallen
 * auf DEFAULT_BRAND_COLOR zurück.
 */
export function buildBrandScale(hex: string | null | undefined): BrandScale {
  const base = hexToRgb(hex && isValidHexColor(hex) ? hex : DEFAULT_BRAND_COLOR);

  const scale = { "600": rgbToHex(base) } as BrandScale;
  for (const key of BRAND_SHADE_KEYS) {
    const lightRatio = LIGHT_RATIOS[key];
    const darkRatio = DARK_RATIOS[key];
    if (lightRatio !== undefined) {
      scale[key] = rgbToHex(mix(base, WHITE, lightRatio));
    } else if (darkRatio !== undefined) {
      scale[key] = rgbToHex(mix(base, BLACK, darkRatio));
    }
  }
  return scale;
}

/** Wandelt eine Skala in ein Objekt mit CSS-Custom-Property-Keys um, z.B. für React-`style`. */
export function brandScaleToCssVars(scale: BrandScale): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const key of BRAND_SHADE_KEYS) {
    vars[`--brand-${key}`] = scale[key];
  }
  return vars;
}
