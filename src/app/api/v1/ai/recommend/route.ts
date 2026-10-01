import { type NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/server/middleware/api-handler";
import { getAIProvider } from "@/lib/ai/stream";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import type { ProjectRecommendation } from "@/types/ai";
import { recommendRequestSchema } from "@/server/schemas/ai.schema";

export const runtime = "nodejs";

async function handlePostRecommend(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body payload." }, { status: 400 });
  }

  const parsedRequest = recommendRequestSchema.safeParse(body);
  if (!parsedRequest.success) return NextResponse.json({ error: "Invalid recommendation request." }, { status: 400 });
  const { level, provider: providerType } = parsedRequest.data;
  const skills = parsedRequest.data.skills.join(", ");
  const provider = getAIProvider(providerType);

  const prompt = `${buildSystemPrompt("project-recommender")}

Suggest 2 production-grade portfolio projects for a ${level} developer with skills: ${skills}.
Return a clean JSON array of objects matching:
[
  {
    "id": "proj-1",
    "title": "Project Title",
    "description": "Comprehensive summary...",
    "difficulty": "intermediate",
    "estimatedHours": 24,
    "requiredSkills": ["Skill 1", "Skill 2"],
    "outcomes": ["Outcome 1", "Outcome 2"],
    "architecturePreview": "Next.js + Prisma + Gemini API + Tailwind CSS"
  }
]`;

  try {
    const rawResponse = await provider.generateText([{ role: "user", content: prompt }], {
      temperature: 0.5,
    });

    const jsonMatch = /\[[\s\S]*\]/.exec(rawResponse);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as ProjectRecommendation[];
      return NextResponse.json({ ok: true, recommendations: parsed }, { status: 200 });
    }

    const fallback: ProjectRecommendation[] = [
      {
        id: "rec-1",
        title: "Autonomous RAG Knowledge Assistant & Vector Search Engine",
        description:
          "Build an enterprise document ingestion pipeline with hybrid TF-IDF + vector embeddings, SSE streaming, and role-based access control.",
        difficulty: "intermediate",
        estimatedHours: 20,
        requiredSkills: ["Next.js 16", "TypeScript", "PostgreSQL", "Gemini API", "Tailwind CSS"],
        outcomes: [
          "Implement stream processing with Web Streams API",
          "Design PostgreSQL vector indexes",
          "Deploy automated rate limiting middleware",
        ],
        architecturePreview:
          "Next.js App Router ➔ PostgreSQL / Prisma ➔ Gemini Embeddings ➔ SSE Stream",
      },
      {
        id: "rec-2",
        title: "Real-Time Microservice Observability & Audit Ledger",
        description:
          "Develop a high-throughput audit telemetry dashboard tracking API performance metrics, rate limits, and structural security events.",
        difficulty: "advanced",
        estimatedHours: 35,
        requiredSkills: ["TypeScript", "Zustand", "Recharts / SVG", "Docker", "Node.js"],
        outcomes: [
          "Build real-time terminal log viewer",
          "Implement sliding-window rate limiters",
          "Design JSON state diffing viewer",
        ],
        architecturePreview:
          "Express/Next.js ➔ Sliding-Window Store ➔ Recharts Dashboard ➔ Docker Container",
      },
    ];

    return NextResponse.json({ ok: true, recommendations: fallback }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        error: `Project recommendation failed: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 500 },
    );
  }
}

export const POST = withApiHandler(handlePostRecommend, {
  actionName: "v1_ai_recommend",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 20 },
});
