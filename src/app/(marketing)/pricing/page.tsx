import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb, CtaCard, PageHero } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Pricing } from "@/components/sections/pricing";

export const metadata: Metadata = buildPageMetadata({
  title: "ZALVY Pricing — Plans That Support the People Who Run It",
  description:
    "ZALVY bills are based on value shown by engineering time recovered and live observability. Starter, Teams, and Enterprise plans with transparent pricing and annual savings.",
  path: "/pricing",
});

const pricingJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

export default function PricingPage() {
  return (
    <>
      <JsonLd id="jsonld-pricing" data={pricingJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Pricing", href: "/pricing", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Pricing"
        title="Plans that support the people who run it."
        description="Three transparent tiers — Starter, Teams, and Enterprise. Every plan includes the ZALVY engineering network. Annual billing saves 17%."
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">
                Talk to enterprise
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/platform">Explore the platform</Link>
            </Button>
          </>
        }
      />

      <Pricing />

      <TrustBand />

      <CtaCard
        title="Not sure which plan fits your team?"
        description="We respond within one business day from engineers on the team. No qualification calls — just a conversation about what you want to build."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">
              Talk to us
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
        secondary={
          <Button asChild variant="secondary" size="lg">
            <Link href="/studio/work">See case studies</Link>
          </Button>
        }
      />
    </>
  );
}
