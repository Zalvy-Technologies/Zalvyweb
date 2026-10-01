import { type NextRequest, NextResponse } from "next/server";

import { generateCertificatePDF } from "@/lib/certificates/generator";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createErrorResponse } from "@/lib/security/api-error";
import { logAuditEvent } from "@/lib/security/audit-logger";
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, verifyCsrfToken } from "@/lib/security/csrf";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  // Rate limiting: 20 PDF generations per minute
  const rateLimit = await checkRateLimit(`admin:cert-pdf:${clientIp}`, { windowMs: 60 * 1000, maxRequests: 20 });
  if (rateLimit.limited) {
    logAuditEvent({
      eventType: "RATE_LIMIT_EXCEEDED",
      severity: "WARN",
      action: "generate_certificate_pdf",
      ip: clientIp,
      userAgent,
    });
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
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
      action: "generate_certificate_pdf",
      ip: clientIp,
      userAgent,
    });
    return createErrorResponse({
      status: 403,
      code: "CSRF_INVALID",
      message: "CSRF verification failed.",
      ip: clientIp,
      action: "generate_certificate_pdf",
    });
  }

  // In production, fetch from database
  // For now, mock data based on ID
  const mockCertificates: Record<string, any> = {
    "CERT-101": {
      certificateNumber: "ZLV-2026-9042",
      recipientName: "Sarah Jenkins",
      recipientEmail: "sarah.j@gmail.com",
      title: "Advanced AI Systems Engineering Internship",
      issueDate: "2026-06-15",
      verificationHash: "0x9a8f2c7e1d4b609832fa05",
      projectTitle: "Multi-Agent Claims Routing System",
      mentorName: "Dr. Anandi Mehta",
      duration: "12 weeks (Oct 2026 - Dec 2026)",
    },
    "CERT-102": {
      certificateNumber: "ZLV-2026-9043",
      recipientName: "Marcus Vance",
      recipientEmail: "marcus.v@outlook.com",
      title: "Full-Stack Modern Web Architecture",
      issueDate: "2026-07-01",
      verificationHash: "0x3f5c1d8a9e2b407761ce88",
      projectTitle: "Real-Time Collaboration Platform",
      mentorName: "Soren Asaka",
      duration: "12 weeks (Oct 2026 - Dec 2026)",
    },
    "CERT-103": {
      certificateNumber: "ZLV-2026-9044",
      recipientName: "David Chen",
      recipientEmail: "david.chen@mit.edu",
      title: "Quantitative Systems & GPU Acceleration",
      issueDate: "2026-07-10",
      verificationHash: "0x7b2a9e4f0c1d508823bb19",
      projectTitle: "High-Frequency Trading Optimization",
      mentorName: "Maya Kolbe",
      duration: "12 weeks (Oct 2026 - Dec 2026)",
    },
  };

  const cert = mockCertificates[id];

  if (!cert) {
    return NextResponse.json(
      { error: "Certificate not found" },
      { status: 404, headers: rateLimit.headers },
    );
  }

  try {
    const pdfBytes = await generateCertificatePDF({
      certificateNumber: cert.certificateNumber,
      recipientName: cert.recipientName,
      recipientEmail: cert.recipientEmail,
      title: cert.title,
      issueDate: cert.issueDate,
      verificationHash: cert.verificationHash,
      projectTitle: cert.projectTitle,
      mentorName: cert.mentorName,
      duration: cert.duration,
    });

    logAuditEvent({
      eventType: "CERTIFICATE_PDF_GENERATED",
      severity: "INFO",
      action: "generate_certificate_pdf",
      ip: clientIp,
      userAgent,
      details: {
        certificateId: id,
        certificateNumber: cert.certificateNumber,
        recipientName: cert.recipientName,
      },
    });

    return new NextResponse(new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" }), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ZALVY-Certificate-${cert.certificateNumber}.pdf"`,
        "Content-Length": pdfBytes.length.toString(),
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        ...rateLimit.headers,
      },
    });
  } catch (err) {
    console.error("[Certificate PDF] Generation failed:", err);
    logAuditEvent({
      eventType: "CERTIFICATE_PDF_FAILED",
      severity: "ERROR",
      action: "generate_certificate_pdf",
      ip: clientIp,
      userAgent,
      details: {
        certificateId: id,
        error: err instanceof Error ? err.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Failed to generate certificate PDF" },
      { status: 500, headers: rateLimit.headers },
    );
  }
}