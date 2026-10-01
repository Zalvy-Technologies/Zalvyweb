"use client";

import { useCallback } from "react";
import { LazySection } from "@/components/ui/lazy-section";

export function HomepageBelowFold() {
  const problem = useCallback(() => import("@/components/sections/problem-section").then((m) => m.ProblemSection), []);
  const capabilities = useCallback(() => import("@/components/sections/capabilities").then((m) => m.Capabilities), []);
  const agentSwarm = useCallback(() => import("@/components/sections/agent-swarm-showcase").then((m) => m.AgentSwarmShowcase), []);
  const automationFlow = useCallback(() => import("@/components/sections/automation-flow").then((m) => m.AutomationFlowSection), []);
  const workflow = useCallback(() => import("@/components/sections/workflow-stepper").then((m) => m.WorkflowStepper), []);
  const roiCalculator = useCallback(() => import("@/components/sections/roi-calculator").then((m) => m.RoiCalculator), []);
  const featuredWork = useCallback(() => import("@/components/sections/featured-work").then((m) => m.FeaturedWork), []);
  const impact = useCallback(() => import("@/components/sections/impact").then((m) => m.Impact), []);
  const internship = useCallback(() => import("@/components/sections/internship-program").then((m) => m.InternshipProgram), []);
  const testimonials = useCallback(() => import("@/components/sections/testimonials").then((m) => m.Testimonials), []);
  const pricing = useCallback(() => import("@/components/sections/pricing").then((m) => m.Pricing), []);
  const faq = useCallback(() => import("@/components/sections/faq").then((m) => m.Faq), []);
  const ctaBand = useCallback(() => import("@/components/sections/cta-band").then((m) => m.CtaBand), []);

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-[rgb(var(--token-accent)/0.14)] via-white/[0.04] to-[rgb(var(--token-accent)/0.08)] lg:block" />
      <LazySection factory={problem} minHeight="24rem" />
      <NarrativeBridge label="From problem to system" />
      <LazySection factory={capabilities} minHeight="28rem" />
      <NarrativeBridge label="Autonomous Swarm Intelligence" />
      <LazySection factory={agentSwarm} minHeight="34rem" />
      <NarrativeBridge label="Deterministic Automation" />
      <LazySection factory={automationFlow} minHeight="32rem" />
      <NarrativeBridge label="How it runs" />
      <LazySection factory={workflow} minHeight="30rem" />
      <LazySection factory={roiCalculator} minHeight="28rem" />
      <NarrativeBridge label="Proof in production" />
      <LazySection factory={featuredWork} minHeight="32rem" />
      <LazySection factory={impact} minHeight="20rem" />
      <NarrativeBridge label="People who build it" />
      <LazySection factory={internship} minHeight="24rem" />
      <LazySection factory={testimonials} minHeight="28rem" />
      <LazySection factory={pricing} minHeight="36rem" />
      <LazySection factory={faq} minHeight="24rem" />
      <LazySection factory={ctaBand} minHeight="16rem" />
    </div>
  );
}

function NarrativeBridge({ label }: { label: string }) {
  return (
    <div aria-hidden className="relative hidden lg:flex justify-center py-6">
      <div className="flex items-center gap-3">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/[0.08]" />
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-surface-raised/40 px-3 py-1 text-[0.625rem] font-mono tracking-[0.14em] text-foreground-subtle/60 uppercase backdrop-blur">
          <span className="size-1 rounded-full bg-[rgb(var(--token-accent)/0.6)]" />
          {label}
        </span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/[0.08]" />
      </div>
    </div>
  );
}
