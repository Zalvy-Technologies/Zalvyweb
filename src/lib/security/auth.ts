/**
 * ZALVY — Authentication Readiness & Session Management.
 *
 * Provides session parsing, auth header parsing, and JWT token validation readiness.
 *
 * @module lib/security/auth
 */

import { type AuthUser, type UserRole } from "./rbac";

export interface SessionPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
  iss: string;
}

/**
 * Parses Authorization header or session cookies to retrieve an authenticated user context.
 * Returns guest user if unauthenticated.
 */
export function getAuthenticatedUser(
  authHeader?: string | null,
  _sessionCookie?: string | null,
): AuthUser {
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      id: "guest-anon",
      email: "anonymous@zalvy.internal",
      role: "guest",
    };
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return {
      id: "guest-anon",
      email: "anonymous@zalvy.internal",
      role: "guest",
    };
  }

  // Simulated token validation structure for Auth-ready integration (NextAuth, Clerk, Auth0, JWT)
  try {
    const parts = token.split(".");
    if (parts.length === 3 && parts[1]) {
      const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
      const parsed = JSON.parse(payloadJson) as Partial<SessionPayload>;
      if (parsed.sub && parsed.role) {
        return {
          id: parsed.sub,
          email: parsed.email ?? "user@zalvy.internal",
          role: parsed.role,
        };
      }
    }
  } catch {
    // Malformed token falls back to guest
  }

  return {
    id: "guest-anon",
    email: "anonymous@zalvy.internal",
    role: "guest",
  };
}
