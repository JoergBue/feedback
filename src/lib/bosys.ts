/**
 * Gemeinsame Hilfsfunktion für das BOSYS UI.Office-Gateway: Im Fehlerfall
 * antwortet das Gateway mit HTTP 400 und einem "Fail"-Objekt statt der
 * eigentlichen Funktionsantwort, z. B.:
 *
 * {
 *   "bns_response": {
 *     "Fail": { "Error": "#99005Absender falsch!", "ErrorNo": 9999 },
 *     "Header": { "Function": "Header", "Status": "FAIL", ... }
 *   }
 * }
 */
export interface BosysFailPayload {
  bns_response?: {
    Fail?: {
      Error?: string;
      ErrorNo?: number;
    };
    Header?: {
      Function?: string;
      Status?: string;
      TimeStamp?: string;
      Version?: string;
    };
  };
}

/** Liest Error/ErrorNo aus einer BOSYS-Fail-Antwort, falls vorhanden. */
export function parseBosysFail(body: unknown): { error: string; errorNo: number } | null {
  if (!body || typeof body !== "object") return null;
  const fail = (body as BosysFailPayload).bns_response?.Fail;
  if (!fail || typeof fail.Error !== "string") return null;
  return {
    error: fail.Error,
    errorNo: typeof fail.ErrorNo === "number" ? fail.ErrorNo : 0,
  };
}
