"use client";

import { useState } from "react";
import { Download, RefreshCw, AlertTriangle, Eye } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG";
  source: string;
  message: string;
  stackTrace?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "LOG-501",
    timestamp: "2026-07-23 08:14:02.941",
    level: "ERROR",
    source: "api/verify",
    message: "Rate limit threshold exceeded for IP 192.168.1.104",
    stackTrace:
      "Error: Rate limit threshold exceeded\n    at RateLimiter.verify (src/lib/security/csrf.ts:42)\n    at APIHandler (src/server/middleware/api-handler.ts:18)",
  },
  {
    id: "LOG-502",
    timestamp: "2026-07-23 08:12:44.102",
    level: "WARN",
    source: "services/email",
    message: "SMTP provider response latency > 1200ms",
  },
  {
    id: "LOG-503",
    timestamp: "2026-07-23 08:10:11.890",
    level: "INFO",
    source: "auth/session",
    message: "User alex.drake@zalvy.internal authenticated via OAuth 2.0",
  },
  {
    id: "LOG-504",
    timestamp: "2026-07-23 08:05:00.000",
    level: "INFO",
    source: "cron/backup",
    message: "Automated database snapshot completed (3.4 GB compressed)",
  },
];

export default function AdminLogsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [activeTrace, setActiveTrace] = useState<LogEntry | null>(null);

  const filteredLogs = mockLogs.filter(
    (log) => selectedLevel === "ALL" || log.level === selectedLevel,
  );

  const getLevelBadge = (level: LogEntry["level"]) => {
    switch (level) {
      case "ERROR":
        return (
          <span className="rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-500">
            ERROR
          </span>
        );
      case "WARN":
        return (
          <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-500">
            WARN
          </span>
        );
      case "INFO":
        return (
          <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-500">
            INFO
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-400">
            DEBUG
          </span>
        );
    }
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Logs & Execution Stream
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Inspect live system output, runtime errors, and stack trace logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Live Stream</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20">
            <Download className="h-3.5 w-3.5" />
            <span>Export Log File</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {["ALL", "ERROR", "WARN", "INFO", "DEBUG"].map((level) => (
          <button
            key={level}
            onClick={() => {
              setSelectedLevel(level);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedLevel === level
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="custom-scrollbar space-y-2 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-900"
          >
            <span className="flex-shrink-0 text-[11px] text-slate-500">{log.timestamp}</span>
            <div className="flex-shrink-0">{getLevelBadge(log.level)}</div>
            <span className="flex-shrink-0 font-semibold text-indigo-400">[{log.source}]</span>
            <span className="flex-1 text-slate-200">{log.message}</span>
            {log.stackTrace && (
              <button
                onClick={() => {
                  setActiveTrace(log);
                }}
                className="flex flex-shrink-0 items-center gap-1 text-[10px] text-amber-400 hover:underline"
              >
                <Eye className="h-3 w-3" /> Stack Trace
              </button>
            )}
          </div>
        ))}
      </div>

      {activeTrace && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="flex items-center gap-2 font-bold text-slate-200">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span>Stack Trace Inspector - {activeTrace.id}</span>
              </h3>
              <button
                onClick={() => {
                  setActiveTrace(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <p className="font-semibold text-rose-400">{activeTrace.message}</p>
            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-slate-400">
              {activeTrace.stackTrace}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
