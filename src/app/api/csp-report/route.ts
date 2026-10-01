import { type NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/security/audit-logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const raw = await request.text();
    let body: Record<string, unknown> | null = null;
    if (raw) {
      try {
        body = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        return NextResponse.json({ error: "Invalid CSP report" }, { status: 400 });
      }
    }
    const report = (body?.["csp-report"] ?? body ?? {}) as Record<string, unknown>;

    logAuditEvent({
      eventType: "SECURITY_HEADER_VIOLATION",
      severity: "WARN",
      action: "csp_violation_report",
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
      details: {
        directive: (report["violated-directive"]) ?? "unknown",
        blockedUri: (report["blocked-uri"]) ?? "unknown",
        documentUri: (report["document-uri"]) ?? "unknown",
        lineNumber: (report["line-number"]) ?? null,
        columnNumber: (report["column-number"]) ?? null,
        sourceFile: (report["source-file"]) ?? null,
        scriptSample: (report["script-sample"]) ?? null,
        disposition: (report.disposition) ?? "enforce",
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Invalid CSP report" }, { status: 400 });
  }
}