"use client";

import { useState } from "react";

interface ActivityNode {
  id: string;
  actor: string;
  avatar: string;
  category: "SECURITY" | "USER" | "APPLICATION" | "SYSTEM";
  actionTitle: string;
  description: string;
  timestamp: string;
  ipAddress: string;
}

const mockActivities: ActivityNode[] = [
  {
    id: "ACT-1",
    actor: "Alex Drake (Super Admin)",
    avatar: "AD",
    category: "SECURITY",
    actionTitle: "Role Matrix Modified",
    description: "Updated permissions matrix for Moderator role.",
    timestamp: "Just now (08:16:08)",
    ipAddress: "192.168.1.1",
  },
  {
    id: "ACT-2",
    actor: "Sarah Jenkins",
    avatar: "SJ",
    category: "APPLICATION",
    actionTitle: "Application Submitted",
    description: "Applied for AI Research Intern posting at DeepMind Systems.",
    timestamp: "15 mins ago",
    ipAddress: "10.0.4.22",
  },
  {
    id: "ACT-3",
    actor: "System Automated",
    avatar: "SYS",
    category: "SYSTEM",
    actionTitle: "Database Snapshot Backup",
    description: "Automated 0001_initial_schema database backup completed.",
    timestamp: "1 hour ago",
    ipAddress: "127.0.0.1",
  },
];

export default function AdminActivityPage() {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const filtered = mockActivities.filter(
    (a) => filterCategory === "ALL" || a.category === filterCategory,
  );

  return (
    <div className="animate-in fade-in max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Activity Timeline Feed
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Real-time event stream tracking administrative events, system tasks, and candidate
          submissions.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {["ALL", "SECURITY", "USER", "APPLICATION", "SYSTEM"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilterCategory(cat);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              filterCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative ml-4 space-y-6 border-l-2 border-slate-200 pl-6 dark:border-slate-800">
        {filtered.map((node) => (
          <div key={node.id} className="group relative">
            <div className="absolute top-1.5 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-950">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {node.avatar}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {node.actor}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">{node.timestamp}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {node.actionTitle}
              </h4>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {node.description}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-mono text-[10px] text-slate-400 dark:border-slate-800/60">
                <span>IP: {node.ipAddress}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold dark:bg-slate-800">
                  {node.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
