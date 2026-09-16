"use client";

import { useReview } from "@/lib/reviewState";
import type { RoomReport } from "@/lib/types";
import { RatingScale } from "../fields/RatingScale";
import { TextAreaField } from "../fields/TextAreaField";
import { StepCard } from "../wizard/StepCard";

const EMPTY: RoomReport = {
  sizeRating: null,
  cleanlinessRating: null,
  sleepQualityRating: null,
  experienceText: null,
};

export function RoomStep() {
  const { state, update } = useReview();
  const room = state.zimmer ?? EMPTY;

  function patch(fields: Partial<RoomReport>) {
    update({ zimmer: { ...room, ...fields } });
  }

  return (
    <StepCard title="Bericht über Zimmer">
      <RatingScale
        label="Wie hast du die Zimmergröße empfunden?"
        allowNA
        value={room.sizeRating}
        onChange={(value) => patch({ sizeRating: value })}
      />
      <RatingScale
        label="Wie war die Sauberkeit von Zimmer und Bad?"
        allowNA
        value={room.cleanlinessRating}
        onChange={(value) => patch({ cleanlinessRating: value })}
      />
      <RatingScale
        label="Wie hast du geschlafen?"
        allowNA
        value={room.sleepQualityRating}
        onChange={(value) => patch({ sleepQualityRating: value })}
      />
      <TextAreaField
        label="Wie würdest du deine Erfahrung mit dem Zimmer beschreiben?"
        allowNA
        value={room.experienceText ?? ""}
        onChange={(value) => patch({ experienceText: value === "" ? null : value })}
      />
    </StepCard>
  );
}
