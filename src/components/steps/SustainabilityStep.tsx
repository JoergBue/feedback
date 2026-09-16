"use client";

import { useReview } from "@/lib/reviewState";
import type { SustainabilityReport } from "@/lib/types";
import { RatingScale } from "../fields/RatingScale";
import { TextAreaField } from "../fields/TextAreaField";
import { StepCard } from "../wizard/StepCard";

const EMPTY: SustainabilityReport = {
  ecoFriendlinessRating: null,
  localEconomySupportRating: null,
  localCultureRating: null,
  measuresText: null,
};

export function SustainabilityStep() {
  const { state, update } = useReview();
  const sustainability = state.nachhaltigkeit ?? EMPTY;

  function patch(fields: Partial<SustainabilityReport>) {
    update({ nachhaltigkeit: { ...sustainability, ...fields } });
  }

  return (
    <StepCard title="Bericht über Nachhaltigkeit">
      <RatingScale
        label="Wie umweltfreundlich ist die Unterkunft? (z. B. Energiesparen, Abfallreduzierung, Recycling)"
        allowNA
        value={sustainability.ecoFriendlinessRating}
        onChange={(value) => patch({ ecoFriendlinessRating: value })}
      />
      <RatingScale
        label="Wie gut unterstützt die Unterkunft die lokale Wirtschaft? (z. B. lokale Produkte und Dienstleistungen)"
        allowNA
        value={sustainability.localEconomySupportRating}
        onChange={(value) => patch({ localEconomySupportRating: value })}
      />
      <RatingScale
        label="Wie gut vermittelt die Unterkunft lokale Kultur? (z. B. Veranstaltungen oder soziale Projekte)"
        allowNA
        value={sustainability.localCultureRating}
        onChange={(value) => patch({ localCultureRating: value })}
      />
      <TextAreaField
        label="Welche nachhaltigen Maßnahmen hast du während deines Aufenthaltes im Hotel bemerkt?"
        allowNA
        value={sustainability.measuresText ?? ""}
        onChange={(value) => patch({ measuresText: value === "" ? null : value })}
      />
    </StepCard>
  );
}
