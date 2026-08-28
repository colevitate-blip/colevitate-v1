import Link from "next/link";
import { FAMOUS_PEOPLE, CATEGORY_LABEL, type FamousPersonCategory } from "@/lib/seo/famousPeopleContent";
import { PersonPortrait } from "@/components/seo/PersonAvatar";

const CATEGORY_ORDER: FamousPersonCategory[] = ["scientist", "nobel-laureate", "entertainment", "politician"];

/** Concept 3: editorial portrait wall — larger portrait tiles, name overlaid on a gradient scrim. Magazine feel, leans into the photos more than 1 or 2. */
export function PortraitWallLayout() {
  return (
    <div>
      {CATEGORY_ORDER.map((category) => {
        const people = FAMOUS_PEOPLE.filter((p) => p.category === category);
        if (people.length === 0) return null;
        return (
          <section key={category} className="mt-10 first:mt-0">
            <h2 className="text-lg font-semibold tracking-tight">{CATEGORY_LABEL[category]}</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {people.map((person) => (
                <Link
                  key={person.slug}
                  href={`/people/${person.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted"
                >
                  <PersonPortrait
                    person={person}
                    sizes="(min-width: 768px) 16vw, 33vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 pt-8">
                    <span className="text-xs font-medium leading-tight text-white drop-shadow-sm">{person.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
