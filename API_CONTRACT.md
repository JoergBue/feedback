# API-Verträge: Hotelbewertung

Diese Datei beschreibt die zwei Schnittstellen, über die die App mit eurem
System spricht. Die App selbst ruft dafür nicht direkt das MidOffice/CGI aus
dem Browser auf, sondern geht über zwei eigene, serverseitige Next.js-Routen
(`/api/hotel/[hashKey]` und `/api/review`), die wiederum an die unten
beschriebenen externen Schnittstellen weiterreichen (siehe `.env.example`).
Das vermeidet CORS-Probleme und verhindert, dass eure internen URLs/Tokens im
Browser sichtbar werden.

Beide Funktionen laufen bereits gegen das echte BOSYS UI.Office-Gateway:
HashKey-Auflösung (Abschnitt 1, Function `"Feedback"`) und Bewertungs-Abgabe
(Abschnitt 2, Function `"PutFeedback"`), inklusive dem gemeinsamen
Fehlerformat weiter unten.

---

## 1. HashKey auflösen (BOSYS UI.Office-Gateway → App)

**Aufruf:** `POST {BOSYS_GATEWAY_URL}` mit `Content-Type: application/json`
(aktuell: `https://testpush.bosys.eu/cgi-bin/uiofficegate.cgi`)

Request-Body:

```json
{
  "bns_request": {
    "Header": {
      "Version": "1.0",
      "Source": "feedback",
      "BOSYSTerminal": "{BOSYS_TERMINAL}",
      "Token": "{BOSYS_TOKEN}",
      "Function": "Feedback"
    },
    "Feedback": {
      "hashKey": "12345"
    }
  }
}
```

Erwartete Antwort bei Erfolg (HTTP 200):

```json
{
  "bns_response": {
    "Feedback": {
      "hotel": {
        "imageUrl": "https://i.giatamedia.com/s.php?uid=204387&source=xml&size=320&cid=3959&iid=134567179",
        "name": "Guya Wave Hotel",
        "region": "Cala Ratjada · Balearen · Spanien"
      },
      "travelPeriod": "12.10.2023 bis 19.10.2023<br>ab Hamburg · D  F",
      "brandColor": "#1C448C",
      "office": {
        "name": "Reisebüro Testermann",
        "adress": "Normannenweg 28 20537 Hamburg"
      }
    },
    "Header": {
      "TimeStamp": "20260915160524",
      "Version": "1.0"
    }
  }
}
```

| Feld                              | Typ    | Beschreibung                                   |
| ---------------------------------- | ------ | ----------------------------------------------- |
| `bns_response.Feedback.hotel.name`     | string | Name des Hotels - **einziges wirklich zwingendes Feld neben travelPeriod** |
| `bns_response.Feedback.hotel.imageUrl` | string, kann leer sein | Bild-URL des Hotels. Kommt bei manchen Buchungen als leerer String zurück (bestätigt am Beispiel-HashKey mit Hotel "Valentin Reina Paguera") - die App zeigt dann einen Platzhalter statt eines kaputten Bilds, statt den HashKey als "nicht gefunden" zu werten |
| `bns_response.Feedback.hotel.region`   | string, kann leer sein | Regionstext (Ort, Region, Land). Kann ebenfalls leer sein - die App blendet die Regionszeile dann einfach aus |
| `bns_response.Feedback.travelPeriod`   | string | Reisezeitraum als Anzeigetext - **kann HTML enthalten** (z. B. `<br>`) und wird von der App entsprechend als Markup gerendert, nicht als reiner Text |
| `bns_response.Feedback.brandColor`     | string, optional | Hex-Farbe des Reisebüros (z. B. `"#1C448C"`), aus der die App ein komplettes Farbschema ableitet - siehe unten. Fehlt das Feld oder ist der Wert kein gültiger Hex-Code, verwendet die App eine Standardfarbe |
| `bns_response.Feedback.office.name`    | string, optional | Name des vermittelnden Reisebüros - siehe unten |
| `bns_response.Feedback.office.adress`  | string, optional | Adresse des vermittelnden Reisebüros - **Feldname bewusst so übernommen wie vom Gateway geliefert** (`adress`, nicht `address`); die App normalisiert das intern auf `address` |
| `bns_response.Header.TimeStamp`        | string | Zeitstempel der Antwort (aktuell ungenutzt) |

### Dynamisches Farbschema aus `brandColor`

