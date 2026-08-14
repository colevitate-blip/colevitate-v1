"use client";

import * as React from "react";
import {
  loadProgress,
  loadResults,
  persistProgress,
  persistResults,
} from "./storage";
import type {
  AssessmentId,
  PersonalityResults,
  ProgressMap,
  SurveyProgress,
} from "./types";

interface PersonalityContextValue {
  mounted: boolean;
  results: PersonalityResults;
  progress: ProgressMap;
  completedIds: AssessmentId[];
  saveResult: <K extends AssessmentId>(id: K, result: PersonalityResults[K]) => void;
  saveProgress: (id: AssessmentId, progress: SurveyProgress) => void;
  resetAssessment: (id: AssessmentId) => void;
  resetAll: () => void;
}

const PersonalityContext = React.createContext<PersonalityContextValue | null>(null);

export function PersonalityProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [results, setResults] = React.useState<PersonalityResults>({});
  const [progress, setProgress] = React.useState<ProgressMap>({});

  React.useEffect(() => {
    setResults(loadResults());
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  const saveResult = React.useCallback(
    <K extends AssessmentId>(id: K, result: PersonalityResults[K]) => {
      setResults((prev) => {
        const next = { ...prev, [id]: result };
        persistResults(next);
        return next;
      });
      setProgress((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        persistProgress(next);
        return next;
      });
    },
    []
  );

  const saveProgress = React.useCallback((id: AssessmentId, p: SurveyProgress) => {
    setProgress((prev) => {
      const next = { ...prev, [id]: p };
      persistProgress(next);
      return next;
    });
  }, []);

  const resetAssessment = React.useCallback((id: AssessmentId) => {
    setResults((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      persistResults(next);
      return next;
    });
    setProgress((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      persistProgress(next);
      return next;
    });
  }, []);

  const resetAll = React.useCallback(() => {
    setResults({});
    setProgress({});
    persistResults({});
    persistProgress({});
  }, []);

  const completedIds = React.useMemo(
    () => (Object.keys(results) as AssessmentId[]).filter((id) => results[id]),
    [results]
  );

  const value = React.useMemo(
    () => ({
      mounted,
      results,
      progress,
      completedIds,
      saveResult,
      saveProgress,
      resetAssessment,
      resetAll,
    }),
    [mounted, results, progress, completedIds, saveResult, saveProgress, resetAssessment, resetAll]
  );

  return (
    <PersonalityContext.Provider value={value}>{children}</PersonalityContext.Provider>
  );
}

export function usePersonality() {
  const ctx = React.useContext(PersonalityContext);
  if (!ctx) {
    throw new Error("usePersonality must be used within a PersonalityProvider");
  }
  return ctx;
}
