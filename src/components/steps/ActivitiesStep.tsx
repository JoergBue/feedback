"use client";

import { useReview } from "@/lib/reviewState";
import type { ActivitiesReport } from "@/lib/types";
import { ACTIVITY_OPTIONS } from "@/lib/options";
import { MultiChoiceGroup } from "../fields/MultiChoiceGroup";
import { StepCard } from "../wizard/StepCard";

const EMPTY: ActivitiesReport = { activities: [] };

export function ActivitiesStep() {
  const { state, update } = useReview();
  const activities = state.aktivitaeten ?? EMPTY;

  return (
    <StepCard title="Bericht über Aktivitäten">
      <MultiChoiceGroup
        label="Was hast du während deines Aufenthalts gemacht? (Mehrfachauswahl möglich)"
        columns={2}
        options={ACTIVITY_OPTIONS}
        values={activities.activities}
        onChange={(values) => update({ aktivitaeten: { activities: values } })}
      />
    </StepCard>
  );
}
