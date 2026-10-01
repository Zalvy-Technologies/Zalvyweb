"use client";

import { useState } from "react";
import { 
  BrainCircuit, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sparkles
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

interface SwarmWorkload {
  id: string;
  title: string;
  category: string;
  goal: string;
  dag: {
    step: string;
    agent: string;
    status: "done" | "active" | "queued";
    output: string;
  }[];
  consensus: {
    agent: string;
    role: string;
    verdict: "Approved" | "Audited" | "Passed";
    metric: string;
  }[];
  terminalLogs: string[];
}

const WORKLOADS: [SwarmWorkload, ...SwarmWorkload[]] = [
  {
    id: "finance",
    title: "Cross-Border ERP Ledger Reconciliation",
    category: "Financial Systems",
    goal: "Audit 14,000 multi-currency transaction records across SAP and Stripe, verify FX hedge calculations, and generate signed audit ledger.",
    dag: [
      { step: "01. Context Ingestion", agent: "Data Ingestion Swarm", status: "done", output: "14,280 ledger rows parsed from SAP S/4HANA" },
      { step: "02. FX Discrepancy DAG", agent: "Quantitative Agent", status: "done", output: "3 variance outliers identified (< $14.20)" },
      { step: "03. Policy & Sanctions Gate", agent: "Security Sentinel", status: "done", output: "0 OFAC matches · Cryptographic compliance verified" },
      { step: "04. Settlement Dispatch", agent: "Execution Agent", status: "active", output: "Signed settlement batch 0x9f4a queued for automated posting" },
    ],
    consensus: [
      { agent: "Data Agent v4", role: "Schema & ETL Validation", verdict: "Passed", metric: "100% data integrity" },
      { agent: "Audit Agent v4", role: "Ledger Consistency Eval", verdict: "Approved", metric: "0.00% reconciliation drift" },
      { agent: "Security Guardrail", role: "Air-Gapped Privacy Check", verdict: "Audited", metric: "0 PII tokens leaked" },
    ],
    terminalLogs: [
      "[14:02:11.412] [SWARM_INIT] Spawning 3 specialized agent sub-processes on isolated micro-VMs",
      "[14:02:11.448] [PLANNER_DAG] Decomposed root prompt into 4 acyclic dependency stages",
      "[14:02:11.492] [DATA_AGENT] Fetched 14,280 SAP records. Memory state cached to vector plane",
      "[14:02:11.530] [SECURITY_SENTINEL] Policy gate evaluated: ZERO prompt injection risk detected",
      "[14:02:11.580] [SWARM_CONSENSUS] 3/3 Worker consensus reached. Generating cryptographic trace #882b",
    ],
  },
  {
    id: "security",
    title: "Autonomous Zero-Day Vulnerability Triage",
    category: "Cybersecurity & Ops",
    goal: "Ingest production telemetry alerts, synthesize micro-patch, run sandboxed integration test suite, and raise verified pull request.",
    dag: [
      { step: "01. Telemetry Capture", agent: "Sentry Ingestion Agent", status: "done", output: "Anomalous stack trace captured in auth gateway" },
      { step: "02. AST Code Analysis", agent: "Code Synthesizer", status: "done", output: "Buffer edge-case identified in token signature parser" },
      { step: "03. Sandbox Simulation", agent: "Test Runner Agent", status: "done", output: "1,200 fuzzing vectors passed without memory leak" },
      { step: "04. PR Generation", agent: "GitHub Agent", status: "active", output: "PR #418 opened with full verification report and diff" },
    ],
    consensus: [
      { agent: "Security Auditor", role: "Static Code Analysis", verdict: "Approved", metric: "0 CVE regressions" },
      { agent: "Sandbox Agent", role: "Isolated Test Execution", verdict: "Passed", metric: "100% test coverage" },
      { agent: "Policy Sentinel", role: "Least-Privilege Gate", verdict: "Audited", metric: "Safe token scope verified" },
    ],
    terminalLogs: [
      "[09:15:02.102] [GATEWAY_ALERT] Auth token parsing anomaly reported from us-east-1 pod #12",
      "[09:15:02.140] [SWARM_DISPATCH] Code Synthesizer agent assigned AST diagnostic sub-tree",
      "[09:15:02.195] [SANDBOX_EXEC] Micro-VM spun up in 18ms. Fuzz suite running against patch branch",
      "[09:15:02.260] [SECURITY_EVAL] Eval gate score: 0.9997. Zero regression probability",
      "[09:15:02.310] [GIT_OPS] Pull Request created: 'fix(auth): bound check jwt signature payload'",
    ],
  },
  {
    id: "support",
    title: "Enterprise Multi-Modal Support & Ops Engine",
    category: "Customer Operations",
    goal: "Resolve tier-3 technical escalation across Jira, Salesforce, and AWS CloudWatch with verified step-by-step reproduction.",
    dag: [
      { step: "01. Ticket Semantic Parse", agent: "NLP Triage Agent", status: "done", output: "Categorized: High-Severity Database Connection Timeout" },
      { step: "02. Telemetry Correlator", agent: "Ops Telemetry Agent", status: "done", output: "Correlated to connection pool saturation at 14:02 UTC" },
      { step: "03. Action Proposal", agent: "Orchestration Swarm", status: "done", output: "Proposed pool resize + automated client retry configuration" },
      { step: "04. Resolution Dispatch", agent: "Customer Success Agent", status: "active", output: "Detailed incident resolution and SLA recovery credit sent" },
    ],
    consensus: [
      { agent: "Ops Specialist", role: "Infrastructure Telemetry", verdict: "Passed", metric: "Root cause verified" },
      { agent: "Policy Evaluator", role: "SLA & Customer Policy", verdict: "Approved", metric: "Compensation authorized" },
      { agent: "Tone & Voice Guard", role: "Executive Communication", verdict: "Audited", metric: "Brand alignment 10/10" },
    ],
    terminalLogs: [
      "[11:42:33.201] [INGEST] Ingested Tier-3 enterprise ticket #8841 via Zendesk Webhook",
      "[11:42:33.245] [KNOWLEDGE_GRAPH] Queried private vector index: matched 12 historic runbooks",
      "[11:42:33.290] [TOOL_CALL] Executing aws.cloudwatch.get_metric_data(db_connections)",
      "[11:42:33.340] [CONSENSUS] Swarm confirmed root cause: Connection exhaustion during shard migration",
      "[11:42:33.390] [RESOLVE] Customer notified with exact timeline, mitigation, and permanent fix",
    ],
  },
];

const DEFAULT_WORKLOAD: SwarmWorkload = WORKLOADS[0];

export function AgentSwarmShowcase() {
  const [selectedId, setSelectedId] = useState<string>("finance");
  const currentWorkload = WORKLOADS.find((w) => w.id === selectedId) ?? DEFAULT_WORKLOAD;

  return (
    <Section
      id="agent-swarm-engine"
      eyebrow="Autonomous Multi-Agent Architecture"
      title="Multi-agent swarms that plan, debate, and verify."
      description="Single LLMs hallucinate. ZALVY swarms orchestrate specialized agent workers that decompose prompts into acyclic DAGs, execute sandboxed code, and cross-validate before every action."
      rhythm="spacious"
      align="left"
    >
      {/* Workload Selector Buttons */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        {WORKLOADS.map((workload) => {
          const isSelected = workload.id === selectedId;
          return (
            <button
              key={workload.id}
              type="button"
              onClick={() => { setSelectedId(workload.id); }}
              className={`group flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-[0.8125rem] font-medium transition-all duration-300 ${
                isSelected
                  ? "border-[rgb(var(--token-accent)/0.5)] bg-white/[0.08] text-foreground shadow-[0_0_24px_rgb(var(--token-accent)/0.15)]"
                  : "border-white/[0.07] bg-white/[0.02] text-foreground-muted hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-foreground"
              }`}
            >
              <span
                className={`size-2 rounded-full transition-all ${
                  isSelected ? "bg-[rgb(var(--token-accent))] shadow-[0_0_8px_rgb(var(--token-accent))]" : "bg-white/20"
                }`}
              />
              <span>{workload.title}</span>
              <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[0.6875rem] font-mono text-foreground-subtle">
                {workload.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: DAG Execution Pipeline */}
        <div className="lg:col-span-7 flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[rgb(var(--token-surface-raised)/0.7)] p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[rgb(var(--token-accent)/0.12)] text-[rgb(var(--token-accent))]">
                <BrainCircuit size={18} />
              </span>
              <div>
                <h3 className="font-sans text-[0.9375rem] font-semibold text-foreground">
                  Acyclic Execution DAG
                </h3>
                <p className="text-[0.75rem] text-foreground-subtle font-mono">
                  Stateful Graph Engine · 0% Loop Traps
                </p>
              </div>
            </div>
            <Badge variant="iris" size="sm">
              LIVE SWARM TRACE
            </Badge>
          </div>

          <p className="text-[0.875rem] text-foreground-muted leading-relaxed">
            <strong className="text-foreground">Objective:</strong> {currentWorkload.goal}
          </p>

          {/* DAG Steps */}
          <div className="flex flex-col gap-3 pt-2">
            {currentWorkload.dag.map((step, idx) => (
              <div
                key={idx}
                className="group relative flex items-start gap-3.5 rounded-xl border border-white/[0.06] bg-black/30 p-3.5 sm:p-4 transition-all duration-200 hover:border-white/[0.12]"
              >
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--token-accent)/0.15)] text-[rgb(var(--token-accent))] font-mono text-[0.6875rem] font-bold">
                  {idx + 1}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-[0.8125rem] font-semibold text-foreground">
                      {step.step}
                    </span>
                    <span className="font-mono text-[0.6875rem] text-[rgb(var(--token-accent))] bg-[rgb(var(--token-accent)/0.08)] px-2 py-0.5 rounded">
                      {step.agent}
                    </span>
                  </div>
                  <p className="text-[0.75rem] font-mono text-foreground-subtle truncate">
                    ↳ {step.output}
                  </p>
                </div>
                {step.status === "done" ? (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <span className="relative flex size-2 shrink-0 mt-2">
                    <span className="absolute inset-0 rounded-full bg-[rgb(var(--token-accent))] animate-ping opacity-75" />
                    <span className="relative size-2 rounded-full bg-[rgb(var(--token-accent))]" />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Real-Time Terminal Output */}
          <div className="mt-2 rounded-xl border border-white/[0.06] bg-black/80 p-4 font-mono text-[0.75rem]">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-foreground-subtle text-[0.6875rem]">
              <span className="flex items-center gap-1.5">
                <Terminal size={12} className="text-emerald-400" />
                <span>worker.stdout.stream</span>
              </span>
              <span className="text-emerald-400">● 240 FPS TELEMETRY</span>
            </div>
            <div className="mt-2.5 flex flex-col gap-1.5 text-foreground/80 overflow-x-auto">
              {currentWorkload.terminalLogs.map((log, i) => (
                <div key={i} className="leading-snug truncate">
                  <span className="text-[rgb(var(--token-accent))]">{log.slice(0, 14)}</span>
                  <span className="text-foreground-muted">{log.slice(14)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Swarm Consensus & Guarantees */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Swarm Consensus Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[rgb(var(--token-surface-raised)/0.7)] p-6 backdrop-blur-xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
              <span className="font-sans text-[0.9375rem] font-semibold text-foreground flex items-center gap-2">
                <Sparkles size={16} className="text-[rgb(var(--token-accent))]" />
                Swarm Consensus Matrix
              </span>
              <span className="font-mono text-[0.6875rem] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                UNANIMOUS
              </span>
            </div>

            <p className="text-[0.8125rem] text-foreground-muted leading-relaxed">
              Every action must pass cross-agent review before touching production databases or dispatching external webhooks.
            </p>

            <div className="flex flex-col gap-2.5">
              {currentWorkload.consensus.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                >
                  <div className="flex flex-col">
                    <span className="text-[0.8125rem] font-semibold text-foreground">{c.agent}</span>
                    <span className="text-[0.6875rem] text-foreground-subtle">{c.role}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[0.75rem] font-semibold text-emerald-400">
                      {c.verdict}
                    </span>
                    <span className="font-mono text-[0.6875rem] text-foreground-subtle">
                      {c.metric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Guarantees Box */}
          <div className="rounded-2xl border border-[rgb(var(--token-accent)/0.2)] bg-gradient-to-br from-[rgb(var(--token-surface-raised))] to-[rgb(var(--token-surface))] p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[rgb(var(--token-accent)/0.15)] text-[rgb(var(--token-accent))]">
                <Layers size={18} />
              </span>
              <h4 className="font-sans text-[0.9375rem] font-semibold text-foreground">
                Enterprise Production Guarantees
              </h4>
            </div>

            <ul className="flex flex-col gap-2 text-[0.8125rem] text-foreground-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[rgb(var(--token-accent))] shrink-0" />
                <span><strong>Zero-Trust Sandboxes:</strong> Ephemeral micro-VM per execution</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[rgb(var(--token-accent))] shrink-0" />
                <span><strong>Cryptographic Audit Logs:</strong> Tamper-proof SHA-256 traces</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[rgb(var(--token-accent))] shrink-0" />
                <span><strong>Air-Gapped Privacy:</strong> Deployable on private VPC or on-prem</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button asChild variant="primary" size="md" fullWidth className="group">
                <Link href="/agents">
                  Explore Autonomous Agent Engine
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
