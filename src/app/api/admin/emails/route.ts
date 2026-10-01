import { type NextRequest, NextResponse } from "next/server";

import { sendEmail } from "@/lib/email/client";
import {
  offerLetterTemplate,
  projectAssignmentTemplate,
  completionEmailTemplate,
  paymentReminderTemplate,
  paymentVerifiedTemplate,
} from "@/lib/email/templates";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { createErrorResponse } from "@/lib/security/api-error";
import { logAuditEvent } from "@/lib/security/audit-logger";
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, verifyCsrfToken } from "@/lib/security/csrf";

export const runtime = "nodejs";

interface EmailRequestBody {
  type: "offer-letter" | "project-assignment" | "completion" | "payment-reminder" | "payment-verified";
  recipientEmail: string;
  recipientName?: string;
  data: Record<string, string>;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  // Rate limiting: 10 emails per minute per IP
  const rateLimit = await checkRateLimit(`admin:emails:${clientIp}`, { windowMs: 60 * 1000, maxRequests: 10 });
  if (rateLimit.limited) {
    logAuditEvent({
      eventType: "RATE_LIMIT_EXCEEDED",
      severity: "WARN",
      action: "send_admin_email",
      ip: clientIp,
      userAgent,
    });
    return NextResponse.json(
      { error: "Too many email requests. Please try again in a minute." },
      { status: 429, headers: rateLimit.headers },
    );
  }

  // CSRF verification
  const cookieCsrf = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerCsrf = request.headers.get(CSRF_HEADER_NAME);
  if (cookieCsrf && headerCsrf && !verifyCsrfToken(cookieCsrf, headerCsrf)) {
    logAuditEvent({
      eventType: "CSRF_VIOLATION",
      severity: "ERROR",
      action: "send_admin_email",
      ip: clientIp,
      userAgent,
    });
    return createErrorResponse({
      status: 403,
      code: "CSRF_INVALID",
      message: "CSRF verification failed.",
      ip: clientIp,
      action: "send_admin_email",
    });
  }

  let body: EmailRequestBody;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse({
      status: 400,
      code: "INVALID_PAYLOAD",
      message: "Invalid JSON payload.",
      ip: clientIp,
      action: "send_admin_email",
    });
  }

  const { type, recipientEmail, recipientName, data } = body;

  if (!type || !recipientEmail) {
    return createErrorResponse({
      status: 400,
      code: "MISSING_FIELDS",
      message: "Type and recipientEmail are required.",
      ip: clientIp,
      action: "send_admin_email",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipientEmail)) {
    return createErrorResponse({
      status: 400,
      code: "INVALID_EMAIL",
      message: "Invalid recipient email address.",
      ip: clientIp,
      action: "send_admin_email",
    });
  }

  let html: string;
  let subject: string;

  const templateData = {
    recipientName,
    companyName: data.companyName,
    internshipTitle: data.internshipTitle,
    startDate: data.startDate,
    endDate: data.endDate,
    stipend: data.stipend,
    certificateNumber: data.certificateNumber,
    verificationHash: data.verificationHash,
    verificationUrl: data.verificationUrl,
    projectTitle: data.projectTitle,
    projectDescription: data.projectDescription,
    mentorName: data.mentorName,
    dashboardUrl: data.dashboardUrl,
    supportEmail: data.supportEmail,
    companyUrl: data.companyUrl,
  };

  switch (type) {
    case "offer-letter":
      html = offerLetterTemplate(templateData);
      subject = `ZALVY Offer Letter: ${data.internshipTitle || "Internship Position"}`;
      break;
    case "project-assignment":
      html = projectAssignmentTemplate(templateData);
      subject = `Project Assignment: ${data.projectTitle || "New Project"}`;
      break;
    case "completion":
      html = completionEmailTemplate(templateData);
      subject = `ZALVY Internship Completed: ${data.certificateNumber || "Certificate"}`;
      break;
    case "payment-reminder":
      html = paymentReminderTemplate(templateData);
      subject = `Payment Reminder: ${data.stipend || "Stipend"}`;
      break;
    case "payment-verified":
      html = paymentVerifiedTemplate(templateData);
      subject = `Payment Confirmed: ${data.stipend || "Stipend"}`;
      break;
    default:
      return createErrorResponse({
        status: 400,
        code: "INVALID_TYPE",
        message: `Unknown email type: ${type}`,
        ip: clientIp,
        action: "send_admin_email",
      });
  }

  const result = await sendEmail({
    to: recipientEmail,
    subject,
    html,
    replyTo: "careers@zalvy.com",
  });

  logAuditEvent({
    eventType: result.success ? "ADMIN_EMAIL_SENT" : "ADMIN_EMAIL_FAILED",
    severity: result.success ? "INFO" : "ERROR",
    action: "send_admin_email",
    ip: clientIp,
    userAgent,
    details: {
      type,
      recipientEmail,
      subject,
      error: result.error,
    },
  });

  if (!result.success) {
    return NextResponse.json(
      { error: "Failed to send email", details: result.error },
      { status: 500, headers: rateLimit.headers },
    );
  }

  return NextResponse.json(
    { ok: true, messageId: result.id },
    { status: 200, headers: rateLimit.headers },
  );
}