Aus der einen Hex-Farbe leitet die App eine 10-stufige Farbskala ab (wie
eine Tailwind-Palette 50–900): die Eingabefarbe selbst landet exakt auf
Stufe 600, hellere Stufen werden mit Weiß gemischt, dunklere mit Schwarz
(`src/lib/colorScale.ts`, `buildBrandScale`). Für `"#1C448C"` ergibt das
z. B. `50: #f4f6f9` … `600: #1c448c` … `900: #0f254d`. Die Skala wird beim
Laden der Reisedaten als CSS-Custom-Properties (`--brand-50` … `--brand-900`)
auf die Bewertungsseite angewendet, sodass Buttons, Links, ausgewählte
Kreise/Chips usw. automatisch im Farbton des jeweiligen Reisebüros
erscheinen. Ohne `brandColor` (oder bei ungültigem Wert) greift eine feste
Standardfarbe.

Die App normalisiert das intern weiterhin auf ihr eigenes, schlankes Format
(`{ status: "ok", hashKey, hotel: { name, imageUrl, region }, travelPeriod }`),
das der Browser tatsächlich abruft (`GET /api/hotel/{hashKey}` der App
selbst) - daran ändert sich durch das Gateway nichts.

Fehlerfall: Antwortet das Gateway mit einem Nicht-200-Status und einem
`Fail`-Objekt (siehe Abschnitt "Fehlerformat" unten), zeigt die App die
Gateway-Meldung an. Antwortet das Gateway mit 200, aber ohne `hotel.name`
oder ohne `travelPeriod` in `bns_response.Feedback`, wertet die App das als
"HashKey nicht gefunden" - das sind die beiden einzigen Felder, die die App
zwingend braucht. `hotel.imageUrl` und `hotel.region` dürfen leer sein,
ohne dass der HashKey deswegen als "nicht gefunden" behandelt wird (Stand
28.09.2026, nach einem konkreten Fall mit leerem Bild/leerer Region bei
sonst gültigen Daten).

**Sonderfall `TEST`:** Wird `TEST` als HashKey übergeben, beantwortet die
App-eigene Route (`/api/hotel/TEST`) die Anfrage **ohne** das Gateway
anzusprechen und liefert immer feste Dummy-Werte (Hotel zur Sonne, Fiss). So
lässt sich die App jederzeit end-to-end testen, unabhängig vom Gateway.

### Reisebüro-Angaben aus `office`

Liefert die HashKey-Antwort ein `office`-Objekt mit sowohl `name` als auch
`adress`, zeigt die App beides an:

- als **schmale Kopfzeile über dem gesamten Wizard** (`AgencyHeader.tsx`) -
  auf jeder Seite sichtbar (Intro, alle Steps, Zusammenfassung, Danke-Seite).
  Auf kleinen Bildschirmen (Smartphone) wird dort nur der Reisebüro-Name
  gezeigt, die Adresse ausgeblendet, damit die Kopfzeile nicht unnötig viel
  Platz beansprucht.
- **ausführlich (Name + Adresse zusammen, unabhängig von der
  Bildschirmgröße)** zusätzlich auf der ersten Seite (Intro) und der letzten
  Seite (Danke-Seite) (`AgencyInfo.tsx`).

Fehlt `office`, oder ist nur eines der beiden Felder (`name`/`adress`)
befüllt, zeigt die App nichts an - kein Platzhalter, keine leere Kopfzeile.
Der Test-HashKey `TEST` demonstriert das mit einem Beispiel-Reisebüro.

---

## 2. Bewertung abschicken (App → BOSYS UI.Office-Gateway)

**Aufruf:** `POST {BOSYS_GATEWAY_URL}` mit `Content-Type: application/json`
(dasselbe Gateway wie in Abschnitt 1, andere `Function`)

Request-Body - die Bewertung selbst steckt 1:1 im `PutFeedback`-Objekt (mit
allen möglichen Feldern befüllt; nicht ausgewählte Themenbereiche sind
`null`, siehe unten):

