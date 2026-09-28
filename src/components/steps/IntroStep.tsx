import Image from "next/image";
import type { HotelInfo, OfficeInfo } from "@/lib/types";
import { AgencyInfo } from "../wizard/AgencyInfo";
import { StepCard } from "../wizard/StepCard";

export function IntroStep({
  hotel,
  travelPeriod,
  office,
}: {
  hotel: HotelInfo;
  travelPeriod: string;
  office?: OfficeInfo;
}) {
  return (
    <StepCard
      title="Deine Bewertung"
      description="Teile deine Erfahrungen mit anderen Reisenden - es dauert nur wenige Minuten."
    >
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="relative h-48 w-full bg-slate-100">
          {hotel.imageUrl ? (
            // Bild kommt von einer externen, zur Build-Zeit nicht bekannten Domain -> unoptimized
            <Image
              src={hotel.imageUrl}
              alt={hotel.name}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            // Kein Bild vom Gateway hinterlegt (kommt bei manchen Buchungen
            // vor) - Platzhalter statt kaputtem Bild.
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                className="h-12 w-12"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m4 17 5-5 3 3 4-4 4 4" />
              </svg>
            </div>
          )}
        </div>
        <div className="space-y-1 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{hotel.name}</h3>
          {hotel.region && <p className="text-sm text-slate-600">{hotel.region}</p>}
          {/* travelPeriod kann HTML (z.B. <br>) enthalten - kommt so aus dem
              BOSYS-Gateway und wird bewusst als Markup gerendert. */}
          <p className="text-sm text-slate-500">
            Reisezeitraum:{" "}
            <span dangerouslySetInnerHTML={{ __html: travelPeriod }} />
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Klicke auf &bdquo;Weiter&ldquo;, um mit deiner Bewertung zu starten.
      </p>
      <AgencyInfo office={office} />
    </StepCard>
  );
}
