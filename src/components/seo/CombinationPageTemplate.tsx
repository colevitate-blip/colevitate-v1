import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Section, BulletList } from "./Section";
import { QuizCta } from "./QuizCta";
import type { TypePageContent } from "@/lib/seo/typeContent";
import type { CombinationPageContent } from "@/lib/seo/combinationContent";

function TypeRefCard({ content }: { content: TypePageContent }) {
  return (
    <Link
      href={`/types/${content.frameworkUrlSlug}/${content.slug}`}
      className="rounded-2xl border p-4 transition-colors hover:bg-muted/50"
    >
      <Badge variant="outline" className="mb-2 rounded-full text-xs">
        {content.frameworkLabel}
      </Badge>
      <p className="font-semibold">{content.name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{content.tagline}</p>
    </Link>
  );
}

export function CombinationPageTemplate({
  content,
  typeA,
  typeB,
}: {
  content: CombinationPageContent;
  typeA: TypePageContent;
  typeB: TypePageContent;
}) {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <Badge variant="outline" className="mb-3 rounded-full">
        Combination
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{content.headline}</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <TypeRefCard content={typeA} />
        <TypeRefCard content={typeB} />
      </div>

      <p className="mt-6 text-base leading-relaxed text-foreground/90">{content.summary}</p>

      <Section title="Where these reinforce each other">
        <BulletList items={content.reinforcements} />
      </Section>

      {content.contrasts.length > 0 ? (
        <Section title="Where they pull in different directions">
          <BulletList items={content.contrasts} />
        </Section>
      ) : null}

      <QuizCta
        href="/"
        label="Complete your remaining quizzes to unlock your Combined Profile"
      />
    </article>
  );
}
