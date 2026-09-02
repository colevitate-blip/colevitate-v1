import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FAMOUS_PEOPLE, CATEGORY_LABEL, type FamousPersonCategory } from "@/lib/seo/famousPeopleContent";
import { MbtiColorPill } from "@/components/seo/MbtiColorPill";
import { PersonAvatar } from "@/components/seo/PersonAvatar";
import { PersonAuditSearch } from "@/components/seo/PersonAuditSearch";
import { TypeAFriendSearch } from "@/components/seo/TypeAFriendSearch";
import { createClient } from "@/lib/supabase/server";
import { loginRedirectTarget } from "@/lib/i18n/serverRedirect";

export const metadata: Metadata = {
  title: "Famous People & Their Personality Types | Colevitate",
  description:
    "Colevitate's editorial take on the personality types of well-known scientists, Nobel laureates, entertainers, politicians, business leaders, athletes, artists, and authors — based on public behavior and biography.",
  alternates: { canonical: "/people" },
};

const CATEGORY_ORDER: FamousPersonCategory[] = [
  "scientist",
  "nobel-laureate",
  "entertainment",
  "politician",
  "business",
  "athlete",
  "artist",
  "author",
];

// Quadrant grid: each category is its own card in a 2-column layout (1 on
// mobile) so far more of the roster is visible in one screen than the old
// single stacked column allowed, while keeping the compact-rows treatment
// inside each card — thumbnail + name + an MBTI pill stroked in the
// person's dominant Colors-framework gradient — chosen from the
// /experiments/people-layouts comparison.
export default async function PeopleIndexPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(authData.user);
  const loginHref = await loginRedirectTarget("/people");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Famous People & Their Personality Types</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Our editorial take on how well-known figures across science, literature, entertainment, business, sports,
        the arts, and politics might type — grounded in public behavior and biography, never presented as their own
        result or as fact.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {CATEGORY_ORDER.map((category) => {
          const people = FAMOUS_PEOPLE.filter((p) => p.category === category);
          if (people.length === 0) return null;
          return (
            <section key={category}>
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

      <PersonAuditSearch />
      <TypeAFriendSearch isLoggedIn={isLoggedIn} loginHref={loginHref} />
    </main>
  );
}
