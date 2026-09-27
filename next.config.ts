import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // /types merged into /learn. The two indexes were near duplicates over the
  // same four frameworks, so the type pages moved one level under the
  // explainer they belong to: /types/<framework>/<type> ->
  // /learn/<framework>/<type> (and its /famous child), and
  // /types/combinations/<slug> -> /learn/combinations/<slug>.
  //
  // Every one of those is in sitemap.ts and indexable, so they redirect
  // permanently rather than 404. The bare /types rule comes first because
  // :path* also matches zero segments, which would otherwise send /types to
  // /learn/ with a trailing slash. Two rules per shape because localePrefix
  // is "always": real traffic arrives as /en/types/..., but bare /types/...
  // is still reachable (an old copy-pasted link, a crawler that dropped the
  // prefix) and next-intl would locale-prefix it into a 404 before anything
  // redirected it. The locale rule is listed first within each shape so the
  // prefixed form never falls through to the bare one and loses its locale.
  async redirects() {
    const shapes = [
      ["/types", "/learn"],
      ["/types/:path*", "/learn/:path*"],
    ];
    return shapes.flatMap(([source, destination]) => [
      { source: `/:locale(en|es|zh|fr|de)${source}`, destination: `/:locale${destination}`, permanent: true },
      { source, destination, permanent: true },
    ]);
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/commons/**",
        search: "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
