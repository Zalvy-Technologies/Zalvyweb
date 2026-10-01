import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Standard robots policy — fully crawlable marketing surface, rep listens back
 * via the explicit sitemap entry. Product (authenticated) routes are gated in
 * those route segments, not here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/studio/notes/draft/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
