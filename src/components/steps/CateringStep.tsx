"use client";

import { useReview } from "@/lib/reviewState";
import type { CateringReport } from "@/lib/types";
import { RatingScale } from "../fields/RatingScale";
import { TextAreaField } from "../fields/TextAreaField";
import { StepCard } from "../wizard/StepCard";

const EMPTY: CateringReport = {
  tasteRating: null,
  varietyRating: null,
  notesText: null,
};

export function CateringStep() {
  const { state, update } = useReview();
  const catering = state.verpflegung ?? EMPTY;

  function patch(fields: Partial<CateringReport>) {
    update({ verpflegung: { ...catering, ...fields } });
  }

  return (
    <StepCard title="Bericht über Verpflegung">
      <RatingScale
        label="Wie hat es dir geschmeckt?"
        allowNA
        value={catering.tasteRating}
        onChange={(value) => patch({ tasteRating: value })}
      />
      <RatingScale
        label="Wie abwechslungsreich war die Auswahl beim Essen?"
        allowNA
        value={catering.varietyRating}
        onChange={(value) => patch({ varietyRating: value })}
      />
      <TextAreaField
        label="Was müssen Gäste über die Gastronomie wissen?"
        allowNA
        value={catering.notesText ?? ""}
        onChange={(value) => patch({ notesText: value === "" ? null : value })}
      />
    </StepCard>
  );
}
