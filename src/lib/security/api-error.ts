/**
 * ZALVY — Standardized API Error Handling.
 *
 * Provides defensive error responses that sanitize internal error tracebacks
 * in production while returning RFC 7807 problem details in development.
 *
 * @module lib/security/api-error
 */

import { NextResponse } from "next/server";
import { logAuditEvent } from "./audit-logger";

export interface ApiErrorOptions {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  ip?: string;
  action?: string;
}

export function createErrorResponse({
  status,
  code,
  message,
  details,
  ip,
  action = "api_request",
}: ApiErrorOptions): NextResponse {
  // Log security event for non-2xx failures
  logAuditEvent({
    eventType: status >= 500 ? "API_ERROR" : "UNAUTHORIZED_ACCESS",
    severity: status >= 500 ? "ERROR" : "WARN",
    action,
    ip,
    details: {
      status,
      code,
      message,
      ...(process.env.NODE_ENV === "development" ? details : {}),
    },
  });

  const responseBody = {
    error: {
      code,
      message:
        process.env.NODE_ENV === "production" && status >= 500
          ? "An internal server error occurred. Please try again later."
          : message,
    },
  };

  return NextResponse.json(responseBody, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
