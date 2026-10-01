import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Activity, Cpu, Zap } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  domain: string;
  sector: string;
  metric: { value: string; label: string };
  tags: string[];
  icon: LucideIcon;
}

const STUDIES: CaseStudy[] = [
  {
    slug: "helios-agent-routing",
    title: "Grounding autonomous decision agents in a 4.2B-row claims knowledge base",
    summary:
      "Engineered an observable agent network with strict policy boundaries. Reduced clinician escalation delays while auto-adjudicating 41% of structured healthcare claims with zero regression.",
    domain: "Knowledge Architecture",
    sector: "Healthcare Systems",
    metric: { value: "41%", label: "Routable claims auto-adjudicated" },
    tags: ["Agent Swarms", "Policy Gates", "Vector DB"],
    icon: Activity,
  },
  {
    slug: "quanta-research-ops",
    title: "High-throughput research orchestration: from 11-day cycles to 9-hour sprints",
    summary:
      "Built a deterministic DAG orchestration engine with per-step OTel cost lines, enabling quantitative researchers to safely automate exploratory pipeline sweeps.",
    domain: "Workflow Engine",
    sector: "Quantitative Ops",
    metric: { value: "−82%", label: "Cycle time reduction" },
    tags: ["State Machines", "OTel Tracing", "MicroVMs"],
    icon: Cpu,
  },
  {
    slug: "aperture-inference",
    title: "Sub-90ms deterministic neural inference for industrial control loops",
    summary:
      "Re-engineered model serving topology for edge-constrained robotics with sub-300ms cold starts, memory isolation, and continuous hardware telemetry.",
    domain: "Inference Platform",
    sector: "Robotics & Edge",
    metric: { value: "87ms", label: "p99 control-loop latency" },
    tags: ["TensorRT", "Edge Runtime", "Low-Latency"],
    icon: Zap,
  },
];

export function FeaturedWork() {
  return (
    <Section
      id="featured-work"
      eyebrow="Studio Engagements"
      title="Engineering proofs in production."
      description="We design and deploy high-leverage systems for complex operational domains. Representative architecture case studies demonstrating verified results."
      rhythm="spacious"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {STUDIES.map((study, i) => (
          <Reveal
            key={study.slug}
            delay={i * 80}
            animation="blur-in"
            className={cn(i === 0 ? "lg:col-span-12" : "lg:col-span-6")}
          >
            <Link
              href={`/studio/work/${study.slug}`}
              className={cn(
                "group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300",
                "border-white/[0.08] bg-surface-raised/70 backdrop-blur-xl hover:border-accent/40 hover:bg-surface-overlay/80 hover:shadow-2xl",
                i === 0 ? "p-8 sm:p-10 min-h-[22rem]" : "p-7 sm:p-8 min-h-[20rem]",
              )}
              aria-label={`${study.sector}: ${study.title}`}
            >
              {/* Dynamic hover wash */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(var(--token-accent)/0.09),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Top metadata row */}
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="neutral" size="sm">
                      {study.sector}
                    </Badge>
                    <span className="t-caption text-[0.6875rem] font-mono uppercase tracking-wider text-foreground-subtle">
                      {study.domain}
                    </span>
                  </div>

                  <span className="text-foreground-subtle group-hover:text-accent inline-flex size-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] transition-colors duration-200 group-hover:border-accent/30">
                    <Icon icon={ArrowUpRight} size="sm" aria-hidden />
                  </span>
                </div>

                <div>
                  <h3 className={cn("text-foreground font-display font-semibold is-balanced", i === 0 ? "t-h2" : "t-h3")}>
                    {study.title}
                  </h3>
                  <p className="t-body t-muted mt-3.5 max-w-3xl leading-relaxed">
                    {study.summary}
                  </p>
                </div>
              </div>

              {/* Bottom metric & tags */}
              <div className="relative z-10 mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/[0.06] pt-6">
                <dl className="t-num-tabular flex flex-col gap-0.5">
                  <dt className="text-overline t-subtle tracking-widest uppercase">
                    {study.metric.label}
                  </dt>
                  <dd className={cn("font-display font-[650] tracking-tight t-gradient-iris leading-none", i === 0 ? "t-display-2" : "t-display-3")}>
                    {study.metric.value}
                  </dd>
                </dl>

                <div className="flex flex-wrap gap-1.5">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[0.75rem] font-medium text-foreground-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
