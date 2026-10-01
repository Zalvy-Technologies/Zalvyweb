"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Send, CheckCircle2 } from "lucide-react";

interface NotificationLog {
  id: string;
  title: string;
  targetAudience: string;
  channel: "IN_APP" | "EMAIL" | "PUSH";
  sentAt: string;
  recipientCount: number;
}

const mockHistory: NotificationLog[] = [
  {
    id: "NOTIF-1",
    title: "Platform Maintenance Notice: Scheduled System Upgrade",
    targetAudience: "All Registered Users",
    channel: "IN_APP",
    sentAt: "2026-07-22 14:00",
    recipientCount: 2480,
  },
  {
    id: "NOTIF-2",
    title: "New Internship Opportunity Digest - Summer 2026",
    targetAudience: "Student Applicants",
    channel: "EMAIL",
    sentAt: "2026-07-20 09:30",
    recipientCount: 1850,
  },
];

export default function AdminNotificationsPage() {
  const [history, setHistory] = useState<NotificationLog[]>(mockHistory);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All Registered Users");
  const [channel, setChannel] = useState<"IN_APP" | "EMAIL" | "PUSH">("IN_APP");
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSendNotification = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const newLog: NotificationLog = {
      id: `NOTIF-${String(history.length + 1)}`,
      title,
      targetAudience: target,
      channel,
      sentAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      recipientCount: Math.floor(800 + Math.random() * 1200),
    };

    setHistory([newLog, ...history]);
    setSuccessBanner(
      `Notification dispatched successfully to ${String(newLog.recipientCount)} recipients via ${channel}!`,
    );
    setTitle("");
    setMessage("");
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  const columns: Column<NotificationLog>[] = [
    {
      header: "Notification Title",
      accessorKey: "title",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.title}</span>,
    },
    {
      header: "Target Audience",
      accessorKey: "targetAudience",
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-slate-600 dark:text-slate-300">{row.targetAudience}</span>
      ),
    },
    {
      header: "Channel",
      accessorKey: "channel",
      cell: (row) => (
        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
          {row.channel}
        </span>
      ),
    },
    {
      header: "Recipients",
      accessorKey: "recipientCount",
      cell: (row) => (
        <span className="font-semibold text-slate-900 dark:text-white">
          {row.recipientCount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Sent Timestamp",
      accessorKey: "sentAt",
      sortable: true,
      cell: (row) => <span className="text-slate-400">{row.sentAt}</span>,
    },
  ];

  return (
    <div className="animate-in fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Notification Center & Broadcaster
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Dispatch targeted platform announcements, push alerts, and in-app notifications.
        </p>
      </div>

      {successBanner && (
        <div className="animate-in fade-in flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successBanner}</span>
        </div>
      )}

      <form
        onSubmit={handleSendNotification}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Send className="h-4 w-4 text-indigo-500" />
          <span>Compose Platform Broadcast</span>
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-500">Notification Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="e.g. Critical Security Update Notice"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Target Audience</label>
            <select
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
              }}
              className="mt-1 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
            >
              <option value="All Registered Users">All Registered Users</option>
              <option value="Student Applicants">Student Applicants</option>
              <option value="Company Members">Company Members & Recruiters</option>
              <option value="Admins">Platform Administrators</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500">Channel Type</label>
          <div className="mt-1 flex items-center gap-3">
            {(["IN_APP", "EMAIL", "PUSH"] as const).map((ch) => (
              <button
                type="button"
                key={ch}
                onClick={() => {
                  setChannel(ch);
                }}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  channel === ch
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500">Notification Message Body</label>
          <textarea
            rows={3}
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Type notification text..."
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Dispatch Broadcast</span>
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Broadcast Dispatch History
        </h3>
        <DataTable
          data={history}
          columns={columns}
          searchPlaceholder="Search notification history..."
          exportFilename="zalvy-notification-history"
        />
      </div>
    </div>
  );
}
