import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Section, BulletList, PlaceholderNote } from "./Section";
import { QuizCta } from "./QuizCta";
import type { TypePageContent } from "@/lib/seo/typeContent";
import type { CombinationPageContent } from "@/lib/seo/combinationContent";

export function TypePageTemplate({
  content,
  relatedCombinations,
}: {
  content: TypePageContent;
  relatedCombinations: CombinationPageContent[];
}) {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <Badge variant="outline" className="mb-3 rounded-full">
        {content.frameworkLabel}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{content.name}</h1>
      <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">{content.tagline}</p>

      <p className="mt-6 text-base leading-relaxed text-foreground/90">{content.description}</p>

      <Section title="Strengths">
        <BulletList items={content.strengths} />
      </Section>

      <Section title="Growth areas">
        <BulletList items={content.challenges} />
      </Section>

      <Section title="Careers that tend to fit">
        {content.careers.length > 0 ? (
          <BulletList items={content.careers} />
        ) : (
          <PlaceholderNote>Career fit guidance for this type is coming soon.</PlaceholderNote>
        )}
      </Section>

      <Section title="Relationships">
        {content.relationships ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{content.relationships}</p>
        ) : (
          <PlaceholderNote>Relationship dynamics for this type are coming soon.</PlaceholderNote>
        )}
      </Section>

      <Section title="Famous examples">
        {content.famousExamples.length > 0 ? (
          <BulletList items={content.famousExamples} />
        ) : (
          <PlaceholderNote>Well-known examples of this type are coming soon.</PlaceholderNote>
        )}
      </Section>

      {relatedCombinations.length > 0 ? (
        <>
          <Separator className="my-8" />
          <Section title={`How ${content.name} combines with other frameworks`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedCombinations.map((combo) => (
                <Link
                  key={combo.slug}
                  href={`/types/combinations/${combo.slug}`}
                  className="rounded-2xl border p-4 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  {combo.headline}
                </Link>
              ))}
            </div>
          </Section>
        </>
      ) : null}

      <QuizCta href={`/${content.frameworkUrlSlug}`} label={`Take the ${content.frameworkLabel} quiz`} />
    </article>
  );
}
