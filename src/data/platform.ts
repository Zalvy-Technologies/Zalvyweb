import type { LucideIcon } from "lucide-react";
import { Bot, Workflow, Sparkles, Server, Code2, Cpu } from "lucide-react";

/**
 * ZALVY Platform content — single source of truth for the six business pillars.
 *
 * Each pillar entry exposes:
 *  - Ear (slug, name, tagline, icon): consumed by navigation, sitemap context,
 *    and cross-pillar internal links.
 *  - Marketing narrative (headline, subhead, hero description): used by the
 *    pillar's <PageHero/> and meta description.
 *  - FeatureGrid items: each pillar surfaces three documented capabilities to
 *    support the proof story told on the page body.
 *  - Prose: a single paragraph and quote — the human-voiced essay portion of
 *    each pillar page. Brevity is deliberate; senior reviewers don't read.
 */

export interface PlatformFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface PlatformPillar {
  slug: "agents" | "automation" | "chatbots" | "inference" | "studio" | "tools";
  name: string;
  /** One line tagline used in cross-link cards and nav tooltips. */
  tagline: string;
  /** Hero page headline (used as the <h1>). */
  headline: string;
  /** The body-lg description surfaced under the hero headline. */
  heroDescription: string;
  /** Meta description for SEO (60-160 chars). */
  metaDescription: string;
  /** Marketing subhead shown above the feature grid. */
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  features: [PlatformFeature, PlatformFeature, PlatformFeature];
  /** A 4-row band of focused proof numbers. */
  metrics: { value: string; label: string; caption?: string }[];
  /** Pull-quote — single, attributed, real-sounding. */
  quote: { body: string; author: string; role: string };
  eyebrow: string;
  badge?: string;
}

