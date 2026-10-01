"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Award,
  FolderGit2,
  Newspaper,
  Users,
  Bell,
  Mail,
  Terminal,
  Settings,
  ShieldCheck,
  Activity,
  History,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    groupName: "Core Overview",
    items: [
      { title: "Analytics", href: "/admin", icon: BarChart3 },
      {
        title: "AI Copilot & Agents",
        href: "/admin/ai",
        icon: Sparkles,
        badge: "Live",
        badgeColor: "bg-accent/10 text-accent border-accent/20",
      },
    ],
  },
  {
    groupName: "Management",
    items: [
      {
        title: "Applications",
        href: "/admin/applications",
        icon: FileText,
        badge: "14 New",
        badgeColor: "bg-success/10 text-success border-success/20",
      },
      { title: "Certificates", href: "/admin/certificates", icon: Award },
      { title: "Projects", href: "/admin/projects", icon: FolderGit2 },
      { title: "Blog / CMS", href: "/admin/blog", icon: Newspaper },
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        badge: "2.4k",
        badgeColor: "bg-iris/10 text-iris border-iris/20",
      },
    ],
  },
  {
    groupName: "Communications",
    items: [
      { title: "Notifications", href: "/admin/notifications", icon: Bell },
      { title: "Email Templates", href: "/admin/email-templates", icon: Mail },
    ],
  },
  {
    groupName: "System & Governance",
    items: [
      {
        title: "Logs",
        href: "/admin/logs",
        icon: Terminal,
        badge: "Live",
        badgeColor: "bg-warning/10 text-warning border-warning/20",
      },
      { title: "Settings", href: "/admin/settings", icon: Settings },
      { title: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
      { title: "Activity Timeline", href: "/admin/activity", icon: Activity },
      { title: "Audit Logs", href: "/admin/audit-logs", icon: History },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Admin navigation"
      className={cn(
        "relative z-30 flex flex-col border-r border-border bg-surface transition-all duration-300 ease-standard",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="from-accent/40 via-accent/20 text-accent-foreground bg-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr shadow-lg">
            <ShieldAlert className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-foreground flex items-center gap-1.5 text-base font-bold tracking-tight">
                ZALVY{" "}
                <span className="bg-accent/10 text-accent rounded border border-accent/20 px-1.5 py-0.5 text-xs font-semibold">
                  ADMIN
                </span>
              </span>
              <span className="t-subtle text-[11px]">Enterprise Operations</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => { setCollapsed(!collapsed); }}
          className="text-muted hover:text-foreground hover:bg-surface-overlay rounded-lg p-1.5 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav aria-label="Admin sections" className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-3">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <p className="text-overline t-subtle px-3 tracking-widest uppercase">
                {group.groupName}
              </p>
            )}
            <ul className="space-y-1 list-none p-0">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const IconComp = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-quick",
                        isActive
                          ? "bg-accent text-on-accent shadow-glow"
                          : "text-foreground-muted hover:bg-surface-overlay hover:text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <IconComp
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-on-accent" : "text-foreground-muted",
                        )}
                        aria-hidden
                      />
                      {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                      {!collapsed && item.badge ? (
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                            item.badgeColor ?? "",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="from-accent/20 via-surface to-surface border-accent/20 m-3 rounded-2xl border bg-gradient-to-br p-3 text-white">
          <div className="text-accent mb-1 flex items-center gap-2 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-foreground">v2.4 Enterprise</span>
          </div>
          <p className="t-subtle text-[11px] leading-relaxed">
            All systems operational. System health 99.98%.
          </p>
        </div>
      )}
    </aside>
  );
}