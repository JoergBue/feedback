import type { ReportSectionId, ReviewState } from "./types";

/**
 * Feste Reihenfolge aller möglichen Steps. Die Berichts-Steps (zimmer …
 * nachhaltigkeit) werden vom Wizard dynamisch ein- bzw. ausgeblendet, je
 * nachdem was der Nutzer im "sectionSelect"-Step ausgewählt hat.
 */
export type StepId =
  | "intro"
  | "recommend"
  | "overallRating"
  | "description"
  | "travelCompanion"
  | "sectionSelect"
  | ReportSectionId
  | "compensation"
  | "insiderTip"
  | "title"
  | "summary";

export const REPORT_SECTION_ORDER: ReportSectionId[] = [
  "zimmer",
  "verpflegung",
  "service",
  "aktivitaeten",
  "preisLeistung",
  "verkehrsanbindung",
  "nachhaltigkeit",
];

const MIN_DESCRIPTION_LENGTH = 100;

/** Berechnet die Liste der aktiven Steps auf Basis der bisherigen Antworten. */
export function getActiveSteps(state: ReviewState): StepId[] {
  const reportSteps = REPORT_SECTION_ORDER.filter((id) =>
    state.reportSections.includes(id)
  );
  return [
    "intro",
    "recommend",
    "overallRating",
    "description",
    "travelCompanion",
    "sectionSelect",
    ...reportSteps,
    "compensation",
    "insiderTip",
    "title",
    "summary",
  ];
}

/** Darf der Nutzer von diesem Step aus auf "Weiter" klicken? */
export function isStepValid(step: StepId, state: ReviewState): boolean {
  switch (step) {
    case "intro":
      return true;
    case "recommend":
      return state.recommend !== null;
    case "overallRating":
      return state.overallRating !== null;
    case "description":
      return state.description.trim().length >= MIN_DESCRIPTION_LENGTH;
    case "travelCompanion":
      return state.travelCompanion !== null;
    case "sectionSelect":
      // Auswahl ist freiwillig - man darf auch ohne Zusatzberichte fortfahren.
      return true;
    case "zimmer":
      return state.zimmer !== null;
    case "verpflegung":
      return state.verpflegung !== null;
    case "service":
      return state.service !== null;
    case "aktivitaeten":
      return state.aktivitaeten !== null;
    case "preisLeistung":
      return state.preisLeistung !== null;
    case "verkehrsanbindung":
      return state.verkehrsanbindung !== null;
    case "nachhaltigkeit":
      return state.nachhaltigkeit !== null;
    case "compensation":
      return state.compensation !== null;
    case "insiderTip":
      return true;
    case "title":
      return true;
    case "summary":
      return true;
    default:
      return true;
  }
}

export { MIN_DESCRIPTION_LENGTH };
