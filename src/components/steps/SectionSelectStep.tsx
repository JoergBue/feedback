"use client";

import { useReview } from "@/lib/reviewState";
import { REPORT_SECTIONS } from "@/lib/options";
import { MultiChoiceGroup } from "../fields/MultiChoiceGroup";
import { StepCard } from "../wizard/StepCard";

export function SectionSelectStep() {
  const { state, update } = useReview();

  return (
    <StepCard
      title="Deine Berichte"
      description="Zu welchen Bereichen möchtest du ausführlicher berichten? Du kannst mehrere Themen auswählen - oder auch keins."
    >
      <MultiChoiceGroup
        label="Bereiche für deinen Bericht"
        columns={2}
        options={REPORT_SECTIONS.map((s) => ({
          value: s.id,
          label: s.label,
          description: s.description,
        }))}
        values={state.reportSections}
        onChange={(values) => update({ reportSections: values })}
      />
    </StepCard>
  );
}
