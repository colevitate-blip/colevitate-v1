"use client";

import * as React from "react";
import { useAuth } from "@/lib/supabase/AuthProvider";
import {
  appendFeedbackNote,
  loadGuidanceSeen,
  loadProgress,
  loadRemoteResults,
  loadResults,
  persistGuidanceSeen,
  persistProgress,
  persistRemoteResults,
  persistResults,
} from "./storage";
import type {
  AssessmentId,
  FeedbackNote,
  GuidanceSeenMap,
  PersonalityResults,
  ProgressMap,
  SurveyProgress,
} from "./types";

interface PersonalityContextValue {
  mounted: boolean;
  results: PersonalityResults;
  progress: ProgressMap;
  guidanceSeen: GuidanceSeenMap;
  completedIds: AssessmentId[];
  /** Non-null while a just-finished assessment is showing its "analyzing" transition. */
  analyzingId: AssessmentId | null;
  saveResult: <K extends AssessmentId>(id: K, result: PersonalityResults[K]) => void;
  /** Same as saveResult, but shows a brief "analyzing" screen first for a sense of computation. */
  finishAssessment: <K extends AssessmentId>(id: K, result: PersonalityResults[K]) => void;
  saveProgress: (id: AssessmentId, progress: SurveyProgress) => void;
  resetAssessment: (id: AssessmentId) => void;
  resetAll: () => void;
  markGuidanceSeen: (id: AssessmentId) => void;
  saveFeedbackNote: (note: Omit<FeedbackNote, "createdAt">) => void;
}

const PersonalityContext = React.createContext<PersonalityContextValue | null>(null);

export function PersonalityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [results, setResults] = React.useState<PersonalityResults>({});
  const [progress, setProgress] = React.useState<ProgressMap>({});
  const [guidanceSeen, setGuidanceSeen] = React.useState<GuidanceSeenMap>({});
  const [analyzingId, setAnalyzingId] = React.useState<AssessmentId | null>(null);
  const syncedUserId = React.useRef<string | null>(null);

  React.useEffect(() => {
    // One-time hydration from localStorage on mount (SSR-unsafe, so it can't run during render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(loadResults());
    setProgress(loadProgress());
    setGuidanceSeen(loadGuidanceSeen());
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !user || syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    loadRemoteResults(user.id).then((remote) => {
      if (remote && Object.keys(remote).length > 0) {
        // Existing account data wins over whatever was on this device.
        setResults(remote);
        persistResults(remote);
      } else {
        // First sign-in on this device with no saved account data yet — seed
        // the account from local results (e.g. a just-finished guest run).
        setResults((current) => {
          if (Object.keys(current).length > 0) {
            persistRemoteResults(user.id, current);
          }
          return current;
        });
      }
    });
  }, [mounted, user]);

  React.useEffect(() => {
    // Signed-in results were mirrored into localStorage for offline/guest continuity.
    // On sign-out, wipe that cache so a previous account's data can't linger on a shared device.
    if (!mounted || user || syncedUserId.current === null) return;
    syncedUserId.current = null;
    setResults({});
    setProgress({});
    persistResults({});
    persistProgress({});
  }, [mounted, user]);

  const saveResult = React.useCallback(
    <K extends AssessmentId>(id: K, result: PersonalityResults[K]) => {
      setResults((prev) => {
        const next = { ...prev, [id]: result };
        persistResults(next);
        if (user) persistRemoteResults(user.id, next);
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
    [user]
  );

  const finishAssessment = React.useCallback(
    <K extends AssessmentId>(id: K, result: PersonalityResults[K]) => {
      setAnalyzingId(id);
      window.setTimeout(() => {
        saveResult(id, result);
        setAnalyzingId((current) => (current === id ? null : current));
      }, 1900);
    },
    [saveResult]
  );

  const saveProgress = React.useCallback((id: AssessmentId, p: SurveyProgress) => {
    setProgress((prev) => {
      const next = { ...prev, [id]: p };
      persistProgress(next);
      return next;
    });
  }, []);

  const resetAssessment = React.useCallback(
    (id: AssessmentId) => {
      setResults((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        persistResults(next);
        if (user) persistRemoteResults(user.id, next);
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
    [user]
  );

  const resetAll = React.useCallback(() => {
    setResults({});
    setProgress({});
    persistResults({});
    persistProgress({});
    if (user) persistRemoteResults(user.id, {});
  }, [user]);

  const markGuidanceSeen = React.useCallback((id: AssessmentId) => {
    setGuidanceSeen((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      persistGuidanceSeen(next);
      return next;
    });
  }, []);

  const saveFeedbackNote = React.useCallback((note: Omit<FeedbackNote, "createdAt">) => {
    appendFeedbackNote({ ...note, createdAt: new Date().toISOString() });
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
      guidanceSeen,
      completedIds,
      analyzingId,
      saveResult,
      finishAssessment,
      saveProgress,
      resetAssessment,
      resetAll,
      markGuidanceSeen,
      saveFeedbackNote,
    }),
    [
      mounted,
      results,
      progress,
      guidanceSeen,
      completedIds,
      analyzingId,
      saveResult,
      finishAssessment,
      saveProgress,
      resetAssessment,
      resetAll,
      markGuidanceSeen,
      saveFeedbackNote,
    ]
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
