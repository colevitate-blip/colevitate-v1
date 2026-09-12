import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { getAllCodesForFramework, getTypeContent, FRAMEWORK_URL_SLUGS } from "@/lib/seo/typeContent";
import { COMBINATIONS } from "@/lib/seo/combinationContent";
import { FRAMEWORK_CONTENT } from "@/lib/seo/frameworkContent";
import { FrameworkTypesCard } from "@/components/seo/FrameworkTypesCard";

export const metadata: Metadata = {
  title: "Personality Types & Combinations | Colevitate",
  description:
    "Browse every 16 Personalities type, Big Five trait profile, Human Design type, and Color type — plus how specific combinations of them interact.",
  alternates: { canonical: "/types" },
};

export default async function TypesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Personality Types & Combinations</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        A page for every individual type across all four frameworks, plus how specific combinations of
        them play out together. Pick a starting point below, or{" "}
        <Link href="/" className="font-medium text-primary underline underline-offset-2">
          take the quiz
        </Link>{" "}
        to find your own.
      </p>

      {/* One card per framework instead of a bare heading over a flat pill
          wrap — MBTI (16 types) and Big Five (10 trait levels) dumped
          straight into the page read as an overwhelming wall on mobile, with
          nothing telling a visitor what they're even looking at. The card
          leads with what the framework is and links to its full /learn
          explanation before showing any sub-types, and FrameworkTypesCard
          collapses the pill list past a handful so the ones that don't need
          it (Human Design, Colors) render exactly as before. */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ASSESSMENT_ORDER.map((framework) => {
          const content = FRAMEWORK_CONTENT[framework];
          const urlSlug = FRAMEWORK_URL_SLUGS[framework];
          const codes = getAllCodesForFramework(framework);
          const pills = codes
            .map((code) => {
              const typeContent = getTypeContent(urlSlug, code.toLowerCase(), locale);
              if (!typeContent) return null;
              return { href: `/types/${urlSlug}/${typeContent.slug}`, label: typeContent.name };
            })
            .filter((pill) => pill !== null);

          return (
            <FrameworkTypesCard
              key={framework}
              tagline={content.tagline}
              label={content.label}
              intro={content.intro}
              learnHref={`/learn/${content.slug}`}
              pills={pills}
            />
          );
        })}
      </div>

      {COMBINATIONS.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Combinations</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {COMBINATIONS.map((combo) => (
              <Link
                key={combo.slug}
                href={`/types/combinations/${combo.slug}`}
                className="rounded-2xl border p-4 text-sm font-medium transition-colors hover:bg-muted/50"
              >
                {combo.headline}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
