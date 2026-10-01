/**
 * ZALVY — Enterprise API Controller Middleware Wrapper.
 *
 * Higher-order controller wrapper (`withApiHandler`) providing:
 *  - Automated rate limiting and RFC header injection.
 *  - Response latency timing headers (`Server-Timing`).
 *  - Defensive error catching & translation.
 *  - Structured audit logging.
 *  - Request validation with Zod schemas.
 *
 * @module server/middleware/api-handler
 */

import { type NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { logAuditEvent } from "@/lib/security/audit-logger";
import { z, ZodError } from "zod";

export interface ApiHandlerOptions {
  actionName: string;
  rateLimitConfig?: { windowMs?: number; maxRequests?: number };
  validationSchema?: z.ZodType;
  requireCsrf?: boolean;
}

export type ControllerFunction = (request: NextRequest) => Promise<NextResponse | Response>;

/**
 * Generates a correlation ID for request tracing.
 */
function generateCorrelationId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = String(Date.now());
  return `corr-${timestamp}-${randomPart}`;
}

async function validateRequestBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    return request.formData().then((formData) => {
      const obj: Record<string, unknown> = {};
      for (const [key, value] of formData.entries()) {
        if (obj[key] === undefined) {
          obj[key] = value;
        } else if (Array.isArray(obj[key])) {
          (obj[key] as unknown[]).push(value);
        } else {
          obj[key] = [obj[key], value];
        }
      }
      return obj;
    });
  }

  return Promise.resolve({});
}

export function withApiHandler(
  handler: ControllerFunction,
  options: ApiHandlerOptions,
): ControllerFunction {
  return async (request: NextRequest): Promise<NextResponse | Response> => {
    const startTime = performance.now();
    const correlationId = request.headers.get("x-correlation-id") ?? generateCorrelationId();
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
    const userAgent = request.headers.get("user-agent") ?? "unknown";

    // 1. Rate Limiting Check (async for Redis support)
    if (options.rateLimitConfig) {
      const rateLimit = await checkRateLimit(
        `${options.actionName}:${clientIp}`,
        options.rateLimitConfig,
      );
      if (rateLimit.limited) {
        logAuditEvent({
          eventType: "RATE_LIMIT_EXCEEDED",
          severity: "WARN",
          action: options.actionName,
          ip: clientIp,
          userAgent,
          traceId: correlationId,
        });

        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429, headers: rateLimit.headers },
        );
      }
    }

    // 2. Request Body Validation (if schema provided)
    if (options.validationSchema) {
      try {
        // Request bodies are one-shot streams. Validate a clone so the route
        // handler can safely parse the original request afterwards.
        const body = await validateRequestBody(request.clone());
        options.validationSchema.parse(body);
      } catch (err) {
        if (err instanceof ZodError) {
          const treeified = z.treeifyError(err);
          const errorDetails = "properties" in treeified ? treeified.properties : treeified.errors;
          logAuditEvent({
            eventType: "VALIDATION_ERROR",
            severity: "WARN",
            action: options.actionName,
            ip: clientIp,
            userAgent,
            traceId: correlationId,
            details: { errors: errorDetails },
          });

          return NextResponse.json(
            { error: "Invalid request payload", details: errorDetails },
            { status: 400 },
          );
        }
        throw err;
      }
    }

    // 3. CSRF Validation (if required)
    if (options.requireCsrf) {
      const { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, verifyCsrfToken } = await import("@/lib/security/csrf");
      const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
      const headerToken = request.headers.get(CSRF_HEADER_NAME) ?? request.headers.get("x-xsrf-token");

      if (!cookieToken || !headerToken || !verifyCsrfToken(cookieToken, headerToken)) {
        logAuditEvent({
          eventType: "CSRF_VIOLATION",
          severity: "ERROR",
          action: options.actionName,
          ip: clientIp,
          userAgent,
          traceId: correlationId,
        });

        return NextResponse.json(
          { error: "Invalid CSRF token. Please refresh the page and try again." },
          { status: 403 },
        );
      }
    }

    try {
      // 4. Execute Inner Controller Handler
      const response = await handler(request);
      const latencyMs = Math.round(performance.now() - startTime);

      // 5. Attach Performance & Security Headers
      response.headers.set("Server-Timing", `total;dur=${String(latencyMs)}`);
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set("X-Correlation-ID", correlationId);

      return response;
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);

      logAuditEvent({
        eventType: "API_ERROR",
        severity: "ERROR",
        action: options.actionName,
        ip: clientIp,
        userAgent,
        traceId: correlationId,
        details: {
          error: err instanceof Error ? err.message : String(err),
          latencyMs,
        },
      });

      return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
    }
  };
}
