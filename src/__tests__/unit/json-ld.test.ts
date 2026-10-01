import { describe, expect, it } from "vitest";
import {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  productSchema,
  serviceSchema,
  faqSchema,
  jobPostingSchema,
  graphSchema,
} from "@/lib/json-ld";
import { site } from "@/lib/site";

describe("JSON-LD schema generators", () => {
  it("generates correct Organization schema", () => {
    const schema = organizationSchema();
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe(site.legalName);
    expect(schema.url).toBe(site.url);
  });

  it("generates correct WebSite schema with search action", () => {
    const schema = websiteSchema();
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.url).toBe(site.url);
    expect(schema.potentialAction).toBeDefined();
  });

  it("generates correct BreadcrumbList schema", () => {
    const items = [
      { name: "Home", path: "/" },
      { name: "Platform", path: "/platform" },
    ];
    const schema = breadcrumbSchema(items);
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(Array.isArray(schema.itemListElement)).toBe(true);
    expect((schema.itemListElement as unknown[]).length).toBe(2);
  });

  it("generates SoftwareApplication schema for product", () => {
    const schema = productSchema({
      slug: "agents",
      name: "Autonomous Agents",
      description: "Enterprise multi-agent system",
      lowPriceUsd: 49,
    });
    expect(schema["@type"]).toBe("SoftwareApplication");
    expect(schema.name).toBe("Autonomous Agents");
  });

  it("generates FAQPage schema", () => {
    const faqs = [{ question: "What is ZALVY?", answer: "An AI technology company." }];
    const schema = faqSchema(faqs);
    expect(schema["@type"]).toBe("FAQPage");
  });

  it("generates Service schema for studio/internship services", () => {
    const schema = serviceSchema({
      slug: "studio",
      name: "Engineering Studio",
      description: "Custom AI software engineering",
      serviceType: "Software Engineering",
    });
    expect(schema["@type"]).toBe("Service");
    expect(schema.name).toBe("Engineering Studio");
  });

  it("generates JobPosting schema for careers", () => {
    const schema = jobPostingSchema({
      id: "agent-eng",
      title: "Agent Systems Engineer",
      description: "Build autonomous multi-agent systems",
      location: "INDIA ",
      remote: true,
      postedAt: "2026-01-01",
    });
    expect(schema["@type"]).toBe("JobPosting");
    expect(schema.title).toBe("Agent Systems Engineer");
  });

  it("merges multiple schemas into a unified @graph array", () => {
    const org = organizationSchema();
    const web = websiteSchema();
    const combined = graphSchema([org, web]);
    expect(combined["@graph"]).toEqual([org, web]);
  });
});
