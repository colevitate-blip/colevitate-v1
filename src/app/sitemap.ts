import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo/siteConfig";
import { getAllTypePageParams, getTypeContent } from "@/lib/seo/typeContent";
import { getAllCombinationSlugs } from "@/lib/seo/combinationContent";
import { getAllFamousPeopleSlugs, getFamousPeopleByTyping } from "@/lib/seo/famousPeopleContent";

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
  const staticPaths = ["/", "/types", "/people", "/for-teams"];

  const typePaths = getAllTypePageParams().map(
    ({ frameworkUrlSlug, slug }) => `/types/${frameworkUrlSlug}/${slug}`
  );

  const combinationPaths = getAllCombinationSlugs().map((slug) => `/types/combinations/${slug}`);

  const peoplePaths = getAllFamousPeopleSlugs().map((slug) => `/people/${slug}`);

  const famousTypePaths = getAllTypePageParams()
    .filter(({ frameworkUrlSlug, slug }) => {
      const content = getTypeContent(frameworkUrlSlug, slug);
      return !!content && getFamousPeopleByTyping(content.framework, content.code).length > 0;
    })
    .map(({ frameworkUrlSlug, slug }) => `/types/${frameworkUrlSlug}/${slug}/famous`);

  return [...staticPaths, ...typePaths, ...combinationPaths, ...peoplePaths, ...famousTypePaths].flatMap(
    localizedEntries
  );
}
