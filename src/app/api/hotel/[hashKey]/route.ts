import { NextRequest, NextResponse } from "next/server";
import { parseBosysFail } from "@/lib/bosys";
import { TEST_HOTEL_LOOKUP } from "@/lib/mockHotels";
import type { HotelLookupResponse } from "@/lib/types";

/** Antwortform des BOSYS UI.Office-Gateways für Function "Feedback". */
interface BosysFeedbackResponse {
  bns_response?: {
    Header?: { Version?: string; TimeStamp?: string };
    Feedback?: {
      hotel?: {
        name?: string;
        imageUrl?: string;
        region?: string;
      };
      travelPeriod?: string;
      /** Hex-Farbe des Reisebüros, z.B. "#1C448C" - optional. */
      brandColor?: string;
      /**
       * Reisebüro-Angaben - optional. Achtung: Das Gateway schreibt das
       * Adressfeld als "adress" (ohne zweites "d"), nicht "address" - wird
       * unten auf das intern verwendete "address" normalisiert.
       */
      office?: {
        name?: string;
        adress?: string;
      };
    };
  };
}

/**
 * Löst einen HashKey zu Hotel-/Reisedaten auf.
 *
 * - HashKey "TEST" liefert immer die vorgegebenen Dummy-Daten - unabhängig
 *   vom BOSYS-Gateway, als verlässlicher Test-/Demo-Pfad.
 * - Für jeden anderen HashKey wird das BOSYS UI.Office-Gateway per POST
 *   angesprochen: bns_request-Umschlag mit Function "Feedback",
 *   Zugangsdaten (BOSYSTerminal/Token) aus den Umgebungsvariablen.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hashKey: string }> }
) {
  const { hashKey } = await params;

  if (hashKey === "TEST") {
    return NextResponse.json(TEST_HOTEL_LOOKUP);
  }

  const gatewayUrl = process.env.BOSYS_GATEWAY_URL;
  const terminal = process.env.BOSYS_TERMINAL;
  const token = process.env.BOSYS_TOKEN;

  if (!gatewayUrl || !terminal || !token) {
    const body: HotelLookupResponse = {
      status: "error",
      hashKey,
      errorCode: "NOT_CONFIGURED",
      message:
        'BOSYS-Gateway nicht konfiguriert (BOSYS_GATEWAY_URL/BOSYS_TERMINAL/BOSYS_TOKEN in .env). Nutze zum Testen den HashKey "TEST".',
    };
    return NextResponse.json(body, { status: 501 });
  }

  try {
    const upstreamRes = await fetch(gatewayUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        bns_request: {
          Header: {
            Version: "1.0",
            Source: "feedback",
            BOSYSTerminal: terminal,
            Token: token,
            Function: "Feedback",
          },
          Feedback: {
            hashKey,
          },
        },
      }),
    });

    if (!upstreamRes.ok) {
      // Das Gateway antwortet im Fehlerfall mit HTTP 400 und einem
      // "Fail"-Objekt statt der Funktionsantwort (z.B. falsche Zugangsdaten
      // oder unbekannter HashKey) - dessen Klartext-Meldung reichen wir
      // durch, statt sie zu einer generischen "nicht gefunden" zu verwässern.
      const fail = parseBosysFail(await upstreamRes.json().catch(() => null));
      const body: HotelLookupResponse = fail
        ? {
            status: "error",
            hashKey,
            errorCode: "GATEWAY_ERROR",
            message: fail.error,
          }
        : {
            status: "error",
            hashKey,
            errorCode: "NOT_FOUND",
            message: "Zu diesem HashKey wurde keine Reise gefunden.",
          };
      return NextResponse.json(body, { status: upstreamRes.status });
    }

    const data = (await upstreamRes.json()) as BosysFeedbackResponse;
    const hotel = data.bns_response?.Feedback?.hotel;
    const travelPeriod = data.bns_response?.Feedback?.travelPeriod;
    const brandColor = data.bns_response?.Feedback?.brandColor;
    const officeRaw = data.bns_response?.Feedback?.office;
    // Nur übernehmen, wenn beide Felder vorhanden sind - sonst lieber gar
    // keine (unvollständige) Reisebüro-Info anzeigen.
    const office =
      officeRaw?.name && officeRaw.adress
        ? { name: officeRaw.name, address: officeRaw.adress }
        : undefined;

    // Das Gateway antwortet auch mit HTTP 200 bei unbekanntem HashKey, aber
    // ohne befüllte Feedback-Daten - das werten wir defensiv als NOT_FOUND.
    // Nur Name und Reisezeitraum sind hier wirklich zwingend: imageUrl und
    // region kommen bei manchen echten Buchungen leer vom Gateway zurück
    // (bestaetigt am 2026-09-28 am Beispiel-HashKey "vorbei" - Bild und
    // Region leer, Rest der Daten aber gueltig) und werden unten als
    // optionale Felder behandelt statt die ganze Buchung zu verwerfen.
    if (!hotel?.name || !travelPeriod) {
      const body: HotelLookupResponse = {
        status: "error",
        hashKey,
        errorCode: "NOT_FOUND",
        message: "Zu diesem HashKey wurde keine Reise gefunden.",
      };
      return NextResponse.json(body, { status: 404 });
    }

    const body: HotelLookupResponse = {
      status: "ok",
      hashKey,
      hotel: {
        name: hotel.name,
        imageUrl: hotel.imageUrl || undefined,
        region: hotel.region || undefined,
      },
      travelPeriod,
      // Ungültige Werte werden nicht hier, sondern zentral in
      // lib/colorScale.ts abgefangen (Fallback auf DEFAULT_BRAND_COLOR).
      brandColor: brandColor || undefined,
      office,
    };
    return NextResponse.json(body);
  } catch {
    const body: HotelLookupResponse = {
      status: "error",
      hashKey,
      errorCode: "UPSTREAM_ERROR",
      message: "Das BOSYS-Gateway konnte nicht erreicht werden.",
    };
    return NextResponse.json(body, { status: 502 });
  }
}
