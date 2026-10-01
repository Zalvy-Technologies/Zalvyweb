import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  Braces,
  Briefcase,
  FlaskConical,
  Layers,
  Microscope,
  Ruler,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  customer: string;
  sector: string;
  timeline: string;
  teamSize: string;
  challenge: string;
  approach: string;
  solution: string;
  results: { value: string; label: string }[];
  note: { body: string; attribution: string };
  technologies: string[];
  icon: LucideIcon;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  detail: string;
  duration: string;
  icon: LucideIcon;
  output: string;
}

export interface EngineeringNote {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  summary: string;
}

export interface OssProject {
  name: string;
  slug: string;
  description: string;
  language: string;
  license: string;
  stars?: string;
  npmDownloads?: string;
  url: string;
  docsUrl?: string;
  icon: LucideIcon;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "helios-agent-routing",
    title: "Grounding agents in a 4.2B-row health claims knowledge base",
    summary:
      "Helios wanted to retire scripted triage flows. ZALVY shipped a grounded agent that cut escalations to clinicians and surfaced 41% of routable claims for auto-adjudication.",
    customer: "Helios",
    sector: "Healthcare",
    timeline: "14 weeks",
    teamSize: "4 ZALVY engineers + 2 Helios domain experts",
    challenge:
      "Helios operated a digital health insurance platform processing over 14 million claims annually. Triage routing ran through a brittle, hand-maintained rules pipeline written between 2014 and 2023. Routing errors accumulated silently: claims that should have been auto-adjudicated were escalated to clinicians, adding days of latency and millions in operational cost. Helios needed an agent system that could reason over a 4.2 billion-row knowledge base — policy documents, clinical guidelines, historical adjudication records — and surface routable claims with cost telemetry per step.",
    approach:
      "ZALVY began with a two-week paid research brief, instrumenting the existing rules pipeline to produce a labeled dataset of routing decisions. The ZALVY team then designed a grounded agent architecture: structured retrieval over the knowledge base with mandatory citations, a tool-call dispatch layer that recorded every decision step with audit traceability, and a regression eval suite that ran on every model bump and every prompt revision.",
    solution:
      "The agent shipped with: (1) a partitioned, versioned memory layer over the 4.2B-row knowledge base — retrieval with citation anchoring and a confidence score per claim; (2) per-step audit logging — every tool call emitted a structured step record, making every routing decision replayable; (3) an eval harness running on every model bump, blocking production deployment by policy if regression thresholds were met. The system cut clinician escalations by 72% and surfaced 41% of routable claims for auto-adjudication within the first six weeks of production.",
    results: [
      { value: "41%", label: "Routable claims auto-adjudicated" },
      { value: "−72%", label: "Clinician escalations" },
      { value: "4.2B", label: "Rows in grounded knowledge base" },
      { value: "94ms", label: "Tool-call overhead p99" },
    ],
    note: {
      body: "The agent we shipped is grounded, observable, and trustworthy — so the team replacing rules written over eight years could sleep through the cutover.",
      attribution: "Staff Engineer, ZALVY",
    },
    technologies: ["TypeScript", "Go", "PostgreSQL + pgvector", "OpenTelemetry"],
    icon: Briefcase,
  },
  {
    slug: "quanta-research-ops",
    title: "Operational research loop: from 11-day cycles to 9-hour sprints",
    summary:
      "Quanta's quantitative researchers were hand-rolling data pipelines. ZALVY built an orchestration plane with per-step cost lines and recovered 80% of researcher time.",
    customer: "Quanta",
    sector: "Quantitative research",
    timeline: "9 weeks",
    teamSize: "3 ZALVY engineers",
    challenge:
      "Quanta runs quantitative research on alternative data across global markets. Eight senior researchers spent 80% of their time hand-rolling data pipelines — extraction from vendor APIs, normalization, model inference, and output formatting — across 11-day cycles. Each cycle required manual intervention at multiple stages; errors cascaded silently and recovery meant restarting the full pipeline. Researchers were not researching — they were operating brittle data ETL in Python notebooks.",
    approach:
      "ZALVY scoped a three-person engagement to one quarter with a single success metric: reduce average research cycle time by 80%. The team instrumented two existing Quanta pipelines to capture every step with latency and cost measurements, built a persisted state-machine runtime with replay from point of failure, and shipped a per-step cost telemetry dashboard with OTel-native export.",
    solution:
      "The orchestration plane shipped in nine weeks: (1) persisted state machines replacing scripted pipelines — every step instrumented with duration, cost, and dependency attribution; (2) replay from point of failure — no full-rerun, no manual cleansing of duplicate side effects; (3) a cost-attribution plane exported via OTel, so the finance team could read the same step-level invoice the researchers saw. Average research cycle time dropped from 11 days to 9 hours — an 82% reduction. $11M annual operating expense recovered across shipped engagements.",
    results: [
      { value: "−82%", label: "Research cycle time reduction" },
      { value: "$11M", label: "Recovered annual opex" },
      { value: "9 hours", label: "Average research cycle, post-ZALVY" },
      { value: "5,400", label: "Workflows in production" },
    ],
    note: {
      body: "We measured research cycle time before and after. Eleven days to nine hours. We didn't optimize the loop — we removed the part of the loop that wasn't research.",
      attribution: "Senior Engineer, ZALVY",
    },
    technologies: ["Go", "TypeScript", "OpenTelemetry", "ClickHouse"],
    icon: Zap,
  },
  {
    slug: "aperture-inference",
    title: "Sub-90ms inference for a live robotics control loop",
    summary:
      "Aperture's robot vision pipeline was fragile on edge gear. ZALVY rebuilt serving for deterministic latency with cold-start budget under 300ms — every model run observable.",
    customer: "Aperture",
    sector: "Industrial robotics",
    timeline: "16 weeks",
    teamSize: "5 ZALVY engineers + 3 Aperture embedded systems engineers",
    challenge:
      "Aperture ships autonomous industrial robots in warehouses and manufacturing floors. Their vision inference pipeline ran on edge GPUs with unpredictable cold-start latency — spikes above 2 seconds during model swap cycles, causing robot control loops to fault. Deterministic sub-100ms latency was a hard requirement for live control loop integration. No vendor offered a latency guarantee; no competitor could give Aperture a written sub-100ms p99 commitment.",
    approach:
      "ZALVY designed a deterministic serving architecture from scratch: per-robot model pool reservations, enforced cold-start budgets via routing (graceful fault instead of cliff-drop when pool depleted), and per-model-run observability with cost and latency attribution. The team instrumented Aperture's existing inference loop to establish baseline latency distributions, then shipped a Rust serving runtime with GPU scheduling tuned for deterministic sub-90ms p99.",
    solution:
      "The inference serving layer shipped with: (1) per-robot capacity reservations — capacity dips for one robot never propagated to another; (2) cold-start budget enforced at 300ms — traffic gracefully faulted rather than cliff-dropping when pools depleted; (3) per-run observability — latency and model metadata persisted per inference run, exported via OTel; (4) BYOM pipeline — Aperture brought their own fine-tuned vision models, served with the same operational rigor. p99 inference latency: 87ms. Monthly availability SLO: 99.97%.",
    results: [
      { value: "87ms", label: "p99 inference latency" },
      { value: "<300ms", label: "Cold-start budget, enforced" },
      { value: "99.97%", label: "Monthly availability SLO" },
      { value: "14", label: "Regions in production" },
    ],
    note: {
      body: "Deterministic sub-90ms isn't a vendor number you can ask for. It's something you build — with design reviews, postmortems, and named owners.",
      attribution: "Staff Engineer, ZALVY",
    },
    technologies: ["Rust", "CUDA", "OpenTelemetry", "TypeScript"],
    icon: Layers,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Research brief",
    description:
      "Two weeks of paid discovery. Instrument your existing pipeline to produce a labeled dataset. Ship a written brief.",
    detail:
      "We instrument your current system — whether it's a rules pipeline, a notebook collection, or a vendor integration — to produce a labeled dataset of decisions, costs, and outcomes. The brief is a 6-10 page document that defines the success metric, maps the current architecture, outlines the proposed approach, and lists the risks we share. The brief is yours whether or not we proceed to build.",
    duration: "2 weeks",
    icon: Microscope,
    output: "Written research brief, labeled dataset, success metric agreed in writing.",
  },
  {
    step: 2,
    title: "Architecture review",
    description:
      "A single design document that maps every component, every failure mode, and the observability plane.",
    detail:
      "The architecture review is a living document shared between ZALVY and your engineering team. It maps every component, every integration point, every anticipated failure mode, and the observability plane that will emit traces and cost lines from day one. The review is updated as the system evolves — not frozen at kickoff. This is where we surface risk: if a component choice has a documented failure mode, we write it down before we build.",
    duration: "1 week (parallel with Research brief)",
    icon: Ruler,
    output: "Architecture document with component map, failure-mode catalog, observability design.",
  },
  {
    step: 3,
    title: "First production deploy",
    description:
      "A minimal viable system that runs in production with the observability plane emitting traces.",
    detail:
      "We ship to production early — not to staging forever. The first deploy is a minimal viable system that exercises the core path: retrieval, inference, tool dispatch, or workflow orchestration. It emits traces to OTel from the first request. It costs money from the first request — and the cost telemetry tells you which step incurred which cost. Median time to first production deploy across ZALVY engagements: 4 weeks.",
    duration: "3-6 weeks",
    icon: Terminal,
    output:
      "Deployed system with observability plane, cost telemetry per step, and a documented deployment.",
  },
  {
    step: 4,
    title: "Feature iteration",
    description:
      "Weekly deploys with regression evals. Every feature ships with an eval harness that blocks regression.",
    detail:
      "From the first deploy onward, every feature ships with an eval harness. Regression runs on every model bump, every prompt change, and every tooling revision. Failures block production deployment by policy — not by manual gate or meeting approval. Weekly deploys are the rhythm; every Friday afternoon ships to production with a written changelog that documents what shipped, what changed, and what was measured.",
    duration: "Remaining engagement weeks",
    icon: Sparkles,
    output: "Shipment-by-shipment changelog with eval results per deploy.",
  },
  {
    step: 5,
    title: "Quarterly operation review",
    description:
      "A written close-out that tours the success metric, the architecture, and what we would not build again.",
    detail:
      "At the end of the quarter, we publish a written operation review. It tours the success metric: did we hit it? If not, we write down why. It maps the final architecture — what was built, what was replaced, what was deferred. It includes a cost analysis: what did the engagement cost, what did the system save, what did the system add to ongoing operational spend? And it includes a section titled 'What we would not build again' — the design decisions that proved expensive or fragile, written down so the next engagement doesn't repeat them. The review is published with the customer's consent.",
    duration: "1 week",
    icon: ScrollText,
    output: "Published Quarterly Operation Review (QOR), metrics dashboards, final changelog.",
  },
];

