"use client";

import { useReview } from "@/lib/reviewState";
import { RatingScale } from "../fields/RatingScale";
import { StepCard } from "../wizard/StepCard";

export function OverallRatingStep() {
  const { state, update } = useReview();

  return (
    <StepCard title="Allgemeine Bewertung">
      <RatingScale
        label="Wie bewertest du das Hotel allgemein?"
        allowNA={false}
        value={state.overallRating}
        onChange={(value) => update({ overallRating: value })}
      />
    </StepCard>
  );
}
