"use client";

import { useMemo, useState } from "react";
import { useReview } from "@/lib/reviewState";
import { getActiveSteps, isStepValid, type StepId } from "@/lib/steps";
import { buildSubmission } from "@/lib/submission";
import type { HotelInfo, OfficeInfo } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { IntroStep } from "../steps/IntroStep";
import { RecommendStep } from "../steps/RecommendStep";
import { OverallRatingStep } from "../steps/OverallRatingStep";
import { DescriptionStep } from "../steps/DescriptionStep";
import { TravelCompanionStep } from "../steps/TravelCompanionStep";
import { SectionSelectStep } from "../steps/SectionSelectStep";
import { RoomStep } from "../steps/RoomStep";
import { CateringStep } from "../steps/CateringStep";
import { ServiceStep } from "../steps/ServiceStep";
import { ActivitiesStep } from "../steps/ActivitiesStep";
import { PriceValueStep } from "../steps/PriceValueStep";
import { AccessibilityStep } from "../steps/AccessibilityStep";
import { SustainabilityStep } from "../steps/SustainabilityStep";
import { CompensationStep } from "../steps/CompensationStep";
import { InsiderTipStep } from "../steps/InsiderTipStep";
import { TitleStep } from "../steps/TitleStep";
import { SummaryStep } from "../steps/SummaryStep";
import { ThankYouStep } from "../steps/ThankYouStep";

function StepContent({
  step,
  hotel,
  travelPeriod,
  office,
  onEdit,
}: {
  step: StepId;
  hotel: HotelInfo;
  travelPeriod: string;
  office?: OfficeInfo;
  onEdit: (step: StepId) => void;
}) {
  switch (step) {
    case "intro":
      return <IntroStep hotel={hotel} travelPeriod={travelPeriod} office={office} />;
    case "recommend":
      return <RecommendStep />;
    case "overallRating":
      return <OverallRatingStep />;
    case "description":
      return <DescriptionStep />;
    case "travelCompanion":
      return <TravelCompanionStep />;
    case "sectionSelect":
      return <SectionSelectStep />;
    case "zimmer":
      return <RoomStep />;
    case "verpflegung":
      return <CateringStep />;
    case "service":
      return <ServiceStep />;
    case "aktivitaeten":
      return <ActivitiesStep />;
    case "preisLeistung":
      return <PriceValueStep />;
    case "verkehrsanbindung":
      return <AccessibilityStep />;
    case "nachhaltigkeit":
      return <SustainabilityStep />;
    case "compensation":
      return <CompensationStep />;
    case "insiderTip":
      return <InsiderTipStep />;
    case "title":
      return <TitleStep />;
    case "summary":
      return <SummaryStep onEdit={onEdit} />;
    default:
      return null;
  }
}

export function WizardShell({
  hotel,
  travelPeriod,
  office,
}: {
  hotel: HotelInfo;
  travelPeriod: string;
  office?: OfficeInfo;
}) {
  const { state, reset } = useReview();
  const [currentStep, setCurrentStep] = useState<StepId>("intro");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const activeSteps = useMemo(() => getActiveSteps(state), [state]);
  const currentIndex = Math.max(0, activeSteps.indexOf(currentStep));
  const isFirst = currentIndex === 0;
  const isLast = activeSteps[currentIndex] === "summary";
  const canProceed = isStepValid(activeSteps[currentIndex], state);

  function goTo(step: StepId) {
    setCurrentStep(step);
  }

  function goBack() {
    if (currentIndex > 0) setCurrentStep(activeSteps[currentIndex - 1]);
  }

  function goNext() {
    if (currentIndex < activeSteps.length - 1) {
      setCurrentStep(activeSteps[currentIndex + 1]);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const submission = buildSubmission(state);
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `Fehler beim Senden (Status ${res.status})`);
      }
      reset();
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unbekannter Fehler beim Senden.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return <ThankYouStep hotelName={hotel.name} office={office} />;
  }

  return (
    <div className="space-y-6">
      <ProgressBar current={currentIndex} total={activeSteps.length} />

      <StepContent
        step={activeSteps[currentIndex]}
        hotel={hotel}
        travelPeriod={travelPeriod}
        office={office}
        onEdit={goTo}
      />

      {submitError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</p>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirst}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-0"
        >
          Zurück
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)] disabled:opacity-60"
          >
            {submitting ? "Wird gesendet …" : "Bewertung absenden"}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed}
            className="rounded-lg bg-[var(--brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Weiter
          </button>
        )}
      </div>
    </div>
  );
}