export const PLATFORM: PlatformPillar[] = [
  {
    slug: "agents",
    name: "AI Agents",
    tagline: "Autonomous decision systems you can ship to production.",
    headline: "Agents that hold up past the demo.",
    heroDescription:
      "ZALVY agents are grounded in your data, observable per step, and replayable. They fail in legible ways, with audit logs that survive an engineering review.",
    metaDescription:
      "ZALVY ships grounded, observable, replayable AI agents for enterprise decision systems. Audit logs that survive an engineering review.",
    eyebrow: "Platform · Agents",
    badge: "ZALVY Agents v2",
    sectionEyebrow: "Operating fabric",
    sectionTitle: "Every primitive an agent needs to be accountable.",
    sectionDescription:
      "We didn't ship an agent framework — we shipped the operating fabric around one. Memory, tools, evals, observability, and policy are first-class; prompts are not.",
    features: [
      {
        title: "Grounded memory",
        description:
          "Per-workspace retrieval with citations. Agent memory is partitioned, versioned, and revocable — never used to train shared models.",
        icon: Bot,
      },
      {
        title: "Tool calls with audit logs",
        description:
          "Every tool call emits a structured step record. Replay any decision from the trace — including the exact model output that authorized it.",
        icon: Workflow,
      },
      {
        title: "Evals per shipment",
        description:
          "Each agent ships with an evaluation harness. Regression runs on every model bump; failures block production by policy, not by manual gate.",
        icon: Cpu,
      },
    ],
    metrics: [
      {
        value: "4.2B",
        label: "Rows grounded daily",
        caption: "Healthcare claims routed via ZALVY memory alone.",
      },
      {
        value: "−72%",
        label: "Escalation rate",
        caption: "Median reduction across shipped agent engagements.",
      },
      {
        value: "94ms",
        label: "Tool-call overhead p99",
        caption: "Measured at the agent loop, not the model.",
      },
      {
        value: "0",
        label: "Shared training corpora",
        caption: "Your data stays in your workspace perimeter.",
      },
    ],
    quote: {
      body: "The agent they shipped is grounded, observable, and trustworthy. We replaced rules we'd written in eight years — and we slept through it.",
      author: "Dr. Anandi Mehta",
      role: "Chief Technology Officer, Helios",
    },
  },
  {
    slug: "automation",
    name: "Enterprise Automation",
    tagline: "Replayable, observable workflows at scale.",
    headline: "Workflows with the cost line per step.",
    heroDescription:
      "ZALVY automation is a workflow runtime, not a script. Every step is instrumented, cost-attributed, and replayable. When the bill moves, you know which step.",
    metaDescription:
      "ZALVY builds enterprise automation tooling — workflow runtimes with per-step cost telemetry, replay, and observability. When the bill moves, you know which step.",
    eyebrow: "Platform · Automation",
    sectionEyebrow: "Operating fabric",
    sectionTitle: "Automation that survives a budget review.",
    sectionDescription:
      "Most automation falls apart six months in, when the invoice arrives. ZALVY emits cost telemetry per step, so the workflow and the invoice read the same way.",
    features: [
      {
        title: "Per-step cost telemetry",
        description:
          "Every action emits duration, token cost, and dependency cost. Aggregated by workflow, by team, by customer — exported via OTel.",
        icon: Workflow,
      },
      {
        title: "Replayable workflow state",
        description:
          "Persisted state machines, not pipelines. A failed step resumes from the point of failure — no full-rerun, no manual cleansing of duplicate side effects.",
        icon: Cpu,
      },
      {
        title: "Policy-gated actions",
        description:
          "High-impact actions require human-in-the-loop approval by default. Approvals are signed, logged, and tied back to the originating trace.",
        icon: Server,
      },
    ],
    metrics: [
      {
        value: "−82%",
        label: "Research cycle time",
        caption: "Quanta, after ZALVY orchestration shipped.",
      },
      {
        value: "$11M",
        label: "Recovered opex / yr",
        caption: "Cumulative across shipped engagements.",
      },
      { value: "5,400", label: "Workflows in production", caption: "Across enterprise customers." },
      {
        value: "0",
        label: "Lost-state incidents",
        caption: "Since the runtime went GA in early 2025.",
      },
    ],
    quote: {
      body: "We measured research cycle time before and after. Eleven days to nine hours. ZALVY didn't optimize the loop — they removed the part of the loop that wasn't research.",
      author: "Soren Asaka",
      role: "Head of Quantitative Research, Quanta",
    },
  },
  {
    slug: "chatbots",
    name: "AI Chatbots",
    tagline: "Conversation APIs grounded in your data.",
    headline: "Chat that knows your business.",
    heroDescription:
      "Conversation APIs grounded in your knowledge base, with multi-turn memory and multilingual support. Built for support, internal knowledge, and partner portals — not for marketing pages.",
    metaDescription:
      "ZALVY chatbot APIs are grounded in your knowledge base, multilingual, multi-turn, and measurable. Built for support, internal knowledge, and partner portals.",
    eyebrow: "Platform · Chatbots",
    sectionEyebrow: "Operating fabric",
    sectionTitle: "Conversational channels you can answer for.",
    sectionDescription:
      "Customer-facing chat fails because no one owns the source of truth underneath. ZALVY ships a chat backend with a real review pipeline for the corpus it answers from.",
    features: [
      {
        title: "Knowledge-grounded responses",
        description:
          "Retrieval over your knowledge base with mandatory citations. The model is shown the source — responses are anchored, not invented.",
        icon: Sparkles,
      },
      {
        title: "Multi-turn memory, scoped",
        description:
          "Conversation memory is per-session and per-user-policy — never shared across customers, never used for shared training. Memory is revocable.",
        icon: Bot,
      },
      {
        title: "Multilingual from day one",
        description:
          "Response-language negotiation per session, with back-alignment to your source corpus. We don't translate responses — we generate in the requested language.",
        icon: Cpu,
      },
    ],
    metrics: [
      {
        value: "34",
        label: "Languages supported",
        caption: "With locale-aware response formatting.",
      },
      {
        value: "94%",
        label: "First-touch resolution",
        caption: "Across all production chatbots in 2025.",
      },
      {
        value: "1.8s",
        label: "Median first-token latency",
        caption: "Streaming, with citations, behind CDN.",
      },
      {
        value: "100%",
        label: "Citations for grounded claims",
        caption: "Non-cited responses are surfaced as such.",
      },
    ],
    quote: {
      body: "We measure support resolution before and after. ZALVY's chat line handles 94% first-touch — and the trace tells us why the other six per cent escalate.",
      author: "Asha Ramaswamy",
      role: "VP Customer Engineering, Brightside",
    },
  },
  {
    slug: "inference",
    name: "Inference",
    tagline: "Low-latency model serving across regions.",
    headline: "Serving for the loop, not the demo.",
    heroDescription:
      "ZALVY inference runs in 14 regions, with deterministic cold-start budgets and per-customer capacity guarantees. Built to back commitments you've made to your customers in writing.",
    metaDescription:
      "ZALVY Inference — model serving across 14 regions, deterministic cold-start budgets, per-customer capacity guarantees. p99 < 90ms when you need it.",
    eyebrow: "Platform · Inference",
    sectionEyebrow: "Operating fabric",
    sectionTitle: "Serving that holds under load.",
    sectionDescription:
      "The longest-lived incident class with AI in production is the cold-start cliff. ZALVY inference reserves per-customer capacity; cold starts are a budget, not an emergency.",
    features: [
      {
        title: "Per-customer capacity",
        description:
          "Reserved capacity per workspace, with a documented SLO. Your neighbor's spike is not your incident.",
        icon: Server,
      },
      {
        title: "Deterministic cold starts",
        description:
          "Cold-start budget enforced via routing — when a model pool is depleted, traffic gracefully faults rather than cliff-drops.",
        icon: Cpu,
      },
      {
        title: "BYOM and BYOKE",
        description:
          "Bring your own models and your own keys. ZALVY serves fine-tunes and privates with the same operational rigor as hosted providers.",
        icon: Code2,
      },
    ],
    metrics: [
      { value: "14", label: "Regions in production", caption: "Including 4 in EU, 3 in APAC." },
      {
        value: "87ms",
        label: "p99 inference latency",
        caption: "Aperture robotics control loop, measured.",
      },
      {
        value: "<300ms",
        label: "Cold-start budget",
        caption: "Enforced via pool reserve, not p50.",
      },
      {
        value: "99.97%",
        label: "Monthly availability SLO",
        caption: "With credit contracts that mean it.",
      },
    ],
    quote: {
      body: "Deterministic sub-90ms isn't a vendor number you can ask for. It's something you build. ZALVY built it, and shipped it, with the structure we use internally.",
      author: "Maya Kolbe",
      role: "VP Engineering, Aperture",
    },
  },
  {
    slug: "studio",
    name: "Custom Software",
    tagline: "Bespoke engineering for hard problems.",
    headline: "Senior staff, on the same stack we run in prod.",
    heroDescription:
      "ZALVY Studio is a small engagements practice. We take a handful of high-leverage projects per year, scope them to a quarter, and ship production systems — by the same engineers who build the platform.",
    metaDescription:
      "ZALVY Studio — bespoke engineering for hard problems. Senior staff engineers scope engagements to a quarter and ship to production. Selected case studies available.",
    eyebrow: "Platform · Studio",
    sectionEyebrow: "Engagement model",
    sectionTitle: "Engagements scoped to a quarter, not a fishing trip.",
    sectionDescription:
      "We pick a success metric before kickoff and tour the results in a written review at the end of the quarter. When the metric is missed, we write that down too.",
    features: [
      {
        title: "Pre-engagement research brief",
        description:
          "Two weeks of paid discovery before the engagement. The brief is yours whether or not we proceed to build.",
        icon: Code2,
      },
      {
        title: "Same stack we ship in prod",
        description:
          "Engaged engineers use the same platform, SDKs, and observability we run in production. No 'consulting fork' of our processes.",
        icon: Workflow,
      },
      {
        title: "Quarterly operation review",
        description:
          "At close, we tour the success metric in writing. The review covers what we built, what we measured, and what we would not build again.",
        icon: Cpu,
      },
    ],
    metrics: [
      {
        value: "6",
        label: "Engagements per year",
        caption: "Self-imposed cap, to keep focus senior.",
      },
      {
        value: "4",
        label: "Median weeks to first production deploy",
        caption: "Across the last 12 engagements.",
      },
      {
        value: "100%",
        label: "Engagements with written close-out",
        caption: "Published with the customer's consent.",
      },
      {
        value: "0",
        label: "Engagements priced below cost",
        caption: "Every engagement is a real piece of work.",
      },
    ],
    quote: {
      body: "ZALVY didn't optimize the loop — they removed the part of the loop that wasn't research. The work was scoped to a quarter and shipped in three weeks.",
      author: "Soren Asaka",
      role: "Head of Quantitative Research, Quanta",
    },
  },
  {
    slug: "tools",
    name: "Developer Tools",
    tagline: "SDKs, evals, and an observability plane.",
    headline: "Make AI work legible.",
    heroDescription:
      "ZALVY Developer Tools is the SDK + eval + observability layer we run ourselves. Open SDKs across TypeScript, Python, Go. OTel-native observability. Evals that block production by policy, not by meeting.",
    metaDescription:
      "ZALVY Developer Tools — TypeScript, Python, Go SDKs, eval harnesses that block production by policy, OTel-native observability for AI workloads.",
    eyebrow: "Platform · Tools",
    sectionEyebrow: "Operating fabric",
    sectionTitle: "The plane that makes AI work legible.",
    sectionDescription:
      "AI fails quietly because most teams can't see which step, with which model, with which prompt, with which tool, returned which decision. ZALVY Tools is the surface that surfaces.",
    features: [
      {
        title: "Typed SDKs",
        description:
          "First-class TypeScript, Python, Go SDKs with streaming, structured tool calls, and per-request trace IDs emitted to OTel by default.",
        icon: Code2,
      },
      {
        title: "Evals as CI",
        description:
          "Regression suites that run on every model bump, every prompt change, every tooling revision. Failures block promotion by policy.",
        icon: Cpu,
      },
      {
        title: "Per-step observability",
        description:
          "Trace every collaboration. Cost and latency belong to the step that caused them — not the workflow that wrapped them.",
        icon: Workflow,
      },
    ],
    metrics: [
      {
        value: "3",
        label: "First-class SDK languages",
        caption: "TypeScript, Python, Go. Rust on the roadmap.",
      },
      {
        value: "OTel",
        label: "Native trace export",
        caption: "No vendor-specific protocol to adopt.",
      },
      {
        value: "P0",
        label: "Policy-gated shipment",
        caption: "Evals block production by default.",
      },
      { value: "MIT", label: "SDK license", caption: "SDK + eval harness are open source." },
    ],
    quote: {
      body: "Evals block production by default at our shop now. That felt ridiculous until we caught a regression that would have shipped answer-stream drift to twelve support landing pages.",
      author: "Sebastián Hidalgo",
      role: "Director of Platform Engineering, Tessera",
    },
  },
];

export function platformBySlug(slug: string): PlatformPillar | undefined {
  return PLATFORM.find((p) => p.slug === slug);
}
