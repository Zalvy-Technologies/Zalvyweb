"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FileJson } from "lucide-react";
import { JsonDiffModal } from "@/components/admin/json-diff-modal";

interface AuditLogRecord {
  id: string;
  actorName: string;
  actorType: "ADMIN" | "USER" | "SYSTEM";
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  createdAt: string;
  changes: Record<string, unknown>;
}

const mockAuditLogs: AuditLogRecord[] = [
  {
    id: "AUD-701",
    actorName: "Alex Drake",
    actorType: "ADMIN",
    action: "UPDATE_ROLE_PERMISSIONS",
    entityType: "admins",
    entityId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    ipAddress: "192.168.1.1",
    createdAt: "2026-07-23 08:16:00",
    changes: {
      before: { role: "MODERATOR", canDeleteUsers: false },
      after: { role: "SUPER_ADMIN", canDeleteUsers: true },
    },
  },
  {
    id: "AUD-702",
    actorName: "DeepMind Recruiter",
    actorType: "USER",
    action: "VERIFY_COMPANY_DOMAIN",
    entityType: "companies",
    entityId: "c1fbc901-2a0d-4ef1-889a-00129a88fa12",
    ipAddress: "10.0.8.44",
    createdAt: "2026-07-22 16:30:12",
    changes: {
      before: { verification_status: "PENDING" },
      after: { verification_status: "VERIFIED", verified_at: "2026-07-22T16:30:12Z" },
    },
  },
  {
    id: "AUD-703",
    actorName: "Sarah Jenkins",
    actorType: "USER",
    action: "SUBMIT_APPLICATION",
    entityType: "applications",
    entityId: "b990a123-4c12-4fe1-90ab-556677889900",
    ipAddress: "172.16.0.12",
    createdAt: "2026-07-20 14:15:00",
    changes: {
      action: "APPLICATION_CREATED",
      internship_id: "i88123-4567-8901",
      applicant_id: "u90123-4567-8901",
    },
  },
];

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditLogRecord[]>(mockAuditLogs);
  const [selectedDiff, setSelectedDiff] = useState<{
    title: string;
    data: Record<string, unknown>;
  } | null>(null);

  const columns: Column<AuditLogRecord>[] = [
    {
      header: "Timestamp",
      accessorKey: "createdAt",
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-500">{row.createdAt}</span>,
    },
    {
      header: "Actor",
      accessorKey: "actorName",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="block font-bold text-slate-900 dark:text-white">{row.actorName}</span>
          <span className="font-mono text-[10px] font-semibold text-indigo-500">
            {row.actorType}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      accessorKey: "action",
      sortable: true,
      cell: (row) => (
        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
          {row.action}
        </span>
      ),
    },
    {
      header: "Target Entity",
      accessorKey: "entityType",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="block font-semibold text-slate-800 dark:text-slate-200">
            {row.entityType}
          </span>
          <span className="block max-w-[120px] truncate font-mono text-[10px] text-slate-400">
            {row.entityId}
          </span>
        </div>
      ),
    },
    {
      header: "IP Address",
      accessorKey: "ipAddress",
      cell: (row) => <span className="font-mono text-slate-500">{row.ipAddress}</span>,
    },
    {
      header: "JSON Diff",
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedDiff({ title: `Audit Event ${row.id} - ${row.action}`, data: row.changes });
          }}
          className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-500/10 dark:bg-slate-800 dark:text-indigo-400"
        >
          <FileJson className="h-3.5 w-3.5" />
          <span>Inspect Diff</span>
        </button>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Audit Trail Ledger
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Immutable security ledger capturing all administrative changes, before/after JSON state
          diffs, and IP addresses.
        </p>
      </div>

      <DataTable
        data={logs}
        columns={columns}
        searchPlaceholder="Search audit logs by actor, action, or IP..."
        exportFilename="zalvy-audit-logs"
      />

      {selectedDiff && (
        <JsonDiffModal
          isOpen={!!selectedDiff}
          onClose={() => {
            setSelectedDiff(null);
          }}
          title={selectedDiff.title}
          data={selectedDiff.data}
        />
      )}
    </div>
  );
}
