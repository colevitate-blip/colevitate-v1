import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ASSESSMENT_CATALOG, ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { getAllCodesForFramework, getTypeContent, FRAMEWORK_URL_SLUGS } from "@/lib/seo/typeContent";
import { COMBINATIONS } from "@/lib/seo/combinationContent";

export const metadata: Metadata = {
  title: "Personality Types & Combinations | Colevitate",
  description:
    "Browse every 16 Personalities type, Big Five trait profile, Human Design type, and Color type — plus how specific combinations of them interact.",
  alternates: { canonical: "/types" },
};

export default function TypesIndexPage() {
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

      {ASSESSMENT_ORDER.map((framework) => {
        const catalog = ASSESSMENT_CATALOG[framework];
        const urlSlug = FRAMEWORK_URL_SLUGS[framework];
        const codes = getAllCodesForFramework(framework);
        return (
          <section key={framework} className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight">{catalog.label}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {codes.map((code) => {
                const content = getTypeContent(urlSlug, code.toLowerCase());
                if (!content) return null;
                return (
                  <Link
                    key={code}
                    href={`/types/${urlSlug}/${content.slug}`}
                    className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/50"
                  >
                    {content.name}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

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
