// Beschriftungen (Labels) für alle Auswahlmöglichkeiten. An einer Stelle
// gepflegt, damit UI-Texte und JSON-Werte (siehe types.ts / API_CONTRACT.md)
// konsistent bleiben.

import type {
  Activity,
  Compensation,
  Rating,
  RatingOrNA,
  ReportSectionId,
  ServiceArea,
  TravelCompanion,
  YesNoOrNA,
} from "./types";

export const RATING_OPTIONS: { value: Rating; label: string }[] = [
  { value: "sehr_schlecht", label: "Sehr schlecht" },
  { value: "schlecht", label: "Schlecht" },
  { value: "eher_schlecht", label: "Eher schlecht" },
  { value: "eher_gut", label: "Eher gut" },
  { value: "gut", label: "Gut" },
  { value: "sehr_gut", label: "Sehr gut" },
];

export const TRAVEL_COMPANION_OPTIONS: { value: TravelCompanion; label: string }[] = [
  { value: "alleine", label: "Alleine" },
  { value: "paar", label: "Paar" },
  { value: "familie", label: "Familie" },
  { value: "gruppe", label: "Gruppe" },
];

export const SERVICE_AREA_OPTIONS: { value: ServiceArea; label: string }[] = [
  { value: "zimmer", label: "Zimmer" },
  { value: "rezeption", label: "Rezeption" },
  { value: "bar_disco_restaurant", label: "Bar/Disco/Restaurant" },
  { value: "gaestebetreuung", label: "Gästebetreuung" },
  { value: "animation", label: "Animation" },
  { value: "woanders", label: "Woanders" },
  { value: "nirgends", label: "Nirgends" },
  { value: "keine_angabe", label: "Keine Angabe" },
];

export const ACTIVITY_OPTIONS: { value: Activity; label: string }[] = [
  { value: "animation", label: "Animation" },
  { value: "sport", label: "Sport" },
  { value: "kultur_erlebnis", label: "Kultur & Erlebnis" },
  { value: "nightlife", label: "Ausgehen & Nightlife" },
  { value: "geschaeftsreise", label: "Geschäftsreise" },
  { value: "sonstiges", label: "Sonstiges" },
  { value: "nichts", label: "Nichts" },
];

export const COMPENSATION_OPTIONS: { value: Compensation; label: string }[] = [
  { value: "keine", label: "Nein" },
  { value: "ermaessigung_gutschein", label: "Ermäßigung oder Gutschein" },
  { value: "kostenloser_checkout", label: "Kostenloser später Check-out" },
  { value: "kostenloses_getraenk", label: "Kostenloses Getränk" },
  { value: "dankeschoen_geschenk", label: "Dankeschön-Geschenk" },
  { value: "sonstiges", label: "Sonstiges" },
  { value: "keine_angabe", label: "Keine Angabe" },
];

export const REPORT_SECTIONS: { id: ReportSectionId; label: string; description: string }[] = [
  { id: "zimmer", label: "Zimmer", description: "Größe, Sauberkeit, Schlafkomfort" },
  { id: "verpflegung", label: "Verpflegung", description: "Geschmack und Auswahl beim Essen" },
  { id: "service", label: "Service", description: "Wo das Personal besonders gut war" },
  { id: "aktivitaeten", label: "Aktivitäten", description: "Was du vor Ort unternommen hast" },
  { id: "preisLeistung", label: "Preis-Leistung", description: "Verhältnis und unerwartete Kosten" },
  { id: "verkehrsanbindung", label: "Verkehrsanbindung", description: "Erreichbarkeit und Lage" },
  { id: "nachhaltigkeit", label: "Nachhaltigkeit", description: "Umwelt, lokale Wirtschaft und Kultur" },
];

// --- Label-Lookups für die Zusammenfassung (SummaryStep) --------------------

export function ratingLabel(value: RatingOrNA): string {
  if (value === null) return "Keine Angabe";
  return RATING_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function yesNoLabel(value: YesNoOrNA): string {
  if (value === null) return "Keine Angabe";
  return value === "ja" ? "Ja" : "Nein";
}

export function travelCompanionLabel(value: TravelCompanion | null): string {
  if (value === null) return "–";
  return TRAVEL_COMPANION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function compensationLabel(value: Compensation | null): string {
  if (value === null) return "–";
  return COMPENSATION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function serviceAreaLabels(values: ServiceArea[]): string {
  if (values.length === 0) return "–";
  return values
    .map((v) => SERVICE_AREA_OPTIONS.find((o) => o.value === v)?.label ?? v)
    .join(", ");
}

export function activityLabels(values: Activity[]): string {
  if (values.length === 0) return "–";
  return values
    .map((v) => ACTIVITY_OPTIONS.find((o) => o.value === v)?.label ?? v)
    .join(", ");
}

export function reportSectionLabel(id: ReportSectionId): string {
  return REPORT_SECTIONS.find((s) => s.id === id)?.label ?? id;
}
