import { type NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/server/middleware/api-handler";
import { defaultKnowledgeStore } from "@/lib/ai/knowledge";
import { knowledgeRequestSchema } from "@/server/schemas/ai.schema";

export const runtime = "nodejs";

async function handlePostKnowledge(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body payload." }, { status: 400 });
  }

  const parsedRequest = knowledgeRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json({ error: "Field 'query' is required." }, { status: 400 });
  }

  const { query, topK } = parsedRequest.data;
  const chunks = await defaultKnowledgeStore.search(query, topK);
  return NextResponse.json(
    { ok: true, query, count: chunks.length, results: chunks },
    { status: 200 },
  );
}

export const POST = withApiHandler(handlePostKnowledge, {
  actionName: "v1_ai_knowledge",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 60 },
});
