/**
 * ZALVY — OpenAPI 3.0 Specification Generator.
 *
 * Programmatically constructs OpenAPI 3.0.3 JSON schema for ZALVY v1 REST APIs.
 *
 * @module server/openapi/openapi-spec
 */

import { site } from "@/lib/site";

export function generateOpenApiSpec(): Record<string, unknown> {
  const aiJsonPost = (summary: string, requestSchema: Record<string, unknown>, responseName: string) => ({
    post: {
      summary,
      tags: ["AI"],
      requestBody: { required: true, content: { "application/json": { schema: requestSchema } } },
      responses: {
        "200": { description: "Successful response.", content: { "application/json": { schema: { type: "object", required: ["ok", responseName], properties: { ok: { type: "boolean", example: true }, [responseName]: {} } } } } },
        "400": { description: "Invalid request payload." },
        "429": { description: "Rate limit exceeded." },
        "500": { description: "Unexpected server error." },
      },
    },
  });
  return {
    openapi: "3.0.3",
    info: {
      title: `${site.name} Platform REST APIs`,
      version: "1.0.0",
      description: site.description,
      contact: {
        name: site.legalName,
        url: site.url,
        email: site.contact.email,
      },
    },
    servers: [
      {
        url: `${site.url}/api/v1`,
        description: "Production API Server (v1)",
      },
    ],
    paths: {
      "/leads": {
        post: {
          summary: "Submit Enterprise Lead or Internship Inquiry",
          operationId: "submitLead",
          tags: ["Leads"],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["intent", "name", "email", "message"],
                  properties: {
                    intent: { type: "string", enum: ["enterprise", "internship"] },
                    name: { type: "string", minLength: 2, maxLength: 200 },
                    email: { type: "string", format: "email" },
                    company: { type: "string" },
                    message: { type: "string", minLength: 20, maxLength: 8000 },
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  required: ["intent", "name", "email", "message"],
                  properties: {
                    intent: { type: "string", enum: ["enterprise", "internship"] },
                    name: { type: "string", minLength: 2, maxLength: 200 },
                    email: { type: "string", format: "email" },
                    company: { type: "string" },
                    message: { type: "string", minLength: 20, maxLength: 8000 },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Lead received successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean", example: true },
                      message: { type: "string", example: "Inquiry received successfully." },
                      leadId: { type: "string", example: "lead_17200000000_abc" },
                    },
                  },
                },
              },
            },
            "400": { description: "Invalid parameters or validation error." },
            "429": { description: "Rate limit exceeded." },
          },
        },
      },
      "/agents": {
        get: {
          summary: "List Active Enterprise AI Agents",
          operationId: "listAgents",
          tags: ["Agents"],
          responses: {
            "200": {
              description: "List of deployed agents and runtime metrics.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      agents: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            type: { type: "string" },
                            environment: { type: "string" },
                            status: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Deploy Enterprise AI Agent",
          operationId: "deployAgent",
          tags: ["Agents"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "type"],
                  properties: {
                    name: { type: "string" },
                    type: {
                      type: "string",
                      enum: [
                        "autonomous_workflow",
                        "code_interpreter",
                        "customer_support",
                        "research_analyst",
                      ],
                    },
                    environment: { type: "string", enum: ["staging", "production"] },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Agent deployment initiated." },
            "400": { description: "Invalid agent parameters." },
          },
        },
      },
      "/ai/chat": {
        post: {
          summary: "Stream an AI chat response",
          operationId: "streamAiChat",
          tags: ["AI"],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["messages"], properties: { messages: { type: "array", minItems: 1, maxItems: 30, items: { type: "object", required: ["role", "content"], properties: { role: { type: "string", enum: ["user", "assistant"] }, content: { type: "string", minLength: 1, maxLength: 12000 } } } }, agentId: { type: "string", enum: ["zalvy-assistant", "resume-analyzer", "interview-coach", "project-recommender", "skill-assessor", "certificate-verifier", "knowledge-base"] }, provider: { type: "string", enum: ["gemini", "ollama"] } } } } } },
          responses: { "200": { description: "SSE frames containing JSON content chunks and a terminal [DONE] frame.", content: { "text/event-stream": { schema: { type: "string" } } } }, "400": { description: "Invalid request payload." }, "429": { description: "Rate limit exceeded." } },
        },
      },
      "/ai/resume": aiJsonPost("Analyze a resume", { type: "object", required: ["resumeText"], properties: { resumeText: { type: "string", minLength: 50, maxLength: 50000 }, provider: { type: "string", enum: ["gemini", "ollama"] } } }, "analysis"),
      "/ai/interview": aiJsonPost("Generate interview questions", { type: "object", properties: { role: { type: "string", minLength: 2, maxLength: 100 }, difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] }, provider: { type: "string", enum: ["gemini", "ollama"] } } }, "questions"),
      "/ai/recommend": aiJsonPost("Recommend portfolio projects", { type: "object", properties: { skills: { type: "array", minItems: 1, maxItems: 20, items: { type: "string", maxLength: 80 } }, level: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] }, provider: { type: "string", enum: ["gemini", "ollama"] } } }, "recommendations"),
      "/ai/assess": aiJsonPost("Create a skill assessment", { type: "object", properties: { skill: { type: "string", minLength: 2, maxLength: 100 }, provider: { type: "string", enum: ["gemini", "ollama"] } } }, "assessment"),
      "/ai/knowledge": aiJsonPost("Search the knowledge base", { type: "object", required: ["query"], properties: { query: { type: "string", minLength: 2, maxLength: 500 }, topK: { type: "integer", minimum: 1, maximum: 10 } } }, "results"),
      "/ai/verify": aiJsonPost("Verify a certificate hash", { type: "object", required: ["certificateHash"], properties: { certificateHash: { type: "string", pattern: "^[a-fA-F0-9]{64}$" } } }, "verification"),
    },
  };
}
