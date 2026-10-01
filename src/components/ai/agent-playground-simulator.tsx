"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { 
  Bot, 
  Cpu, 
  Play, 
  Terminal, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Code2, 
  Sparkles, 
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface AgentArchetype {
  id: string;
  name: string;
  role: string;
  icon: LucideIcon;
  model: string;
  speed: string;
  accuracy: string;
  description: string;
  defaultPrompt: string;
  executionSteps: {
    title: string;
    type: "thought" | "tool" | "output";
    detail: string;
    latencyMs: number;
  }[];
}

const SWARM_ORCHESTRATOR: AgentArchetype = {
    id: "swarm-orchestrator",
    name: "Zalvy Swarm Orchestrator v4",
    role: "Multi-Agent System",
    icon: Layers,
    model: "Zalvy-Omni-v4 (MoE 128B)",
    speed: "185 tokens/sec",
    accuracy: "99.9%",
    description: "Decomposes enterprise workflows into sub-tasks and dispatches to specialized agent worker pools in parallel.",
    defaultPrompt: "Analyze supply chain logs, predict Q4 inventory deficits, and generate automated purchase orders.",
    executionSteps: [
      { title: "Initializing Agent Mesh", type: "thought", detail: "Spawning 4 worker instances: [Data-Ingest-01, Predictor-Core, Risk-Auditor, ERP-Connector]", latencyMs: 12 },
      { title: "Querying Postgres & Snowflake Lakehouse", type: "tool", detail: "tool_call: execute_vector_query(dataset='supply_chain_q3', min_confidence=0.96)", latencyMs: 34 },
      { title: "Predictive Neural Inference", type: "thought", detail: "Detected 14.2% supply deficit in Semiconductor Component Grade-A for November.", latencyMs: 28 },
      { title: "Executing ERP Purchase Order Draft", type: "tool", detail: "tool_call: SAP_ERP.create_po(vendor_id='V-9921', qty=4500, auto_approve=false)", latencyMs: 42 },
      { title: "Swarm Finalized", type: "output", detail: "Successfully synthesized report. 3 Purchase Orders created with human-in-the-loop approval gate.", latencyMs: 15 }
    ]
  };

const CODE_ARCHITECT: AgentArchetype = {
    id: "code-architect",
    name: "Autonomous Code Architect",
    role: "Software Engineering",
    icon: Code2,
    model: "Zalvy-Coder-v2",
    speed: "210 tokens/sec",
    accuracy: "99.7%",
    description: "Autonomously refactors high-concurrency microservices, generates zero-trust API contracts, and writes unit tests.",
    defaultPrompt: "Refactor Node.js REST API endpoint to Next.js 15 Server Actions with Prisma batching.",
    executionSteps: [
      { title: "AST Parsing & Dependency Graphing", type: "thought", detail: "Parsed 14 source files in /src/api. Identified N+1 database queries in user lookup.", latencyMs: 8 },
      { title: "Prisma Schema Index Optimization", type: "tool", detail: "tool_call: generate_prisma_migration(indexes=['idx_user_email_status'])", latencyMs: 22 },
      { title: "Generating React 19 Server Action", type: "thought", detail: "Constructed type-safe Server Action with Zod input validation and React cache directives.", latencyMs: 18 },
      { title: "Executing Vitest Suite", type: "tool", detail: "tool_call: run_unit_tests(target='actions/users.test.ts') -> 18/18 passed in 142ms", latencyMs: 31 },
      { title: "Refactoring Complete", type: "output", detail: "Code refactored. Database latency reduced by 74% with 100% test coverage.", latencyMs: 10 }
    ]
  };

const SECURITY_AUDITOR: AgentArchetype = {
    id: "security-auditor",
    name: "Zero-Trust Security Auditor",
    role: "Cybersecurity & Compliance",
    icon: ShieldCheck,
    model: "Zalvy-SecGuard-v3",
    speed: "160 tokens/sec",
    accuracy: "100%",
    description: "Scans cloud infrastructure, Kubernetes manifests, and IAM policies for SOC2 & ISO 27001 compliance drift.",
    defaultPrompt: "Audit AWS Terraform manifests for public S3 buckets, unencrypted RDS instances, and loose IAM roles.",
    executionSteps: [
      { title: "Parsing HCL Terraform AST", type: "thought", detail: "Analyzed 42 Terraform modules. Inspecting 180 cloud resource declarations.", latencyMs: 14 },
      { title: "Threat Vector Cross-Examination", type: "tool", detail: "tool_call: check_cve_database(resource='aws_s3_bucket.logs', policy='public-read')", latencyMs: 25 },
      { title: "Identified Critical Drift", type: "thought", detail: "FOUND 1 HIGH RISK: S3 bucket 'audit-logs-prod' lacks server-side KMS encryption.", latencyMs: 16 },
      { title: "Generating Automated Remediation Patch", type: "tool", detail: "tool_call: apply_hcl_patch(file='s3.tf', rule='aws_kms_key.logs_key')", latencyMs: 29 },
      { title: "Audit Report Mapped", type: "output", detail: "SOC2 Compliance readiness updated to 99.4%. Remediation PR automatically pushed to GitHub.", latencyMs: 11 }
    ]
  };

const AGENT_ARCHETYPES: AgentArchetype[] = [SWARM_ORCHESTRATOR, CODE_ARCHITECT, SECURITY_AUDITOR];

