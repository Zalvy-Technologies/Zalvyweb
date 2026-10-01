export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
  type: "feature" | "improvement" | "fix" | "breaking";
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2.4.0",
    date: "2026-07-14",
    title: "Agents v2 — grounded memory, tool-call audit logs, policy-gated promotion",
    type: "feature",
    changes: [
      "Agent memory layer: partitioned, versioned, revocable per workspace. Memory never used for shared model training.",
      "Structured tool-call audit logging: every tool call emits a step record with model output, authorization state, and latency. Replayable from trace.",
      "Policy-gated promotion: agent deployments require eval-harness passes. Regression on model bumps, prompt changes, or tooling revisions blocks production by policy.",
      "Per-step cost attribution: every agent tool call now emits cost telemetry exported via OTel.",
    ],
  },
  {
    version: "v2.3.1",
    date: "2026-07-08",
    title: "Inference fleet — capacity reservation enforcement",
    type: "improvement",
    changes: [
      "Capacity reservation enforcement: per-customer capacity dips no longer propagate to neighboring customers. Graceful fault instead of cliff-drop.",
      "Cold-start budget tightened from 500ms to 300ms across all regions.",
      "Monthly availability SLO dashboard now available per-customer in the platform console.",
      "BYOM pipeline now supports fine-tuned weights served from customer-managed buckets.",
    ],
  },
  {
    version: "v2.3.0",
    date: "2026-06-28",
    title: "Workflow runtime — per-step cost telemetry and replay from point of failure",
    type: "feature",
    changes: [
      "Workflow runtime now emits per-step cost telemetry — every action reports duration, token cost, and dependency cost. Aggregated by workflow, team, and customer.",
      "Replay from point of failure: persisted state machines resume from the failed step, not the beginning. No full-rerun, no manual cleansing of duplicate side effects.",
      "Policy-gated actions: high-impact workflow actions require human-in-the-loop approval. Approvals signed, logged, and tied to originating trace.",
      "Cost telemetry export via OTel — compatible with Datadog, Honeycomb, and any OTel-compatible backend.",
    ],
  },
  {
    version: "v2.2.1",
    date: "2026-06-15",
    title: "Chatbot grounding pipeline — citations mandatory, multilingual negotiation",
    type: "improvement",
    changes: [
      "Knowledge-grounded responses now emit mandatory citations for every factual claim. Non-cited claims surfaced as such.",
      "Response-language negotiation per session — locale-aware formatting with back-alignment to source corpus. No translated responses; generated in requested language.",
      "Multi-turn memory scoping: per-session, per-user-policy; never shared across customers, never used for shared training. Memory is revocable.",
    ],
  },
  {
    version: "v2.2.0",
    date: "2026-06-01",
    title: "Developer Tools — Python SDK GA, eval harness shipped open-source",
    type: "feature",
    changes: [
      "Python SDK (v1.0.0): async-native, structured tool-call dispatch, OTel traces exported by default. Parity with TypeScript SDK.",
      "Eval harness shipped open-source under MIT license: regression suites for model bumps, prompt changes, tooling revisions. CI native integration.",
      "Go SDK (v0.9.0-beta): streaming responses, structured tool calls, trace ID propagation.",
      "OTel-native trace export across all three SDKs. No vendor-specific protocol to adopt.",
    ],
  },
  {
    version: "v2.1.0",
    date: "2026-05-14",
    title: "Platform — SOC 2 Type II certified, HIPAA BAA available on Enterprise",
    type: "feature",
    changes: [
      "SOC 2 Type II certification awarded: audited across security, availability, and confidentiality. Reports available under MNDA via Trust Center.",
      "HIPAA BAA available on Enterprise tier. PHI handling isolated per workspace, never used to train shared models.",
      "Per-shipment changelog: every deployed agent, workflow, and SDK emits a structured change record. Customer view matches engineering view of what shipped.",
      "Engineering on-call, not 'support': P0 incidents reach a name, not a ticket queue. On-call rotations staffed by engineers who built the system.",
    ],
  },
  {
    version: "v2.0.0",
    date: "2026-04-07",
    title: "ZALVY v2 — platform fabric GA across six surfaces",
    type: "breaking",
    changes: [
      "Platform fabric GA: agents, automation, chatbots, inference, studio, and developer tools — single operating fabric across six product surfaces.",
      "Observability plane: per-step traces, cost telemetry, and latency attribution shared across every surface.",
      "Security posture: unified across every deployment — SOC 2 Type II pipeline, workspace isolation, data partitioning.",
      "Developer SDKs: TypeScript and Python SDKs with structured tool calls, trace IDs, and OTel-native observability.",
      "ZALVY Studio: engagements practice launched — senior staff engineers, quarterly scoping, written close-out reviews.",
      "Internship program: first cohort accepted — 12 interns, 1:1 mentorship, production-shipment requirement.",
    ],
  },
];
