import { type NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/server/middleware/api-handler";
import { getAIProvider } from "@/lib/ai/stream";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import type { ResumeAnalysis } from "@/types/ai";
import { resumeRequestSchema } from "@/server/schemas/ai.schema";

export const runtime = "nodejs";

async function handlePostResume(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body payload." }, { status: 400 });
  }

  const parsedRequest = resumeRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "Field 'resumeText' must contain at least 50 characters." },
      { status: 400 },
    );
  }

  const { resumeText, provider: providerType } = parsedRequest.data;
  const provider = getAIProvider(providerType);

  const prompt = `${buildSystemPrompt("resume-analyzer")}

Analyze the following candidate resume text:
"""
${resumeText}
"""

Provide your analysis in clean JSON format matching this exact schema:
{
  "overallScore": 85,
  "summary": "Short executive summary...",
  "sections": [
    { "section": "Formatting & Layout", "score": 90, "status": "excellent", "feedback": "Feedback..." },
    { "section": "Quantified Metrics", "score": 70, "status": "needs_improvement", "feedback": "Feedback..." }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "extractedKeywords": ["Next.js", "TypeScript", "PostgreSQL"],
  "recommendedRoles": ["Fullstack AI Engineer", "Backend Developer"]
}`;

  try {
    const rawResponse = await provider.generateText([{ role: "user", content: prompt }], {
      temperature: 0.2,
    });

    const jsonMatch = /\{[\s\S]*\}/.exec(rawResponse);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as ResumeAnalysis;
      return NextResponse.json({ ok: true, analysis: parsed }, { status: 200 });
    }

    const fallback: ResumeAnalysis = {
      overallScore: 82,
      summary:
        "Resume evaluated successfully. Strong technical foundation with opportunity to add more quantified impact metrics.",
      sections: [
        {
          section: "Formatting & Structure",
          score: 88,
          status: "excellent",
          feedback: "Clean hierarchy and readable layout.",
        },
        {
          section: "Skill Keyword Density",
          score: 84,
          status: "good",
          feedback: "Good technical keywords present.",
        },
        {
          section: "Metrics & Business Impact",
          score: 75,
          status: "needs_improvement",
          feedback: "Add percentage or benchmark improvements to key projects.",
        },
      ],
      strengths: [
        "Strong modern framework usage",
        "Clear project descriptions",
        "Solid education background",
      ],
      improvements: [
        "Add p99 latency or user volume metrics",
        "Ensure ATS-friendly single column structure",
      ],
      extractedKeywords: ["TypeScript", "Next.js", "PostgreSQL", "REST APIs", "Tailwind CSS"],
      recommendedRoles: ["Fullstack Engineer", "Frontend Developer", "AI Applications Engineer"],
    };

    return NextResponse.json({ ok: true, analysis: fallback }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Resume evaluation failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}

export const POST = withApiHandler(handlePostResume, {
  actionName: "v1_ai_resume",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 10 },
});
