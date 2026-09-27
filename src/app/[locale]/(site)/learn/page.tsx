import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ASSESSMENT_ORDER } from "@/lib/personality/catalog";
import { getAllCodesForFramework, getTypeContent, FRAMEWORK_URL_SLUGS } from "@/lib/seo/typeContent";
import { COMBINATIONS } from "@/lib/seo/combinationContent";
import { FRAMEWORK_CONTENT } from "@/lib/seo/frameworkContent";
import { FrameworkTypesCard } from "@/components/seo/FrameworkTypesCard";
import { ExpandableList } from "@/components/seo/ExpandableList";

export const metadata: Metadata = {
  title: "Personality Test Knowledge Base — Frameworks, Types & Combinations | Colevitate",
  description:
    "What 16 Personalities, Big Five, Human Design, and 4 Color Types actually measure, where each one comes from, how much scientific backing it has — plus a page for every individual type and how specific combinations interact.",
  alternates: { canonical: "/learn" },
};

// The former /types index folded in here. The two pages were already near
// duplicates — both looped over the same four frameworks, both rendered the
// same tagline/label/intro, and both linked out to /learn/<framework> — so a
// visitor had to guess which of "Learn" and "Types" held the thing they
// wanted. FrameworkTypesCard was already the fusion of both (explainer blurb
// on top, type pills under it), so the merged hub is just that card driving
// the whole page. Individual type pages moved to /learn/<framework>/<type>
// and combinations to /learn/combinations/<slug>; next.config.ts keeps the
// old /types/* URLs alive as permanent redirects.
export default async function LearnIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Personality Test Knowledge Base</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Four very different tools live on this site — one is the most evidence-backed model in personality
        science, and one has no scientific basis at all. Here&rsquo;s where each one came from, what it actually
        measures, and a page for every type it can give you. Or{" "}
        <Link href="/" className="font-medium text-primary underline underline-offset-2">
          take the quiz
        </Link>{" "}
        to find your own.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ASSESSMENT_ORDER.map((framework) => {
          const content = FRAMEWORK_CONTENT[framework];
          const urlSlug = FRAMEWORK_URL_SLUGS[framework];
          const pills = getAllCodesForFramework(framework)
            .map((code) => {
              const typeContent = getTypeContent(urlSlug, code.toLowerCase(), locale);
              if (!typeContent) return null;
              return { href: `/learn/${urlSlug}/${typeContent.slug}`, label: typeContent.name };
            })
            .filter((pill) => pill !== null);

          return (
            <FrameworkTypesCard
              key={framework}
              tagline={content.tagline}
              label={content.label}
              intro={content.intro}
              standing={content.standing.summary}
              learnHref={`/learn/${content.slug}`}
              pills={pills}
            />
          );
        })}
      </div>

      {COMBINATIONS.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Combinations</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            How results from two different frameworks play out together.
          </p>
          {/* Collapsed for the same reason the type pills above are: all 81
              combination cards rendered flat ran the hub to ~9,400px on a
              390px screen, nearly all of it this one section. previewCount is
              6 rather than the pills' 8 because each of these is a full-width
              card carrying a whole headline sentence, not a one-word pill. */}
          <ExpandableList
            previewCount={6}
            previewClassName="mt-3 grid gap-3 sm:grid-cols-2"
            restClassName="mt-3 grid gap-3 sm:grid-cols-2"
            toggleClassName="mt-3"
            items={COMBINATIONS.map((combo) => (
              <Link
                key={combo.slug}
                href={`/learn/combinations/${combo.slug}`}
                className="rounded-2xl border p-4 text-sm font-medium transition-colors hover:bg-muted/50"
              >
                {combo.headline}
              </Link>
            ))}
          />
        </section>
      ) : null}
    </main>
  );
}
