# Hotelbewertung

Eine WebApp zum Erfassen von Bewertungen für Pauschalreisen und
Hotelaufenthalte, als mehrstufiger Wizard. Aufruf immer über einen HashKey
zu einer bestehenden, im MidOffice gebuchten Reise: `/bewertung/{hashKey}`.

Zum Testen ohne echten MidOffice-Anschluss: **`/bewertung/TEST`**.

## Erste Schritte

Im Projektordner ausführen:

```
npm install
npm run dev
```

Danach ist die App unter http://localhost:3000/bewertung/TEST erreichbar.

## Tech-Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- Kein Backend/DB: der Wizard-Fortschritt liegt nur im Browser
  (`localStorage`, pro HashKey), die fertige Bewertung wird per POST direkt
  ans CGI weitergereicht (siehe `API_CONTRACT.md`)

Damit gelten die gleichen Rahmenbedingungen (Next.js/TypeScript/Tailwind) wie
bei der MyFamily-App, aber als eigenständiges, schlankeres Projekt ohne
Prisma/Supabase/Auth - die werden hier nicht gebraucht.

## Konfiguration

Eine `.env.local` mit den echten Zugangsdaten sollte lokal angelegt werden
(nicht in Git, siehe `.gitignore`) - `.env.example` zeigt das Format ohne
Geheimnisse:

- `BOSYS_GATEWAY_URL`, `BOSYS_TERMINAL`, `BOSYS_TOKEN` - ein einziges BOSYS
  UI.Office-Gateway für beide Zwecke: HashKey auflösen (Function
  `"Feedback"`) und fertige Bewertung abspeichern (Function `"PutFeedback"`)

Fehlt eine der drei Variablen, liefert nur der HashKey `TEST` Dummy-Hoteldaten
(jeder andere HashKey einen "nicht konfiguriert"-Fehler), und abgeschickte
Bewertungen werden nur in die Server-Konsole geloggt statt wirklich
verschickt - der Wizard lässt sich trotzdem komplett durchtesten.

Die genauen JSON-Strukturen für beide Schnittstellen stehen in
[`API_CONTRACT.md`](./API_CONTRACT.md).

## Projektstruktur

```
src/
  app/
    page.tsx                     Startseite (Hinweis + Testlink)
    bewertung/[hashKey]/         Die eigentliche Wizard-Seite
    api/hotel/[hashKey]/         GET: HashKey -> Hoteldaten (Mock/MidOffice)
    api/review/                  POST: fertige Bewertung -> CGI
  components/
    fields/                      Wiederverwendbare Eingabe-Elemente
                                  (RatingScale = 6-Kreise-Widget, YesNoField,
                                  ChoiceGroup, MultiChoiceGroup, TextAreaField)
    steps/                       Ein Step pro Frage/Themenbereich
    wizard/                      WizardShell (Navigation, Fortschritt,
                                  Absenden), ProgressBar, StepCard,
                                  AgencyHeader (Reisebüro-Kopfzeile auf jeder
                                  Seite), AgencyInfo (Reisebüro ausführlich
                                  auf erster/letzter Seite)
  lib/
    types.ts                     Alle Datentypen (siehe API_CONTRACT.md)
    options.ts                   Auswahllisten + Labels an einer Stelle
    steps.ts                     Reihenfolge der Steps, Validierung je Step
    reviewState.tsx              React-Context + localStorage-Persistenz
    submission.ts                Baut das finale POST-JSON aus dem State
    mockHotels.ts                Dummy-Daten für HashKey "TEST"
    colorScale.ts                Leitet aus brandColor die 10-stufige Farbskala ab
    bosys.ts                     Gemeinsames Fehlerformat-Parsing fürs BOSYS-Gateway
```

## Bewertungsskala (6-Kreise-Widget)

Die Skala "Sehr schlecht … Sehr gut" wird als sechs leere Kreise dargestellt.
Ein Klick auf den n-ten Kreis füllt die Kreise 1…n (Komponente
`src/components/fields/RatingScale.tsx`). Wo laut Vorgabe zusätzlich "keine
Angabe" möglich ist, gibt es daneben einen entsprechenden Schalter, der die
Auswahl auf "keine Angabe" (= `null`) zurücksetzt.

## Farbschema pro Reisebüro

Liefert die HashKey-Antwort ein `brandColor` (Hex-Wert, z. B. `"#1C448C"`),
leitet die App daraus zur Laufzeit eine komplette Farbskala ab und setzt sie
als CSS-Custom-Properties auf die Bewertungsseite - Buttons, Links,
ausgewählte Kreise/Chips passen sich dann automatisch an die Farbe des
jeweiligen Reisebüros an. Details siehe `API_CONTRACT.md`, Abschnitt 1.

## Reisebüro-Angaben (Kopfzeile)

Liefert die HashKey-Antwort ein `office`-Objekt (Name + Adresse des
vermittelnden Reisebüros), zeigt die App das als schmale Kopfzeile über dem
gesamten Wizard an - sichtbar auf jeder Seite. Auf dem Smartphone wird dort
nur der Name gezeigt (die Adresse ausgeblendet), damit die Kopfzeile nicht zu
viel Platz einnimmt; auf der ersten und letzten Seite erscheinen Name und
Adresse zusätzlich ausführlich, unabhängig von der Bildschirmgröße. Details
siehe `API_CONTRACT.md`, Abschnitt 1.

## Ablauf des Wizards

1. Intro (Hoteldaten aus dem HashKey-Lookup)
2. Empfehlung
3. Allgemeine Bewertung
4. Beschreibung (min. 100 Zeichen)
5. Reisebegleitung
6. Auswahl der Themenbereiche für den Bericht
7. Je ein Step pro ausgewähltem Bereich (Zimmer, Verpflegung, Service,
   Aktivitäten, Preis-Leistung, Verkehrsanbindung, Nachhaltigkeit)
8. Gegenleistung
9. Geheimtipp
10. Titel
11. Zusammenfassung (mit "Bearbeiten"-Links zurück zu jedem Step)
12. Absenden → POST ans CGI → Danke-Seite

## Hinweis zur Entwicklungsumgebung

Dieses Projekt wurde in einer Cloud-Sandbox ohne Zugriff auf npm-Registries
erstellt (Netzwerk-Policy der Organisation blockiert registry.npmjs.org
u. a.). Ein automatisierter `npm run build` konnte dort deshalb nicht
ausgeführt werden - bitte einmal lokal `npm install && npm run build` (oder
`npm run dev`) laufen lassen, um Tippfehler/TypeScript-Fehler zu finden, die
bei der manuellen Durchsicht übersehen wurden.
