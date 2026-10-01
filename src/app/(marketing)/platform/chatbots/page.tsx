import type { Metadata } from "next";

import { PillarPage } from "@/components/layout/pillar-page";
import { platformBySlug } from "@/data/platform";
import { buildPageMetadata } from "@/lib/page-metadata";

const pillar = platformBySlug("chatbots");

export const metadata: Metadata = pillar
  ? buildPageMetadata({
      title: `${pillar.name} — ZALVY Platform`,
      description: pillar.metaDescription,
      path: "/platform/chatbots",
    })
  : {};

export default function ChatbotsPage() {
  if (!pillar) return null;
  return <PillarPage pillar={pillar} />;
}
