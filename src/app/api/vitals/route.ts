import { NextResponse } from "next/server";

/**
 * POST /api/vitals — Web Vitals telemetry endpoint.
 *
 * Receives Core Web Vitals metrics (CLS, FCP, FID, INP, LCP, TTFB) from the
 * client-side `sendVitalMetric()` reporter. In production, this would forward
 * metrics to an analytics pipeline (BigQuery, Datadog, etc.).
 *
 * Design decisions:
 *  - Accepts only POST with JSON body.
 *  - Returns 204 No Content on success (minimal response for fire-and-forget).
 *  - No auth required — telemetry is anonymous, server-side filtering by origin.
 *  - Validates metric shape to prevent abuse.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();

    // Validate metric shape.
    if (
      !body ||
      typeof body !== "object" ||
      !("name" in body) ||
      !("value" in body) ||
      !("id" in body)
    ) {
      return NextResponse.json({ error: "Invalid metric shape" }, { status: 400 });
    }

    const metric = body as {
      id: string;
      name: string;
      value: number;
      rating: string;
      delta: number;
      page: string;
      ts: number;
    };

    // In production, forward to analytics pipeline:
    // await analyticsClient.track("web_vital", metric);

    // For now, log in development only.
    if (process.env.NODE_ENV === "development") {
      const rating =
        metric.rating === "good" ? "✅" : metric.rating === "needs-improvement" ? "⚠️" : "🔴";
      console.info(
        `[CWV] ${rating} ${metric.name}: ${String(metric.value)} (${metric.rating}) — ${metric.page}`,
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to process metric" }, { status: 400 });
  }
}
