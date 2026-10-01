import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/leads/route";
import { NextRequest } from "next/server";

interface LeadResponseBody {
  error?: string;
  ok?: boolean;
  message?: string;
}

describe("POST /api/leads", () => {
  it("rejects invalid request intent with HTTP 400", async () => {
    const formData = new FormData();
    formData.append("intent", "invalid_intent");
    formData.append("name", "Jane Doe");
    formData.append("email", "jane@example.com");
    formData.append("message", "This is a sufficiently long test message for validation.");

    const request = new NextRequest("http://localhost:3000/api/leads", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = (await response.json()) as LeadResponseBody;
    expect(json.error).toBe("Invalid request intent.");
  });

  it("rejects short or invalid email address with HTTP 400", async () => {
    const formData = new FormData();
    formData.append("intent", "enterprise");
    formData.append("name", "Jane Doe");
    formData.append("email", "not-an-email");
    formData.append("message", "This is a sufficiently long test message for validation.");

    const request = new NextRequest("http://localhost:3000/api/leads", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = (await response.json()) as LeadResponseBody;
    expect(json.error).toBe("Please provide a valid email address.");
  });

  it("accepts valid enterprise inquiry with HTTP 200", async () => {
    const formData = new FormData();
    formData.append("intent", "enterprise");
    formData.append("name", "Alice Engineer");
    formData.append("email", "alice@enterprise.com");
    formData.append("company", "Acme Corp");
    formData.append(
      "message",
      "We are interested in deploying ZALVY AI Agents across our engineering organization.",
    );

    const request = new NextRequest("http://localhost:3000/api/leads", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const json = (await response.json()) as LeadResponseBody;
    expect(json.ok).toBe(true);
    expect(json.message).toBe("Inquiry received successfully.");
  });
});