```json
{
  "bns_request": {
    "Header": {
      "Version": "1.0",
      "Source": "feedback",
      "BOSYSTerminal": "{BOSYS_TERMINAL}",
      "Token": "{BOSYS_TOKEN}",
      "Function": "PutFeedback"
    },
    "PutFeedback": {
      "hashKey": "TEST",
      "submittedAt": "2026-09-15T14:32:10.123Z",
      "title": "Traumhafter Familienurlaub in Fiss",
      "recommend": true,
      "overallRating": "sehr_gut",
      "description": "Freitext, mindestens 100 Zeichen ...",
      "travelCompanion": "familie",
      "reportSections": ["zimmer", "verpflegung", "preisLeistung"],
      "zimmer": {
        "sizeRating": "gut",
        "cleanlinessRating": "sehr_gut",
        "sleepQualityRating": "eher_gut",
        "experienceText": "Das Zimmer war großzügig geschnitten."
      },
      "verpflegung": {
        "tasteRating": "gut",
        "varietyRating": "eher_gut",
        "notesText": null
      },
      "service": null,
      "aktivitaeten": null,
      "preisLeistung": {
        "ratioRating": "gut",
        "unexpectedCosts": "nein"
      },
      "verkehrsanbindung": null,
      "nachhaltigkeit": null,
      "compensation": "ermaessigung_gutschein",
      "insiderTip": "Die kleine Hütte oberhalb des Lifts hat den besten Kaiserschmarrn."
    }
  }
}
```

### Felder innerhalb von `PutFeedback`

| Feld               | Typ                       | Pflicht | Beschreibung |
| ------------------- | -------------------------- | ------- | ------------ |
| `hashKey`           | string                     | ja      | HashKey der Reise, aus dem Aufruf-Link |
| `submittedAt`       | string (ISO-8601)          | ja      | Zeitpunkt des Absendens |
| `title`             | string \| null             | nein    | Titel der Bewertung |
| `recommend`         | boolean                    | ja      | Empfehlung Ja/Nein |
| `overallRating`     | Rating                     | ja      | Allgemeine Bewertung (kein "keine Angabe") |
| `description`       | string                     | ja      | Freitext, mind. 100 Zeichen |
| `travelCompanion`   | TravelCompanion             | ja      | Mit wem verreist |
| `reportSections`    | ReportSectionId[]          | ja      | Welche Themenbereiche der Gast ausgewählt hat |
| `zimmer`            | RoomReport \| null          | nein    | nur befüllt, wenn `"zimmer"` in `reportSections` |
| `verpflegung`       | CateringReport \| null      | nein    | nur befüllt, wenn `"verpflegung"` in `reportSections` |
| `service`           | ServiceReport \| null       | nein    | nur befüllt, wenn `"service"` in `reportSections` |
| `aktivitaeten`      | ActivitiesReport \| null    | nein    | nur befüllt, wenn `"aktivitaeten"` in `reportSections` |
| `preisLeistung`     | PriceValueReport \| null    | nein    | nur befüllt, wenn `"preisLeistung"` in `reportSections` |
| `verkehrsanbindung` | AccessibilityReport \| null | nein    | nur befüllt, wenn `"verkehrsanbindung"` in `reportSections` |
| `nachhaltigkeit`    | SustainabilityReport \| null| nein    | nur befüllt, wenn `"nachhaltigkeit"` in `reportSections` |
| `compensation`      | Compensation                | ja      | Gegenleistung vom Hotelier erhalten |
| `insiderTip`        | string \| null              | nein    | Geheimtipp |

Wichtig: Die sieben Berichts-Felder (`zimmer` … `nachhaltigkeit`) sind
**immer im JSON vorhanden**, aber nur dann ein Objekt statt `null`, wenn der
Gast den jeweiligen Bereich im Auswahl-Step angehakt hat. Das ergibt ein
festes, vorhersagbares Schema für das CGI (keine variablen Keys).

### Verschachtelte Objekte

```ts
RoomReport = {
  sizeRating: Rating | null;          // Zimmergröße
  cleanlinessRating: Rating | null;   // Sauberkeit Zimmer & Bad
  sleepQualityRating: Rating | null;  // Schlafqualität
  experienceText: string | null;      // Freitext
}

CateringReport = {
  tasteRating: Rating | null;         // Geschmack
  varietyRating: Rating | null;       // Abwechslung
  notesText: string | null;           // Freitext
}

ServiceReport = {
  goodAreas: ServiceArea[];           // Mehrfachauswahl, siehe unten
  staffInteractionText: string | null;
}

ActivitiesReport = {
  activities: Activity[];             // Mehrfachauswahl, siehe unten
}

PriceValueReport = {
  ratioRating: Rating | null;         // Preis-Leistungs-Verhältnis
  unexpectedCosts: "ja" | "nein" | null;
}

AccessibilityReport = {
  publicTransport: "ja" | "nein" | null;
  parking: "ja" | "nein" | null;
  locationRating: Rating | null;      // Lage für Sehenswürdigkeiten/Aktivitäten
  accessText: string | null;
}

SustainabilityReport = {
  ecoFriendlinessRating: Rating | null;
  localEconomySupportRating: Rating | null;
  localCultureRating: Rating | null;
  measuresText: string | null;
}
```

