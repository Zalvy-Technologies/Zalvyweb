import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { 
  Bot, 
  Database, 
  ArrowRight, 
  Server, 
  Lock, 
} from "lucide-react";
import { RoiCalculator } from "@/components/sections/roi-calculator";
import { WorkflowStepper } from "@/components/sections/workflow-stepper";

export const metadata: Metadata = {
  title: "Custom AI Solutions & Enterprise Infrastructure — ZALVY",
  description: "Bespoke autonomous AI systems, private LLM deployments, fine-tuned agent architectures, and enterprise business automation built for global industry leaders.",
  alternates: { canonical: "/solutions" },
};

const SOLUTIONS_PILLARS = [
  {
    icon: Bot,
    title: "Autonomous Agent Fine-Tuning",
    description: "Custom domain-adapted LLMs fine-tuned on proprietary enterprise data with zero data leakage guarantees.",
    metrics: "99.8% Domain Task Accuracy"
  },
  {
    icon: Database,
    title: "Vector & Graph RAG Architecture",
    description: "Sub-50ms hybrid retrieval over petabyte-scale knowledge bases combining vector embeddings with knowledge graphs.",
    metrics: "<35ms Retrieval Latency"
  },
  {
    icon: Server,
    title: "Private Cloud & On-Prem Deployment",
    description: "Air-gapped deployment capability on AWS, GCP, Azure, or private Kubernetes clusters with full SOC2 compliance.",
    metrics: "100% Data Sovereignty"
  },
  {
    icon: Lock,
    title: "Zero-Trust Security & Guardrails",
    description: "Real-time threat mitigation, PII redactors, prompt injection firewalls, and cryptographic audit logs.",
    metrics: "SOC2 Type II Ready"
  }
];

export default function SolutionsPage() {
  return (
    <div className="pt-12 pb-16">
      <Container>
        {/* Header — editorial, not centered blob */}
        <div className="grid grid-cols-12 gap-8 items-end border-b border-white/[0.06] pb-12">
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 self-start">
              <span className="h-px w-6 bg-[rgb(var(--token-accent)/0.5)]" aria-hidden />
              <Badge variant="iris" size="sm">Enterprise AI Architecture</Badge>
            </div>
            <h1 className="t-h1 text-foreground tracking-[-0.03em] leading-[1.02] is-balanced">
              Custom AI solutions <span className="text-foreground-muted font-[400]">built for scale, not slides.</span>
            </h1>
            <p className="t-body-lg t-muted max-w-[36rem] leading-relaxed">
              We partner with operators who need autonomous agent networks that survive month 14 — not just demo day. Every system is grounded, observed, and policy-gated.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5 flex lg:justify-end">
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <Button asChild variant="primary" size="lg" className="w-full lg:w-auto">
                <Link href="/contact">
                  Request Architecture Audit
                  <Icon icon={ArrowRight} size="sm" aria-hidden />
                </Link>
              </Button>
              <span className="t-caption text-foreground-subtle text-center lg:text-right font-mono">Response within 1 business day · Direct staff access</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars — asymmetric premium grid with continuity line */}
        <div className="relative mt-14">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 hidden h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgb(var(--token-accent)/0.18)] to-transparent lg:block" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {SOLUTIONS_PILLARS.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              const isFeatured = idx === 0;
              return (
                <GlassCard
                  key={idx}
                  variant="raised"
                  intensity="medium"
                  animated
                  glow
                  className={isFeatured ? "md:col-span-2 p-7 md:p-8" : "p-6 md:p-7"}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" aria-hidden />
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent ring-1 ring-accent/15 ring-inset">
                      <IconComponent className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.75} />
                    </span>
                    <span className="shrink-0 rounded-full border border-accent/20 bg-accent-subtle px-3 py-1 text-[0.6875rem] font-mono font-medium tracking-wide text-accent">
                      {pillar.metrics}
                    </span>
                  </div>
                  <h3 className="t-h3 mt-5 text-foreground tracking-tight">{pillar.title}</h3>
                  <p className="t-body-sm t-muted mt-2.5 leading-relaxed max-w-[36rem]">{pillar.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mt-16 lg:mt-20">
          <RoiCalculator />
        </div>
      </Container>

      <div className="mt-10 lg:mt-14">
        <WorkflowStepper />
      </div>
    </div>
  );
}
