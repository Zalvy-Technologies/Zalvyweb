"use client";

import { useState, useId } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/cn";

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyUsd: number | null;
  annualUsd: number | null;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Growth Tier",
    tagline: "For scaling engineering teams standing up initial autonomous pipelines.",
    monthlyUsd: 240,
    annualUsd: 198,
    features: [
      "Up to 3 production agent swarms",
      "Grounded RAG vector connection",
      "1M grounded tokens / month",
      "Full OpenTelemetry export",
      "Automated evaluation harnesses",
      "Community & Discord support",
    ],
    ctaLabel: "Get Started",
    ctaHref: "/contact",
  },
  {
    id: "teams",
    name: "Platform Tier",
    tagline: "For enterprises operating mission-critical AI automation in production.",
    monthlyUsd: 1_800,
    annualUsd: 1_485,
    features: [
      "Up to 25 autonomous agent swarms",
      "Dedicated multi-region inference nodes",
      "15M grounded tokens / month",
      "BYOM (Bring-Your-Own-Model) key vault",
      "Granular per-step cost telemetry",
      "5 staff engineer seats + SAML SSO",
      "4-hour SLA & dedicated engineer channel",
    ],
    ctaLabel: "Deploy Platform",
    ctaHref: "/contact",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise Architecture",
    tagline: "Bespoke system design, air-gapped deployments, and custom SLAs.",
    monthlyUsd: null,
    annualUsd: null,
    features: [
      "Unlimited deployed agent topologies",
      "VPC / On-Premise air-gapped deployment",
      "Per-step latency SLO contracts (< 100ms)",
      "SOC 2 Type II & HIPAA compliance package",
      "Direct 1:1 on-call staff mentorship",
      "Quarterly architecture review & fine-tuning",
    ],
    ctaLabel: "Schedule Architecture Review",
    ctaHref: "/contact",
  },
];

