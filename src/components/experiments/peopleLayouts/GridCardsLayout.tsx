import Link from "next/link";
import { FAMOUS_PEOPLE, CATEGORY_LABEL, type FamousPersonCategory } from "@/lib/seo/famousPeopleContent";
import { PersonAvatar } from "@/components/seo/PersonAvatar";

const CATEGORY_ORDER: FamousPersonCategory[] = ["scientist", "nobel-laureate", "entertainment", "politician"];

/** Concept 1: card grid — circular portrait, name, category badge. Familiar "team page" pattern, scans well at any width. */
export function GridCardsLayout() {
  return (
    <div>
      {CATEGORY_ORDER.map((category) => {
        const people = FAMOUS_PEOPLE.filter((p) => p.category === category);
        if (people.length === 0) return null;
        return (
          <section key={category} className="mt-10 first:mt-0">
            <h2 className="text-lg font-semibold tracking-tight">{CATEGORY_LABEL[category]}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {people.map((person) => (
                <Link
                  key={person.slug}
                  href={`/people/${person.slug}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors hover:bg-muted/50"
                >
                  <PersonAvatar person={person} size={64} />
                  <span className="text-sm font-medium leading-tight">{person.name}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
