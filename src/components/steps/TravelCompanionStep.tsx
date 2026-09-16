"use client";

import { useReview } from "@/lib/reviewState";
import { TRAVEL_COMPANION_OPTIONS } from "@/lib/options";
import { ChoiceGroup } from "../fields/ChoiceGroup";
import { StepCard } from "../wizard/StepCard";

export function TravelCompanionStep() {
  const { state, update } = useReview();

  return (
    <StepCard title="Reisebegleitung">
      <ChoiceGroup
        label="Mit wem bist du verreist?"
        options={TRAVEL_COMPANION_OPTIONS}
        value={state.travelCompanion}
        onChange={(value) => update({ travelCompanion: value })}
      />
    </StepCard>
  );
}
