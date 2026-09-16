"use client";

import { useReview } from "@/lib/reviewState";
import { TextAreaField } from "../fields/TextAreaField";
import { StepCard } from "../wizard/StepCard";

export function TitleStep() {
  const { state, update } = useReview();

  return (
    <StepCard
      title="Titel deiner Bewertung"
      description="Um deine Bewertung fertigzustellen, gib ihr bitte einen aussagekräftigen Titel."
    >
      <TextAreaField
        label="Titel"
        allowNA
        value={state.title}
        onChange={(value) => update({ title: value })}
        placeholder="z. B. „Traumhafter Familienurlaub in Fiss“"
        rows={2}
      />
    </StepCard>
  );
}
