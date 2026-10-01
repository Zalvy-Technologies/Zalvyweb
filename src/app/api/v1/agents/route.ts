import { type NextRequest, NextResponse } from "next/server";
import { DeployAgentDto } from "@/server/dtos/agent.dto";
import { defaultAgentService } from "@/server/services/agent.service";
import { withApiHandler } from "@/server/middleware/api-handler";

export const runtime = "nodejs";

async function handleGetAgents(): Promise<NextResponse> {
  const agents = await defaultAgentService.listAgents();
  return NextResponse.json({ ok: true, agents }, { status: 200 });
}

async function handlePostAgent(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { dto, error } = DeployAgentDto.parse(body);
  if (error || !dto) {
    return NextResponse.json({ error: error ?? "Invalid agent parameters." }, { status: 400 });
  }

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const agent = await defaultAgentService.deployAgent(dto, clientIp);

  return NextResponse.json(
    { ok: true, message: "Agent deployment initiated.", agent },
    { status: 200 },
  );
}

export const GET = withApiHandler(handleGetAgents, {
  actionName: "v1_get_agents",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 60 },
});

export const POST = withApiHandler(handlePostAgent, {
  actionName: "v1_post_agent",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 10 },
});
