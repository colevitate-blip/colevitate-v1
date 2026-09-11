import type { Metadata } from "next";
import { FAMOUS_PEOPLE, type FamousPersonCategory } from "@/lib/seo/famousPeopleContent";
import { PeopleCategoryFilter } from "@/components/seo/PeopleCategoryFilter";
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

// A horizontal chip filter (name + count per category, including "All")
// drives a single flat people list below — scans in one glance on mobile,
// unlike a stack of 8 expand/collapse accordions.
export default async function PeopleIndexPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(authData.user);
  const loginHref = await loginRedirectTarget("/people");

  const categories = CATEGORY_ORDER.map((category) => ({
    category,
    people: FAMOUS_PEOPLE.filter((p) => p.category === category),
  })).filter(({ people }) => people.length > 0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Famous People & Their Personality Types</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Our editorial take on how well-known figures across science, literature, entertainment, business, sports,
        the arts, and politics might type — grounded in public behavior and biography, never presented as their own
        result or as fact.
      </p>

      <div className="mt-10">
        <PeopleCategoryFilter categories={categories} />
      </div>

      <PersonAuditSearch />
      <TypeAFriendSearch isLoggedIn={isLoggedIn} loginHref={loginHref} />
    </main>
  );
}
