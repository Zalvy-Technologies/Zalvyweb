import type { Metadata } from "next";

import { site } from "@/lib/site";

/**
 * Per-route metadata helpers.
 *
 * Centralizing metadata keeps inner pages consistent: every page emits a
 * canonical URL, an alternates list, an OpenGraph payload that localizes the
 * global default, and a Twitter card that inherits the OG image. Pages only
 * supply the page-specific bits — title, description, optional disallow for
 * gated content.
 */
export interface PageMetaInput {
  title: string;
  description: string;
  /** Path relative to the site root — defaults to "/" if unprovided. */
  path?: string;
  /** Set false to mark this page noindex — used for staged/draft surfaces. */
  indexable?: boolean;
  /** OpenGraph image override (absolute path under /public). */
  ogImage?: string;
}

const DEFAULT_INDEX = true;

export function buildPageMetadata({
  title,
  description,
  path = "/",
  indexable = DEFAULT_INDEX,
  ogImage,
}: PageMetaInput): Metadata {
  const url = new URL(path, site.url).toString();
  const image = ogImage ?? site.ogImage;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: site.twitterHandle,
      creator: site.twitterHandle,
      title: `${title} — ${site.name}`,
      description,
      images: [image],
    },
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: { index: indexable, follow: indexable, "max-image-preview": "large" },
    },
  };
}
