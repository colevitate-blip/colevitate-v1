import { CULTURE_IDS, CULTURE_STYLE, DIMENSIONS } from "@/lib/understand/model";

/** Culture clusters x seven dimensions, each cell a bar diverging from a
 * center line. Server-rendered; labels are passed in already translated. */
export function CultureMatrix({
  cultureLabels,
  dimensionLabels,
}: {
  cultureLabels: Record<string, string>;
  dimensionLabels: Record<string, { label: string; left: string; right: string }>;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead>
          <tr className="border-b bg-muted/40 text-muted-foreground">
            <th className="sticky left-0 z-10 bg-muted px-3 py-2 font-medium" />
            {DIMENSIONS.map((d) => (
              <th key={d} className="px-2 py-2 align-bottom font-medium">
                <span className="block text-foreground">{dimensionLabels[d].label}</span>
                <span className="block text-[10px] font-normal">
                  {dimensionLabels[d].left} ↔ {dimensionLabels[d].right}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CULTURE_IDS.map((c) => (
            <tr key={c} className="border-b last:border-b-0">
              <th scope="row" className="sticky left-0 z-10 bg-card px-3 py-2 font-medium">
                {cultureLabels[c]}
              </th>
              {DIMENSIONS.map((d) => {
                const v = CULTURE_STYLE[c][d];
                const width = Math.abs(v) * 50;
                return (
                  <td key={d} className="px-2 py-2">
                    <div
                      className="relative h-2.5 w-full min-w-16 rounded-full bg-muted"
                      role="img"
                      aria-label={`${dimensionLabels[d].label}: ${v < 0 ? dimensionLabels[d].left : dimensionLabels[d].right} ${Math.round(Math.abs(v) * 100)}%`}
                    >
                      <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-foreground/30" />
                      <span
                        aria-hidden
                        className={`absolute inset-y-0 rounded-full ${v < 0 ? "bg-sky-500/80" : "bg-violet-500/80"}`}
                        style={v < 0 ? { right: "50%", width: `${width}%` } : { left: "50%", width: `${width}%` }}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
