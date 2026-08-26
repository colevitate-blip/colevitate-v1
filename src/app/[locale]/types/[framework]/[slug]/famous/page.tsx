import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllTypePageParams, getTypeContent, type TypePageContent } from "@/lib/seo/typeContent";
import { getFamousPeopleByTyping } from "@/lib/seo/famousPeopleContent";
import { FamousTypeTemplate } from "@/components/seo/FamousTypeTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, itemListJsonLd } from "@/lib/seo/structuredData";

type Params = { locale: string; framework: string; slug: string };

/** "Famous INTJs" / "Famous Blue Types" / "Famous People High in Openness" / "Famous Generators" — a headline that reads naturally for each framework's code shape. */
function famousHeadline(content: TypePageContent): string {
  switch (content.framework) {
    case "mbti":
      return `Famous ${content.code}s`;
    case "colors":
      return `Famous ${content.code.charAt(0).toUpperCase()}${content.code.slice(1)} Types`;
    case "humandesign":
      return `Famous ${content.name.replace(/^The /, "")}s`;
    case "bigfive": {
      const [, level] = content.code.split("-");
      const traitLabel = content.name.split(" — ")[0].replace(/^High |^Low /, "");
      return `Famous People ${level === "high" ? "High in" : "Low in"} ${traitLabel}`;
    }
  }
}

function typeParamsWithFamousMatches() {
  return getAllTypePageParams().filter(({ frameworkUrlSlug, slug }) => {
    const content = getTypeContent(frameworkUrlSlug, slug);
    return !!content && getFamousPeopleByTyping(content.framework, content.code).length > 0;
  });
}

export function generateStaticParams() {
  const typeParams = typeParamsWithFamousMatches();
  return routing.locales.flatMap((locale) =>
    typeParams.map(({ frameworkUrlSlug, slug }) => ({ locale, framework: frameworkUrlSlug, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { framework, slug } = await params;
  const content = getTypeContent(framework, slug);
  if (!content) return {};
  const people = getFamousPeopleByTyping(content.framework, content.code);
  if (people.length === 0) return {};

  const headline = famousHeadline(content);
  const description = `${people.length} well-known ${people.length === 1 ? "person" : "people"} Colevitate editorially types as ${content.name} — ${people.map((p) => p.name).join(", ")}.`;
  const path = `/types/${content.frameworkUrlSlug}/${content.slug}/famous`;

  return {
    title: `${headline} | Colevitate`,
    description: description.length > 155 ? `${description.slice(0, 152)}...` : description,
    alternates: { canonical: path },
    openGraph: { title: `${headline} | Colevitate`, description, url: path },
  };
}

export default async function FamousTypePage({ params }: { params: Promise<Params> }) {
  const { framework, slug } = await params;
  const content = getTypeContent(framework, slug);
  if (!content) notFound();

  const people = getFamousPeopleByTyping(content.framework, content.code);
  if (people.length === 0) notFound();

  const headline = famousHeadline(content);
  const path = `/types/${content.frameworkUrlSlug}/${content.slug}/famous`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline,
          description: `Well-known people Colevitate editorially types as ${content.name}.`,
          url: path,
        })}
      />
      <JsonLd data={itemListJsonLd(people.map((p) => ({ name: p.name, url: `/people/${p.slug}` })))} />
      <FamousTypeTemplate content={content} headline={headline} people={people} />
    </>
  );
}
