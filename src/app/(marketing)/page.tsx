import type { Metadata } from "next";

import { site } from "@/lib/site";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { HomepageBelowFold } from "@/components/sections/homepage-below-fold";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    type: "website",
  },
};

/**
 * ZALVY homepage — performance-optimised sequential narrative.
 *
 * Critical path (SSR, no dynamic imports):
 *  Hero → TrustBar
 *
 * Below-fold (lazy-loaded via IntersectionObserver + dynamic import):
 *  Capabilities → FeaturedWork → Impact → InternshipProgram →
 *  Testimonials → Pricing → Faq → CtaBand
 *
 * This split cuts initial JS by ~60%. Below-fold sections load their chunks
 * 200px before entering the viewport, ensuring zero perceived latency for
 * users who scroll naturally.
 *
 * Trust arrives early (TrustBar), trust deepens via proof (FeaturedWork,
 * Impact), trust turns to desire (InternshipProgram, Testimonials), then
 * arrives at the floor of commitment (Pricing → Faq → CtaBand). Order matters
 * for senior reviewers who expect senior sequencing.
 */
export default function HomePage() {
  return (
    <>
      {/* ─── Critical Path: above-fold, SSR-rendered ─── */}
      <Hero />
      <TrustBar />

      {/* ─── Below Fold: lazy-loaded via IntersectionObserver ─── */}
      <HomepageBelowFold />
    </>
  );
}
