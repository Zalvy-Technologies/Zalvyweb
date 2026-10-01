import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Code2,
  Cpu,
  Database,
  GraduationCap,
  Lock,
  Server,
  Workflow,
  Zap,
} from "lucide-react";

export interface JobPosting {
  id: string;
  title: string;
  team: string;
  location: string;
  remote: boolean;
  postedAt: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  icon: LucideIcon;
  /** Display-only fields for the listing page — kept here as the single source of truth. */
  salary?: string;
  type?: string;
  experience?: string;
  department?: string;
  featured?: boolean;
  benefits?: string[];
}

export interface BenchMember {
  name: string;
  avatarInitials: string;
  project: string;
  description: string;
  links: { label: string; href: string }[];
}

export interface InternCohort {
  season: string;
  year: string;
  status: "open" | "closed" | "upcoming";
  applicationDate: string;
  startDate: string;
  endDate: string;
  stipend: string;
  size: number;
}

export interface InternshipFaq {
  question: string;
  answer: string;
}

export const OPEN_ROLES: JobPosting[] = [
  {
    id: "senior-staff-agent-systems",
    title: "Senior Staff Engineer, Agent Systems",
    team: "Platform Engineering",
    department: "AI Engineering",
    location: "INDIA",
    remote: true,
    postedAt: "2026-07-01",
    type: "Full-time",
    experience: "8+ years",
    salary: "$180k - $250k + equity",
    featured: true,
    benefits: ["Equity package", "Top-tier hardware", "Conference budget", "4-day work week option"],
    description:
      "Lead the architecture and reliability of ZALVY's agent runtime — the operating fabric around every deployed agent. You'll own the memory layer, tool-call dispatch, and eval pipeline that block production regressions by policy.",
    responsibilities: [
      "Design and ship the next generation of the ZALVY agent runtime, including grounded memory, tool-call audit logging, and per-shipment eval harnesses.",
      "Set the reliability bar for agent deployments: cold-start budgets, capacity guarantees, and graceful faulting.",
      "Mentor a small team of senior engineers working on the agent operating fabric and publish design notebooks each quarter.",
      "Participate in the engineering on-call rotation — P0 agent incidents reach a name, not a ticket queue.",
    ],
    qualifications: [
      "8+ years building and operating distributed systems in production (Rust, Go, or TypeScript).",
      "Ship-record of designing and maintaining runtime platforms that other engineers depend on.",
      "Strong opinions about observability, cost telemetry, and the difference between a demo and production.",
      "Experience with LLM inference serving, prompt engineering pipelines, or agent architectures is valued but not required.",
    ],
    icon: Brain,
  },
  {
    id: "staff-inference-engineer",
    title: "Staff Engineer, Inference Serving",
    team: "Infrastructure",
    department: "Platform",
    location: "INDIA ",
    remote: true,
    postedAt: "2026-07-03",
    type: "Full-time",
    experience: "6+ years",
    salary: "$170k - $240k + equity",
    benefits: ["Equity package", "GPU cluster access", "On-call rotation (paid)", "Learning budget"],
    description:
      "Own the inference serving layer across 14 regions with deterministic cold-start budgets and per-customer capacity guarantees. This role is for someone who has built serving systems at a provider or large internal platform.",
    responsibilities: [
      "Design and operate the multi-region inference fleet — model pool routing, capacity reservation, cold-start enforcement.",
      "Build BYOM/BYOKE serving pipelines with the same operational rigor as hosted providers.",
      "Ship latency telemetry per-customer per-region and publish monthly availability SLO reports.",
    ],
    qualifications: [
      "6+ years in infrastructure engineering with direct experience shipping serving systems.",
      "Deep familiarity with GPU scheduling, model weight caching, and deterministic latency targets.",
      "Comfortable in Rust or Go for serving-critical paths; TypeScript for observability planes.",
    ],
    icon: Server,
  },
  {
    id: "senior-platform-engineer-workflows",
    title: "Senior Engineer, Workflow Runtime",
    team: "Platform Engineering",
    department: "Platform",
    location: "INDIA",
    remote: true,
    postedAt: "2026-06-28",
    type: "Full-time",
    experience: "5+ years",
    salary: "$160k - $220k + equity",
    benefits: ["Equity package", "Top-tier hardware", "Conference budget", "4-day work week option"],
    description:
      "Build the next generation of the ZALVY workflow runtime — persisted state machines with per-step cost telemetry, replay from point of failure, and policy-gated actions with human-in-the-loop approval.",
    responsibilities: [
      "Ship a durable workflow runtime that emits cost telemetry per step, exported via OTel.",
      "Design replay semantics for state-machine-based workflows — resumption from failure without side-effect duplication.",
      "Integrate the runtime with the ZALVY observability plane and eval harness.",
    ],
    qualifications: [
      "5+ years building durable execution systems (workflow engines, job schedulers, or state-machine runtimes).",
      "Experience with OpenTelemetry tracing and cost-attribution pipelines.",
      "TypeScript at the product layer; Rust or Go for the runtime core.",
    ],
    icon: Workflow,
  },
  {
    id: "ai-research-scientist-evals",
    title: "Research Scientist, AI Evaluation Systems",
    team: "Research",
    department: "Research",
    location: "INDIA",
    remote: false,
    postedAt: "2026-07-08",
    type: "Full-time",
    experience: "PhD or equivalent",
    salary: "$200k - $300k + equity",
    benefits: ["Equity package", "Compute budget", "Publication support", "Sabbatical option"],
    description:
      "Design evaluation methodologies for grounded agents, multi-turn chatbots, and retrieval-augmented systems. Your evals block production by policy — you decide what 'good enough' means.",
    responsibilities: [
      "Build regression suites that run on every model bump, every prompt change, every tooling revision.",
      "Develop novel eval methodologies for agent tool-call correctness, citation grounding, and multi-step reasoning.",
      "Publish eval results internally and work with platform engineers to gate production deployments.",
    ],
    qualifications: [
      "PhD or equivalent experience in ML evaluation, NLP, or related field.",
      "Published work on LLM evaluation methodologies, grounding, or agent reliability.",
      "Comfortable building eval harnesses in Python and integrating with CI/CD pipelines.",
    ],
    icon: Cpu,
  },
  {
    id: "senior-frontend-engineer",
    title: "Senior Frontend Engineer, Platform Surfaces",
    team: "Design Engineering",
    department: "Design Engineering",
    location: "INDIA",
    remote: true,
    postedAt: "2026-07-05",
    type: "Full-time",
    experience: "5+ years",
    salary: "$150k - $210k + equity",
    benefits: ["Equity package", "Top-tier hardware", "OSS contribution time", "Conference budget"],
    description:
      "Build the product surfaces that customers use to configure, observe, and extend ZALVY agents and workflows. This is a design-engineering role — you ship interfaces that feel like a tool, not a dashboard.",
    responsibilities: [
      "Design and ship agent configuration surfaces, observability dashboards, and workflow builders.",
      "Own the ZALVY design system implementation — maintain token consistency across product and marketing surfaces.",
      "Work with design engineers on motion, accessibility, and performance budgets.",
    ],
    qualifications: [
      "5+ years building production React/Next.js applications with strong design sensibilities.",
      "Experience with design systems, design tokens, and fluid typography at scale.",
      "Demonstrated ability to ship interfaces that feel like Linear, Vercel, or Stripe — not like enterprise admin dashboards.",
    ],
    icon: Code2,
  },
  {
    id: "security-engineer",
    title: "Security Engineer, Platform Trust",
    team: "Trust & Security",
    department: "Security",
    location: "INDIA",
    remote: true,
    postedAt: "2026-06-25",
    type: "Full-time",
    experience: "5+ years",
    salary: "$160k - $220k + equity",
    benefits: ["Equity package", "Security certifications covered", "Bug bounty participation", "Flexible location"],
    description:
      "Own the security posture of a platform that ships agents into healthcare, finance, and robotics control loops. Maintain SOC 2 Type II, ship security review automation, and build the Trust Center.",
    responsibilities: [
      "Maintain and extend SOC 2 Type II compliance across the ZALVY platform.",
      "Build automated security review pipelines for agent deployments and customer workspaces.",
      "Operate the ZALVY Trust Center and manage BAA/HIPAA compliance for Enterprise customers.",
    ],
    qualifications: [
      "5+ years in security engineering with SOC 2, HIPAA, or equivalent compliance experience.",
      "Engineering background — you ship automation, not just policy documents.",
      "Experience shipping security review tooling for SaaS platforms.",
    ],
    icon: Lock,
  },
  {
    id: "dba-sre",
    title: "Database Reliability Engineer",
    team: "Infrastructure",
    department: "Platform",
    location: "INDIA",
    remote: true,
    postedAt: "2026-07-10",
    type: "Full-time",
    experience: "5+ years",
    salary: "$165k - $230k + equity",
    benefits: ["Equity package", "GPU cluster access", "On-call rotation (paid)", "Learning budget"],
    description:
      "Own ZALVY's data infrastructure — the foundation that grounds agents in customer data. You'll operate PostgreSQL fleets, vector stores, and caching layers across regions with documented SLOs.",
    responsibilities: [
      "Design and operate multi-region PostgreSQL fleets with documented latency, durability, and availability SLOs.",
      "Build and maintain vector store infrastructure for agent grounding pipelines.",
      "Ship data reliability tooling: backup verification, replica lag monitoring, failover automation.",
    ],
    qualifications: [
      "5+ years operating relational databases at scale (PostgreSQL preferred).",
      "Experience with vector databases (pgvector, Qdrant, or similar) is valued.",
      "Comfortable writing automation in Rust, Go, or TypeScript.",
    ],
    icon: Database,
  },
  {
    id: "devrel-engineer",
    title: "Developer Relations Engineer",
    team: "Developer Experience",
    department: "Developer Experience",
    location: "INDIA",
    remote: true,
    postedAt: "2026-07-02",
    type: "Full-time",
    experience: "3+ years",
    salary: "$140k - $190k + equity",
    benefits: ["Equity package", "Travel budget", "Content creation tools", "Flexible schedule"],
    description:
      "Ship SDKs in TypeScript, Python, and Go. Write documentation that engineers trust. Build the eval harness that ships open-source. This role is for someone who can ship libraries and explain why they shipped them that way.",
    responsibilities: [
      "Own the ZALVY TypeScript, Python, and Go SDKs — typed, streaming, structured tool calls, trace IDs to OTel.",
      "Write documentation, examples, and migration guides that engineers reference.",
      "Build and maintain the open-source eval harness and CI integration.",
    ],
    qualifications: [
      "4+ years shipping developer tooling — SDKs, CLIs, or API client libraries.",
      "Experience across TypeScript, Python, and Go; at least one at an expert level.",
      "Published technical writing (blog posts, docs, tutorials) that engineers found useful.",
    ],
    icon: Zap,
  },
  {
    id: "internship-coordinator",
    title: "Internship Program Lead",
    team: "People",
    department: "People",
    location: "INDIA",
    remote: false,
    postedAt: "2026-07-07",
    type: "Full-time",
    experience: "3+ years",
    salary: "$120k - $160k + equity",
    benefits: ["Equity package", "Program ownership", "Conference hosting", "Flexible schedule"],
    description:
      "Run the ZALVY internship program — 12 interns per cohort, flexible 4/6/8/12-week tracks, senior staff mentors. You coordinate the program structure, mentor pairing, and the end-of-cohort written reviews.",
    responsibilities: [
      "Design and run the internship cohort structure: mentor pairing, project scoping, weekly check-ins.",
      "Coordinate with senior staff engineers to scope intern projects that ship to production.",
      "Publish end-of-cohort reviews and manage the application pipeline.",
    ],
    qualifications: [
      "3+ years managing engineering internship or apprenticeship programs.",
      "Experience coordinating with senior engineers on technical project scoping.",
      "Strong written communication — you'll write and publish cohort reviews.",
    ],
    icon: GraduationCap,
  },
];

