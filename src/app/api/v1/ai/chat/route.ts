import { type NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/server/middleware/api-handler";
import { createAISSEStreamResponse } from "@/lib/ai/stream";
import { defaultAgentRegistry } from "@/lib/ai/agents";
import { defaultKnowledgeStore } from "@/lib/ai/knowledge";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import type { AIMessage } from "@/types/ai";
import { chatRequestSchema } from "@/server/schemas/ai.schema";

export const runtime = "nodejs";

async function handlePostChat(request: NextRequest): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body payload." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Field 'messages' must be a non-empty array." },
      { status: 400 },
    );
  }

  const rawMessages: AIMessage[] = parsed.data.messages;
  const agentId = parsed.data.agentId ?? "zalvy-assistant";
  const provider = parsed.data.provider;
  const agent = defaultAgentRegistry.getAgent(agentId);

  const lastUserMsg = [...rawMessages].reverse().find((m) => m.role === "user")?.content ?? "";

  let contextSnippet = "";
  if (agentId === "knowledge-base" || lastUserMsg.toLowerCase().includes("zalvy")) {
    const docs = await defaultKnowledgeStore.search(lastUserMsg, 2);
    if (docs.length > 0) {
      contextSnippet = docs.map((d) => `[${d.title}]: ${d.content}`).join("\n\n");
    }
  }

  const systemPrompt = buildSystemPrompt(agentId, contextSnippet);

  const formattedMessages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    ...rawMessages.filter((m) => m.role !== "system"),
  ];

  return createAISSEStreamResponse(formattedMessages, {
    provider,
    temperature: agent?.temperature ?? 0.7,
  });
}

export const POST = withApiHandler(handlePostChat, {
  actionName: "v1_ai_chat",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 30 },
});
