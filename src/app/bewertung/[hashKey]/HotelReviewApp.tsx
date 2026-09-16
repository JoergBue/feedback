"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ReviewProvider } from "@/lib/reviewState";
import { brandScaleToCssVars, buildBrandScale } from "@/lib/colorScale";
import type { HotelLookupResponse } from "@/lib/types";
import { AgencyHeader } from "@/components/wizard/AgencyHeader";
import { WizardShell } from "@/components/wizard/WizardShell";

export function HotelReviewApp({ hashKey }: { hashKey: string }) {
  const [lookup, setLookup] = useState<HotelLookupResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/hotel/${encodeURIComponent(hashKey)}`)
      .then((res) => res.json() as Promise<HotelLookupResponse>)
      .then((data) => {
        if (!cancelled) setLookup(data);
      })
      .catch(() => {
        if (!cancelled) {
          setLookup({
            status: "error",
            hashKey,
            errorCode: "UPSTREAM_ERROR",
            message: "Die Reisedaten konnten nicht geladen werden.",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hashKey]);

  // Farbschema des Reisebüros: brandColor aus der HashKey-Antwort (falls
  // vorhanden und gültig) -> 10-stufige Skala -> als CSS-Custom-Properties
  // auf den Wrapper, auf die alle `bg-[var(--brand-600)]`-artigen
  // Tailwind-Klassen im Wizard zugreifen. Vor dem Laden bzw. im Fehlerfall
  // greift automatisch die Standardfarbe (siehe lib/colorScale.ts).
  const brandColor = lookup?.status === "ok" ? lookup.brandColor : undefined;
  const brandStyle = useMemo(
    () => brandScaleToCssVars(buildBrandScale(brandColor)) as CSSProperties,
    [brandColor]
  );

  if (loading) {
    return (
      <div
        style={brandStyle}
        className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500"
      >
        Reisedaten werden geladen …
      </div>
    );
  }

  if (!lookup || lookup.status === "error") {
    return (
      <div style={brandStyle} className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-800">Bewertung nicht verfügbar</h1>
        <p className="text-sm text-red-700">
          {lookup?.message ?? "Zu diesem Link wurde keine Reise gefunden."}
        </p>
      </div>
    );
  }

  return (
    <div style={brandStyle}>
      {/* Reisebüro-Kopfzeile: außerhalb des Wizard-Inhalts platziert, damit
          sie unverändert auf jeder Seite sichtbar bleibt (Intro, alle
          Steps, Zusammenfassung, Danke-Seite) - siehe AgencyHeader.tsx. */}
      <AgencyHeader office={lookup.office} />
      <ReviewProvider hashKey={hashKey}>
        <WizardShell
          hotel={lookup.hotel}
          travelPeriod={lookup.travelPeriod}
          office={lookup.office}
        />
      </ReviewProvider>
    </div>
  );
}
