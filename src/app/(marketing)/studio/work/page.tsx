import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { CASE_STUDIES } from "@/data/studio";
import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema, serviceSchema } from "@/lib/json-ld";
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
  title: "ZALVY Studio Work — Production AI Engineering Engagements",
  description:
    "Selected work from ZALVY Studio — healthcare claims routing, quantitative research orchestration, and industrial robotics inference. Engagements are anonymized; figures are representative.",
  path: "/studio/work",
});

const caseStudiesJsonLd = graphSchema([
  organizationSchema(),
  websiteSchema(),
  serviceSchema({
    slug: "studio/work",
    name: "ZALVY Studio Case Studies",
    description:
      "Production AI engineering case studies — Helios agent routing, Quanta research ops, Aperture inference serving. Measured outcomes with real numbers.",
    serviceType: "AI Engineering Services",
  }),
]);

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd id="jsonld-case-studies" data={caseStudiesJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Studio", href: "/studio" },
            { label: "Case Studies", href: "/studio/work", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Studio Work"
        title="Selected engagements, representative outcomes."
        description="Each engagement begins with a paid research brief, a written success metric, and an architecture review — and ends with software that runs in production. Client identities are anonymized for confidentiality and figures illustrate representative outcomes."
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">
                Talk to us
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
          </>
        }
      />

      <Section id="case-studies-list" rhythm="default">
        <ul className="grid list-none grid-cols-1 gap-4 p-0">
          {CASE_STUDIES.map((study, i) => (
            <Reveal key={study.slug} as="li" delay={i * 80} animation="blur-in">
              <Link
                href={`/studio/work/${study.slug}`}
                className="group border-border bg-surface-raised hover:border-border-strong hover:bg-surface-overlay relative flex min-h-[18rem] flex-col justify-between rounded-2xl border p-6 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:shadow-lg motion-reduce:transition-none md:min-h-[20rem] md:p-8"
                aria-label={`${study.customer}: ${study.title}`}
              >
                <div
                  aria-hidden
                  className="duration-base pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(60%_70%_at_50%_0%,rgb(var(--token-accent)/0.06),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="relative flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral">{study.sector}</Badge>
                    <span className="text-foreground-muted group-hover:text-accent transition-colors">
                      <Icon icon={ArrowUpRight} aria-hidden />
                    </span>
                  </div>
                  <div>
                    <p className="t-overline t-subtle tracking-widest uppercase">
                      {study.customer}
                    </p>
                    <h3 className="t-h3 text-foreground is-balanced mt-1">{study.title}</h3>
                    <p className="t-body t-muted mt-4 max-w-prose leading-relaxed">
                      {study.summary}
                    </p>
                  </div>
                </div>
                <dl className="t-num-tabular relative mt-6 flex flex-col gap-0.5">
                  <dt className="text-overline t-subtle tracking-widest uppercase">
                    {study.results[0]?.label}
                  </dt>
                  <dd className="t-h2 t-gradient-iris">{study.results[0]?.value}</dd>
                </dl>
                <span
                  aria-hidden
                  className="bg-surface text-foreground-muted ring-border group-hover:text-accent group-hover:border-border-strong absolute right-7 bottom-7 inline-flex size-12 items-center justify-center rounded-xl ring-1 transition-colors ring-inset"
                >
                  <Icon icon={study.icon} aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <TrustBand />

      <CtaCard
        title="Want results like these for your team?"
        description="Each engagement begins with a paid research brief and a success metric agreed in writing. We respond within one business day from engineers on the team."
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
            <Link href="/studio/process">See the process</Link>
          </Button>
        }
      />
    </>
  );
}
