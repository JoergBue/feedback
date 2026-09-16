import type { OfficeInfo } from "@/lib/types";

/**
 * Ausführliche Reisebüro-Angabe (Name + Adresse, immer beide zusammen,
 * unabhängig von der Bildschirmgröße) - wird auf der ersten Seite (Intro)
 * und der letzten Seite (Danke-Seite) eingeblendet, zusätzlich zur
 * kompakten AgencyHeader-Kopfzeile, die auf kleinen Bildschirmen die
 * Adresse ausblendet.
 */
export function AgencyInfo({ office }: { office?: OfficeInfo }) {
  if (!office) return null;

  return (
    <p className="text-xs text-slate-500">
      Vermittelt durch{" "}
      <span className="font-medium text-slate-700">{office.name}</span>,{" "}
      {office.address}
    </p>
  );
}
