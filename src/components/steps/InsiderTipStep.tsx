"use client";

import { useReview } from "@/lib/reviewState";
import { TextAreaField } from "../fields/TextAreaField";
import { StepCard } from "../wizard/StepCard";

export function InsiderTipStep() {
  const { state, update } = useReview();

  return (
    <StepCard title="Geheimtipp">
      <TextAreaField
        label="Was ist dein Geheimtipp vor Ort?"
        allowNA
        value={state.insiderTip}
        onChange={(value) => update({ insiderTip: value })}
        placeholder="Ein Restaurant, ein Ausblick, eine Aktivität …"
        rows={3}
      />
    </StepCard>
  );
}
