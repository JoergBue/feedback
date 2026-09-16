import type { HotelLookupResponse } from "./types";

/**
 * Dummy-Daten für den HashKey "TEST" - siehe Vorgabe. Wird verwendet,
 * solange kein echtes BOSYS-Gateway konfiguriert ist, bzw. immer dann,
 * wenn genau "TEST" übergeben wird. brandColor demonstriert das dynamische
 * Farbschema (siehe lib/colorScale.ts), office die Reisebüro-Kopfzeile -
 * beides mit Beispielwerten aus der Vorgabe.
 */
export const TEST_HOTEL_LOOKUP: HotelLookupResponse = {
  status: "ok",
  hashKey: "TEST",
  hotel: {
    name: "Hotel zur Sonne",
    imageUrl:
      "https://www.alpenheim.net/typo3temp/_processed_/csm_alpenheimhaus_fb297ea437.jpg",
    region: "Fiss, Tirol, Österreich",
  },
  travelPeriod: "September 2026",
  brandColor: "#1C448C",
  office: {
    name: "Reisebüro Sonnenschein",
    address: "Hauptstraße 10, 10115 Berlin",
  },
};
