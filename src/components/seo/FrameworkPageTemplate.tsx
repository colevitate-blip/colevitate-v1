import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Section, BulletList } from "./Section";
import { QuizCta } from "./QuizCta";
import type { FrameworkContent } from "@/lib/seo/frameworkContent";

/**
 * `typeLinks` are this framework's own type pages, listed on the explainer
 * itself. Before /types merged into /learn this section was a single link out
 * to the separate /types index, which made a reader who had just finished
 * reading what (say) Big Five measures leave for a directory of all four
 * frameworks to find the five trait pages sitting one level below the page
 * they were already on. They now live at /learn/<framework>/<type>, so the
 * explainer can just list them.
 */
export function FrameworkPageTemplate({
  content,
  typeLinks = [],
}: {
  content: FrameworkContent;
  typeLinks?: { href: string; label: string }[];
}) {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <Link
        href="/learn"
        className="text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        ← Knowledge base
      </Link>

      <Badge variant="outline" className="mb-3 mt-4 rounded-full">
        {content.tagline}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{content.label}</h1>
      <p className="mt-4 text-base leading-relaxed text-foreground/90">{content.intro}</p>

      <Section title="Where it comes from">
        <p className="text-sm leading-relaxed text-muted-foreground">{content.origin}</p>
      </Section>

      <Section title="What it measures">
        <p className="text-sm leading-relaxed text-muted-foreground">{content.whatItMeasures}</p>
      </Section>

      <Section title={content.id === "bigfive" ? "The five traits" : "The types"}>
        <div className="space-y-4">
          {content.dimensions.map((dim) => (
            <div key={dim.name}>
              <h3 className="text-sm font-semibold">{dim.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{dim.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How it's scored on this site">
        <p className="text-sm leading-relaxed text-muted-foreground">{content.howItsScoredHere}</p>
      </Section>

      <Section title="Scientific standing">
        <Badge className="mb-2 rounded-full">{content.standing.summary}</Badge>
        <p className="text-sm leading-relaxed text-muted-foreground">{content.standing.detail}</p>
      </Section>

      <Section title="Good for">
        <BulletList items={content.goodFor} />
      </Section>

      <Section title="Keep in mind">
        <BulletList items={content.keepInMind} />
      </Section>

      {typeLinks.length > 0 ? (
        <Section title={`Browse ${content.label} types`}>
          <div className="flex flex-wrap gap-2">
            {typeLinks.map((type) => (
              <Link
                key={type.href}
                href={type.href}
                className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/50"
              >
                {type.label}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <QuizCta href={`/${content.slug}`} label={`Take the ${content.label} quiz`} />
    </article>
  );
}
