import type { ReviewState, ReviewSubmission } from "./types";

/**
 * Baut das finale POST-JSON aus dem im Browser gehaltenen Zustand:
 * - Berichts-Objekte für nicht ausgewählte Bereiche werden auf null gesetzt,
 *   auch wenn im State noch (alte) Daten dazu stehen.
 * - Leere Freitexte (insiderTip, title) werden zu null.
 */
export function buildSubmission(state: ReviewState): ReviewSubmission {
  const included = new Set(state.reportSections);

  return {
    ...state,
    zimmer: included.has("zimmer") ? state.zimmer : null,
    verpflegung: included.has("verpflegung") ? state.verpflegung : null,
    service: included.has("service") ? state.service : null,
    aktivitaeten: included.has("aktivitaeten") ? state.aktivitaeten : null,
    preisLeistung: included.has("preisLeistung") ? state.preisLeistung : null,
    verkehrsanbindung: included.has("verkehrsanbindung") ? state.verkehrsanbindung : null,
    nachhaltigkeit: included.has("nachhaltigkeit") ? state.nachhaltigkeit : null,
    insiderTip: state.insiderTip.trim() === "" ? null : state.insiderTip,
    title: state.title.trim() === "" ? null : state.title,
    submittedAt: new Date().toISOString(),
  };
}
