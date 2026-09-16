import { NextRequest, NextResponse } from "next/server";
import { parseBosysFail } from "@/lib/bosys";
import type { ReviewSubmission } from "@/lib/types";

/**
 * Nimmt die fertige Bewertung entgegen und reicht sie an das BOSYS
 * UI.Office-Gateway weiter: bns_request-Umschlag mit Function "PutFeedback",
 * die Bewertung selbst als "PutFeedback"-Objekt (1:1 der ReviewSubmission).
 *
 * Fehlen die BOSYS-Umgebungsvariablen, wird die Bewertung nur serverseitig
 * geloggt (Konsole) und als Erfolg quittiert - so lässt sich der komplette
 * Wizard inkl. Absenden auch ohne Zugangsdaten durchtesten.
 */
export async function POST(req: NextRequest) {
  let submission: ReviewSubmission;
  try {
    submission = (await req.json()) as ReviewSubmission;
  } catch {
    return NextResponse.json({ message: "Ungültiges JSON." }, { status: 400 });
  }

  if (!submission?.hashKey) {
    return NextResponse.json({ message: "hashKey fehlt." }, { status: 400 });
  }

  const gatewayUrl = process.env.BOSYS_GATEWAY_URL;
  const terminal = process.env.BOSYS_TERMINAL;
  const token = process.env.BOSYS_TOKEN;

  if (!gatewayUrl || !terminal || !token) {
    console.log(
      "[review] BOSYS-Gateway nicht konfiguriert - Bewertung nur geloggt:\n" +
        JSON.stringify(submission, null, 2)
    );
    return NextResponse.json({ status: "ok", forwarded: false });
  }

  try {
    const upstreamRes = await fetch(gatewayUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bns_request: {
          Header: {
            Version: "1.0",
            Source: "feedback",
            BOSYSTerminal: terminal,
            Token: token,
            Function: "PutFeedback",
          },
          PutFeedback: submission,
        },
      }),
    });

    if (!upstreamRes.ok) {
      // Fehlerfall des Gateways: HTTP 400 mit einem "Fail"-Objekt statt der
      // Funktionsantwort - dessen Klartext-Meldung reichen wir an die App
      // durch, die sie dem Gast im Wizard anzeigt.
      const fail = parseBosysFail(await upstreamRes.json().catch(() => null));
      const message =
        fail?.error ?? `Das BOSYS-Gateway hat mit Status ${upstreamRes.status} geantwortet.`;
      return NextResponse.json({ message }, { status: upstreamRes.status });
    }

    return NextResponse.json({ status: "ok", forwarded: true });
  } catch {
    return NextResponse.json(
      { message: "Das BOSYS-Gateway konnte nicht erreicht werden." },
      { status: 502 }
    );
  }
}
