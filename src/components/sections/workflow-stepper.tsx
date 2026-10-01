"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Shield } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

interface StepDetail {
  id: string;
  number: string;
  label: string;
  tagline: string;
  desc: string;
  spec: { key: string; value: string }[];
  codeSnippet: string;
}

const STEPS: [StepDetail, ...StepDetail[]] = [
  {
    id: "trigger",
    number: "01",
    label: "Trigger Event",
    tagline: "High-throughput ingestion & context capture",
    desc: "An event fires via webhook, scheduled cron, kafka stream, or authenticated API. ZALVY captures full session context, identity claims, and idempotency keys.",
    spec: [
      { key: "Protocol", value: "HTTP/2, gRPC, Kafka" },
      { key: "Idempotency", value: "Strict SHA-256 Key" },
      { key: "Ingestion Latency", value: "4ms (p99)" },
    ],
    codeSnippet: `event_stream.ingest({
  type: "order.dispute_raised",
  source: "gateway.eu_west",
  idempotency_key: "idmp_89f0a21",
  payload_ctx: { amount: 1420.00, currency: "USD" }
});`,
  },
  {
    id: "decision",
    number: "02",
    label: "Policy Decision",
    tagline: "Deterministic routing & safety boundaries",
    desc: "Organizational policy and safety boundaries evaluate the intent. Routes to appropriate sub-agents or holds in human-in-the-loop review if risk threshold exceeds policy.",
    spec: [
      { key: "Policy Engine", value: "Zero-Trust WASM Filter" },
      { key: "Audit Log", value: "Append-Only Merkle Tree" },
      { key: "Gating Mode", value: "Auto (Score: 0.96)" },
    ],
    codeSnippet: `const decision = await policyEngine.evaluate({
  intent: "dispute_resolution",
  riskThreshold: 0.85,
  escalationRole: "risk_ops"
});
// Status: APPROVED -> Dispatched to Specialist Agent`,
  },
  {
    id: "agent",
    number: "03",
    label: "Reasoning Agent",
    tagline: "Autonomous multi-tool orchestration",
    desc: "The specialist agent decomposes the problem into an execution DAG. It calls database vectors, verifies contracts, and traces every token step with OpenTelemetry.",
    spec: [
      { key: "Runtime", value: "Isolated MicroVM Sandbox" },
      { key: "Telemetry", value: "OTel Traced (Span ID #84a)" },
      { key: "Context Window", value: "128k Grounded Tokens" },
    ],
    codeSnippet: `const plan = await agent.reason({
  tools: [bankApi, crmVectorStore, fraudShield],
  strategy: "cot_self_consistency",
  maxSubTasks: 4
});`,
  },
  {
    id: "action",
    number: "04",
    label: "Grounded Action",
    tagline: "Transactional side-effect execution",
    desc: "Actions execute against internal systems with two-phase commit support. Every mutating request is signed and replayable from failure points without duplicate execution.",
    spec: [
      { key: "Commit Type", value: "2-Phase Transactional" },
      { key: "Rollback", value: "Deterministic Snapshot" },
      { key: "Replay Safety", value: "Guaranteed Exact-Once" },
    ],
    codeSnippet: `await transaction.execute([
  bankApi.reverseCharge(claimId),
  crm.updateLedger(userId, "reimbursed"),
  notification.dispatchReceipt(userId)
]);`,
  },
  {
    id: "result",
    number: "05",
    label: "Verified Result",
    tagline: "Eval-gated verification & telemetry wrap",
    desc: "Post-execution evaluator checks the final output against strict SLA and safety metrics. The execution is permanently logged to your audit plane with full reproducibility.",
    spec: [
      { key: "Eval Verdict", value: "PASSED (100% Assertion)" },
      { key: "Cost Metrics", value: "$0.0031 / run" },
      { key: "Total Duration", value: "84ms E2E" },
    ],
    codeSnippet: `evaluator.verify({
  assertion: "balance_net_zero == true",
  latency_budget_ms: 100,
  audit_signed: true
});
// 🟢 Workflow completed successfully. Trace stored.`,
  },
];