type Billing = "monthly" | "annual";

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("annual");
  const groupChannelId = useId();

  return (
    <Section
      id="pricing"
      eyebrow="Predictable Infrastructure"
      title="Transparent pricing. Engineered for scale."
      description="Zero hidden inference markups. Pay for predictable compute and dedicated telemetry, with complete cost transparency at every agent step."
      rhythm="spacious"
      align="center"
    >
      <BillingToggle billing={billing} onChange={setBilling} id={groupChannelId} />

      <div className="mt-12 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2">
        {PLANS.filter((p) => p.id !== "enterprise").map((plan, i) => (
          <Reveal key={plan.id} as="div" delay={i * 80} animation="blur-in" className="h-full">
            <PricingCard plan={plan} billing={billing} />
          </Reveal>
        ))}
      </div>

      {(() => {
        const enterprise = PLANS.find((p) => p.id === "enterprise");
        if (!enterprise) return null;
        return (
          <Reveal delay={160} animation="blur-in" className="mt-6">
            <div className="group relative flex flex-col lg:flex-row lg:items-stretch overflow-hidden rounded-3xl border border-white/[0.09] bg-surface-raised/80 backdrop-blur-2xl shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgb(var(--token-accent)/0.06),transparent_60%)] pointer-events-none" aria-hidden />

              <div className="relative flex-1 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Badge variant="iris" size="sm">Custom Scoped</Badge>
                    <span className="font-mono text-xs text-foreground-subtle">VPC / AIR-GAPPED</span>
                  </div>

                  <h3 className="t-h2 text-foreground font-display font-semibold mt-3">
                    {enterprise.name}
                  </h3>

                  <p className="t-body t-muted mt-2.5 max-w-2xl leading-relaxed">
                    {enterprise.tagline}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["On-Premises VPC", "Custom Model Fine-Tuning", "Zero-Data Retention", "Signed SLA"].map((f) => (
                      <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs text-foreground-muted">
                        <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden /> {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-6">
                  <Button asChild variant="primary" size="lg">
                    <Link href={enterprise.ctaHref}>
                      {enterprise.ctaLabel}
                      <Icon icon={ArrowRight} aria-hidden size="sm" />
                    </Link>
                  </Button>
                  <span className="t-caption text-foreground-subtle font-mono text-xs">
                    Custom deployment brief in 24 hours
                  </span>
                </div>
              </div>

              <div className="relative hidden lg:flex w-[24rem] flex-col justify-center border-l border-white/[0.08] bg-surface/90 p-8 sm:p-10">
                <p className="t-caption font-mono text-foreground-subtle uppercase tracking-widest text-[0.75rem]">
                  ENTERPRISE CAPABILITIES
                </p>
                <ul role="list" className="mt-4 flex list-none flex-col gap-3 p-0">
                  {enterprise.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="bg-accent-subtle text-accent ring-accent/20 mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset">
                        <Icon icon={Check} size="xs" aria-hidden />
                      </span>
                      <span className="t-body-sm text-foreground leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        );
      })()}
    </Section>
  );
}

function BillingToggle({
  billing,
  onChange,
  id,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
  id: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      id={id}
      className="rounded-full bg-surface-raised border border-white/[0.08] inline-flex items-center p-1 backdrop-blur-md"
    >
      {(["monthly", "annual"] as const).map((option) => {
        const active = billing === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            data-state={active ? "active" : "inactive"}
            onClick={() => { onChange(option); }}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-medium transition-all duration-200",
              active
                ? "bg-surface-overlay text-foreground shadow-md border border-white/10"
                : "text-foreground-muted hover:text-foreground",
            )}
          >
            {option === "monthly" ? "Monthly Billing" : "Annual Billing"}
            {option === "annual" && (
              <span className="text-accent font-semibold ml-1.5 tracking-wider uppercase">
                Save 17%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PricingCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const price = billing === "monthly" ? plan.monthlyUsd : plan.annualUsd;
  const perMo = billing === "annual" ? "billed annually" : "billed monthly";

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col justify-between rounded-3xl p-8 sm:p-9 transition-all duration-300",
        "bg-surface-raised/80 backdrop-blur-xl border",
        plan.featured
          ? "border-accent/40 shadow-[0_0_30px_rgb(var(--token-accent)/0.1)] hover:border-accent/60"
          : "border-white/[0.08] hover:border-white/20 hover:shadow-xl",
      )}
    >
      {plan.featured && (
        <span className="rounded-full bg-accent text-accent-foreground absolute top-8 right-8 inline-flex items-center px-3 py-1 text-[0.6875rem] font-bold tracking-widest uppercase shadow-md">
          <Sparkles size={11} className="mr-1" />
          Recommended
        </span>
      )}

      <div>
        <header className="flex flex-col gap-2">
          <h3 className="t-h3 text-foreground font-display font-semibold">{plan.name}</h3>
          <p className="t-body-sm t-muted leading-relaxed min-h-[3rem]">{plan.tagline}</p>
        </header>

        <div className="t-num-tabular my-6 flex items-baseline gap-1.5">
          <span className="font-display text-foreground font-bold tracking-tight text-4xl sm:text-5xl">
            ${price?.toLocaleString()}
          </span>
          <span className="t-body-sm text-foreground-subtle">/ month</span>
        </div>

        <p className="t-caption text-[0.75rem] font-mono text-foreground-subtle uppercase tracking-wider -mt-4 mb-6">
          {perMo}
        </p>

        <Button asChild variant={plan.featured ? "primary" : "secondary"} size="lg" fullWidth>
          <Link href={plan.ctaHref}>
            {plan.ctaLabel}
            <Icon icon={ArrowRight} aria-hidden size="sm" />
          </Link>
        </Button>

        <ul role="list" className="mt-8 flex list-none flex-col gap-3 p-0 border-t border-white/[0.06] pt-6">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="bg-accent-subtle text-accent ring-accent/20 mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset">
                <Icon icon={Check} size="xs" aria-hidden />
              </span>
              <span className="t-body-sm text-foreground leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
