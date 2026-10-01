"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { 
  Bot, 
  BrainCircuit, 
  Terminal, 
  CheckCircle2, 
  Workflow, 
  ShieldCheck, 
  Cpu, 
  Zap 
} from "lucide-react";

/**
 * ZALVY — Autonomous Intelligence System Loop
 * Interactive visual representation of ZALVY's multi-agent execution pipeline.
 * Features live node inspection, glowing particle pulses, and real-time execution telemetry.
 */
interface NodeDetail {
  id: string;
  label: string;
  sub: string;
  badge: string;
  icon: typeof Bot;
  metric: string;
  latency: string;
  status: string;
  detail: string;
  trace: string;
}

const SYSTEM_NODES: [NodeDetail, ...NodeDetail[]] = [
  {
    id: "input",
    label: "Input",
    sub: "Context Ingestion",
    badge: "Stream",
    icon: Zap,
    metric: "4.2M tokens/s",
    latency: "8ms",
    status: "Ingesting",
    detail: "Multimodal events, ERP webhooks, customer queries, and database changes stream in real time.",
    trace: "event.stream.ingest -> schema_validate(0x7F2A) -> tokenized: 1,420 tokens",
  },
  {
    id: "reason",
    label: "Reason",
    sub: "DAG Planner",
    badge: "Neural",
    icon: BrainCircuit,
    metric: "0.02% drift",
    latency: "42ms",
    status: "Planning",
    detail: "Decomposes complex requests into acyclic sub-task dependency graphs with stateful memory.",
    trace: "planner.dag.compile -> 4 sub-tasks created -> memory_retrieval(similarity: 0.94)",
  },
  {
    id: "swarm",
    label: "Swarm",
    sub: "Multi-Agent Consensus",
    badge: "Consensus",
    icon: Bot,
    metric: "3 Workers",
    latency: "68ms",
    status: "Validating",
    detail: "Specialized agents (Data, Logic, Security) cross-examine plans before granting execution tokens.",
    trace: "swarm.consensus -> DataAgent: PASS | SecurityAgent: 0 PII detected | Eval: 0.998",
  },
  {
    id: "tools",
    label: "Tools",
    sub: "Sandbox VM",
    badge: "Zero-Trust",
    icon: Terminal,
    metric: "Micro-VM",
    latency: "34ms",
    status: "Running",
    detail: "Executes Python scripts, SQL queries, and API calls within air-gapped container sandboxes.",
    trace: "sandbox.exec(vm_id: 884) -> query_db('SELECT * FROM ledger') -> exit_code: 0",
  },
  {
    id: "action",
    label: "Action",
    sub: "Policy-Gated Ops",
    badge: "Verified",
    icon: Workflow,
    metric: "SOC2 Gated",
    latency: "15ms",
    status: "Executing",
    detail: "Carries out idempotent enterprise actions with automated rollback safety mechanisms.",
    trace: "ops.dispatch -> webhook.post(target: 'erp.sync') -> ACK 200 OK",
  },
  {
    id: "result",
    label: "Result",
    sub: "Eval & Telemetry",
    badge: "Loopback",
    icon: CheckCircle2,
    metric: "99.9% SLA",
    latency: "6ms",
    status: "Verified",
    detail: "Evaluated against ground truth, signed with cryptographic audit hashes, and stored for continuous learning.",
    trace: "eval.gate -> hash: sha256:4a8b... -> trace_recorded -> ready for next loop",
  },
];

const DEFAULT_NODE: NodeDetail = SYSTEM_NODES[0];