export function WorkflowStepper() {
  const [activeId, setActiveId] = useState<string>("agent");
  const activeStep: StepDetail = STEPS.find((s) => s.id === activeId) ?? STEPS[0];

  return (
    <Section
      id="automation"
      rhythm="spacious"
      eyebrow="Automation Architecture"
      title="Continuous loops. Observed at every state."
      description="No unmonitored black boxes. Every autonomous action follows a deterministic, policy-gated state machine with real-time OpenTelemetry tracing."
    >
      <div className="rounded-3xl border border-white/[0.08] bg-surface-raised/60 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl">
        {/* Step Navigation Pipeline */}
        <div className="relative">
          {/* Connecting line */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-[10%] right-[10%] top-[2.25rem] h-0.5 bg-gradient-to-r from-white/5 via-accent/30 to-white/5"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {STEPS.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseEnter={() => { setActiveId(s.id); }}
                  onClick={() => { setActiveId(s.id); }}
                  className="group relative text-left focus-visible:outline-none"
                  aria-current={isActive ? "step" : undefined}
                >
                  <div
                    className={cn(
                      "relative flex flex-col gap-2.5 rounded-2xl border p-4 sm:p-5 transition-all duration-300",
                      isActive
                        ? "border-accent/40 bg-surface-overlay shadow-[0_0_24px_rgb(var(--token-accent)/0.12)] scale-[1.02]"
                        : "border-white/[0.06] bg-surface/80 hover:border-white/15 hover:bg-surface-raised/90",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex size-7 items-center justify-center rounded-lg font-mono text-xs font-semibold transition-colors duration-200",
                          isActive
                            ? "bg-accent text-accent-foreground shadow-[0_0_10px_rgb(var(--token-accent)/0.5)]"
                            : "bg-white/[0.05] text-foreground-subtle border border-white/10",
                        )}
                      >
                        {s.number}
                      </span>
                      {isActive && (
                        <span className="relative flex size-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                          <span className="relative inline-flex rounded-full size-2 bg-accent" />
                        </span>
                      )}
                    </div>

                    <div>
                      <span
                        className={cn(
                          "font-display text-sm font-semibold transition-colors duration-200 block",
                          isActive ? "text-accent" : "text-foreground group-hover:text-foreground",
                        )}
                      >
                        {s.label}
                      </span>
                      <span className="t-caption text-[0.75rem] text-foreground-subtle leading-tight line-clamp-1 mt-0.5">
                        {s.tagline}
                      </span>
                    </div>

                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-px left-4 right-4 h-0.5 transition-opacity duration-300",
                        isActive ? "bg-accent opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Detail & Interactive Console */}
        <div className="mt-8 grid grid-cols-12 gap-5 items-stretch">
          {/* Left Detail Panel */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-surface/90 p-6 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <Badge variant="iris" size="sm">
                    Phase {activeStep.number}
                  </Badge>
                  <span className="font-mono text-xs text-foreground-subtle">
                    {activeStep.id.toUpperCase()}_STAGE
                  </span>
                </div>

                <h3 className="t-h3 text-foreground font-display font-semibold">
                  {activeStep.label}
                </h3>

                <p className="t-body text-muted leading-relaxed">
                  {activeStep.desc}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/[0.06] pt-4">
                  {activeStep.spec.map((item) => (
                    <div key={item.key} className="flex flex-col gap-1">
                      <span className="t-caption text-[0.6875rem] font-mono text-foreground-subtle uppercase tracking-wider">
                        {item.key}
                      </span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-mono text-foreground-subtle">
              <span className="inline-flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-400" /> Policy Guard Active
              </span>
              <span>OTel Trace: #8f92b</span>
            </div>
          </div>

          {/* Right Live Execution Code Block */}
          <div className="col-span-12 lg:col-span-6 flex flex-col rounded-2xl border border-white/[0.08] bg-[#05070a] p-5 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-foreground-subtle">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-500/80" />
                <span className="size-2.5 rounded-full bg-amber-500/80" />
                <span className="size-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[0.75rem] text-foreground-subtle">zalvy_runtime.ts</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[0.6875rem] text-emerald-400">
                <CheckCircle2 size={12} /> Sandbox OK
              </span>
            </div>

            <div className="flex-1 py-4 overflow-x-auto">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeStep.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-foreground-muted leading-relaxed"
                >
                  <code>{activeStep.codeSnippet}</code>
                </motion.pre>
              </AnimatePresence>
            </div>

            <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-[0.6875rem] text-foreground-subtle">
              <span>Memory: 42MB / 128MB</span>
              <span className="text-accent">Live Telemetry Hook</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
