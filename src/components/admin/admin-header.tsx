"use client";

import { useId, useState } from "react";
import { Search, Bell, User, LogOut, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "./theme-toggle";

export function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchId = useId();

  const mockNotifications = [
    {
      id: 1,
      title: "New Application Submitted",
      desc: "Sarah Jenkins applied for AI Research Intern",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Certificate Issued",
      desc: "Certificate #ZLV-9482 verified & sent",
      time: "15m ago",
      unread: true,
    },
    {
      id: 3,
      title: "Company Domain Verified",
      desc: "Acme Corp domain verified",
      time: "1h ago",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-canvas/80 px-6 backdrop-blur-md transition-colors">
      <div className="flex max-w-md flex-1 items-center gap-4">
        <div className="relative w-full">
          <label htmlFor={searchId} className="sr-only">Search admin</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" aria-hidden />
          <input
            id={searchId}
            type="text"
            placeholder="Search applications, users, certificates, logs... (Cmd+K)"
            className="w-full rounded-xl border border-border bg-surface px-9 py-2 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-surface-raised px-1.5 py-0.5 text-[10px] font-semibold text-foreground-subtle sm:inline-flex">
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-success hidden items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[11px] font-semibold md:flex">
          <span className="bg-success h-2 w-2 animate-pulse rounded-full" aria-hidden />
          <span>System Normal</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-foreground-muted hover:text-accent hover:bg-surface-overlay hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:flex"
          rel="noopener noreferrer"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </Link>

        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); }}
            aria-label={`Notifications${mockNotifications.filter((n) => n.unread).length ? ` — ${String(mockNotifications.filter((n) => n.unread).length)} unread` : ""}`}
            className="text-foreground-muted hover:text-foreground hover:bg-surface-overlay relative rounded-xl p-2 transition-colors"
          >
            <Bell className="h-5 w-5" aria-hidden />
            {mockNotifications.filter((n) => n.unread).length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-canvas" aria-hidden="true" />
            )}
          </button>

          {showNotifications && (
            <div
              className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-80 space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-xl"
              role="menu"
              aria-label="Notifications"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="text-foreground text-xs font-semibold">Notifications</h4>
                <span className="bg-accent/10 text-accent rounded-full px-2 py-0.5 text-[10px] font-semibold">
                  {mockNotifications.filter((n) => n.unread).length} Unread
                </span>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    role="menuitem"
                    tabIndex={0}
                    className="hover:bg-surface-overlay cursor-pointer rounded-xl p-2.5 text-xs transition-colors"
                  >
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>{n.title}</span>
                      <span className="t-subtle text-[10px] font-normal">{n.time}</span>
                    </div>
                    <p className="t-muted mt-0.5 text-[11px]">{n.desc}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/notifications"
                className="block border-t border-border pt-2 text-center text-xs font-semibold text-accent hover:underline"
              >
                View Notification Hub &rarr;
              </Link>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); }}
            aria-label={showProfileMenu ? "Close profile menu" : "Open profile menu"}
            aria-expanded={showProfileMenu}
            aria-controls="admin-profile-menu"
            className="hover:bg-surface-overlay flex items-center gap-2.5 rounded-xl p-1.5 transition-colors"
          >
            <div className="from-accent to-iris text-on-accent flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr text-xs font-bold shadow-md" aria-hidden="true">
              AD
            </div>
            <div className="hidden flex-col text-left lg:flex">
              <span className="text-foreground text-xs leading-tight font-semibold">Alex Drake</span>
              <span className="t-subtle text-[10px]">Super Admin</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-foreground-subtle" aria-hidden />
          </button>

          {showProfileMenu && (
            <div
              id="admin-profile-menu"
              role="menu"
              aria-label="Admin profile"
              className="absolute right-0 z-50 mt-2 w-56 space-y-1 rounded-2xl border border-border bg-surface p-2 shadow-xl"
            >
              <div className="border-b border-border px-3 py-2">
                <p className="text-foreground text-xs font-semibold">Alex Drake</p>
                <p className="t-subtle truncate text-[11px]">alex.drake@zalvy.internal</p>
              </div>
              <Link
                href="/admin/settings"
                role="menuitem"
                className="t-muted hover:text-foreground hover:bg-surface-overlay flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors"
              >
                <User className="h-3.5 w-3.5" aria-hidden />
                <span>Account Settings</span>
              </Link>
              <div className="my-1 border-t border-border" aria-hidden />
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}