import type { CombinedSnapshot, PersonalityResults, ProgressMap } from "./types";

const RESULTS_KEY = "colevitate.personality.results.v1";
const PROGRESS_KEY = "colevitate.personality.progress.v1";
const HISTORY_KEY = "colevitate.personality.combinedHistory.v1";
const MAX_HISTORY_SNAPSHOTS = 50;

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently, state stays in memory
  }
}

export function loadResults(): PersonalityResults {
  return readJson<PersonalityResults>(RESULTS_KEY, {});
}

export function persistResults(results: PersonalityResults) {
  writeJson(RESULTS_KEY, results);
}

export function loadProgress(): ProgressMap {
  return readJson<ProgressMap>(PROGRESS_KEY, {});
}

export function persistProgress(progress: ProgressMap) {
  writeJson(PROGRESS_KEY, progress);
}

export function loadHistory(): CombinedSnapshot[] {
  return readJson<CombinedSnapshot[]>(HISTORY_KEY, []);
}

// Combined-profile snapshots are additive, not overwritten on retake — capped
// so an idle browser tab can't grow this key unboundedly over a long session.
export function appendHistorySnapshot(snapshot: CombinedSnapshot) {
  const existing = loadHistory();
  const next = [...existing, snapshot].slice(-MAX_HISTORY_SNAPSHOTS);
  writeJson(HISTORY_KEY, next);
  return next;
}
