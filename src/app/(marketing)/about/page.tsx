import type { Metadata } from "next";
import { ArrowRight, Cpu, Eye, GraduationCap, Scale, Target, Users } from "lucide-react";

import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema } from "@/lib/json-ld";
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
  title: "About ZALVY — Building Intelligent Systems, Empowering Future Talent",
  description:
    "ZALVY engineers autonomous AI agent swarms, resilient business automation pipelines, and empowers top future engineering talent through rigorous 1:1 apprenticeship.",
  path: "/about",
});

const aboutJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

const ABOUT_METRICS = [
  { value: "2024", label: "Founded", caption: "Autonomous AI & Automation." },
  { value: "99.8%", label: "Deterministic Accuracy", caption: "Policy-gated DAG execution." },
  { value: "48+", label: "Enterprise Connectors", caption: "Across ERPs, CRMs & Lakehouses." },
  { value: "12 / Cohort", label: "Apprenticeship Seats", caption: "1:1 Staff Engineering Mentorship." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd id="jsonld-about" data={aboutJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Company Philosophy"
        title="Building Intelligent Systems. Empowering Future Talent."
        description="ZALVY was founded on a singular conviction: autonomous AI and business automation must be engineered with deterministic rigor, zero hallucination drift, and observable safety gates. Alongside building production systems, we cultivate world-class engineering talent through intensive, hands-on apprenticeship."
      />

      <Section id="mission" rhythm="default">
        <h2 className="t-h2 text-foreground is-balanced mb-8">Two missions, one unified discipline.</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal delay={0} animation="blur-in" className="rounded-2xl">
            <div className="bg-surface-raised border-border flex h-full flex-col gap-4 rounded-2xl border p-6 md:p-8">
              <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-12 items-center justify-center rounded-xl ring-1 ring-inset">
                <Icon icon={Cpu} aria-hidden />
              </span>
              <h3 className="t-h3 text-foreground">Build Intelligent Systems</h3>
              <p className="t-body t-muted leading-relaxed">
                ZALVY engineers autonomous multi-agent networks, business automation state machines, and private LLM knowledge planes. Every system is built around real workflows, equipped with granular OpenTelemetry cost lines, sub-second latency targets, and air-gapped security guardrails.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80} animation="blur-in" className="rounded-2xl">
            <div className="bg-surface-raised border-border flex h-full flex-col gap-4 rounded-2xl border p-6 md:p-8">
              <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-12 items-center justify-center rounded-xl ring-1 ring-inset">
                <Icon icon={GraduationCap} aria-hidden />
              </span>
              <h3 className="t-h3 text-foreground">Empower Future Talent</h3>
              <p className="t-body t-muted leading-relaxed">
                4/6/8/12-week tracks. Twelve engineers per cohort. Direct 1:1 mentorship from senior staff. Apprentices build and ship real code to production repositories — evaluated via verifiable GitHub pull requests, architecture design documents, and cryptographically signed credentials.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="values" surface="veil" rhythm="default">
        <h2 className="t-h2 text-foreground is-balanced mb-8">The engineering principles we live by.</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Observability First",
              body: "Every neural step is logged and costed. We don't ask 'is it working' — we require cryptographic trace evidence.",
              icon: Eye,
            },
            {
              title: "Deterministic Execution",
              body: "AI agents must never gamble on unverified outputs. Multi-agent consensus and sandbox execution ensure 99.8% precision.",
              icon: Scale,
            },
            {
              title: "Zero Compromise on Craft",
              body: "From system architecture to micro-animations, every line of code reflects uncompromising craftsmanship and restraint.",
              icon: Users,
            },
            {
              title: "Production Over Slides",
              body: "A demo is not a delivery. Software is complete only when operating reliably in live enterprise environments.",
              icon: Target,
            },
          ].map((value, i) => (
            <Reveal
              key={value.title}
              as="div"
              delay={i * 60}
              animation="blur-in"
              className="rounded-2xl"
            >
              <div className="bg-surface-raised border-border hover:border-border-strong flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors duration-300">
                <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset">
                  <Icon icon={value.icon} aria-hidden />
                </span>
                <h3 className="t-h4 text-foreground">{value.title}</h3>
                <p className="t-body-sm t-muted leading-snug">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <StatRow stats={ABOUT_METRICS} surface="veil" />

      <TrustBand />

      <CtaCard
        title="Ready to build intelligent systems with ZALVY?"
        description="Partner with senior staff engineers who design, build, and deploy high-leverage autonomous AI and automation architectures."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">
              Start a Project
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
        secondary={
          <Button asChild variant="secondary" size="lg">
            <Link href="/careers/internship">Explore Apprenticeship</Link>
          </Button>
        }
      />
    </>
  );
}
