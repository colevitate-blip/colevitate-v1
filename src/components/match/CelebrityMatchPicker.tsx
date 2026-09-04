"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, type FamousPersonCategory } from "@/lib/seo/famousPeopleContent";
import type { RelationshipType } from "@/components/personality/compatibility/relationshipFraming";
import { RelationshipTypeToggle } from "@/components/personality/compatibility/RelationshipTypeToggle";

export interface MatchRosterEntry {
  slug: string;
  name: string;
  category: FamousPersonCategory;
}

// Slug that stands in for "the signed-in viewer's own combined profile"
// rather than a roster entry — never a real celebrity slug, so it's safe to
// compare against roster/selection state without a collision.
export const YOU_SLUG = "me";

// available: true when the viewer is logged in with a completed combined
// profile ready to compare — "me" becomes a selectable third option.
// available: false covers both "not logged in" and "no combined profile
// yet"; ctaLabel/ctaHref point at whichever fixes that.
export type YouOption = { available: true; name: string } | { available: false; ctaLabel: string; ctaHref: string };

function PersonSlot({
  label,
  roster,
  selectedSlug,
  excludeSlug,
  onSelect,
  onClear,
  you,
}: {
  label: string;
  roster: MatchRosterEntry[];
  selectedSlug: string | null;
  excludeSlug: string | null;
  onSelect: (slug: string) => void;
  onClear: () => void;
  you: YouOption | null;
}) {
  const [query, setQuery] = useState("");
  const isYouSelected = selectedSlug === YOU_SLUG && you?.available === true;
  const selected = isYouSelected ? null : (roster.find((p) => p.slug === selectedSlug) ?? null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return roster.filter((p) => p.slug !== excludeSlug && p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [roster, query, excludeSlug]);

  if (isYouSelected && you?.available) {
    return (
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-primary/5 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{you.name}</p>
            <Badge variant="outline" className="mt-1 rounded-full">
              You
            </Badge>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Change
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      {selected ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{selected.name}</p>
            <Badge variant="outline" className="mt-1 rounded-full">
              {CATEGORY_LABEL[selected.category]}
            </Badge>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Change
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a name…" />
          {matches.length > 0 && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-card shadow-lg">
              {matches.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => {
                    onSelect(p.slug);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span className="truncate">{p.name}</span>
                  <Badge variant="outline" className="shrink-0 rounded-full">
                    {CATEGORY_LABEL[p.category]}
                  </Badge>
                </button>
              ))}
            </div>
          )}
          {you && excludeSlug !== YOU_SLUG && matches.length === 0 && (
            <p className="mt-1.5">
              {you.available ? (
                <button
                  type="button"
                  onClick={() => onSelect(YOU_SLUG)}
                  className="text-xs font-medium text-primary underline underline-offset-2"
                >
                  Compare with your own results
                </button>
              ) : (
                <Link href={you.ctaHref} className="text-xs text-muted-foreground underline underline-offset-2">
                  {you.ctaLabel}
                </Link>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function CelebrityMatchPicker({
  roster,
  initialA,
  initialB,
  initialType,
  you,
}: {
  roster: MatchRosterEntry[];
  initialA: string | null;
  initialB: string | null;
  initialType: RelationshipType;
  you: YouOption | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function navigate(a: string | null, b: string | null, type: RelationshipType) {
    const params = new URLSearchParams();
    // Picking "You" in either slot isn't a roster pairing — it routes to the
    // dedicated vs=me flow (which compares the signed-in viewer's own
    // combined profile against whichever celebrity slug ends up in `a`)
    // rather than ever putting the literal "me" slug in the querystring.
    if (a === YOU_SLUG || b === YOU_SLUG) {
      const celebSlug = a === YOU_SLUG ? b : a;
      if (celebSlug) params.set("a", celebSlug);
      params.set("vs", "me");
      params.set("type", type);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      return;
    }
    if (a) params.set("a", a);
    if (b) params.set("b", b);
    params.set("type", type);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <PersonSlot
          label="Person A"
          roster={roster}
          selectedSlug={initialA}
          excludeSlug={initialB}
          onSelect={(slug) => navigate(slug, initialB, initialType)}
          onClear={() => navigate(null, initialB, initialType)}
          you={you}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 self-center sm:self-auto"
          disabled={!initialA || !initialB}
          onClick={() => navigate(initialB, initialA, initialType)}
          aria-label="Swap Person A and Person B"
        >
          <ArrowLeftRight className="size-4" />
        </Button>
        <PersonSlot
          label="Person B"
          roster={roster}
          selectedSlug={initialB}
          excludeSlug={initialA}
          onSelect={(slug) => navigate(initialA, slug, initialType)}
          onClear={() => navigate(initialA, null, initialType)}
          you={you}
        />
      </div>

      <div className="mt-5 border-t pt-4">
        <RelationshipTypeToggle value={initialType} onSelect={(type) => navigate(initialA, initialB, type)} />
      </div>
    </div>
  );
}
