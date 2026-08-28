// Discovers the site's routes: tries the sitemap first, falls back to a
// shallow crawl of internal links from the homepage.
//
// Sitemaps commonly hardcode the production origin in <loc> regardless of
// which host served the XML (this site's does, via a fixed site-URL
// constant) — rewritten onto baseUrl's origin so a local/staging run
// actually exercises the server under test instead of silently hitting
// production.
function rewriteOrigin(url, baseUrl) {
  try {
    const target = new URL(url);
    const base = new URL(baseUrl);
    target.protocol = base.protocol;
    target.host = base.host;
    return target.toString();
  } catch {
    return url;
  }
}

export async function getRoutes(baseUrl) {
  for (const path of ['/sitemap-index.xml', '/sitemap.xml']) {
    try {
      const res = await fetch(baseUrl + path);
      if (!res.ok) continue;
      const xml = await res.text();
      const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => rewriteOrigin(m[1], baseUrl));
      if (!locs.length) continue;

      if (path === '/sitemap-index.xml') {
        const all = [];
        for (const sub of locs) {
          const subRes = await fetch(sub);
          if (subRes.ok) {
            const subXml = await subRes.text();
            all.push(...[...subXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => rewriteOrigin(m[1], baseUrl)));
          }
        }
        if (all.length) return [...new Set(all)];
      } else {
        return [...new Set(locs)];
      }
    } catch {
      // try the next strategy
    }
  }

  // Fallback: shallow crawl from the homepage
  const res = await fetch(baseUrl);
  const html = await res.text();
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => baseUrl + m[1]);
  return [...new Set([baseUrl, ...hrefs])];
}
