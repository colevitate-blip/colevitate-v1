import type { AxisScore } from "./scoringMatrix";

// Only these fields are ever read below — narrower than the full AxisScore
// (which also carries per-person narrative like `sentence`/`contributions`
// that a stored pairing snapshot doesn't need to keep) so callers can pass
// either a live computeScoringMatrix() result or a slim stored snapshot.
type ComparableAxis = Pick<AxisScore, "id" | "label" | "leftPole" | "rightPole" | "score">;

export type CompatibilityBucket = "aligned" | "different" | "opposite";

export interface AxisCompatibility {
  id: AxisScore["id"];
  label: string;
  leftPole: string;
  rightPole: string;
  scoreA: number;
  scoreB: number;
  similarity: number; // 0..100
  bucket: CompatibilityBucket;
  sentence: string;
}

export interface Compatibility {
  overallScore: number; // 0..100
  headline: string;
  axes: AxisCompatibility[];
}

function bucketFor(gap: number): CompatibilityBucket {
  if (gap <= 30) return "aligned";
  if (gap <= 90) return "different";
  return "opposite";
}

// "You" takes a plural-form verb ("lean") while a third-person name takes
// the singular ("leans") — sentences below always run through this so the
// visitor's own name (always literally "You" on the live compare page)
// reads grammatically.
function leans(name: string): string {
  return name === "You" ? "lean" : "leans";
}
function does(name: string): string {
  return name === "You" ? "do" : "does";
}

// Deliberately descriptive, not evaluative — a wide gap on an axis isn't
// framed as good or bad, just named, matching the app's existing "not a
// scientific composite score" stance on the rest of the combined profile.
function sentenceFor(nameA: string, nameB: string, axis: ComparableAxis, scoreA: number, scoreB: number, bucket: CompatibilityBucket): string {
  if (bucket === "aligned") {
    return `${nameA} and ${nameB} land in a similar place on ${axis.label.toLowerCase()}.`;
  }
  const higher = scoreA >= scoreB ? nameA : nameB;
  const lower = scoreA >= scoreB ? nameB : nameA;
  const pole = scoreA >= scoreB ? axis.rightPole : axis.leftPole;
  const otherPole = scoreA >= scoreB ? axis.leftPole : axis.rightPole;
  if (bucket === "opposite") {
    return `${higher} ${leans(higher)} ${pole.toLowerCase()} while ${lower} ${leans(lower)} ${otherPole.toLowerCase()} on ${axis.label.toLowerCase()} — one of the widest gaps between you.`;
  }
  return `${higher} ${leans(higher)} more ${pole.toLowerCase()} than ${lower} ${does(lower)} on ${axis.label.toLowerCase()}.`;
}

function headlineFor(overallScore: number): string {
  if (overallScore >= 75) return "Your approaches line up closely across most of these axes.";
  if (overallScore >= 50) return "Solid common ground, with a few real differences worth knowing about.";
  if (overallScore >= 25) return "You see several of these axes quite differently.";
  return "Your two profiles pull in different directions on most axes — could be friction, could be a complement.";
}

/**
 * Compares two completed profiles' axis scores. Every completed profile
 * (>=2 assessments) always has all 4 AXES entries regardless of which
 * frameworks contributed, so this zips by id with no partial-axis handling.
 */
export function computeCompatibility(axesA: ComparableAxis[], axesB: ComparableAxis[], nameA: string, nameB: string): Compatibility {
  const axes: AxisCompatibility[] = axesA.map((a) => {
    const b = axesB.find((x) => x.id === a.id)!;
    const gap = Math.abs(a.score - b.score);
    const similarity = Math.round(100 - gap / 2);
    const bucket = bucketFor(gap);
    return {
      id: a.id,
      label: a.label,
      leftPole: a.leftPole,
      rightPole: a.rightPole,
      scoreA: a.score,
      scoreB: b.score,
      similarity,
      bucket,
      sentence: sentenceFor(nameA, nameB, a, a.score, b.score, bucket),
    };
  });

  const overallScore = Math.round(axes.reduce((sum, a) => sum + a.similarity, 0) / axes.length);

  return { overallScore, headline: headlineFor(overallScore), axes };
}
