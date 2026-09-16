import type { OfficeInfo } from "@/lib/types";

/**
 * Kompakte Kopfzeile mit Name/Adresse des vermittelnden Reisebüros - wird
 * oberhalb des gesamten Wizards angezeigt und ist damit auf jeder Seite
 * sichtbar (Intro, alle Steps, Zusammenfassung, Danke-Seite).
 *
 * Bewusst schmal gehalten (eine Zeile, kleine Schrift): auf dem Mobiltelefon
 * wird die Adresse ausgeblendet und nur der Reisebüro-Name gezeigt, damit die
 * Kopfzeile nicht unnötig viel Platz einnimmt. Name und Adresse zusammen
 * erscheinen dafür ausführlich auf der ersten und letzten Seite (siehe
 * AgencyInfo).
 */
export function AgencyHeader({ office }: { office?: OfficeInfo }) {
  if (!office) return null;

  return (
    <header className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4 shrink-0 text-[var(--brand-600)]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 21V7l8-4 8 4v14M4 21h16M9 21v-6h6v6M9 10h.01M15 10h.01M9 13h.01M15 13h.01"
        />
      </svg>
      <div className="min-w-0 flex-1 truncate text-xs sm:text-sm">
        <span className="font-medium text-slate-800">{office.name}</span>
        <span className="hidden text-slate-400 sm:inline"> · </span>
        <span className="hidden text-slate-500 sm:inline">{office.address}</span>
      </div>
    </header>
  );
}
