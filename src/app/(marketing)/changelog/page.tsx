import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { CHANGELOG } from "@/data/changelog";
import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb, CtaCard, PageHero } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

export const metadata: Metadata = buildPageMetadata({
  title: "ZALVY Changelog — Every Shipment Documented",
  description:
    "Per-shipment changelog for the ZALVY platform. Every deployed agent, workflow, and SDK improvement documented with version, date, and full change list.",
  path: "/changelog",
});

const changelogJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

const typeVariant: Record<string, "accent" | "iris" | "success" | "danger"> = {
  feature: "accent",
  improvement: "iris",
  fix: "success",
  breaking: "danger",
};

const typeLabel: Record<string, string> = {
  feature: "Feature",
  improvement: "Improvement",
  fix: "Fix",
  breaking: "Breaking",
};

export default function ChangelogPage() {
  return (
    <>
      <JsonLd id="jsonld-changelog" data={changelogJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Changelog", href: "/changelog", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Engineering"
        title="Every shipment documented."
        description="ZALVY emits a structured change record for every deployed agent, workflow, SDK, and platform update. The same view that ship is available to engineers and customers — identical changelog, identical record."
      />

      <Section id="changelog-list" rhythm="default">
        <ul className="list-none space-y-8 p-0">
          {CHANGELOG.map((entry, i) => (
            <Reveal key={entry.version} as="li" delay={i * 60} animation="blur-in">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-accent font-mono text-base font-medium whitespace-nowrap">
                    {entry.version}
                  </span>
                  <span className="t-caption t-subtle tracking-widest whitespace-nowrap uppercase">
                    {formatDate(entry.date)}
                  </span>
                  <Badge variant={typeVariant[entry.type] ?? "neutral"} size="sm">
                    {typeLabel[entry.type] ?? entry.type}
                  </Badge>
                </div>
                <h3 className="t-h3 text-foreground">{entry.title}</h3>
                <ul className="list-none space-y-2 p-0">
                  {entry.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="bg-foreground-muted mt-1.5 inline-flex size-1.5 shrink-0 rounded-full"
                      />
                      <span className="t-body-sm t-muted leading-relaxed">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <TrustBand />

      <CtaCard
        title="This changelog ships with every ZALVY subscription."
        description="When a new version ships, you see the same structured record that we do. Explore the platform to see what a changelog-powered deployment looks like."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="/platform">
              Explore the platform
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
        secondary={
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">Talk to us</Link>
          </Button>
        }
      />
    </>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
