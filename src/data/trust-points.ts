import type { LucideIcon } from "lucide-react";
import { CheckCircle2, GitBranch, Lock, ScrollText } from "lucide-react";

/**
 * Cross-pillar proof points — shared in a single band shown on every platform
 * inner page beneath the ProductGrid. Reused (not recreated) to keep the
 * narrative voice consistent and to avoid the "every page has different
 * trust claims" failure mode.
 */
export interface TrustPoint {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const TRUST_POINTS: TrustPoint[] = [
  {
    title: "SOC 2 Type II today",
    description:
      "Audited across security, availability, and confidentiality. Reports available under MNDA via Trust Center.",
    icon: Lock,
  },
  {
    title: "HIPAA, on request",
    description:
      "BAA available on the Enterprise tier. PHI handling is isolated per workspace, never used to train shared models.",
    icon: ScrollText,
  },
  {
    title: "Per-shipment change log",
    description:
      "Every deployed agent, workflow, and SDK emits a structured change record. You have the same view of what shipped that we do.",
    icon: GitBranch,
  },
  {
    title: "Engineering on-call, not 'support'",
    description:
      "On-call rotations staffed by the engineers who built the system. P0 incidents reach a name, not a ticket queue.",
    icon: CheckCircle2,
  },
];
