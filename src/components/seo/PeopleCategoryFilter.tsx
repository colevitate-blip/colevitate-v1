"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MbtiColorPill } from "@/components/seo/MbtiColorPill";
import { PersonAvatar } from "@/components/seo/PersonAvatar";
import type { FamousPersonCategory, FamousPersonContent } from "@/lib/seo/famousPeopleContent";
import { CATEGORY_LABEL } from "@/lib/seo/famousPeopleContent";

type CategoryGroup = { category: FamousPersonCategory; people: FamousPersonContent[] };

const ALL = "all" as const;

// Replaces the old one-accordion-per-category list: 8 stacked expand/collapse
// sections was too much vertical scrolling on mobile, and the trigger's count
// badge visually collided with the chevron. A chip filter (count baked into
// each pill) plus a single flat, filtered list scans in one glance and has
// nowhere for a number to get jumbled.
//
// Chips scroll in a single row rather than wrap: variable-width pills
// wrapping onto multiple lines bricked unevenly (a short "Athlete 8" next to
// a long "Business & Innovation 9" never lines up cleanly). A bare overflow
// row has the opposite problem — most phone browsers hide the scrollbar at
// rest, so nothing hints that more categories exist off-screen — hence the
// fade-out edge below.
export function PeopleCategoryFilter({ categories }: { categories: CategoryGroup[] }) {
  const [selected, setSelected] = useState<FamousPersonCategory | typeof ALL>(ALL);

  const allPeople = useMemo(() => categories.flatMap((c) => c.people), [categories]);
  const visiblePeople = selected === ALL ? allPeople : categories.find((c) => c.category === selected)?.people ?? [];

  return (
    <div>
      <div className="relative">
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <CategoryChip
            label="All"
            count={allPeople.length}
            active={selected === ALL}
            onClick={() => setSelected(ALL)}
          />
          {categories.map(({ category, people }) => (
            <CategoryChip
              key={category}
              label={CATEGORY_LABEL[category]}
              count={people.length}
              active={selected === category}
              onClick={() => setSelected(category)}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent"
        />
      </div>

      <div className="mt-4 divide-y rounded-2xl border">
        {visiblePeople.map((person) => (
          <Link
            key={person.slug}
            href={`/people/${person.slug}`}
            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50"
          >
            <PersonAvatar person={person} size={36} />
            <span className="text-sm font-medium">{person.name}</span>
            <MbtiColorPill person={person} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "border-foreground bg-foreground text-background" : "hover:bg-muted/50"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-xs leading-none",
          active ? "bg-background/20" : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}
