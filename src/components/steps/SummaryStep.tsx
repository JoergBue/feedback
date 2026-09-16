"use client";

import type { ReactNode } from "react";
import { useReview } from "@/lib/reviewState";
import {
  activityLabels,
  compensationLabel,
  ratingLabel,
  reportSectionLabel,
  serviceAreaLabels,
  travelCompanionLabel,
  yesNoLabel,
} from "@/lib/options";
import type { StepId } from "@/lib/steps";
import { StepCard } from "../wizard/StepCard";

function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium text-slate-900">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)]"
        >
          Bearbeiten
        </button>
      </div>
      <dl className="space-y-1 text-sm text-slate-700">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{value || "–"}</dd>
    </div>
  );
}

export function SummaryStep({ onEdit }: { onEdit: (step: StepId) => void }) {
  const { state } = useReview();

  return (
    <StepCard
      title="Zusammenfassung"
      description="Bitte prüfe deine Angaben, bevor du die Bewertung absendest."
    >
      <SummarySection title="Übersicht" onEdit={() => onEdit("recommend")}>
        <Row label="Empfehlung" value={state.recommend === null ? "–" : state.recommend ? "Ja" : "Nein"} />
        <Row label="Allgemeine Bewertung" value={ratingLabel(state.overallRating)} />
      </SummarySection>

      <SummarySection title="Beschreibung" onEdit={() => onEdit("description")}>
        <p className="whitespace-pre-wrap text-slate-700">{state.description || "–"}</p>
      </SummarySection>

      <SummarySection title="Reisebegleitung" onEdit={() => onEdit("travelCompanion")}>
        <Row label="Mit wem verreist" value={travelCompanionLabel(state.travelCompanion)} />
      </SummarySection>

      {state.reportSections.length > 0 && (
        <SummarySection title="Ausgewählte Berichte" onEdit={() => onEdit("sectionSelect")}>
          <Row
            label="Bereiche"
            value={state.reportSections.map(reportSectionLabel).join(", ")}
          />
        </SummarySection>
      )}

      {state.zimmer && (
        <SummarySection title="Zimmer" onEdit={() => onEdit("zimmer")}>
          <Row label="Zimmergröße" value={ratingLabel(state.zimmer.sizeRating)} />
          <Row label="Sauberkeit" value={ratingLabel(state.zimmer.cleanlinessRating)} />
          <Row label="Schlafqualität" value={ratingLabel(state.zimmer.sleepQualityRating)} />
          {state.zimmer.experienceText && (
            <p className="pt-1 text-slate-700">{state.zimmer.experienceText}</p>
          )}
        </SummarySection>
      )}

      {state.verpflegung && (
        <SummarySection title="Verpflegung" onEdit={() => onEdit("verpflegung")}>
          <Row label="Geschmack" value={ratingLabel(state.verpflegung.tasteRating)} />
          <Row label="Abwechslung" value={ratingLabel(state.verpflegung.varietyRating)} />
          {state.verpflegung.notesText && (
            <p className="pt-1 text-slate-700">{state.verpflegung.notesText}</p>
          )}
        </SummarySection>
      )}

      {state.service && (
        <SummarySection title="Service" onEdit={() => onEdit("service")}>
          <Row label="Besonders gut" value={serviceAreaLabels(state.service.goodAreas)} />
          {state.service.staffInteractionText && (
            <p className="pt-1 text-slate-700">{state.service.staffInteractionText}</p>
          )}
        </SummarySection>
      )}

      {state.aktivitaeten && (
        <SummarySection title="Aktivitäten" onEdit={() => onEdit("aktivitaeten")}>
          <Row label="Unternommen" value={activityLabels(state.aktivitaeten.activities)} />
        </SummarySection>
      )}

      {state.preisLeistung && (
        <SummarySection title="Preis-Leistung" onEdit={() => onEdit("preisLeistung")}>
          <Row label="Verhältnis" value={ratingLabel(state.preisLeistung.ratioRating)} />
          <Row label="Unerwartete Kosten" value={yesNoLabel(state.preisLeistung.unexpectedCosts)} />
        </SummarySection>
      )}

      {state.verkehrsanbindung && (
        <SummarySection title="Verkehrsanbindung" onEdit={() => onEdit("verkehrsanbindung")}>
          <Row label="Öffentliche Verkehrsmittel" value={yesNoLabel(state.verkehrsanbindung.publicTransport)} />
          <Row label="Parkplätze in der Nähe" value={yesNoLabel(state.verkehrsanbindung.parking)} />
          <Row label="Lage" value={ratingLabel(state.verkehrsanbindung.locationRating)} />
          {state.verkehrsanbindung.accessText && (
            <p className="pt-1 text-slate-700">{state.verkehrsanbindung.accessText}</p>
          )}
        </SummarySection>
      )}

      {state.nachhaltigkeit && (
        <SummarySection title="Nachhaltigkeit" onEdit={() => onEdit("nachhaltigkeit")}>
          <Row label="Umweltfreundlichkeit" value={ratingLabel(state.nachhaltigkeit.ecoFriendlinessRating)} />
          <Row label="Lokale Wirtschaft" value={ratingLabel(state.nachhaltigkeit.localEconomySupportRating)} />
          <Row label="Lokale Kultur" value={ratingLabel(state.nachhaltigkeit.localCultureRating)} />
          {state.nachhaltigkeit.measuresText && (
            <p className="pt-1 text-slate-700">{state.nachhaltigkeit.measuresText}</p>
          )}
        </SummarySection>
      )}

      <SummarySection title="Gegenleistung" onEdit={() => onEdit("compensation")}>
        <Row label="Erhalten" value={compensationLabel(state.compensation)} />
      </SummarySection>

      <SummarySection title="Geheimtipp" onEdit={() => onEdit("insiderTip")}>
        <p className="text-slate-700">{state.insiderTip || "–"}</p>
      </SummarySection>

      <SummarySection title="Titel" onEdit={() => onEdit("title")}>
        <p className="font-medium text-slate-900">{state.title || "–"}</p>
      </SummarySection>
    </StepCard>
  );
}
