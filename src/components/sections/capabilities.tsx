import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  CircuitBoard,
  Code2,
  GraduationCap,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Section } from "@/components/ui/section";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

interface Capability {
  slug: string;
  title: string;
  badge?: string;
  tagline: string;
  blurb: string;
  href: string;
  icon: LucideIcon;
  tags: string[];
  metrics?: { label: string; value: string };
  emphasis: "flagship" | "primary" | "secondary";
}

const CAPABILITIES: Capability[] = [
  {
    slug: "agents",
    title: "Autonomous AI Agents",
    badge: "Core Architecture",
    tagline: "Self-reasoning systems that execute with precision.",
    blurb:
      "Grounded, multi-step decision agents that coordinate tools, inspect outcomes, and complete complex enterprise workflows with deterministic safety gates.",
    href: "/platform/agents",
    icon: Bot,
    tags: ["Tool Grounding", "Multi-Agent Swarms", "Policy Gates", "Self-Correction"],
    metrics: { label: "Deterministic Accuracy", value: "99.8%" },
    emphasis: "flagship",
  },
  {
    slug: "automation",
    title: "Business Automation",
    badge: "Enterprise",
    tagline: "Resilient orchestration with per-step telemetry.",
    blurb:
      "Replayable state machines that bridge legacy APIs and modern neural models. Every step is costed, observed, and reversible without data duplication.",
    href: "/platform/automation",
    icon: Workflow,
    tags: ["State Machines", "OTel Tracing", "Human-in-Loop"],
    metrics: { label: "Execution Latency", value: "< 120ms" },
    emphasis: "primary",
  },
  {
    slug: "chatbots",
    title: "Enterprise Chatbots",
    badge: "Knowledge Plane",
    tagline: "Grounded conversational intelligence.",
    blurb:
      "Context-aware interfaces connected directly to your private data plane. Multi-turn reasoning with verifiable source attribution and zero hallucination drift.",
    href: "/platform/chatbots",
    icon: Sparkles,
    tags: ["RAG Vectors", "Source Citations", "Multi-Tenant"],
    emphasis: "primary",
  },
  {
    slug: "studio",
    title: "Custom AI Engineering",
    tagline: "High-leverage bespoke system design.",
    blurb:
      "Bespoke neural architectures engineered by senior staff for high-barrier domains in robotics, medical diagnostics, and algorithmic finance.",
    href: "/platform/studio",
    icon: Code2,
    tags: ["Proprietary Models", "Zero Technical Debt"],
    emphasis: "secondary",
  },
  {
    slug: "tools",
    title: "Developer Tooling & SDKs",
    tagline: "The modern AI observability suite.",
    blurb:
      "Evaluation harnesses, synthetic data generation, and trace planes that make autonomous agent behavior fully transparent and auditable.",
    href: "/platform/tools",
    icon: CircuitBoard,
    tags: ["OpenTelemetry", "Eval Pipelines", "Python/TS SDK"],
    emphasis: "secondary",
  },
  {
    slug: "internship",
    title: "Future Talent Apprenticeship",
    badge: "4–12 Week Immersion",
    tagline: "Real production shipping, not simulations.",
    blurb:
      "Intensive 1:1 mentorship where emerging engineers build and ship core infrastructure alongside senior staff. Rigorous code reviews, zero toy projects.",
    href: "/careers/internship",
    icon: GraduationCap,
    tags: ["Production Access", "1:1 Staff Mentorship"],
    emphasis: "secondary",
  },
];

export function Capabilities() {
  return (
    <Section
      id="capabilities"
      eyebrow="Architecture & Ecosystem"
      title="Engineered for autonomy. Grounded in reality."
      description="ZALVY delivers an integrated platform spanning production AI agent networks, resilient business automation, and hands-on engineering talent cultivation."
      rhythm="spacious"
      align="left"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
        {CAPABILITIES.map((cap, i) => {
          const isFlagship = cap.emphasis === "flagship";
          const isPrimary = cap.emphasis === "primary";

          return (
            <Reveal
              key={cap.slug}
              delay={i * 70}
              animation="blur-in"
              className={cn(
                "rounded-3xl",
                isFlagship
                  ? "lg:col-span-12"
                  : isPrimary
                    ? "lg:col-span-6"
                    : "lg:col-span-4",
              )}
            >
              <Link
                href={cap.href}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300",
                  "bg-surface-raised/70 backdrop-blur-xl hover:bg-surface-overlay/80",
                  isFlagship
                    ? "border-accent/30 p-8 sm:p-10 shadow-[0_0_30px_rgb(var(--token-accent)/0.06)] hover:border-accent/50 hover:shadow-[0_0_40px_rgb(var(--token-accent)/0.12)]"
                    : isPrimary
                      ? "border-white/[0.09] p-7 sm:p-8 hover:border-accent/40 hover:shadow-lg"
                      : "border-white/[0.07] p-6 sm:p-7 hover:border-white/20",
                  "min-h-[17rem]",
                )}
                aria-label={`${cap.title}: ${cap.blurb}`}
              >
                {/* Ambient dynamic radial glow behind card */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    isFlagship
                      ? "bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(var(--token-accent)/0.12),transparent_70%)]"
                      : "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgb(var(--token-accent)/0.08),transparent_70%)]",
                  )}
                />

                {/* Subtle top hairline */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="relative z-10 flex flex-col gap-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-accent-subtle text-accent ring-accent/20 inline-flex size-11 items-center justify-center rounded-2xl ring-1 ring-inset transition-transform duration-300 group-hover:scale-105">
                        <Icon icon={cap.icon} size="md" aria-hidden strokeWidth={1.8} />
                      </span>
                      {cap.badge && (
                        <Badge variant="iris" size="sm">
                          {cap.badge}
                        </Badge>
                      )}
                    </div>

                    <span className="text-foreground-subtle group-hover:text-accent inline-flex size-8 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] transition-colors duration-200 group-hover:border-accent/30">
                      <Icon icon={ArrowRight} size="xs" aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  <div>
                    <h3 className={cn("text-foreground font-display font-semibold", isFlagship ? "t-h2" : "t-h3")}>
                      {cap.title}
                    </h3>
                    <p className="t-body-sm text-accent font-medium mt-1">
                      {cap.tagline}
                    </p>
                    <p className="t-body-sm t-muted mt-2.5 max-w-2xl leading-relaxed">
                      {cap.blurb}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[0.75rem] font-medium text-foreground-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {cap.metrics && (
                    <div className="flex items-baseline gap-2">
                      <span className="t-caption text-[0.6875rem] uppercase tracking-widest text-foreground-subtle font-mono">
                        {cap.metrics.label}:
                      </span>
                      <span className="font-mono text-xs font-semibold text-accent">
                        {cap.metrics.value}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
