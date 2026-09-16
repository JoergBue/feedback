import type { OfficeInfo } from "@/lib/types";
import { AgencyInfo } from "../wizard/AgencyInfo";
import { StepCard } from "../wizard/StepCard";

export function ThankYouStep({
  hotelName,
  office,
}: {
  hotelName: string;
  office?: OfficeInfo;
}) {
  return (
    <StepCard title="Vielen Dank!">
      <p className="text-slate-700">
        Deine Bewertung für <strong>{hotelName}</strong> wurde erfolgreich übermittelt. Wir
        freuen uns, dass du dir die Zeit genommen hast, deine Erfahrungen zu teilen.
      </p>
      <AgencyInfo office={office} />
    </StepCard>
  );
}
