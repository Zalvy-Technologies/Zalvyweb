import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  /** Mark the destination as out-of-site (renders as `target="_blank"` + safe rel). */
  external?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavCta {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
}
