import type { Metadata } from "next";
import { ArrowRight, Clock, Microscope, Users } from "lucide-react";

import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema, serviceSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb, CtaCard, PageHero, StatRow } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

export const metadata: Metadata = buildPageMetadata({
  title: "ZALVY Studio — Selected Engagements With Engineers Who Ship",
  description:
    "ZALVY Studio takes on a small number of high-leverage engineering engagements per year. Each begins with a paid research brief and ends with software that runs in production.",
  path: "/studio",
});

const studioJsonLd = graphSchema([
  organizationSchema(),
  websiteSchema(),
  serviceSchema({
    slug: "studio",
    name: "ZALVY Studio",
    description:
      "High-leverage AI engineering engagements — from research brief through architecture review, production deploy, and quarterly operation review.",
    serviceType: "AI Engineering Services",
  }),
]);

const ENGAGEMENT_STATS = [
  {
    value: "3",
    label: "Flagship engagements",
    caption: "Taken on per year — each scoped for measurable operational impact.",
  },
  {
    value: "14 weeks",
    label: "Median engagement",
    caption: "From research brief to production deploy with evals.",
  },
  {
    value: "4",
    label: "ZALVY engineers per team",
    caption: "Paired with domain experts from your engineering org.",
  },
  {
    value: "100%",
    label: "Production deploy rate",
    caption: "Every engagement ships software that runs in production.",
  },
];

const ENGAGEMENT_CARDS = [
  {
    title: "Research brief",
    description:
      "Two weeks of paid discovery — we instrument your existing pipeline, produce a labeled dataset, and ship a written brief with a success metric agreed in writing.",
    icon: Microscope,
  },
  {
    title: "Architecture review",
    description:
      "A single living design document that maps every component, every failure mode, and the observability plane. Shared between ZALVY and your team, updated as the system evolves.",
    icon: Users,
  },
  {
    title: "Quarterly operation review",
    description:
      "Every engagement closes with a written review: did we hit the success metric? What would we not build again? Published with customer consent so the lessons compound.",
    icon: Clock,
  },
];

export default function StudioPage() {
  return (
    <>
      <JsonLd id="jsonld-studio" data={studioJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Studio", href: "/studio", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Studio"
        title="Selected engagements with engineers who ship."
        description="ZALVY Studio takes on a small number of high-leverage engineering engagements per year. Each begins with a paid research brief, a written success metric, and an architecture review — and ends with software that runs in production, cost telemetry, and a quarterly operation review published with your consent."
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">
                Talk to us
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/studio/work">See case studies</Link>
            </Button>
          </>
        }
      />

      <StatRow stats={ENGAGEMENT_STATS} surface="veil" />

      <Section
        id="engagement-model"
        eyebrow="How we work"
        title="Three anchors of every ZALVY Studio engagement."
        description="The model is designed to surface risk early, ship to production fast, and publish lessons so the next engagement compounds — not repeats."
        rhythm="default"
      >
        <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
          {ENGAGEMENT_CARDS.map((card, i) => (
            <Reveal
              key={card.title}
              as="li"
              delay={i * 60}
              animation="blur-in"
              className="rounded-2xl"
            >
              <div className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex h-full flex-col gap-3 rounded-2xl border p-6 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:shadow-lg motion-reduce:transition-none md:p-7">
                <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset">
                  <Icon icon={card.icon} aria-hidden />
                </span>
                <h3 className="t-h4 text-foreground is-balanced">{card.title}</h3>
                <p className="t-body-sm t-muted leading-snug">{card.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="studio-nav" rhythm="compact" align="center">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/studio/work"
            className="group border-border bg-surface hover:bg-surface-overlay hover:border-border-strong duration-quick inline-flex items-center gap-2 rounded-xl border px-5 py-3 transition-colors"
          >
            <span className="t-body text-foreground font-medium">Case studies</span>
            <Icon
              icon={ArrowRight}
              aria-hidden
              size="sm"
              className="text-foreground-muted group-hover:text-accent transition-colors"
            />
          </Link>
          <Link
            href="/studio/process"
            className="group border-border bg-surface hover:bg-surface-overlay hover:border-border-strong duration-quick inline-flex items-center gap-2 rounded-xl border px-5 py-3 transition-colors"
          >
            <span className="t-body text-foreground font-medium">Our process</span>
            <Icon
              icon={ArrowRight}
              aria-hidden
              size="sm"
              className="text-foreground-muted group-hover:text-accent transition-colors"
            />
          </Link>
          <Link
            href="/studio/notes"
            className="group border-border bg-surface hover:bg-surface-overlay hover:border-border-strong duration-quick inline-flex items-center gap-2 rounded-xl border px-5 py-3 transition-colors"
          >
            <span className="t-body text-foreground font-medium">Engineering notes</span>
            <Icon
              icon={ArrowRight}
              aria-hidden
              size="sm"
              className="text-foreground-muted group-hover:text-accent transition-colors"
            />
          </Link>
          <Link
            href="/studio/oss"
            className="group border-border bg-surface hover:bg-surface-overlay hover:border-border-strong duration-quick inline-flex items-center gap-2 rounded-xl border px-5 py-3 transition-colors"
          >
            <span className="t-body text-foreground font-medium">Open source</span>
            <Icon
              icon={ArrowRight}
              aria-hidden
              size="sm"
              className="text-foreground-muted group-hover:text-accent transition-colors"
            />
          </Link>
        </div>
      </Section>

      <TrustBand />

      <CtaCard
        title="Ready to scope an engagement?"
        description="We respond within one business day from engineers on the team. No qualification calls — just a conversation about what you want to ship."
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
