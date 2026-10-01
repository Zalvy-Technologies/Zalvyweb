import type { Metadata } from "next";

import { PillarPage } from "@/components/layout/pillar-page";
import { platformBySlug } from "@/data/platform";
import { buildPageMetadata } from "@/lib/page-metadata";

const pillar = platformBySlug("tools");

export const metadata: Metadata = pillar
  ? buildPageMetadata({
      title: `${pillar.name} — ZALVY Platform`,
      description: pillar.metaDescription,
      path: "/platform/tools",
    })
  : {};

export default function DeveloperToolsPage() {
  if (!pillar) return null;
  return <PillarPage pillar={pillar} />;
}