export const BENCH_MEMBERS: BenchMember[] = [
  {
    name: "María Elena Torres",
    avatarInitials: "MT",
    project: "pgvector-recall",
    description:
      "Maintains the recall-evaluation harness for PostgreSQL vector stores. Published the first cross-index accuracy comparison toolkit adopted by the ZALVY internal eval pipeline.",
    links: [
      { label: "GitHub", href: "https://github.com/zalvy/pgvector-recall" },
      {
        label: "Technical report",
        href: "https://github.com/zalvy/pgvector-recall/blob/main/REPORT.md",
      },
    ],
  },
  {
    name: "Kwame Asante",
    avatarInitials: "KA",
    project: "open-evals",
    description:
      "Core contributor to the open-source evaluation harness that ships with every ZALVY SDK deployment. Authored the initial CI integration that gates production deployments.",
    links: [
      { label: "GitHub", href: "https://github.com/zalvy/open-evals" },
      { label: "Docs", href: "https://docs.zalvy.com/evals" },
    ],
  },
  {
    name: "Rina Yamamoto",
    avatarInitials: "RY",
    project: "trace-viewer",
    description:
      "Built the open-source OTel trace viewer adopted across ZALVY product surfaces. Ships a real-time waterfall UI for agent step traces with cost-per-step breakdown.",
    links: [
      { label: "GitHub", href: "https://github.com/zalvy/trace-viewer" },
      { label: "Demo", href: "https://trace-viewer.zalvy.com" },
    ],
  },
  {
    name: "Jules Moreau-Lefèvre",
    avatarInitials: "JL",
    project: "agent-safety-kit",
    description:
      "Designs and ships the safety and policy evaluation framework for ZALVY agents. Published the first structured agent safety rubric adopted across open-source agent frameworks.",
    links: [
      { label: "GitHub", href: "https://github.com/zalvy/agent-safety-kit" },
      { label: "Paper", href: "https://arxiv.org/abs/zalvy-agent-safety" },
    ],
  },
];

