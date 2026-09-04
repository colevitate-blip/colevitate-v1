import { computeCompatibility } from "@/components/personality/combined/computeCompatibility";
import {
  hydrateAxisSnapshot,
  type ApproachIntent,
  type ComparableAxisSnapshot,
  type StoredAxisSnapshot,
} from "@/components/discovery/discoveryTypes";
import type { DiscoverCardData } from "@/components/discovery/DiscoverCard";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// Fetching the whole eligible pool (post-exclusion) and ranking it in
// memory is a deliberate trade-off: compatibility score is per-viewer and
// never persisted (mirrors the never-store-a-raw-personality-field stance
// pairings.sql and 0007_approachability.sql already take), so there's no
// column Postgres could ORDER BY. This cap bounds that in-memory work —
// if the approachable pool ever exceeds it, the lowest-recency rows past
// the cap simply won't be considered. Acceptable for now; revisit only if
// the pool actually grows past this in practice.
const POOL_CAP = 300;
export const DISCOVER_PAGE_SIZE = 24;

interface SnapshotRow {
  user_id: string;
  anon_label: string;
  axes: StoredAxisSnapshot[];
  archetype_name: string | null;
  mbti_badge: string | null;
  humandesign_badge: string | null;
  colors_badge: string | null;
  bigfive_badge: string | null;
  updated_at: string;
}

export interface DiscoverCursor {
  score: number;
  updatedAt: string;
  id: string;
}

export function encodeDiscoverCursor(cursor: DiscoverCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

export function decodeDiscoverCursor(raw: string | null | undefined): DiscoverCursor | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (typeof parsed?.score === "number" && typeof parsed?.updatedAt === "string" && typeof parsed?.id === "string") {
      return parsed as DiscoverCursor;
    }
  } catch {
    // Malformed/tampered cursor — treat as "start from the first page"
    // rather than erroring, since this only ever controls pagination
    // offset, never what a viewer is allowed to see (RLS still governs that).
  }
  return null;
}

/**
 * A candidate is excluded from a viewer's feed if the viewer skipped them
 * (discovery_skips) or already sent them an approach that was declined —
 * both computed here as real WHERE-clause exclusions on the main query
 * below, not filtered out of an already-fetched list. Blocks are handled
 * separately, at the RLS level (is_blocked() in 0007_approachability.sql),
 * so they never need to appear here.
 */
async function fetchViewerExclusions(supabase: SupabaseServerClient, viewerId: string): Promise<string[]> {
  const [{ data: skipRows }, { data: declinedRows }] = await Promise.all([
    supabase.from("discovery_skips").select("skipped_user_id").eq("user_id", viewerId),
    supabase
      .from("approach_requests")
      .select("recipient_id")
      .eq("sender_id", viewerId)
      .eq("status", "declined"),
  ]);

  const ids = new Set<string>();
  for (const r of (skipRows as { skipped_user_id: string }[] | null) || []) ids.add(r.skipped_user_id);
  for (const r of (declinedRows as { recipient_id: string }[] | null) || []) ids.add(r.recipient_id);
  return Array.from(ids);
}

interface RankedRow {
  row: SnapshotRow;
  /** Ranking/cursor key — 0 when the viewer has no profile to compare against, same fallback as before. */
  score: number;
  /** Same value as `score`, but null (not 0) when there's no real compatibility to display — distinct from `score` so the card can hide the badge instead of showing a misleading "0% compatible". */
  compatibilityScore: number | null;
  commonGround: string[];
  /** The sentence for whichever non-aligned axis has the widest gap — one contrast point to surface alongside the common-ground tags, or null when the viewer has no profile to compare against. */
  contrast: string | null;
}

// Primary: compatibility score, descending. Secondary: recency, descending
// — among equal scores this rotates who surfaces first as different
// approachable users retake assessments or change scope, rather than the
// same tied rows calcifying at the top of every viewer's feed forever.
// Tertiary: user_id, ascending — pure tie-break for a fully deterministic
// order, since the cursor below depends on one.
function compareRanked(a: RankedRow, b: RankedRow): number {
  if (a.score !== b.score) return b.score - a.score;
  if (a.row.updated_at !== b.row.updated_at) return a.row.updated_at < b.row.updated_at ? 1 : -1;
  if (a.row.user_id === b.row.user_id) return 0;
  return a.row.user_id < b.row.user_id ? -1 : 1;
}

