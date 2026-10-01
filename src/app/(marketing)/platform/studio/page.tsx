import type { Metadata } from "next";

import { PillarPage } from "@/components/layout/pillar-page";
import { platformBySlug } from "@/data/platform";
import { buildPageMetadata } from "@/lib/page-metadata";

const pillar = platformBySlug("studio");

export const metadata: Metadata = pillar
  ? buildPageMetadata({
      title: `${pillar.name} — ZALVY Platform`,
      description: pillar.metaDescription,
      path: "/platform/studio",
    })
  : {};

export default function CustomSoftwarePage() {
  if (!pillar) return null;
  return <PillarPage pillar={pillar} />;
}
