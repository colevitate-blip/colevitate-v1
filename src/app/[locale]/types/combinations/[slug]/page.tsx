import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllCombinationSlugs, getCombinationContent, resolveTypeRef } from "@/lib/seo/combinationContent";
import { CombinationPageTemplate } from "@/components/seo/CombinationPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/seo/structuredData";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  const slugs = getAllCombinationSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const content = getCombinationContent(slug, locale);
  if (!content) return {};

  const description = content.summary.length > 155 ? `${content.summary.slice(0, 152)}...` : content.summary;
  const path = `/types/combinations/${content.slug}`;

  return {
    title: `${content.headline} | Colevitate`,
    description,
    alternates: { canonical: path },
    openGraph: { title: content.headline, description, url: path },
  };
}

export default async function CombinationPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const content = getCombinationContent(slug, locale);
  if (!content) notFound();

  const typeA = resolveTypeRef(content.a, locale);
  const typeB = resolveTypeRef(content.b, locale);
  if (!typeA || !typeB) notFound();

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: content.headline,
          description: content.summary,
          url: `/types/combinations/${content.slug}`,
        })}
      />
      <CombinationPageTemplate content={content} typeA={typeA} typeB={typeB} />
    </>
  );
}
