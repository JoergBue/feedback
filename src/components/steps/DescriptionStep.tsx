"use client";

import { useReview } from "@/lib/reviewState";
import { TextAreaField } from "../fields/TextAreaField";
import { MIN_DESCRIPTION_LENGTH } from "@/lib/steps";
import { StepCard } from "../wizard/StepCard";

export function DescriptionStep() {
  const { state, update } = useReview();

  return (
    <StepCard
      title="Beschreibe das Hotel"
      description={`Mindestens ${MIN_DESCRIPTION_LENGTH} Zeichen.`}
    >
      <TextAreaField
        label="Beschreibe das Hotel"
        value={state.description}
        onChange={(value) => update({ description: value })}
        minLength={MIN_DESCRIPTION_LENGTH}
        rows={6}
        placeholder="Was hat dir gefallen, was nicht?"
      />
    </StepCard>
  );
}
