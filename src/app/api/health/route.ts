import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Health check endpoint for load balancer liveness/readiness probes.
 * 
 * GET /api/health       - Liveness probe (basic process health)
 * GET /api/health/ready - Readiness probe (dependencies: DB, cache, etc.)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const check = searchParams.get("check") ?? "liveness";

  const timestamp = String(Date.now());
  const randomPart = Math.random().toString(36).substring(2, 8);
  const correlationId = `health-${timestamp}-${randomPart}`;

  if (check === "readiness") {
    const checks = await Promise.allSettled([
      checkDatabase(),
      checkCache(),
    ]);

    const dbCheck = checks[0];
    const cacheCheck = checks[1];

    const isReady = dbCheck.status === "fulfilled" && cacheCheck.status === "fulfilled";

    return NextResponse.json(
      {
        status: isReady ? "ready" : "not ready",
        timestamp: new Date().toISOString(),
        correlationId,
        checks: {
          database: dbCheck.status === "fulfilled" ? "healthy" : "unhealthy",
          cache: cacheCheck.status === "fulfilled" ? "healthy" : "unhealthy",
        },
      },
      {
        status: isReady ? 200 : 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Correlation-ID": correlationId,
        },
      }
    );
  }

  // Liveness check - always returns healthy if process is running
  return NextResponse.json(
    {
      status: "alive",
      timestamp: new Date().toISOString(),
      correlationId,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version ?? "unknown",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Correlation-ID": correlationId,
      },
    }
  );
}

async function checkDatabase(): Promise<void> {
  // Simple query to verify DB connectivity
  await prisma.$queryRaw`SELECT 1`;
}

async function checkCache(): Promise<void> {
  // Import cache provider dynamically to avoid circular deps
  const { defaultCacheProvider } = await import("@/server/cache/cache-provider");
  await defaultCacheProvider.set("health-check", "ok", 10);
  const result = await defaultCacheProvider.get("health-check");
  if (result !== "ok") throw new Error("Cache read/write failed");
}