export const INTERN_COHORTS: InternCohort[] = [
  {
    season: "Autumn",
    year: "2026",
    status: "open",
    applicationDate: "12 August 2026",
    startDate: "5 October 2026",
    endDate: "24 December 2026",
    stipend: "$9,800/mo",
    size: 12,
  },
  {
    season: "Spring",
    year: "2027",
    status: "upcoming",
    applicationDate: "15 February 2027",
    startDate: "7 April 2027",
    endDate: "27 June 2027",
    stipend: "$9,800/mo",
    size: 12,
  },
];

export const INTERNSHIP_FAQS: InternshipFaq[] = [
  {
    question: "What does a ZALVY intern actually build?",
    answer:
      "You ship a feature or system that ships to production. Past intern projects include: an eval harness regression suite that blocks production deployments by policy, a cross-region latency telemetry dashboard used by the on-call rotation, and a tool-call audit pipeline that surfaces agent decision traces to customers. No 'intern projects' — you build what senior engineers scope.",
  },
  {
    question: "How are interns mentored?",
    answer:
      "Every intern is paired 1:1 with a senior staff engineer who reviews your code, attends your design reviews, and writes your end-of-cohort review. Mentors are not shuffled — you work with the same person throughout your 4, 6, 8, or 12-week program. Your mentor is also your on-call partner for two rotations.",
  },
  {
    question: "What does the interview process look like?",
    answer:
      "Two rounds: a 90-minute pair programming session where you solve a real problem with a ZALVY engineer (not a contrived algorithm puzzle), and a 60-minute system design conversation. We decide within three weeks of first contact. No take-home assignments, no behavioral rounds, no HR screening. The people who interview you are the people you'll work with.",
  },
  {
    question: "Is the internship remote?",
    answer:
      "In-person and hybrid in India. We provide relocation support, workstation setup, and housing stipends for on-site immersion cohorts. Pair programming, design reviews, and on-call mentorship happen with dedicated staff leads — remote options available across India.",
  },
  {
    question: "Do interns get hired full-time?",
    answer:
      "Over 80% of ZALVY interns have been offered full-time roles. The internship is a structured 4/6/8/12-week practical interview — if you ship to production, write a close-out review, and contribute to the on-call rotation, the full-time conversation is short. We do not hire interns into roles that don't exist.",
  },
  {
    question: "What technologies will I work with?",
    answer:
      "The ZALVY platform stack: TypeScript (Next.js product surfaces, SDKs), Go (serving runtime, workflow engine), Python (eval harness, research tooling), Rust (inference serving critical paths), PostgreSQL + vector stores (grounding layer), and OpenTelemetry (observability plane). You'll touch most of these during your program.",
  },
];

export function jobById(id: string): JobPosting | undefined {
  return OPEN_ROLES.find((job) => job.id === id);
}
