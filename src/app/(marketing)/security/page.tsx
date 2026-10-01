import type { Metadata } from "next";
import { ArrowRight, FileText, Key, ShieldCheck } from "lucide-react";

import { TRUST_POINTS } from "@/data/trust-points";
import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb, CtaCard, PageHero } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

export const metadata: Metadata = buildPageMetadata({
  title: "ZALVY Security — Production-Grade Security for Production-Grade AI",
  description:
    "ZALVY operates on a shared security fabric: SOC 2 Type II, HIPAA BAA available, workspace isolation, TLS 1.3, AES-256, and structured audit logging. Security ships with every deployment.",
  path: "/security",
});

const securityJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

export default function SecurityPage() {
  return (
    <>
      <JsonLd id="jsonld-security" data={securityJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Security", href: "/security", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Trust"
        title="Production-grade security for production-grade AI."
        description="ZALVY operates on a shared security fabric across all six product surfaces. Workspace isolation, per-customer encryption keys, structured audit logging, and SOC 2 Type II certification are not tier-gated — they ship with every deployment."
      />

      <Section id="posture" rhythm="default">
        <p className="t-body-lg t-muted mb-12 max-w-[42rem] leading-relaxed">
          ZALVY operates on a shared security fabric across all six product surfaces. Workspace
          isolation, per-customer encryption keys, structured audit logging, and SOC 2 Type II
          certification are not tier-gated — they ship with every deployment. Reports are available
          to Enterprise customers under MNDA via the ZALVY Trust Center.
        </p>
        <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((point, i) => (
            <Reveal
              key={point.title}
              as="li"
              delay={i * 60}
              animation="blur-in"
              className="rounded-2xl"
            >
              <div className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex h-full flex-col gap-3 rounded-2xl border p-6 transition-[background-color,border-color] duration-300">
                <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset">
                  <Icon icon={point.icon} aria-hidden />
                </span>
                <h3 className="t-h5 text-foreground is-balanced">{point.title}</h3>
                <p className="t-body-sm t-muted leading-snug">{point.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="architecture" surface="veil" rhythm="default">
        <h2 className="t-h2 text-foreground is-balanced mb-4">Security architecture</h2>
        <p className="t-body-lg t-muted mb-12 max-w-[42rem]">
          ZALVY operates on a shared security fabric across all six product surfaces. Workspace
          isolation, per-customer encryption keys, structured audit logging, and SOC 2 Type II
          certification are not tier-gated — they ship with every deployment.
        </p>
        <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
          {[
            {
              title: "Workspace isolation",
              body: "Data, memory, and model context are partitioned per workspace. No cross-customer data sharing, no shared training corpora. PHI handling is isolated per workspace for HIPAA-enabled accounts.",
              icon: ShieldCheck,
            },
            {
              title: "Encryption at rest and in transit",
              body: "TLS 1.3 for all traffic; AES-256 for stored data. Customer-managed keys available on Enterprise. Every data object is encrypted with a workspace-scoped key — no shared encryption materially between customers.",
              icon: Key,
            },
            {
              title: "Audit logging",
              body: "Every model invocation, tool call, and data access comparison emits a structured, immutable audit record. Logs are exportable via OTel and retained for the duration of your engagement plus the legal retention period.",
              icon: FileText,
            },
          ].map((item, i) => (
            <Reveal
              key={item.title}
              as="li"
              delay={i * 60}
              animation="blur-in"
              className="rounded-2xl"
            >
              <div className="bg-surface-raised border-border hover:border-border-strong flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors duration-300">
                <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset">
                  <Icon icon={item.icon} aria-hidden />
                </span>
                <h3 className="t-h4 text-foreground">{item.title}</h3>
                <p className="t-body-sm t-muted leading-snug">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <TrustBand />

      <CtaCard
        title="Request a security review."
        description="SOC 2 Type II reports, HIPAA BAAs, and penetration test summaries available to Enterprise customers under MNDA. Contact our Trust team — we respond from engineers who built the system."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">
              Talk to enterprise
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
        secondary={
          <Button asChild variant="secondary" size="lg">
            <Link href="/legal/dpa">Read the DPA</Link>
          </Button>
        }
      />
    </>
  );
}
