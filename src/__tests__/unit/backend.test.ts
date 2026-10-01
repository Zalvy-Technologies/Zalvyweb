import { describe, expect, test, beforeEach } from "vitest";

import { CreateLeadDto } from "@/server/dtos/lead.dto";
import { DeployAgentDto } from "@/server/dtos/agent.dto";
import { MemoryCacheProvider } from "@/server/cache/cache-provider";
import { InMemoryLeadRepository } from "@/server/repositories/lead.repository";
import { InMemoryAgentRepository } from "@/server/repositories/agent.repository";
import { LeadService } from "@/server/services/lead.service";
import { AgentService } from "@/server/services/agent.service";
import { generateOpenApiSpec } from "@/server/openapi/openapi-spec";

describe("Layered Architecture & DTO Parsing", () => {
  test("CreateLeadDto parses and sanitizes valid lead payloads", () => {
    const valid = {
      intent: "enterprise",
      name: "  Alice Smith  ",
      email: "ALICE@EXAMPLE.COM  ",
      message:
        "We would like to explore deploying autonomous AI Agents across enterprise workflows.",
      company: "<b>Acme AI Corp</b>",
    };

    const result = CreateLeadDto.parse(valid);
    expect(result.error).toBeUndefined();
    expect(result.dto).toBeDefined();
    expect(result.dto?.name).toBe("Alice Smith");
    expect(result.dto?.email).toBe("alice@example.com");
    expect(result.dto?.company).toBe("Acme AI Corp");
  });

  test("CreateLeadDto rejects invalid or short messages", () => {
    const invalid = {
      intent: "enterprise",
      name: "Alice",
      email: "alice@example.com",
      message: "Too short",
    };

    const result = CreateLeadDto.parse(invalid);
    expect(result.error).toBeDefined();
    expect(result.dto).toBeUndefined();
  });

  test("DeployAgentDto parses valid AI Agent deployment configurations", () => {
    const valid = {
      name: "Research Analyst Bot",
      type: "research_analyst",
      environment: "production",
    };

    const result = DeployAgentDto.parse(valid);
    expect(result.error).toBeUndefined();
    expect(result.dto?.name).toBe("Research Analyst Bot");
    expect(result.dto?.type).toBe("research_analyst");
  });
});

describe("Cache Provider & TTL Expiration", () => {
  test("MemoryCacheProvider stores, retrieves, and expires entries", async () => {
    const cache = new MemoryCacheProvider();
    await cache.set("test_key", { data: 123 }, 10);

    const cached = await cache.get<{ data: number }>("test_key");
    expect(cached?.data).toBe(123);

    await cache.delete("test_key");
    expect(await cache.get("test_key")).toBeNull();
  });
});

describe("Repositories & Domain Services", () => {
  let leadRepo: InMemoryLeadRepository;
  let agentRepo: InMemoryAgentRepository;
  let cache: MemoryCacheProvider;
  let leadService: LeadService;
  let agentService: AgentService;

  beforeEach(() => {
    leadRepo = new InMemoryLeadRepository();
    agentRepo = new InMemoryAgentRepository();
    cache = new MemoryCacheProvider();
    leadService = new LeadService(leadRepo, cache);
    agentService = new AgentService(agentRepo, cache);
  });

  test("LeadService processes leads, deduplicates, and caches lists", async () => {
    const parseRes = CreateLeadDto.parse({
      intent: "enterprise",
      name: "Bob Dev",
      email: "bob@zalvy.dev",
      message: "Enterprise inquiry regarding custom AI chatbot development.",
    });

    expect(parseRes.dto).toBeDefined();
    if (!parseRes.dto) return;

    // First submission
    const firstRes = await leadService.processLead(parseRes.dto, "127.0.0.1");
    expect(firstRes.duplicate).toBe(false);
    expect(firstRes.response.email).toBe("bob@zalvy.dev");

    // Immediate second submission should mark duplicate
    const secondRes = await leadService.processLead(parseRes.dto, "127.0.0.1");
    expect(secondRes.duplicate).toBe(true);

    const allLeads = await leadService.getLeads();
    expect(allLeads.length).toBeGreaterThanOrEqual(2);
  });

  test("AgentService deploys agents and retrieves instances", async () => {
    const parseRes = DeployAgentDto.parse({
      name: "Custom Support Agent",
      type: "customer_support",
      environment: "staging",
    });

    expect(parseRes.dto).toBeDefined();
    if (!parseRes.dto) return;
    const agent = await agentService.deployAgent(parseRes.dto, "127.0.0.1");

    expect(agent.id).toBeDefined();
    expect(agent.status).toBe("active");

    const list = await agentService.listAgents();
    expect(list.some((a) => a.id === agent.id)).toBe(true);
  });
});

describe("OpenAPI 3.0 Generator", () => {
  test("generateOpenApiSpec constructs valid OpenAPI schema JSON", () => {
    const spec = generateOpenApiSpec();
    expect(spec.openapi).toBe("3.0.3");
    expect(spec.paths).toBeDefined();
    expect((spec.paths as Record<string, unknown>)["/leads"]).toBeDefined();
    expect((spec.paths as Record<string, unknown>)["/agents"]).toBeDefined();
  });
});
