"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createEmptyReviewState, type ReviewState } from "./types";

const STORAGE_PREFIX = "bewertung:";

function storageKey(hashKey: string) {
  return `${STORAGE_PREFIX}${hashKey}`;
}

function loadFromStorage(hashKey: string): ReviewState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(hashKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReviewState;
    // Sicherheitsnetz: falls hashKey nicht passt, ignorieren.
    if (parsed.hashKey !== hashKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

interface ReviewContextValue {
  state: ReviewState;
  update: (patch: Partial<ReviewState>) => void;
  reset: () => void;
}

const ReviewContext = createContext<ReviewContextValue | null>(null);

export function ReviewProvider({
  hashKey,
  children,
}: {
  hashKey: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<ReviewState>(() =>
    loadFromStorage(hashKey) ?? createEmptyReviewState(hashKey)
  );
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      window.localStorage.setItem(storageKey(hashKey), JSON.stringify(state));
    } catch {
      // localStorage nicht verfügbar (z.B. privater Modus) - Fortschritt geht
      // dann beim Neuladen verloren, das Formular funktioniert aber weiter.
    }
  }, [state, hashKey]);

  const update = useCallback((patch: Partial<ReviewState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey(hashKey));
    } catch {
      // ignorieren
    }
    setState(createEmptyReviewState(hashKey));
  }, [hashKey]);

  const value = useMemo(() => ({ state, update, reset }), [state, update, reset]);

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview() {
  const ctx = useContext(ReviewContext);
  if (!ctx) {
    throw new Error("useReview muss innerhalb von <ReviewProvider> verwendet werden");
  }
  return ctx;
}