### Enum-Werte

**`Rating`** (6-stufige Skala, grafisch als 6 Kreise dargestellt):
`"sehr_schlecht" | "schlecht" | "eher_schlecht" | "eher_gut" | "gut" | "sehr_gut"`
— bei den Unterfragen mit "keine Angabe" ist der Wert zusätzlich `null`
möglich (bei `overallRating` nicht, dort ist die Angabe Pflicht).

**`TravelCompanion`**: `"alleine" | "paar" | "familie" | "gruppe"`

**`ReportSectionId`**:
`"zimmer" | "verpflegung" | "service" | "aktivitaeten" | "preisLeistung" | "verkehrsanbindung" | "nachhaltigkeit"`

**`ServiceArea`** (Mehrfachauswahl für "Wo war der Service besonders gut?"):
`"zimmer" | "rezeption" | "bar_disco_restaurant" | "gaestebetreuung" | "animation" | "woanders" | "nirgends" | "keine_angabe"`

**`Activity`** (Mehrfachauswahl für "Was hast du unternommen?"):
`"animation" | "sport" | "kultur_erlebnis" | "nightlife" | "geschaeftsreise" | "sonstiges" | "nichts"`

**`Compensation`**:
`"keine" | "ermaessigung_gutschein" | "kostenloser_checkout" | "kostenloses_getraenk" | "dankeschoen_geschenk" | "sonstiges" | "keine_angabe"`

### Erwartete Antwort vom Gateway

- **2xx** → Bewertung wurde erfolgreich angenommen, App zeigt die
  Danke-Seite und löscht den lokal zwischengespeicherten Entwurf.
- **alles andere (siehe Fehlerformat unten)** → App zeigt die vom Gateway
  gelieferte Fehlermeldung an, der Entwurf bleibt im Browser erhalten, der
  Gast kann es erneut versuchen.

---

## Fehlerformat (beide Funktionen)

Im Fehlerfall antwortet das Gateway mit **HTTP 400** und einem `Fail`-Objekt
anstelle der eigentlichen Funktionsantwort - egal ob bei `Feedback` (HashKey
auflösen) oder `PutFeedback` (Bewertung abspeichern):

```json
{
  "bns_response": {
    "Fail": {
      "Error": "#99005Absender falsch!",
      "ErrorNo": 9999
    },
    "Header": {
      "Function": "Header",
      "Status": "FAIL",
      "TimeStamp": "15.09.2026 16:47",
      "Version": "1.0"
    }
  }
}
```

| Feld                       | Typ    | Beschreibung |
| --------------------------- | ------ | ------------ |
| `bns_response.Fail.Error`   | string | Klartext-Fehlermeldung (enthält bei euch offenbar einen Code-Präfix wie `#99005`) |
| `bns_response.Fail.ErrorNo` | number | Numerischer Fehlercode |
| `bns_response.Header.Status`| string | `"FAIL"` im Fehlerfall |

Beide App-Routen werten das bereits aus (`src/lib/bosys.ts`,
`parseBosysFail`) und reichen `Fail.Error` 1:1 als `message` an den Browser
durch:

- `/api/hotel/[hashKey]`: liefert bei einer Fail-Antwort
  `errorCode: "GATEWAY_ERROR"` mit der Gateway-Meldung als `message`
  (Wizard zeigt sie in der Fehleransicht statt eines generischen
  "nicht gefunden").
- `/api/review`: gibt `{ message: <Fail.Error> }` mit demselben HTTP-Status
  zurück, den das Gateway geliefert hat; die App zeigt das im Wizard als
  Fehlermeldung beim Absenden an.

Kann `Fail` aus der Antwort nicht gelesen werden (z. B. kein JSON-Body),
fällt die App auf eine generische Meldung zurück ("nicht gefunden" bzw.
"Status &lt;code&gt;").

---

## Offene Punkte

Aktuell keine bekannten offenen Punkte - beide Funktionen (`Feedback`,
`PutFeedback`) inklusive Fehlerformat, dynamischem Farbschema
(`brandColor`) und Reisebüro-Kopfzeile (`office`) sind implementiert.
