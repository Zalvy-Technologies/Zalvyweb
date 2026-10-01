import { type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { JsonLd } from "@/components/ui/json-ld";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";
import {
  Breadcrumb,
  CtaCard,
  FeatureGrid,
  PageHero,
  StatRow,
} from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { breadcrumbSchema, graphSchema, organizationSchema, productSchema } from "@/lib/json-ld";
import type { PlatformPillar } from "@/data/platform";

interface PillarPageProps {
  pillar: PlatformPillar;
}

/**
 * `PillarPage` — shared body composer for all six ZALVY platform pages.
 *
 * Each platform route renders this component with a typed `PlatformPillar`.
 * The composer decides:
 *  - PageHero (eyebrow, badge, headline, description, actions, metrics).
 *  - FeatureGrid (three documented capabilities).
 *  - StatRow (proof band).
 *  - A pull-quote (real-voiced, single per page).
 *  - The cross-pillar trust band (shared `TRUST_POINTS`).
 *  - The campaign CTA card.
 *  - JSON-LD graph (Organization + SoftwareApplication + Breadcrumb).
 *
 * The page is server-only. Animations are gated by motion.css + Reveal.
 */
export function PillarPage({ pillar }: PillarPageProps): ReactNode {
  const jsonLd = graphSchema([
    organizationSchema(),
    productSchema({
      slug: pillar.slug,
      name: `${process.env.NEXT_PUBLIC_SITE_NAME ?? "ZALVY"} ${pillar.name}`,
      description: pillar.metaDescription,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Platform", path: "/platform" },
      { name: pillar.name, path: `/platform/${pillar.slug}` },
    ]),
  ]);

  const merchEyebrow = pillar.sectionEyebrow;
  const merchTitle = pillar.sectionTitle;
  const merchDescription = pillar.sectionDescription;

  return (
    <>
      <JsonLd id={`jsonld-${pillar.slug}`} data={jsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Platform", href: "/platform" },
            { label: pillar.name, href: `/platform/${pillar.slug}`, current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow={pillar.eyebrow}
        badge={pillar.badge}
        title={pillar.headline}
        description={pillar.heroDescription}
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">
                Talk to enterprise
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={`/platform/${pillar.slug}/docs`} external>
                Read the docs
                <Icon icon={ArrowUpRight} size="sm" aria-hidden />
              </Link>
            </Button>
          </>
        }
      />

      <Section
        id={`${pillar.slug}-features`}
        eyebrow={merchEyebrow}
        title={merchTitle}
        description={merchDescription}
        rhythm="default"
      >
        <FeatureGrid items={pillar.features} columns={3} />
      </Section>

      <StatRow stats={pillar.metrics} surface="veil" />

      <Section id={`${pillar.slug}-quote`} rhythm="compact" align="center">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
          <blockquote className="t-h3 md:t-h2 text-foreground is-balanced font-display leading-[1.18] tracking-tight">
            <p>{pillar.quote.body}</p>
          </blockquote>
          <figcaption className="flex flex-col items-center gap-1">
            <p className="t-body text-foreground font-medium">{pillar.quote.author}</p>
            <p className="t-body-sm t-muted">{pillar.quote.role}</p>
          </figcaption>
        </Reveal>
      </Section>

      <TrustBand />

      <CtaCard
        title={`Ship ${pillar.name} to production.`}
        description="We respond within one business day from engineers on the team. No qualification calls, no SDR funnel."
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
            <Link href="/pricing">See pricing</Link>
          </Button>
        }
      />
    </>
  );
}
