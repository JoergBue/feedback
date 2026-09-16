"use client";

import { useReview } from "@/lib/reviewState";
import type { AccessibilityReport } from "@/lib/types";
import { RatingScale } from "../fields/RatingScale";
import { YesNoField } from "../fields/YesNoField";
import { TextAreaField } from "../fields/TextAreaField";
import { StepCard } from "../wizard/StepCard";

const EMPTY: AccessibilityReport = {
  publicTransport: null,
  parking: null,
  locationRating: null,
  accessText: null,
};

export function AccessibilityStep() {
  const { state, update } = useReview();
  const accessibility = state.verkehrsanbindung ?? EMPTY;

  function patch(fields: Partial<AccessibilityReport>) {
    update({ verkehrsanbindung: { ...accessibility, ...fields } });
  }

  return (
    <StepCard title="Bericht über Verkehrsanbindung">
      <YesNoField
        label="Ist das Hotel mit öffentlichen Verkehrsmitteln gut erreichbar?"
        value={accessibility.publicTransport}
        onChange={(value) => patch({ publicTransport: value })}
      />
      <YesNoField
        label="Gab es Parkplätze in der Nähe?"
        value={accessibility.parking}
        onChange={(value) => patch({ parking: value })}
      />
      <RatingScale
        label="Wie ist die Lage des Hotels für Sehenswürdigkeiten und Aktivitäten?"
        allowNA
        value={accessibility.locationRating}
        onChange={(value) => patch({ locationRating: value })}
      />
      <TextAreaField
        label="Wie gut ist das Hotel zu erreichen?"
        allowNA
        value={accessibility.accessText ?? ""}
        onChange={(value) => patch({ accessText: value === "" ? null : value })}
      />
    </StepCard>
  );
}
