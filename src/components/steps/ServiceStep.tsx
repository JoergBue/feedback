"use client";

import { useReview } from "@/lib/reviewState";
import type { ServiceReport } from "@/lib/types";
import { SERVICE_AREA_OPTIONS } from "@/lib/options";
import { MultiChoiceGroup } from "../fields/MultiChoiceGroup";
import { TextAreaField } from "../fields/TextAreaField";
import { StepCard } from "../wizard/StepCard";

const EMPTY: ServiceReport = {
  goodAreas: [],
  staffInteractionText: null,
};

export function ServiceStep() {
  const { state, update } = useReview();
  const service = state.service ?? EMPTY;

  function patch(fields: Partial<ServiceReport>) {
    update({ service: { ...service, ...fields } });
  }

  return (
    <StepCard title="Bericht über Service">
      <MultiChoiceGroup
        label="Wo war der Service besonders gut? (Mehrfachauswahl möglich)"
        columns={2}
        options={SERVICE_AREA_OPTIONS}
        values={service.goodAreas}
        onChange={(values) => patch({ goodAreas: values })}
      />
      <TextAreaField
        label="Wie war der Umgang des Personals mit den Gästen?"
        allowNA
        value={service.staffInteractionText ?? ""}
        onChange={(value) => patch({ staffInteractionText: value === "" ? null : value })}
      />
    </StepCard>
  );
}
