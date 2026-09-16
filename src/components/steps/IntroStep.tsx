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
          {/* Bild kommt von einer externen, zur Build-Zeit nicht bekannten Domain -> unoptimized */}
          <Image
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="space-y-1 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{hotel.name}</h3>
          <p className="text-sm text-slate-600">{hotel.region}</p>
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
