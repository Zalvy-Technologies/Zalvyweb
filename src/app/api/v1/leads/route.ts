import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateLeadDto } from "@/server/dtos/lead.dto";
import { defaultLeadService } from "@/server/services/lead.service";
import { withApiHandler } from "@/server/middleware/api-handler";

export const runtime = "nodejs";

const leadSchema = z.object({
  intent: z.enum(["enterprise", "internship"]),
  name: z.string().min(2).max(200),
  email: z.email(),
  company: z.string().max(200).optional(),
  message: z.string().min(20).max(8000),
});

function stringFormValue(body: FormData, key: string): string | null {
  const entry = body.get(key);
  if (entry === null) return null;
  if (typeof entry === "string") return entry;
  if (entry instanceof File) return entry.name;
  return null;
}

async function handlePostLead(request: NextRequest): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  let payload: Record<string, unknown> = {};

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await request.formData();
    payload = {
      intent: stringFormValue(formData, "intent"),
      name: stringFormValue(formData, "name"),
      email: stringFormValue(formData, "email"),
      company: stringFormValue(formData, "company"),
      message: stringFormValue(formData, "message"),
    };
  } else if (contentType.includes("application/json")) {
    payload = (await request.json()) as Record<string, unknown>;
  } else {
    // Fallback: try formData first, then json
    try {
      const formData = await request.formData();
      payload = {
        intent: stringFormValue(formData, "intent"),
        name: stringFormValue(formData, "name"),
        email: stringFormValue(formData, "email"),
        company: stringFormValue(formData, "company"),
        message: stringFormValue(formData, "message"),
      };
    } catch {
      payload = (await request.json()) as Record<string, unknown>;
    }
  }

  // Parse & Validate DTO
  const { dto, error } = CreateLeadDto.parse(payload);
  if (error || !dto) {
    return NextResponse.json({ error: error ?? "Invalid request payload." }, { status: 400 });
  }

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const result = await defaultLeadService.processLead(dto, clientIp);

  return NextResponse.json(
    {
      ok: true,
      message: "Inquiry received successfully.",
      lead: result.response,
      duplicate: result.duplicate,
    },
    { status: 200 },
  );
}

async function handleGetLeads(): Promise<NextResponse> {
  const leads = await defaultLeadService.getLeads();
  return NextResponse.json({ ok: true, leads }, { status: 200 });
}

export const POST = withApiHandler(handlePostLead, {
  actionName: "v1_post_lead",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 5 },
  validationSchema: leadSchema,
  requireCsrf: true,
});

export const GET = withApiHandler(handleGetLeads, {
  actionName: "v1_get_leads",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 30 },
});
