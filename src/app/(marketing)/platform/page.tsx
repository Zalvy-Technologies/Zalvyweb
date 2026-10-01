import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { PLATFORM, type PlatformPillar } from "@/data/platform";
import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHero } from "@/components/layout/page-primitives";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { TrustBand } from "@/components/layout/trust-band";
import { Breadcrumb } from "@/components/layout/page-primitives";

export const metadata: Metadata = buildPageMetadata({
  title: "ZALVY Platform — AI Infrastructure for Production",
  description:
    "ZALVY ships AI agents, enterprise automation, chatbots, inference, custom software, and developer tooling — a single operating fabric across six surfaces.",
  path: "/platform",
});

const platformJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

const PLATFORM_HERO_METRICS = [
  { label: "Models in production", value: "48" },
  { label: "Enterprise customers", value: "120+" },
  { label: "Regions served", value: "14" },
];

function PillarCard({ pillar, index }: { pillar: PlatformPillar; index: number }) {
  return (
    <Reveal as="li" delay={index * 60} animation="blur-in" className="rounded-2xl">
      <Link
        href={`/platform/${pillar.slug}`}
        className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex min-h-[16rem] flex-col justify-between rounded-2xl border p-6 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:transform-none md:p-7"
        aria-label={`${pillar.name}. ${pillar.tagline}`}
      >
        <span
          aria-hidden
          className="duration-base pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(closest-side,rgb(var(--token-accent)/0.06),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100"
        />
        <span className="relative flex flex-col gap-3">
          {pillar.badge ? (
            <Badge variant="iris" size="sm" className="w-fit">
              {pillar.badge}
            </Badge>
          ) : null}
          <span className="t-h3 text-foreground is-balanced">{pillar.name}</span>
          <p className="t-body-sm t-muted leading-snug">{pillar.tagline}</p>
        </span>
        <span className="t-body-sm text-accent duration-quick relative mt-6 inline-flex items-center gap-1.5 transition-transform group-hover:translate-x-0.5">
          Explore
          <Icon icon={ArrowRight} aria-hidden size="xs" />
        </span>
      </Link>
    </Reveal>
  );
}

export default function PlatformPage() {
  return (
    <>
      <JsonLd id="jsonld-platform" data={platformJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Platform", href: "/platform", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Platform"
        title="Six surfaces, one operating fabric."
        description="ZALVY ships AI agents, enterprise automation, and developer tooling across six product surfaces. Every surface shares the same observability plane, the same security posture, and the same engineering team."
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">
                Talk to enterprise
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </>
        }
        metrics={PLATFORM_HERO_METRICS}
      />

      <Section
        id="platform-pillars"
        eyebrow="Surfaces"
        title="Six ways to ship with ZALVY."
        description="Each pillar is a standalone product surface — paired with an operating fabric of security, observability, and engineering support that is shared across every deployment."
        rhythm="default"
      >
        <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
          {PLATFORM.map((pillar, i) => (
            <PillarCard key={pillar.slug} pillar={pillar} index={i} />
          ))}
        </ul>
      </Section>

      <TrustBand />
    </>
  );
}
