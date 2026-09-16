// Zentrale Typdefinitionen für die Bewertungs-App.
// Diese Typen spiegeln 1:1 die JSON-Verträge aus API_CONTRACT.md wider.

export type Rating =
  | "sehr_schlecht"
  | "schlecht"
  | "eher_schlecht"
  | "eher_gut"
  | "gut"
  | "sehr_gut";

/** Bewertungsskala, bei der zusätzlich "keine Angabe" (= null) erlaubt ist. */
export type RatingOrNA = Rating | null;

export type YesNo = "ja" | "nein";
/** Ja/Nein-Frage, bei der zusätzlich "keine Angabe" (= null) erlaubt ist. */
export type YesNoOrNA = YesNo | null;

export type TravelCompanion = "alleine" | "paar" | "familie" | "gruppe";

export type ReportSectionId =
  | "zimmer"
  | "verpflegung"
  | "service"
  | "aktivitaeten"
  | "preisLeistung"
  | "verkehrsanbindung"
  | "nachhaltigkeit";

export type ServiceArea =
  | "zimmer"
  | "rezeption"
  | "bar_disco_restaurant"
  | "gaestebetreuung"
  | "animation"
  | "woanders"
  | "nirgends"
  | "keine_angabe";

export type Activity =
  | "animation"
  | "sport"
  | "kultur_erlebnis"
  | "nightlife"
  | "geschaeftsreise"
  | "sonstiges"
  | "nichts";

export type Compensation =
  | "keine"
  | "ermaessigung_gutschein"
  | "kostenloser_checkout"
  | "kostenloses_getraenk"
  | "dankeschoen_geschenk"
  | "sonstiges"
  | "keine_angabe";

export interface HotelInfo {
  name: string;
  imageUrl: string;
  region: string;
}

/** Name und Adresse des vermittelnden Reisebüros (optional). */
export interface OfficeInfo {
  name: string;
  address: string;
}

export type HotelLookupResponse =
  | {
      status: "ok";
      hashKey: string;
      hotel: HotelInfo;
      travelPeriod: string;
      /**
       * Optionale Hex-Farbe des Reisebüros (z.B. "#1C448C"), aus der die App
       * ein eigenes Farbschema ableitet (siehe lib/colorScale.ts). Fehlt sie
       * oder ist sie ungültig, wird die Standardfarbe verwendet.
       */
      brandColor?: string;
      /**
       * Name/Adresse des vermittelnden Reisebüros (optional). Wird als
       * kompakte Kopfzeile über dem gesamten Wizard sowie ausführlich auf
       * der ersten und letzten Seite angezeigt (siehe AgencyHeader/
       * AgencyInfo). Fehlt das Feld, wird nichts angezeigt.
       */
      office?: OfficeInfo;
    }
  | {
      status: "error";
      hashKey: string;
      errorCode: "NOT_FOUND" | "UPSTREAM_ERROR" | "NOT_CONFIGURED" | "GATEWAY_ERROR";
      message: string;
    };

export interface RoomReport {
  sizeRating: RatingOrNA;
  cleanlinessRating: RatingOrNA;
  sleepQualityRating: RatingOrNA;
  experienceText: string | null;
}

export interface CateringReport {
  tasteRating: RatingOrNA;
  varietyRating: RatingOrNA;
  notesText: string | null;
}

export interface ServiceReport {
  goodAreas: ServiceArea[];
  staffInteractionText: string | null;
}

export interface ActivitiesReport {
  activities: Activity[];
}

export interface PriceValueReport {
  ratioRating: RatingOrNA;
  unexpectedCosts: YesNoOrNA;
}

export interface AccessibilityReport {
  publicTransport: YesNoOrNA;
  parking: YesNoOrNA;
  locationRating: RatingOrNA;
  accessText: string | null;
}

export interface SustainabilityReport {
  ecoFriendlinessRating: RatingOrNA;
  localEconomySupportRating: RatingOrNA;
  localCultureRating: RatingOrNA;
  measuresText: string | null;
}

/** Der komplette, im Browser gehaltene Zustand des Bewertungs-Wizards. */
export interface ReviewState {
  hashKey: string;
  recommend: boolean | null;
  overallRating: Rating | null;
  description: string;
  travelCompanion: TravelCompanion | null;
  reportSections: ReportSectionId[];
  zimmer: RoomReport | null;
  verpflegung: CateringReport | null;
  service: ServiceReport | null;
  aktivitaeten: ActivitiesReport | null;
  preisLeistung: PriceValueReport | null;
  verkehrsanbindung: AccessibilityReport | null;
  nachhaltigkeit: SustainabilityReport | null;
  compensation: Compensation | null;
  insiderTip: string;
  title: string;
}

/**
 * Das JSON, das per POST an das CGI geschickt wird: ReviewState + Metadaten.
 * insiderTip/title werden hier von "" auf null normalisiert (siehe
 * lib/submission.ts), damit "keine Angabe" im JSON eindeutig null ist.
 */
export interface ReviewSubmission extends Omit<ReviewState, "insiderTip" | "title"> {
  submittedAt: string;
  insiderTip: string | null;
  title: string | null;
}

export function createEmptyReviewState(hashKey: string): ReviewState {
  return {
    hashKey,
    recommend: null,
    overallRating: null,
    description: "",
    travelCompanion: null,
    reportSections: [],
    zimmer: null,
    verpflegung: null,
    service: null,
    aktivitaeten: null,
    preisLeistung: null,
    verkehrsanbindung: null,
    nachhaltigkeit: null,
    compensation: null,
    insiderTip: "",
    title: "",
  };
}
