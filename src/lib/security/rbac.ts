/**
 * ZALVY — Role-Based Access Control (RBAC) System.
 *
 * Defines enterprise roles, granular permissions, and authorization matrix.
 *
 * Supported Roles:
 *  - `admin`: Superuser control over platform, audit logs, and talent workflows.
 *  - `enterprise`: Access to custom AI Agent deployments and automation pipelines.
 *  - `developer`: Access to developer tooling, APIs, and model benchmarks.
 *  - `candidate`: Student / Intern applicant access to internship programs & status.
 *  - `guest`: Anonymous visitor with read-only public marketing access.
 *
 * @module lib/security/rbac
 */

export type UserRole = "admin" | "enterprise" | "developer" | "candidate" | "guest";

export type Permission =
  | "read:public"
  | "submit:leads"
  | "read:platform"
  | "write:platform"
  | "read:internships"
  | "apply:internship"
  | "read:audit_logs"
  | "manage:users"
  | "manage:enterprise_agents";

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  admin: [
    "read:public",
    "submit:leads",
    "read:platform",
    "write:platform",
    "read:internships",
    "apply:internship",
    "read:audit_logs",
    "manage:users",
    "manage:enterprise_agents",
  ],
  enterprise: [
    "read:public",
    "submit:leads",
    "read:platform",
    "write:platform",
    "manage:enterprise_agents",
  ],
  developer: ["read:public", "submit:leads", "read:platform", "write:platform"],
  candidate: ["read:public", "submit:leads", "read:internships", "apply:internship"],
  guest: ["read:public", "submit:leads"],
} as const;

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId?: string;
}

/**
 * Evaluates whether a user role possesses a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Checks if a user has all required permissions.
 */
export function hasAllPermissions(
  role: UserRole,
  requiredPermissions: readonly Permission[],
): boolean {
  return requiredPermissions.every((perm) => hasPermission(role, perm));
}
