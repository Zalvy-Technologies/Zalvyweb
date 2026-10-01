import { type NextRequest, NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeText, sanitizeEmail } from "@/lib/security/sanitization";
import {
  validateEmail,
  validateName,
  validateMessage,
  validateEnum,
} from "@/lib/security/validation";
import { logAuditEvent } from "@/lib/security/audit-logger";
import { createErrorResponse } from "@/lib/security/api-error";
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, verifyCsrfToken } from "@/lib/security/csrf";

export const runtime = "nodejs";

const ALLOWED_INTENTS = ["enterprise", "internship"] as const;

function stringFormValue(body: FormData, key: string): string | null {
  const entry = body.get(key);
  if (entry === null) return null;
  if (typeof entry === "string") return entry;
  if (entry instanceof File) return entry.name;
  return null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  // 1. Rate Limiting Check (5 requests / 60 seconds)
  const rateLimit = await checkRateLimit(`leads:${clientIp}`, { windowMs: 60 * 1000, maxRequests: 5 });

  if (rateLimit.limited) {
    logAuditEvent({
      eventType: "RATE_LIMIT_EXCEEDED",
      severity: "WARN",
      action: "submit_lead",
      ip: clientIp,
      userAgent,
      details: { maxRequests: rateLimit.limit },
    });

    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: rateLimit.headers },
    );
  }

  // 2. Double-Submit CSRF Verification (if token is provided)
  const cookieCsrf = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerCsrf = request.headers.get(CSRF_HEADER_NAME);

  if (cookieCsrf && headerCsrf && !verifyCsrfToken(cookieCsrf, headerCsrf)) {
    logAuditEvent({
      eventType: "CSRF_VIOLATION",
      severity: "ERROR",
      action: "submit_lead",
      ip: clientIp,
      userAgent,
    });

    return createErrorResponse({
      status: 403,
      code: "CSRF_INVALID",
      message: "CSRF verification failed.",
      ip: clientIp,
      action: "submit_lead",
    });
  }

  // 3. Payload Parsing
  let rawIntent: string | null = null;
  let rawName: string | null = null;
  let rawEmail: string | null = null;
  let rawCompany: string | null = null;
  let rawMessage: string | null = null;

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const json = (await request.json()) as Record<string, unknown>;
      rawIntent = typeof json.intent === "string" ? json.intent : null;
      rawName = typeof json.name === "string" ? json.name : null;
      rawEmail = typeof json.email === "string" ? json.email : null;
      rawCompany = typeof json.company === "string" ? json.company : null;
      rawMessage = typeof json.message === "string" ? json.message : null;
    } catch {
      return createErrorResponse({
        status: 400,
        code: "INVALID_PAYLOAD",
        message: "Invalid JSON payload.",
        ip: clientIp,
        action: "submit_lead",
      });
    }
  } else {
    try {
      const body = await request.formData();
      rawIntent = stringFormValue(body, "intent");
      rawName = stringFormValue(body, "name");
      rawEmail = stringFormValue(body, "email");
      rawCompany = stringFormValue(body, "company");
      rawMessage = stringFormValue(body, "message");
    } catch {
      return createErrorResponse({
        status: 400,
        code: "INVALID_PAYLOAD",
        message: "Invalid form payload.",
        ip: clientIp,
        action: "submit_lead",
      });
    }
  }

  // 4. Intent Validation
  const intentResult = validateEnum(rawIntent, ALLOWED_INTENTS, "intent");
  if (!intentResult.success || !intentResult.data) {
    return NextResponse.json({ error: "Invalid request intent." }, { status: 400 });
  }

  // 5. Input Validation & Sanitization
  const nameResult = validateName(rawName, 2, 200);
  if (!nameResult.success || !nameResult.data) {
    return NextResponse.json(
      { error: "Name must be between 2 and 200 characters." },
      { status: 400 },
    );
  }

  const emailResult = validateEmail(rawEmail);
  if (!emailResult.success || !emailResult.data) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const company = rawCompany ? sanitizeText(rawCompany) : undefined;

  const messageResult = validateMessage(rawMessage, 20, 8000);
  if (!messageResult.success || !messageResult.data) {
    return NextResponse.json(
      { error: "Message must be between 20 and 8000 characters." },
      { status: 400 },
    );
  }

  const sanitizedName = sanitizeText(nameResult.data);
  const sanitizedEmail = sanitizeEmail(emailResult.data);
  const sanitizedMessage = sanitizeText(messageResult.data);

  // 6. Security Audit Event
  logAuditEvent({
    eventType: "LEAD_SUBMITTED",
    severity: "INFO",
    action: "submit_lead",
    ip: clientIp,
    userAgent,
    details: {
      intent: intentResult.data,
      name: sanitizedName,
      email: sanitizedEmail,
      company: company ?? null,
      messageLength: sanitizedMessage.length,
    },
  });

  return NextResponse.json(
    { ok: true, message: "Inquiry received successfully." },
    {
      status: 200,
      headers: {
        ...rateLimit.headers,
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
