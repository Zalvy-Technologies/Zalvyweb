/**
 * ZALVY — Security Audit Logging & Telemetry Engine.
 *
 * Emits structured JSON security audit events suitable for cloud log aggregation
 * (Datadog, GCP Cloud Logging, AWS CloudWatch, Splunk) and SIEM systems.
 *
 * Features:
 *  - Enforces structured log schema with ISO timestamps and trace IDs.
 *  - Automatically redacts sensitive parameters (PII, tokens, secrets).
 *  - Categorizes security events (`AUTH_ATTEMPT`, `RATE_LIMIT_EXCEEDED`, `CSRF_VIOLATION`, `LEAD_SUBMITTED`, etc.).
 *
 * @module lib/security/audit-logger
 */

import { redactSensitiveData } from "./sanitization";

export type SecurityEventType =
  | "AUTH_ATTEMPT"
  | "AUTH_SUCCESS"
  | "AUTH_FAILURE"
  | "UNAUTHORIZED_ACCESS"
  | "CSRF_VIOLATION"
  | "RATE_LIMIT_EXCEEDED"
  | "LEAD_SUBMITTED"
  | "API_ERROR"
  | "SECURITY_HEADER_VIOLATION"
  | "VALIDATION_ERROR"
  | "ADMIN_EMAIL_SENT"
  | "ADMIN_EMAIL_FAILED"
  | "CERTIFICATE_PDF_GENERATED"
  | "CERTIFICATE_PDF_FAILED";

export type SeverityLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export interface AuditEventPayload {
  eventType: SecurityEventType;
  severity: SeverityLevel;
  action: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  traceId?: string;
}

export function logAuditEvent(payload: AuditEventPayload): void {
  const timestamp = new Date().toISOString();
  const sanitizedDetails = payload.details ? redactSensitiveData(payload.details) : {};

  const logRecord = {
    timestamp,
    service: "zalvy-platform",
    environment: process.env.NODE_ENV,
    eventType: payload.eventType,
    severity: payload.severity,
    action: payload.action,
    userId: payload.userId ?? "anonymous",
    clientIp: payload.ip ?? "unknown",
    userAgent: payload.userAgent ?? "unknown",
    traceId: payload.traceId ?? `trace-${String(Date.now())}`,
    details: sanitizedDetails,
  };

  const output = JSON.stringify(logRecord);

  switch (payload.severity) {
    case "CRITICAL":
    case "ERROR":
      console.error(`[AUDIT_LOG_ERROR] ${output}`);
      break;
    case "WARN":
      console.warn(`[AUDIT_LOG_WARN] ${output}`);
      break;
    case "INFO":
    default:
      console.info(`[AUDIT_LOG_INFO] ${output}`);
      break;
  }
}
