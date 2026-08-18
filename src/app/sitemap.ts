import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo/siteConfig";
import { getAllTypePageParams } from "@/lib/seo/typeContent";
import { getAllCombinationSlugs } from "@/lib/seo/combinationContent";

// Builds one sitemap entry per locale for a given internal href, with
// `alternates.languages` pointing at every other locale's URL for the same
// page — this is what tells search engines the pages are translations of
// each other rather than duplicate content.
function localizedEntries(href: string): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}${getPathname({ href, locale })}`])
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${getPathname({ href, locale })}`,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/types"];

  const typePaths = getAllTypePageParams().map(
    ({ frameworkUrlSlug, slug }) => `/types/${frameworkUrlSlug}/${slug}`
  );

  const combinationPaths = getAllCombinationSlugs().map((slug) => `/types/combinations/${slug}`);

  return [...staticPaths, ...typePaths, ...combinationPaths].flatMap(localizedEntries);
}
