"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL, type FamousPersonCategory } from "@/lib/seo/famousPeopleContent";
import {
  RELATIONSHIP_TYPE_ORDER,
  relationshipFramingFor,
  type RelationshipType,
} from "@/components/personality/compatibility/relationshipFraming";

export interface MatchRosterEntry {
  slug: string;
  name: string;
  category: FamousPersonCategory;
}

function PersonSlot({
  label,
  roster,
  selectedSlug,
  excludeSlug,
  onSelect,
  onClear,
}: {
  label: string;
  roster: MatchRosterEntry[];
  selectedSlug: string | null;
  excludeSlug: string | null;
  onSelect: (slug: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const selected = roster.find((p) => p.slug === selectedSlug) ?? null;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return roster.filter((p) => p.slug !== excludeSlug && p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [roster, query, excludeSlug]);

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
}: {
  roster: MatchRosterEntry[];
  initialA: string | null;
  initialB: string | null;
  initialType: RelationshipType;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function navigate(a: string | null, b: string | null, type: RelationshipType) {
    const params = new URLSearchParams();
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
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
        {RELATIONSHIP_TYPE_ORDER.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => navigate(initialA, initialB, type)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              type === initialType
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {relationshipFramingFor(type).label}
          </button>
        ))}
      </div>
    </div>
  );
}
