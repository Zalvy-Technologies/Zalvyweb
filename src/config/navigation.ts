import {
  Bot,
  Cpu,
  Sparkles,
  Workflow,
  Layers,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { NavGroup, NavItem, NavCta } from "@/types/nav";

export interface NavMega {
  label: string;
  href: string;
  groups: {
    label: string;
    items: { label: string; href: string; description: string; icon: LucideIcon }[];
  }[];
}

/**
 * ZALVY marketing navigation — a single typed structure shared between the
 * desktop header, the mobile menu, and the footer.
 */
export const megaNav: NavMega[] = [
  {
    label: "Solutions",
    href: "/solutions",
    groups: [
      {
        label: "Intelligent Systems",
        items: [
          {
            label: "AI Agents",
            href: "/agents",
            description: "Autonomous swarms that reason, use tools, and deliver results.",
            icon: Bot,
          },
          {
            label: "Business Automation",
            href: "/automation",
            description: "Replay-safe state machines that connect ERP, CRM, and cloud DBs.",
            icon: Workflow,
          },
          {
            label: "Custom AI Solutions",
            href: "/solutions",
            description: "Bespoke architectures engineered for high-stakes operational scale.",
            icon: Layers,
          },
        ],
      },
      {
        label: "Platform & Security",
        items: [
          {
            label: "AI Chatbots & RAG",
            href: "/platform/chatbots",
            description: "Grounded conversational intelligence with zero hallucination drift.",
            icon: Sparkles,
          },
          {
            label: "Enterprise Security",
            href: "/security",
            description: "Air-gapped deployment, SOC2 readiness, and zero-trust policies.",
            icon: ShieldCheck,
          },
          {
            label: "Developer SDKs",
            href: "/platform/tools",
            description: "OpenTelemetry tracing, eval harnesses, and TypeScript SDKs.",
            icon: Cpu,
          },
        ],
      },
    ],
  },
];

/** Top-level paths that appear as simple inline links. */
export const navRoutes: NavItem[] = [
  { label: "Internships", href: "/careers/internship" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** CTA cluster rendered at the header tail. */
export const navCtas: NavCta[] = [
  { label: "Start a Project", href: "/contact", variant: "primary" },
];

/** Footer navigation grouped by column. */
export const footerNav: NavGroup[] = [
  {
    label: "Solutions",
    items: [
      { label: "AI Agents", href: "/agents" },
      { label: "Business Automation", href: "/automation" },
      { label: "Custom AI Solutions", href: "/solutions" },
      { label: "Security & Trust", href: "/security" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Insights", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    label: "Talent & Apprenticeship",
    items: [
      { label: "Internship Program", href: "/careers/internship" },
      { label: "Certificate Verification", href: "/verify" },
      { label: "Engineering Bench", href: "/careers/bench" },
    ],
  },
  {
    label: "Legal & Policies",
    items: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Data Processing (DPA)", href: "/legal/dpa" },
    ],
  },
];

/** Compact list used by the mobile drawer. */
export const mobileNavRoutes: NavItem[] = [
  ...megaNav.map((entry) => ({ label: entry.label, href: entry.href })),
  ...navRoutes,
];
