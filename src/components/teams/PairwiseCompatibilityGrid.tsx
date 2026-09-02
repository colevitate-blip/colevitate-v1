import { cn } from "@/lib/utils";
import { computePairwiseCompatibility } from "./pairwiseCompatibility";
import type { SharedMemberAxes } from "./teamInsights";

function cellTone(score: number): string {
  if (score >= 75) return "bg-emerald-500 text-white";
  if (score >= 50) return "bg-lime-400/80 text-foreground";
  if (score >= 25) return "bg-amber-400/80 text-foreground";
  return "bg-rose-400/80 text-white";
}

/** Every pairwise compatibility score in a circle at once — Tier 2.1 (see prompt.md), reusing the same overallScore computeCompatibility already produces for 1:1 comparisons. */
export function PairwiseCompatibilityGrid({
  members,
  title = "Compatibility Grid",
}: {
  members: SharedMemberAxes[];
  title?: string;
}) {
  const { matrix, anchorIndex, wildcardIndex } = computePairwiseCompatibility(members);

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-[0_18px_40px_-16px_var(--elevation-shadow-sm)]">
      <h2 className="mb-1 font-semibold">{title}</h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        How every pair in the circle compares, axis-for-axis, averaged into one score per pair.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-1" />
              {members.map((m, i) => (
                <th key={i} className="p-1 text-center font-medium text-muted-foreground" scope="col">
                  <span className="inline-block max-w-16 truncate" title={m.displayName}>
                    {m.displayName}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((rowMember, i) => (
              <tr key={i}>
                <th className="p-1 text-right font-medium text-muted-foreground" scope="row">
                  <span className="inline-block max-w-16 truncate" title={rowMember.displayName}>
                    {rowMember.displayName}
                  </span>
                </th>
                {members.map((colMember, j) => (
                  <td key={j} className="p-1">
                    {i === j ? (
                      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        —
                      </div>
                    ) : (
                      <div
                        title={`${rowMember.displayName} & ${colMember.displayName}: ${matrix[i][j]}`}
                        className={cn("flex size-9 items-center justify-center rounded-lg font-semibold", cellTone(matrix[i][j]))}
                      >
                        {matrix[i][j]}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {anchorIndex !== null && wildcardIndex !== null ? (
        <div className="mt-6 space-y-1.5 border-t pt-4 text-sm leading-relaxed text-foreground/90">
          <p>
            <strong>{members[anchorIndex].displayName}</strong> is the circle&apos;s anchor — the highest average
            compatibility with everyone else.
          </p>
          {wildcardIndex !== anchorIndex ? (
            <p>
              <strong>{members[wildcardIndex].displayName}</strong> is the wildcard — their compatibility swings the
              most from person to person.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
