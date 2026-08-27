import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllTypePageParams, getTypeContent } from "@/lib/seo/typeContent";
import { getCombinationsForType } from "@/lib/seo/combinationContent";
import { TypePageTemplate } from "@/components/seo/TypePageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, faqJsonLd } from "@/lib/seo/structuredData";

type Params = { locale: string; framework: string; slug: string };

export function generateStaticParams() {
  const typeParams = getAllTypePageParams();
  return routing.locales.flatMap((locale) =>
    typeParams.map(({ frameworkUrlSlug, slug }) => ({ locale, framework: frameworkUrlSlug, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, framework, slug } = await params;
  const content = getTypeContent(framework, slug, locale);
  if (!content) return {};

  const title = `${content.name} (${content.code}) — What It Means | Colevitate`;
  const description = content.description.length > 155 ? `${content.description.slice(0, 152)}...` : content.description;
  const path = `/types/${content.frameworkUrlSlug}/${content.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default async function TypePage({ params }: { params: Promise<Params> }) {
  const { locale, framework, slug } = await params;
  const content = getTypeContent(framework, slug, locale);
  if (!content) notFound();

  const relatedCombinations = getCombinationsForType(content.framework, content.code, locale);
  const path = `/types/${content.frameworkUrlSlug}/${content.slug}`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: `${content.name} (${content.code})`,
          description: content.description,
          url: path,
        })}
      />
      <JsonLd
        data={faqJsonLd([
          { question: `What does ${content.name} mean?`, answer: content.description },
          ...(content.strengths[0]
            ? [{ question: `What's a key strength of ${content.name}?`, answer: content.strengths[0] }]
            : []),
        ])}
      />
      <TypePageTemplate content={content} relatedCombinations={relatedCombinations} />
    </>
  );
}
