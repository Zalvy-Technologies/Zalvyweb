import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";

import { PROCESS_STEPS } from "@/data/studio";
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
  title: "ZALVY Studio Process — How We Scope, Build, and Ship",
  description:
    "Five phases: research brief, architecture review, first production deploy, feature iteration, and quarterly operation review. Every step instrumented, documented, and reviewable.",
  path: "/studio/process",
});

const processJsonLd = graphSchema([
  organizationSchema(),
  websiteSchema(),
  serviceSchema({
    slug: "studio/process",
    name: "ZALVY Studio Engagement Process",
    description:
      "Five-phase AI engineering engagement process: research brief, architecture review, first production deploy, feature iteration, quarterly operation review. Measured outcomes ship with every phase.",
    serviceType: "AI Engineering Services",
  }),
]);

export default function ProcessPage() {
  return (
    <>
      <JsonLd id="jsonld-process" data={processJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Studio", href: "/studio" },
            { label: "Process", href: "/studio/process", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Process"
        title="Five phases from brief to quarterly review."
        description="The ZALVY Studio engagement model is structured to surface risk early, ship to production fast, and publish lessons so the next engagement compounds — not repeats outcomes of previous iterations."
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

      <Section id="process-steps" rhythm="default">
        <ol className="grid list-none grid-cols-1 gap-6 p-0">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal
              key={step.step}
              as="li"
              delay={i * 80}
              animation="blur-in"
              className="rounded-2xl"
            >
              <div className="group bg-surface-raised border-border hover:border-border-strong relative flex flex-col gap-5 rounded-2xl border p-6 transition-colors duration-300 md:p-8">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset"
                  >
                    <Icon icon={step.icon} aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="t-eyebrow" data-eyebrow>
                        Phase {step.step}
                      </span>
                      <Badge variant="iris" size="sm">
                        {step.duration}
                      </Badge>
                    </div>
                    <h3 className="t-h3 text-foreground">{step.title}</h3>
                  </div>
                </div>

                <div className="ml-0 flex flex-col gap-4 md:ml-16">
                  <p className="t-body-lg t-muted leading-relaxed">{step.description}</p>
                  <p className="t-body t-muted leading-relaxed">{step.detail}</p>

                  <div className="bg-surface border-border mt-2 flex items-start gap-3 rounded-xl border p-4">
                    <span className="bg-accent-subtle text-accent ring-accent/15 mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset">
                      <Icon icon={Check} size="xs" aria-hidden />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="t-body-sm text-foreground font-medium">
                        Phase {step.step} output
                      </span>
                      <span className="t-body-sm t-muted leading-snug">{step.output}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <TrustBand />

      <CtaCard
        title="Ready to begin with a research brief?"
        description="Phase 1 is two weeks of paid discovery. You own the brief whether or not we proceed to build. We respond within one business day."
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