export function InfinityFlowVisual() {
  const reduce = useReducedMotion();
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<NodeDetail | null>(null);

  // Auto-cycle through nodes to give a live breathing heartbeat
  useEffect(() => {
    if (reduce || hoveredNode) return;
    const interval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % SYSTEM_NODES.length);
    }, 2800);
    return () => { clearInterval(interval); };
  }, [reduce, hoveredNode]);

  const currentNode = hoveredNode ?? SYSTEM_NODES[activeNodeIndex] ?? DEFAULT_NODE;

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[rgb(var(--token-surface-raised)/0.65)] backdrop-blur-2xl shadow-[0_32px_80px_-16px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.05)_inset]"
      role="region"
      aria-label="ZALVY Autonomous System Architecture Visualizer"
    >
      {/* Specular top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.22] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[rgb(var(--token-accent)/0.6)] to-transparent opacity-50 blur-[1px]" />

      {/* Layered atmospheric glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgb(var(--token-accent)/0.09),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgb(var(--token-iris)/0.07),transparent_60%)]" />
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgb(255_255_255) 1px, transparent 1px), linear-gradient(90deg, rgb(255_255_255) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative p-6 sm:p-8 lg:p-9 flex flex-col gap-6">
        {/* Header — ZALVY Runtime Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex size-2.5 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[rgb(var(--token-accent))] animate-ping opacity-40" />
              <span className="relative size-2 rounded-full bg-[rgb(var(--token-accent))] shadow-[0_0_10px_rgb(var(--token-accent))]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.75rem] font-semibold tracking-wider text-foreground">
                ZALVY SWARM ENGINE
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-mono font-medium tracking-wider text-emerald-300">
                ACTIVE PIPELINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[0.6875rem] text-foreground-subtle tracking-tight">
              LATENCY: <strong className="text-foreground">{currentNode.latency}</strong>
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
              <Cpu size={12} className="text-[rgb(var(--token-accent))]" />
              <span className="font-mono text-[0.6875rem] text-foreground-muted">DAG v4.8</span>
            </div>
          </div>
        </div>

        {/* Nodes interactive strip */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {SYSTEM_NODES.map((node, index) => {
            const Icon = node.icon;
            const isActive = currentNode.id === node.id;

            return (
              <button
                key={node.id}
                type="button"
                onMouseEnter={() => { setHoveredNode(node); }}
                onMouseLeave={() => { setHoveredNode(null); }}
                onClick={() => { setActiveNodeIndex(index); }}
                className={`group relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-300 ${
                  isActive
                    ? "border-[rgb(var(--token-accent)/0.45)] bg-white/[0.07] shadow-[0_0_24px_rgb(var(--token-accent)/0.12),0_1px_0_0_rgb(255_255_255/0.1)_inset]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                }`}
              >
                {/* Active indicator top line */}
                {isActive && (
                  <motion.div
                    layoutId="activeNodeIndicator"
                    className="absolute inset-x-2 -top-px h-[2px] bg-gradient-to-r from-transparent via-[rgb(var(--token-accent))] to-transparent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between w-full mb-2.5">
                  <span
                    className={`inline-flex size-7 items-center justify-center rounded-lg border transition-colors ${
                      isActive
                        ? "border-[rgb(var(--token-accent)/0.4)] bg-[rgb(var(--token-accent)/0.15)] text-[rgb(var(--token-accent))]"
                        : "border-white/[0.08] bg-white/[0.04] text-foreground-subtle group-hover:text-foreground"
                    }`}
                  >
                    <Icon size={14} strokeWidth={2} />
                  </span>
                  <span className="font-mono text-[0.625rem] font-medium text-foreground-subtle uppercase">
                    0{index + 1}
                  </span>
                </div>

                <span className="font-sans text-[0.8125rem] font-semibold tracking-tight text-foreground">
                  {node.label}
                </span>
                <span className="font-mono text-[0.6875rem] text-foreground-subtle leading-tight mt-0.5">
                  {node.sub}
                </span>

                <div className="mt-2.5 flex items-center gap-1.5 w-full pt-2 border-t border-white/[0.04]">
                  <span
                    className={`size-1.5 rounded-full ${
                      isActive ? "bg-[rgb(var(--token-accent))] shadow-[0_0_6px_rgb(var(--token-accent))]" : "bg-white/20"
                    }`}
                  />
                  <span className="font-mono text-[0.625rem] text-foreground-muted truncate">
                    {node.metric}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Node Telemetry Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNode.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-white/[0.08] bg-black/40 p-4 sm:p-5 backdrop-blur-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-[rgb(var(--token-accent)/0.12)] text-[rgb(var(--token-accent))]">
                  <ShieldCheck size={14} />
                </span>
                <span className="font-sans text-[0.875rem] font-semibold text-foreground">
                  Stage: {currentNode.label} — {currentNode.sub}
                </span>
                <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[0.625rem] text-[rgb(var(--token-accent))] uppercase">
                  {currentNode.badge}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[0.6875rem] text-foreground-subtle">
                <span>Execution: <strong className="text-emerald-400">{currentNode.latency}</strong></span>
                <span>•</span>
                <span>Status: <strong className="text-foreground">{currentNode.status}</strong></span>
              </div>
            </div>

            <p className="mt-3 text-[0.8125rem] text-foreground-muted leading-relaxed">
              {currentNode.detail}
            </p>

            {/* Trace stream terminal */}
            <div className="mt-3.5 flex items-center gap-2 rounded-lg bg-black/70 px-3.5 py-2.5 font-mono text-[0.6875rem] text-foreground/90 border border-white/[0.05] overflow-x-auto">
              <span className="text-[rgb(var(--token-accent))] shrink-0">$ zalvy-trace &gt;</span>
              <span className="text-emerald-300 font-medium truncate">{currentNode.trace}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Metrics Ribbon */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-4">
          <div className="flex flex-col">
            <span className="font-mono text-[0.875rem] font-bold text-foreground">99.8%</span>
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-foreground-subtle">
              Deterministic Accuracy
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[0.875rem] font-bold text-foreground">&lt; 120ms</span>
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-foreground-subtle">
              P99 DAG Latency
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[0.875rem] font-bold text-emerald-400">Zero Leakage</span>
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-foreground-subtle">
              Air-Gapped SOC2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
