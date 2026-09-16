"use client";

import { useReview } from "@/lib/reviewState";
import { YesNoField } from "../fields/YesNoField";
import { StepCard } from "../wizard/StepCard";

export function RecommendStep() {
  const { state, update } = useReview();

  return (
    <StepCard title="Empfehlung">
      <YesNoField
        label="Kannst du das Hotel empfehlen?"
        allowNA={false}
        value={state.recommend === null ? null : state.recommend ? "ja" : "nein"}
        onChange={(value) => update({ recommend: value === "ja" })}
      />
    </StepCard>
  );
}
