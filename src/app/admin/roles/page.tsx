"use client";

import { useState } from "react";
import { ShieldCheck, Check, Save } from "lucide-react";

interface RolePermission {
  domain: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  approve: boolean;
}

interface RoleConfig {
  role: "SUPER_ADMIN" | "MODERATOR" | "CONTENT_EDITOR" | "SUPPORT_AGENT";
  title: string;
  description: string;
  permissions: Record<string, RolePermission>;
}

const initialRoles: RoleConfig[] = [
  {
    role: "SUPER_ADMIN",
    title: "Super Administrator",
    description:
      "Unrestricted access to system configuration, financial payouts, user administration, and security rules.",
    permissions: {
      Users: { domain: "Users", read: true, write: true, delete: true, approve: true },
      Applications: {
        domain: "Applications",
        read: true,
        write: true,
        delete: true,
        approve: true,
      },
      Certificates: {
        domain: "Certificates",
        read: true,
        write: true,
        delete: true,
        approve: true,
      },
      Blog: { domain: "Blog", read: true, write: true, delete: true, approve: true },
      AuditLogs: { domain: "Audit Logs", read: true, write: true, delete: true, approve: true },
    },
  },
  {
    role: "MODERATOR",
    title: "Platform Moderator",
    description: "Can review applications, verify companies, and moderate showcase projects.",
    permissions: {
      Users: { domain: "Users", read: true, write: true, delete: false, approve: true },
      Applications: {
        domain: "Applications",
        read: true,
        write: true,
        delete: false,
        approve: true,
      },
      Certificates: {
        domain: "Certificates",
        read: true,
        write: false,
        delete: false,
        approve: true,
      },
      Blog: { domain: "Blog", read: true, write: false, delete: false, approve: false },
      AuditLogs: { domain: "Audit Logs", read: true, write: false, delete: false, approve: false },
    },
  },
];

export default function AdminRolesPage() {
  const initialRoleConfig = initialRoles[0] ?? {
    role: "SUPER_ADMIN",
    title: "Super Administrator",
    description: "",
    permissions: {},
  };
  const [roles, setRoles] = useState<RoleConfig[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(initialRoleConfig);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const togglePermission = (domain: string, permKey: keyof Omit<RolePermission, "domain">) => {
    const currentDomain = selectedRole.permissions[domain];
    if (!currentDomain) return;
    const updatedPerms = {
      ...selectedRole.permissions,
      [domain]: {
        ...currentDomain,
        [permKey]: !currentDomain[permKey],
      },
    };
    setSelectedRole({ ...selectedRole, permissions: updatedPerms });
  };

  const handleSaveMatrix = () => {
    setRoles(roles.map((r) => (r.role === selectedRole.role ? selectedRole : r)));
    setSavedMessage(`Permissions matrix updated for ${selectedRole.title}!`);
    setTimeout(() => {
      setSavedMessage(null);
    }, 3000);
  };

  return (
    <div className="animate-in fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          RBAC Roles & Permissions Matrix
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Configure granular access control permissions across system administrative domains.
        </p>
      </div>

      {savedMessage && (
        <div className="animate-in fade-in flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Check className="h-4 w-4" />
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {roles.map((r) => (
          <div
            key={r.role}
            onClick={() => {
              setSelectedRole(r);
            }}
            className={`cursor-pointer rounded-2xl border p-5 transition-all ${
              selectedRole.role === r.role
                ? "border-indigo-500 bg-indigo-600/10 ring-2 ring-indigo-500/20"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h3>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-500">
                {r.role}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {r.description}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span>Permissions Grid for {selectedRole.title}</span>
          </h3>
          <button
            onClick={handleSaveMatrix}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
          >
            <Save className="h-4 w-4" />
            <span>Save Role Matrix</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-semibold tracking-wider text-slate-500 uppercase dark:bg-slate-800/50">
              <tr>
                <th className="p-3">Domain</th>
                <th className="p-3 text-center">Read</th>
                <th className="p-3 text-center">Write / Modify</th>
                <th className="p-3 text-center">Delete</th>
                <th className="p-3 text-center">Approve / Issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {Object.values(selectedRole.permissions).map((perm) => (
                <tr key={perm.domain} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {perm.domain}
                  </td>
                  {(["read", "write", "delete", "approve"] as const).map((key) => (
                    <td key={key} className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={perm[key]}
                        onChange={() => {
                          togglePermission(perm.domain, key);
                        }}
                        className="cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
