import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { 
  Layers, 
  ArrowRight, 
  Terminal, 
  GitBranch, 
  BrainCircuit
} from "lucide-react";
import { AgentPlaygroundSimulator } from "@/components/ai/agent-playground-simulator";

export const metadata: Metadata = {
  title: "ZALVY Autonomous AI Agent Engine — Multi-Agent Swarms & Planning",
  description: "Explore ZALVY's multi-agent swarm framework, tool-calling runtime, sub-task planning graphs, and stateful memory engines for complex enterprise operations.",
  alternates: { canonical: "/agents" },
};

const AGENT_CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: "Dynamic Sub-Task Planning",
    description: "Decomposes multi-step prompts into structured execution DAGs, verifying intermediate outputs before proceeding."
  },
  {
    icon: GitBranch,
    title: "Multi-Agent Swarm Consensus",
    description: "Orchestrates teams of specialized workers (Data, Code, Security) that review and cross-validate each other's work."
  },
  {
    icon: Terminal,
    title: "Sandbox Tool Execution",
    description: "Executes Python code, SQL queries, API calls, and browser interactions inside isolated zero-trust sandbox micro-VMs."
  },
  {
    icon: Layers,
    title: "Stateful Vector & Episodic Memory",
    description: "Maintains contextual continuity across millions of operational tokens with instant retrieval."
  }
];

export default function AgentsPage() {
  return (
    <div className="pt-12 pb-16">
      <Container>
        {/* Header — editorial */}
        <div className="grid grid-cols-12 gap-8 items-end border-b border-white/[0.06] pb-12">
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 self-start">
              <span className="h-px w-6 bg-[rgb(var(--token-accent)/0.5)]" aria-hidden />
              <Badge variant="iris" size="sm">Autonomous Agent Engine v4</Badge>
            </div>
            <h1 className="t-h1 text-foreground tracking-[-0.03em] leading-[1.02] is-balanced">
              Multi-agent swarms <span className="text-foreground-muted font-[400]">for work that can&rsquo;t hallucinate.</span>
            </h1>
            <p className="t-body-lg t-muted max-w-[36rem] leading-relaxed">
              Beyond chat. Agents that plan in DAGs, call tools in sandboxed micro-VMs, and cross-validate in swarms — observable at every token.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5 flex lg:justify-end">
            <Button asChild variant="primary" size="lg" className="w-full lg:w-auto">
              <Link href="/contact">
                Deploy Agent Swarm
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        {/* Simulator */}
        <div className="mt-14">
          <AgentPlaygroundSimulator />
        </div>

        {/* Capabilities — editorial 2-col with thread */}
        <div className="relative mt-16">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 hidden h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgb(var(--token-accent)/0.14)] to-transparent lg:block" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {AGENT_CAPABILITIES.map((cap, idx) => {
              const IconComponent = cap.icon;
              return (
                <GlassCard key={idx} variant="raised" intensity="medium" animated glow className="p-6 md:p-7">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" aria-hidden />
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-subtle text-accent ring-1 ring-accent/15 ring-inset">
                    <IconComponent className="h-[1.2rem] w-[1.2rem]" strokeWidth={1.75} />
                  </span>
                  <h3 className="t-h3 mt-4 text-foreground tracking-tight">{cap.title}</h3>
                  <p className="t-body-sm t-muted mt-2 leading-relaxed">{cap.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
