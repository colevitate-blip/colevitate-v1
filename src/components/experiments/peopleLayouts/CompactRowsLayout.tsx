import Link from "next/link";
import { FAMOUS_PEOPLE, CATEGORY_LABEL, type FamousPersonCategory } from "@/lib/seo/famousPeopleContent";
import { MbtiColorPill } from "@/components/seo/MbtiColorPill";
import { PersonAvatar } from "@/components/seo/PersonAvatar";

const CATEGORY_ORDER: FamousPersonCategory[] = ["scientist", "nobel-laureate", "entertainment", "politician"];

/** Concept 2 — the one that shipped to the real /people page. Dense list rows: small thumbnail inline with name + an MBTI/color pill. */
export function CompactRowsLayout() {
  return (
    <div>
      {CATEGORY_ORDER.map((category) => {
        const people = FAMOUS_PEOPLE.filter((p) => p.category === category);
        if (people.length === 0) return null;
        return (
          <section key={category} className="mt-8 first:mt-0">
            <h2 className="text-lg font-semibold tracking-tight">{CATEGORY_LABEL[category]}</h2>
            <div className="mt-3 divide-y rounded-2xl border">
              {people.map((person) => (
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
          </section>
        );
      })}
    </div>
  );
}
