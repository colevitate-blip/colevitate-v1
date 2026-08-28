import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FAMOUS_PEOPLE, CATEGORY_LABEL, type FamousPersonCategory } from "@/lib/seo/famousPeopleContent";
import { MbtiColorPill } from "@/components/seo/MbtiColorPill";
import { PersonAvatar } from "@/components/seo/PersonAvatar";

export const metadata: Metadata = {
  title: "Famous People & Their Personality Types | Colevitate",
  description:
    "Colevitate's editorial take on the personality types of well-known scientists, Nobel laureates, entertainers, and politicians — based on public behavior and biography.",
  alternates: { canonical: "/people" },
};

const CATEGORY_ORDER: FamousPersonCategory[] = ["scientist", "nobel-laureate", "entertainment", "politician"];

// Compact-rows layout, chosen from the /experiments/people-layouts comparison:
// thumbnail + name + an MBTI pill stroked in the person's dominant Colors-
// framework gradient, instead of the plain name-pill list this replaced.
export default function PeopleIndexPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Famous People & Their Personality Types</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Our editorial take on how well-known figures across science, literature, entertainment, and politics might
        type — grounded in public behavior and biography, never presented as their own result or as fact.
      </p>

      {CATEGORY_ORDER.map((category) => {
        const people = FAMOUS_PEOPLE.filter((p) => p.category === category);
        if (people.length === 0) return null;
        return (
          <section key={category} className="mt-10 first:mt-0">
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
    </main>
  );
}
