import { type NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/server/middleware/api-handler";
import { getAIProvider } from "@/lib/ai/stream";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import type { InterviewQuestion } from "@/types/ai";
import { interviewRequestSchema } from "@/server/schemas/ai.schema";

export const runtime = "nodejs";

async function handlePostInterview(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body payload." }, { status: 400 });
  }

  const parsedRequest = interviewRequestSchema.safeParse(body);
  if (!parsedRequest.success) return NextResponse.json({ error: "Invalid interview request." }, { status: 400 });
  const { role, difficulty, provider: providerType } = parsedRequest.data;
  const provider = getAIProvider(providerType);

  const prompt = `${buildSystemPrompt("interview-coach")}

Generate 3 technical mock interview questions for a ${difficulty} level candidate applying for the role of ${role}.
Output in JSON format as an array of objects matching:
[
  {
    "id": "q1",
    "question": "Question text...",
    "category": "technical",
    "difficulty": "${difficulty}",
    "sampleAnswerHint": "Hint on key concepts...",
    "keyTopics": ["Topic 1", "Topic 2"]
  }
]`;

  try {
    const rawResponse = await provider.generateText([{ role: "user", content: prompt }], {
      temperature: 0.5,
    });

    const jsonMatch = /\[[\s\S]*\]/.exec(rawResponse);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as InterviewQuestion[];
      return NextResponse.json({ ok: true, questions: parsed }, { status: 200 });
    }

    const fallback: InterviewQuestion[] = [
      {
        id: "q1",
        question:
          "How do Server-Sent Events (SSE) differ from WebSockets in modern streaming web applications, and when would you choose SSE?",
        category: "system_design",
        difficulty: "intermediate",
        sampleAnswerHint:
          "SSE is unidirectional HTTP stream, lighter weight, reconnects automatically. WebSockets are bidirectional TCP connections.",
        keyTopics: ["Streaming", "SSE", "WebSockets", "HTTP/2"],
      },
      {
        id: "q2",
        question:
          "Explain how you would handle race conditions and cache invalidation when deploying background workers with Next.js App Router.",
        category: "technical",
        difficulty: "intermediate",
        sampleAnswerHint:
          "Use atomic database locks, Redis KV with TTLs, or revalidateTag / revalidatePath in Next.js.",
        keyTopics: ["Concurrency", "Caching", "Next.js", "Redis"],
      },
      {
        id: "q3",
        question:
          "How do you evaluate and optimize LLM prompt latency in a production microservice architecture?",
        category: "technical",
        difficulty: "advanced",
        sampleAnswerHint:
          "Use streaming token delivery, model quantizations/smaller models for fast routing, and request batching.",
        keyTopics: ["LLM Performance", "Latency", "Streaming", "Gemini API"],
      },
    ];

    return NextResponse.json({ ok: true, questions: fallback }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Interview generation failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}

export const POST = withApiHandler(handlePostInterview, {
  actionName: "v1_ai_interview",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 20 },
});
