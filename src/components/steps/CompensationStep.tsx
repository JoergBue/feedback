"use client";

import { useReview } from "@/lib/reviewState";
import { COMPENSATION_OPTIONS } from "@/lib/options";
import { ChoiceGroup } from "../fields/ChoiceGroup";
import { StepCard } from "../wizard/StepCard";

export function CompensationStep() {
  const { state, update } = useReview();

  return (
    <StepCard title="Gegenleistung">
      <ChoiceGroup
        label="Hast du eine Gegenleistung vom Hotelier für deine Bewertung erhalten?"
        columns={2}
        options={COMPENSATION_OPTIONS}
        value={state.compensation}
        onChange={(value) => update({ compensation: value })}
      />
    </StepCard>
  );
}
