import { NextResponse } from "next/server";
import { generateOpenApiSpec } from "@/server/openapi/openapi-spec";

export const runtime = "nodejs";

/**
 * GET /api/v1/docs — Returns OpenAPI 3.0 specification JSON.
 */
export function GET(): NextResponse {
  const spec = generateOpenApiSpec();
  return NextResponse.json(spec, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