export const ENGINEERING_NOTES: EngineeringNote[] = [
  {
    slug: "agents-hold-up-past-the-demo",
    title: "Agents that hold up past the demo",
    date: "2026-07-14",
    author: "ZALVY Platform Engineering",
    tags: ["agents", "architecture", "production"],
    summary:
      "A tour of the four operating-fabric primitives that make ZALVY agents survive their first production deploy: grounded memory with citation anchoring, structured tool-call audit logging, per-shipment eval harnesses, and policy-gated promotion.",
  },
  {
    slug: "cost-lines-and-the-workflow-invoice",
    title: "Cost lines and the workflow invoice",
    date: "2026-07-01",
    author: "ZALVY Platform Engineering",
    tags: ["automation", "cost", "observability"],
    summary:
      "Most automation falls apart six months in, when the invoice arrives. This post describes how ZALVY emits cost telemetry per workflow step — exported via OTel, aggregated by team, by customer, and by cost center — so the workflow and the invoice read the same way.",
  },
  {
    slug: "cold-starts-are-a-budget",
    title: "Cold starts are a budget, not an emergency",
    date: "2026-06-18",
    author: "ZALVY Infrastructure",
    tags: ["inference", "serving", "reliability"],
    summary:
      "The longest-lived incident class with AI in production is the cold-start cliff. This post describes ZALVY's deterministic cold-start enforcement model: per-customer capacity reserves, graceful faulting when pools are depleted, and cold-start budgets enforced at routing — not measured at p50.",
  },
  {
    slug: "evals-as-ci-not-meeting",
    title: "Evals as CI, not as a meeting",
    date: "2026-05-28",
    author: "ZALVY Research",
    tags: ["evaluation", "ci", "reliability"],
    summary:
      "The primary failure mode for AI evaluation is that it happens in a meeting, not in CI. This post describes ZALVY's eval philosophy: regression suites that run on every model bump, every prompt change, and every tooling revision — failures block production deployment by policy.",
  },
  {
    slug: "postmortem-inference-regression-q4-2025",
    title: "Postmortem: Inference regression, Q4 2025",
    date: "2026-01-08",
    author: "ZALVY Infrastructure",
    tags: ["postmortem", "inference", "incident"],
    summary:
      "On 12 November 2025, a serving-route update introduced a latency regression that tripped the p99 SLO for three enterprise customers over a 40-minute window. This postmortem describes the root cause, the detection gap, and the structural fix shipped the following week.",
  },
];

