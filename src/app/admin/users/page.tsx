"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { KeyRound } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "USER" | "COMPANY_MEMBER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  lastLogin: string;
  createdAt: string;
}

const mockUsers: UserRecord[] = [
  {
    id: "USR-801",
    name: "Sarah Jenkins",
    email: "sarah.j@gmail.com",
    role: "USER",
    status: "ACTIVE",
    lastLogin: "2026-07-23 07:45",
    createdAt: "2026-01-15",
  },
  {
    id: "USR-802",
    name: "Marcus Vance",
    email: "marcus.v@outlook.com",
    role: "COMPANY_MEMBER",
    status: "ACTIVE",
    lastLogin: "2026-07-22 18:20",
    createdAt: "2026-02-10",
  },
  {
    id: "USR-803",
    name: "Elena Rostova",
    email: "elena.r@tech.org",
    role: "USER",
    status: "SUSPENDED",
    lastLogin: "2026-06-30 11:15",
    createdAt: "2026-03-04",
  },
  {
    id: "USR-804",
    name: "Alex Drake",
    email: "alex.drake@zalvy.internal",
    role: "ADMIN",
    status: "ACTIVE",
    lastLogin: "2026-07-23 08:10",
    createdAt: "2025-11-01",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          triggerNotification(`User ${u.name} is now ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );
  };

  const columns: Column<UserRecord>[] = [
    {
      header: "User",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="block font-semibold text-slate-900 dark:text-white">{row.name}</span>
            <span className="text-[11px] text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      sortable: true,
      cell: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            row.role === "ADMIN"
              ? "border border-purple-500/20 bg-purple-500/10 text-purple-600"
              : row.role === "COMPANY_MEMBER"
                ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-600"
                : "border border-slate-500/20 bg-slate-500/10 text-slate-600"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            row.status === "ACTIVE"
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              : "border border-rose-500/20 bg-rose-500/10 text-rose-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Last Active",
      accessorKey: "lastLogin",
      sortable: true,
      cell: (row) => <span className="text-slate-500 dark:text-slate-400">{row.lastLogin}</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerNotification(`Password reset link dispatched to ${row.email}`);
            }}
            title="Send Password Reset"
            className="rounded-lg bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <KeyRound className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              toggleUserStatus(row.id);
            }}
            className={`rounded-xl px-3 py-1 text-xs font-semibold transition-colors ${
              row.status === "ACTIVE"
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40"
            }`}
          >
            {row.status === "ACTIVE" ? "Suspend" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in space-y-6">
      {notification && (
        <div className="animate-in fade-in rounded-xl bg-indigo-600 p-3 text-center text-xs font-semibold text-white shadow-lg">
          {notification}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          User Directory & Governance
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Manage user roles, account active statuses, and credential reset triggers.
        </p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search users by name or email..."
        exportFilename="zalvy-user-directory"
      />
    </div>
  );
}