export function AgentPlaygroundSimulator() {
  const [selectedAgent, setSelectedAgent] = useState<AgentArchetype>(SWARM_ORCHESTRATOR);
  const [customPrompt, setCustomPrompt] = useState(SWARM_ORCHESTRATOR.defaultPrompt);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [totalExecutionTime, setTotalExecutionTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSelectAgent = (agent: AgentArchetype) => {
    setSelectedAgent(agent);
    setCustomPrompt(agent.defaultPrompt);
    setIsRunning(false);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setTotalExecutionTime(0);
    // Run simulation after state updates
    setTimeout(() => {
      runSimulation(agent);
    }, 0);
  };

  const runSimulation = (agent: AgentArchetype = selectedAgent) => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setTotalExecutionTime(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let step = 0;
    let accumulatedTime = 0;

    const interval = setInterval(() => {
      if (step < agent.executionSteps.length) {
        const currentStep = agent.executionSteps[step];
        if (currentStep) {
          accumulatedTime += currentStep.latencyMs;
          setTotalExecutionTime(accumulatedTime);
          setCurrentStepIndex(step);
          setCompletedSteps((prev) => [...prev, step]);
          step++;
        }
      } else {
        clearInterval(interval);
        intervalRef.current = null;
        setIsRunning(false);
      }
    }, 600);
    intervalRef.current = interval;
  };

  return (
    <GlassCard variant="raised" intensity="strong" className="overflow-hidden border border-white/10 p-0 shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-surface/80 p-4 backdrop-blur-md sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="t-body font-semibold text-foreground">{selectedAgent.name}</h3>
              <Badge variant="outline" className="border-accent/30 bg-accent/10 text-[10px] text-accent font-mono uppercase">
                {selectedAgent.role}
              </Badge>
            </div>
            <p className="t-caption t-subtle mt-0.5">{selectedAgent.model}</p>
          </div>
        </div>

        {/* Agent Selector Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1 backdrop-blur-sm">
          {AGENT_ARCHETYPES.map((agent) => {
            const IconComp = agent.icon;
            const isSelected = selectedAgent.id === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => { handleSelectAgent(agent); }}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-accent text-black font-semibold shadow-md shadow-accent/20"
                    : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{agent.name.split(" ")[1] ?? agent.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Playground Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Control & Metrics Panel */}
        <div className="border-b border-white/10 bg-surface/30 p-5 lg:col-span-4 lg:border-b-0 lg:border-r">
          <div className="space-y-4">
            <div>
              <label className="t-overline text-foreground-subtle block mb-1.5">
                Agent Capability Overview
              </label>
              <p className="t-body-sm text-foreground-muted leading-relaxed">
                {selectedAgent.description}
              </p>
            </div>

            {/* Performance Metric Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-accent">
                  <Zap className="h-3.5 w-3.5" />
                  <span className="font-mono">Processing Speed</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground font-mono">
                  {selectedAgent.speed}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="font-mono">Accuracy</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground font-mono">
                  {selectedAgent.accuracy}
                </div>
              </div>
            </div>

            {/* Prompt Input & Execute */}
            <div className="pt-2">
              <label className="t-overline text-foreground-subtle block mb-1.5">
                Simulated Execution Prompt
              </label>
              <div className="relative">
                <textarea
                  value={customPrompt}
                  onChange={(e) => { setCustomPrompt(e.target.value); }}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                />
              </div>

              <button
                onClick={() => { runSimulation(); }}
                disabled={isRunning}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-cyan-400 p-2.5 text-xs font-semibold text-black shadow-lg shadow-accent/20 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Executing Swarm Task...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-black" />
                    <span>Run Agent Swarm Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Terminal & Execution Stream */}
        <div className="bg-black/80 p-5 font-mono lg:col-span-8 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-foreground-subtle">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-accent" />
                <span>ZALVY_SWARM_RUNTIME // TERMINAL LOGS</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${isRunning ? "bg-amber animate-pulse" : "bg-success"}`} />
                  {isRunning ? "PROCESSING" : "READY"}
                </span>
                <span>LATENCY: {totalExecutionTime}ms</span>
              </div>
            </div>

            {/* Live Steps Stream */}
            <div className="mt-4 space-y-3.5">
              {selectedAgent.executionSteps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                const isCurrent = currentStepIndex === idx && isRunning;
                if (!isDone && !isCurrent && completedSteps.length < idx) {
                  return null;
                }

                return (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 text-xs transition-all duration-300 ${
                      isCurrent
                        ? "border-accent/40 bg-accent/5 text-foreground animate-pulse"
                        : isDone
                        ? "border-white/10 bg-surface/20 text-foreground-muted"
                        : "border-transparent opacity-40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {step.type === "thought" && <Sparkles className="h-3.5 w-3.5 text-iris" />}
                        {step.type === "tool" && <Cpu className="h-3.5 w-3.5 text-accent" />}
                        {step.type === "output" && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                        <span className="font-semibold text-foreground">{step.title}</span>
                      </div>
                      <span className="text-[10px] text-foreground-subtle font-mono">
                        +{step.latencyMs}ms
                      </span>
                    </div>
                    <div className="pl-5 text-[11px] font-mono text-foreground-subtle break-words">
                      {step.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Bar of Terminal */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-foreground-subtle">
            <span>Powered by Zalvy Vector Engine & Multi-Agent Consensus</span>
            <span className="text-accent font-semibold flex items-center gap-1">
              Zero Human Touch Required <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
