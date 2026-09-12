import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Section } from "./Section";
import { QuizCta } from "./QuizCta";
import { PersonAvatar } from "./PersonAvatar";
import { CATEGORY_LABEL, FAMOUS_PEOPLE, type FamousPersonContent } from "@/lib/seo/famousPeopleContent";
import { getTypeContent, FRAMEWORK_URL_SLUGS } from "@/lib/seo/typeContent";
import { ASSESSMENT_CATALOG } from "@/lib/personality/catalog";
import { deriveFamousPersonResults, deriveFamousPersonProfile } from "./famousPersonResults";
import { FamousPersonInsights } from "./FamousPersonInsights";
import { pickComparisonSuggestions } from "@/lib/seo/personComparisonSuggestions";

export async function PersonPageTemplate({ content }: { content: FamousPersonContent }) {
  const primaryFramework = content.typings[0]?.framework ?? "mbti";
  const t = await getTranslations();
  const locale = await getLocale();
  const profile = deriveFamousPersonProfile(content, t, locale);
  const results = deriveFamousPersonResults(content);
  const suggestions = pickComparisonSuggestions(content, FAMOUS_PEOPLE);

  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <Badge variant="outline" className="mb-3 rounded-full">
        {CATEGORY_LABEL[content.category]}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{content.name}</h1>
      <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">{content.years}</p>

      {content.photo ? (
        <figure className="mt-6">
          <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border">
            <Image
              src={content.photo.url}
              alt={content.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 text-xs text-muted-foreground/70">
            {content.photo.attribution} ({content.photo.license}).{" "}
            <a
              href={content.photo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2"
            >
              Source
            </a>
          </figcaption>
        </figure>
      ) : null}

      <p className="mt-6 text-base leading-relaxed text-foreground/90">{content.bio}</p>

      <details className="mt-6 group rounded-2xl border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
        <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
          <span className="inline-flex items-center gap-1.5">
            Editorial disclaimer
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180"
            >
              <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </summary>
        <p className="mt-2">
          The typings below are Colevitate&apos;s own speculative, editorial assessment based on {content.name}&apos;s
          public life, interviews, and biography — not {content.name}&apos;s own quiz result, not a claim about their
          private life, and not a factual statement about who they are.
        </p>
      </details>

      <Section title="How we'd type them">
        <div className="space-y-5">
          {content.typings.map((typing, i) => {
            const frameworkUrlSlug = FRAMEWORK_URL_SLUGS[typing.framework];
            const typeContent = getTypeContent(frameworkUrlSlug, typing.code.toLowerCase());
            const frameworkLabel = ASSESSMENT_CATALOG[typing.framework].label;
            return (
              <div key={`${typing.framework}-${typing.code}-${i}`} className="rounded-2xl border p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {frameworkLabel}
                  </Badge>
                  {typeContent ? (
                    <Link
                      href={`/types/${frameworkUrlSlug}/${typeContent.slug}`}
                      className="text-sm font-medium text-primary underline underline-offset-2"
                    >
                      {typeContent.name}
                    </Link>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{typing.rationale}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {profile ? (
        <FamousPersonInsights name={content.name} gender={content.gender} profile={profile} results={results} />
      ) : null}

      <Section title={`Compare ${content.name}`}>
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((s) => (
            <Link
              key={s.slug}
              href={`/people/match?a=${content.slug}&b=${s.slug}`}
              className="flex items-center gap-2 rounded-full border bg-card py-1.5 pl-1.5 pr-4 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <PersonAvatar person={s} size={28} />
              {s.name}
            </Link>
          ))}
        </div>

        <p className="mt-4 text-center">
          <Link
            href={`/people/match?a=${content.slug}&vs=me`}
            className="text-sm font-medium text-primary underline underline-offset-2"
          >
            Compare your own results with {content.name}
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link
            href={`/people/match?a=${content.slug}`}
            className="text-xs font-medium text-muted-foreground underline underline-offset-2"
          >
            Or search anyone else in our roster
          </Link>
        </p>
      </Section>

      <Separator className="my-8" />

      <QuizCta
        href={`/${ASSESSMENT_CATALOG[primaryFramework].slug}`}
        label={`Take the ${ASSESSMENT_CATALOG[primaryFramework].label} quiz`}
      />
    </article>
  );
}
