import { type NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/server/middleware/api-handler";
import { getAIProvider } from "@/lib/ai/stream";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import type { SkillAssessment } from "@/types/ai";
import { assessRequestSchema } from "@/server/schemas/ai.schema";

export const runtime = "nodejs";

async function handlePostAssess(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body payload." }, { status: 400 });
  }

  const parsedRequest = assessRequestSchema.safeParse(body);
  if (!parsedRequest.success) return NextResponse.json({ error: "Invalid assessment request." }, { status: 400 });
  const { skill, provider: providerType } = parsedRequest.data;
  const provider = getAIProvider(providerType);

  const prompt = `${buildSystemPrompt("skill-assessor")}

Generate a 2-question diagnostic skill assessment for ${skill}.
Output clean JSON matching:
{
  "skill": "${skill}",
  "calculatedLevel": "Intermediate",
  "scorePercentage": 85,
  "questions": [
    {
      "id": "q1",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 1,
      "explanation": "Explanation..."
    }
  ],
  "strengths": ["Good understanding of fundamentals"],
  "skillGaps": ["Deep memory management"],
  "learningPath": ["Study generics and utility types", "Build production API handlers"]
}`;

  try {
    const rawResponse = await provider.generateText([{ role: "user", content: prompt }], {
      temperature: 0.3,
    });

    const jsonMatch = /\{[\s\S]*\}/.exec(rawResponse);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as SkillAssessment;
      return NextResponse.json({ ok: true, assessment: parsed }, { status: 200 });
    }

    const fallback: SkillAssessment = {
      skill,
      calculatedLevel: "Intermediate",
      scorePercentage: 85,
      questions: [
        {
          id: "q1",
          question: `Which TypeScript feature guarantees exhaustive checking in switch statements when working with discriminated unions?`,
          options: ["never type assertion", "unknown type cast", "any fallback", "keyof operator"],
          correctOptionIndex: 0,
          explanation:
            "Assigning the default case to a value of type 'never' causes the TypeScript compiler to raise an error if any union variant is unhandled.",
        },
        {
          id: "q2",
          question: `In modern React 19 / Next.js 16, what is the primary benefit of Server Actions over traditional REST endpoints?`,
          options: [
            "Seamless type-safety from client to server without manual fetch boilerplate",
            "Slower bundle download times",
            "Requires custom CORS headers on every action",
            "Incompatibility with Server Components",
          ],
          correctOptionIndex: 0,
          explanation:
            "Server Actions allow directly calling async server functions from client components with full TypeScript type inferencing.",
        },
      ],
      strengths: [
        "Strong understanding of type inferencing",
        "Familiarity with modern React server patterns",
      ],
      skillGaps: ["Advanced generic constraints", "Custom compiler plugin configurations"],
      learningPath: [
        "Master conditional types and infer keyword",
        "Implement production middleware with rate limiting & security audit logs",
        "Deploy fullstack Next.js 16 application with Prisma ORM",
      ],
    };

    return NextResponse.json({ ok: true, assessment: fallback }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Skill assessment failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}

export const POST = withApiHandler(handlePostAssess, {
  actionName: "v1_ai_assess",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 15 },
});