export const OSS_PROJECTS: OssProject[] = [
  {
    name: "open-evals",
    slug: "open-evals",
    description:
      "The evaluation harness that ships with every ZALVY deployment. Regression suites run on model bumps, prompt changes, and tooling revisions — failures block production by policy. TypeScript, Python, Go SDKs with CI native integration.",
    language: "TypeScript",
    license: "MIT",
    npmDownloads: "12K+/mo",
    url: "https://github.com/zalvy/open-evals",
    docsUrl: "https://docs.zalvy.com/evals",
    icon: FlaskConical,
  },
  {
    name: "trace-viewer",
    slug: "trace-viewer",
    description:
      "A real-time OpenTelemetry trace viewer built for agent step traces. Waterfall UI with cost-per-step breakdown, tool-call replay, and latency attribution. Runs on the same observability plane as ZALVY production.",
    language: "TypeScript",
    license: "MIT",
    stars: "3.2K",
    url: "https://github.com/zalvy/trace-viewer",
    docsUrl: "https://trace-viewer.zalvy.com",
    icon: Braces,
  },
  {
    name: "pgvector-recall",
    slug: "pgvector-recall",
    description:
      "A recall-evaluation harness for PostgreSQL vector stores. Cross-index accuracy comparison toolkit — measures HNSW vs IVFFlat recall at configurable dimensions and query counts. Adopted by the ZALVY internal eval pipeline for agent grounding.",
    language: "Python",
    license: "MIT",
    npmDownloads: "8K+/mo",
    url: "https://github.com/zalvy/pgvector-recall",
    icon: ArrowRightLeft,
  },
  {
    name: "agent-safety-kit",
    slug: "agent-safety-kit",
    description:
      "A safety and policy evaluation framework for autonomous agents. Structured safety rubric — tool-call authorization, output grounding checks, and policy violation scoring — adopted across open-source agent frameworks. Published research paper accompanying.",
    language: "Python",
    license: "MIT",
    stars: "1.8K",
    url: "https://github.com/zalvy/agent-safety-kit",
    docsUrl: "https://arxiv.org/abs/zalvy-agent-safety",
    icon: ShieldCheck,
  },
  {
    name: "zalvy-sdk-js",
    slug: "zalvy-sdk-js",
    description:
      "The open-source TypeScript SDK for ZALVY's agent and workflow surfaces. Streaming responses, structured tool calls, per-request trace IDs emitted to OTel by default. Zero-config observability.",
    language: "TypeScript",
    license: "MIT",
    npmDownloads: "28K+/mo",
    url: "https://github.com/zalvy/zalvy-sdk-js",
    docsUrl: "https://docs.zalvy.com/sdk/js",
    icon: Layers,
  },
  {
    name: "zalvy-sdk-py",
    slug: "zalvy-sdk-py",
    description:
      "Python SDK for ZALVY's inference and agent surfaces. Async-native with structured tool-call dispatch. Ships with the same eval harness as the TypeScript SDK — OTel traces exported by default.",
    language: "Python",
    license: "MIT",
    npmDownloads: "18K+/mo",
    url: "https://github.com/zalvy/zalvy-sdk-py",
    docsUrl: "https://docs.zalvy.com/sdk/python",
    icon: Terminal,
  },
];

export function caseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function noteBySlug(slug: string): EngineeringNote | undefined {
  return ENGINEERING_NOTES.find((note) => note.slug === slug);
}
