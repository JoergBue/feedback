import Link from "next/link";

export default function HomePage() {
  return (
    <main className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold">Hotelbewertung</h1>
      <p className="text-sm text-slate-600">
        Diese App wird immer mit einem HashKey zu einer bestehenden Reise aufgerufen, z. B.:
      </p>
      <Link
        href="/bewertung/TEST"
        className="inline-block rounded-lg bg-[var(--brand-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-700)]"
      >
        /bewertung/TEST (Beispiel-Bewertung starten)
      </Link>
    </main>
  );
}
