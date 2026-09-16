"use client";

import { useReview } from "@/lib/reviewState";
import type { PriceValueReport } from "@/lib/types";
import { RatingScale } from "../fields/RatingScale";
import { YesNoField } from "../fields/YesNoField";
import { StepCard } from "../wizard/StepCard";

const EMPTY: PriceValueReport = { ratioRating: null, unexpectedCosts: null };

export function PriceValueStep() {
  const { state, update } = useReview();
  const priceValue = state.preisLeistung ?? EMPTY;

  function patch(fields: Partial<PriceValueReport>) {
    update({ preisLeistung: { ...priceValue, ...fields } });
  }

  return (
    <StepCard title="Bericht über Preis-Leistung">
      <RatingScale
        label="Wie war das Preis-Leistungs-Verhältnis?"
        allowNA
        value={priceValue.ratioRating}
        onChange={(value) => patch({ ratioRating: value })}
      />
      <YesNoField
        label="Gab es unerwartete Kosten während deines Aufenthalts?"
        value={priceValue.unexpectedCosts}
        onChange={(value) => patch({ unexpectedCosts: value })}
      />
    </StepCard>
  );
}