function isAfterCursor(r: RankedRow, cursor: DiscoverCursor): boolean {
  const cursorAsRanked: RankedRow = {
    row: { user_id: cursor.id, updated_at: cursor.updatedAt } as SnapshotRow,
    score: cursor.score,
    compatibilityScore: null,
    commonGround: [],
    contrast: null,
  };
  return compareRanked(r, cursorAsRanked) > 0;
}

export interface DiscoverPageResult {
  cards: DiscoverCardData[];
  nextCursor: string | null;
}

export async function fetchDiscoverPage(
  supabase: SupabaseServerClient,
  opts: {
    viewerId: string;
    viewerAxes: ComparableAxisSnapshot[] | null;
    viewerName: string;
    intentFilter: ApproachIntent | null;
    cursor: DiscoverCursor | null;
  }
): Promise<DiscoverPageResult> {
  const { viewerId, viewerAxes, viewerName, intentFilter, cursor } = opts;

  const excludedIds = await fetchViewerExclusions(supabase, viewerId);

  let query = supabase
    .from("approachable_snapshots")
    .select("user_id, anon_label, axes, archetype_name, mbti_badge, humandesign_badge, colors_badge, bigfive_badge, updated_at")
    .neq("user_id", viewerId)
    .order("updated_at", { ascending: false })
    .limit(POOL_CAP);

  if (excludedIds.length > 0) {
    query = query.not("user_id", "in", `(${excludedIds.join(",")})`);
  }
  if (intentFilter) {
    query = query.or(`scope.eq.everyone,intents.cs.{${intentFilter}}`);
  }

  const { data: rows } = await query;
  const snapshots = (rows as SnapshotRow[] | null) || [];

  let alreadySent = new Set<string>();
  if (snapshots.length > 0) {
    const { data: sentRows } = await supabase
      .from("approach_requests")
      .select("recipient_id")
      .eq("sender_id", viewerId)
      .eq("status", "pending")
      .in(
        "recipient_id",
        snapshots.map((s) => s.user_id)
      );
    alreadySent = new Set(((sentRows as { recipient_id: string }[] | null) || []).map((r) => r.recipient_id));
  }

  const ranked: RankedRow[] = snapshots
    .map((row) => {
      const candidateAxes = hydrateAxisSnapshot(row.axes);
      const compatibility = viewerAxes
        ? computeCompatibility(viewerAxes, candidateAxes, viewerName, row.anon_label || "them")
        : null;
      // Widest-gap non-aligned axis, if any — one contrast point to pair with
      // the aligned tags below, rather than the full axis-by-axis breakdown.
      const contrastAxis = compatibility
        ? [...compatibility.axes].filter((a) => a.bucket !== "aligned").sort((a, b) => a.similarity - b.similarity)[0]
        : undefined;
      return {
        row,
        score: compatibility?.overallScore ?? 0,
        compatibilityScore: compatibility?.overallScore ?? null,
        commonGround: compatibility ? compatibility.axes.filter((a) => a.bucket === "aligned").map((a) => a.label) : [],
        contrast: contrastAxis?.sentence ?? null,
      };
    })
    .sort(compareRanked);

  const startIndex = cursor ? ranked.findIndex((r) => isAfterCursor(r, cursor)) : 0;
  const sliceStart = startIndex === -1 ? ranked.length : startIndex;
  const page = ranked.slice(sliceStart, sliceStart + DISCOVER_PAGE_SIZE);

  const cards: DiscoverCardData[] = page.map(({ row, commonGround, compatibilityScore, contrast }) => ({
    userId: row.user_id,
    displayName: row.anon_label || "Someone",
    avatarUrl: null,
    archetypeName: row.archetype_name,
    mbtiBadge: row.mbti_badge,
    humandesignBadge: row.humandesign_badge,
    colorsBadge: row.colors_badge,
    bigfiveBadge: row.bigfive_badge,
    commonGround,
    compatibilityScore,
    contrast,
    alreadySent: alreadySent.has(row.user_id),
  }));

  const hasMore = sliceStart + DISCOVER_PAGE_SIZE < ranked.length;
  const last = page[page.length - 1];
  const nextCursor =
    hasMore && last ? encodeDiscoverCursor({ score: last.score, updatedAt: last.row.updated_at, id: last.row.user_id }) : null;

  return { cards, nextCursor };
}
