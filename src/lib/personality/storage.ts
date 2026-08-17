import { createClient } from "@/lib/supabase/client";
import type {
  CombinedSnapshot,
  FeedbackNote,
  GuidanceSeenMap,
  PersonalityResults,
  ProgressMap,
} from "./types";

const RESULTS_KEY = "colevitate.personality.results.v1";
const PROGRESS_KEY = "colevitate.personality.progress.v1";
const FEEDBACK_KEY = "colevitate.personality.feedback.v1";
const GUIDANCE_SEEN_KEY = "colevitate.personality.guidanceSeen.v1";
const HISTORY_KEY = "colevitate.personality.combinedHistory.v1";
const MAX_FEEDBACK_NOTES = 200;
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

/** Loads a signed-in user's results from Supabase. Returns null if the row doesn't exist yet or the fetch fails. */
export async function loadRemoteResults(userId: string): Promise<PersonalityResults | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("results")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return (data.results as PersonalityResults) ?? {};
}

/** Upserts a signed-in user's results to Supabase. */
export async function persistRemoteResults(userId: string, results: PersonalityResults) {
  const supabase = createClient();
  await supabase.from("profiles").upsert({ id: userId, results });
}

export function loadProgress(): ProgressMap {
  return readJson<ProgressMap>(PROGRESS_KEY, {});
}

export function persistProgress(progress: ProgressMap) {
  writeJson(PROGRESS_KEY, progress);
}

export function loadFeedbackNotes(): FeedbackNote[] {
  return readJson<FeedbackNote[]>(FEEDBACK_KEY, []);
}

// Notes are for local product-improvement review only (no backend exists in this app) — capped
// so an idle browser tab can't grow this key unboundedly over a long session.
export function appendFeedbackNote(note: FeedbackNote) {
  const existing = loadFeedbackNotes();
  const next = [...existing, note].slice(-MAX_FEEDBACK_NOTES);
  writeJson(FEEDBACK_KEY, next);
}

export function loadGuidanceSeen(): GuidanceSeenMap {
  return readJson<GuidanceSeenMap>(GUIDANCE_SEEN_KEY, {});
}

export function persistGuidanceSeen(seen: GuidanceSeenMap) {
  writeJson(GUIDANCE_SEEN_KEY, seen);
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

/** Loads a signed-in user's history snapshots from Supabase. Returns empty array if the fetch fails. */
export async function loadRemoteHistory(userId: string): Promise<CombinedSnapshot[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("snapshots")
    .select("completed_at, axes, archetype_name")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    completedAt: row.completed_at,
    axes: row.axes as CombinedSnapshot["axes"],
    archetypeName: row.archetype_name ?? undefined,
  }));
}

/** Appends a signed-in user's history snapshot to Supabase. Silently ignores unique-violation conflicts (already recorded). */
export async function appendRemoteHistorySnapshot(
  userId: string,
  snapshot: CombinedSnapshot
): Promise<void> {
  const supabase = createClient();
  await supabase.from("snapshots").insert({
    user_id: userId,
    completed_at: snapshot.completedAt,
    axes: snapshot.axes,
    archetype_name: snapshot.archetypeName,
  });
}

export interface ProfileMeta {
  displayName: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  shareSlug: string | null;
}

/** Loads a signed-in user's profile metadata from Supabase. Returns null if the row doesn't exist or the fetch fails. */
export async function loadRemoteProfileMeta(userId: string): Promise<ProfileMeta | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, is_public, share_slug")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    isPublic: data.is_public,
    shareSlug: data.share_slug,
  };
}

/** Upserts a signed-in user's profile metadata fields. Only updates the provided fields. */
export async function persistRemoteProfileMeta(
  userId: string,
  patch: Partial<ProfileMeta>
): Promise<void> {
  const supabase = createClient();
  const update: Record<string, unknown> = { id: userId };
  if (patch.displayName !== undefined) update.display_name = patch.displayName;
  if (patch.avatarUrl !== undefined) update.avatar_url = patch.avatarUrl;
  if (patch.isPublic !== undefined) update.is_public = patch.isPublic;
  if (patch.shareSlug !== undefined) update.share_slug = patch.shareSlug;
  await supabase.from("profiles").upsert(update);
}
