import { describe, expect, test, beforeEach } from "vitest";

import {
  escapeHtml,
  sanitizeText,
  sanitizeEmail,
  sanitizeUrl,
  redactSensitiveData,
} from "@/lib/security/sanitization";
import {
  validateEmail,
  validateName,
  validateMessage,
  validateEnum,
  validateUuid,
} from "@/lib/security/validation";
import { checkRateLimitSync, memoryRateLimiterStore } from "@/lib/security/rate-limit";
import { generateCsrfToken, verifyCsrfToken } from "@/lib/security/csrf";
import { hasPermission, hasAllPermissions } from "@/lib/security/rbac";
import { getAuthenticatedUser } from "@/lib/security/auth";
import { validateEnv } from "@/lib/env";

describe("Security & Sanitization Suite", () => {
  test("escapeHtml escapes dangerous HTML characters", () => {
    const malicious = '<script>alert("XSS & attack")</script>';
    const escaped = escapeHtml(malicious);
    expect(escaped).not.toContain("<script>");
    expect(escaped).toContain("&lt;script&gt;");
    expect(escaped).toContain("&amp;");
  });

  test("sanitizeText strips script/style tags and control characters", () => {
    const raw = "  Hello \x00 World! <script>alert(1)</script> <style>body{}</style> <b>Bold</b> ";
    const clean = sanitizeText(raw);
    expect(clean).toBe("Hello World! Bold");
  });

  test("sanitizeEmail cleans whitespace and lowercases email", () => {
    expect(sanitizeEmail("  USER@ZALVY.COM \t")).toBe("user@zalvy.com");
    expect(sanitizeEmail(123)).toBe("");
  });

  test("sanitizeUrl allows only safe HTTP/HTTPS/mailto or relative URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
    expect(sanitizeUrl("data:text/html,hack")).toBe("");
    expect(sanitizeUrl("https://zalvy.com/docs")).toBe("https://zalvy.com/docs");
    expect(sanitizeUrl("/about")).toBe("/about");
  });

  test("redactSensitiveData masks sensitive object keys", () => {
    const input = {
      name: "Alice",
      password: "SuperSecretPassword123!",
      token: "bearer-xyz",
      nested: { secret: "key-999", publicInfo: "ok" },
    };
    const redacted = redactSensitiveData(input);
    expect(redacted.name).toBe("Alice");
    expect(redacted.password).toBe("[REDACTED]");
    expect(redacted.token).toBe("[REDACTED]");
    expect((redacted.nested as Record<string, unknown>).secret).toBe("[REDACTED]");
    expect((redacted.nested as Record<string, unknown>).publicInfo).toBe("ok");
  });
});

describe("Validation Primitives", () => {
  test("validateEmail verifies RFC email formats", () => {
    expect(validateEmail("user@zalvy.com").success).toBe(true);
    expect(validateEmail("invalid-email").success).toBe(false);
    expect(validateEmail("").success).toBe(false);
  });

  test("validateName checks min/max length constraints", () => {
    expect(validateName("Zalvy Engineer").success).toBe(true);
    expect(validateName("A", 2, 50).success).toBe(false);
    expect(validateName("A".repeat(300), 2, 200).success).toBe(false);
  });

  test("validateMessage enforces length limits", () => {
    expect(validateMessage("Valid long description for inquiry").success).toBe(true);
    expect(validateMessage("Too short", 20, 100).success).toBe(false);
  });

  test("validateEnum restricts values to allowed set", () => {
    const intents = ["enterprise", "internship"] as const;
    expect(validateEnum("enterprise", intents).success).toBe(true);
    expect(validateEnum("invalid", intents).success).toBe(false);
  });

  test("validateUuid validates UUID v4 strings", () => {
    expect(validateUuid("123e4567-e89b-41d4-a716-446655440000").success).toBe(true);
    expect(validateUuid("not-a-uuid").success).toBe(false);
  });
});

describe("Rate Limiting Engine", () => {
  beforeEach(() => {
    memoryRateLimiterStore.reset();
  });

  test("enforces request window limits and sets RateLimit headers", () => {
    const key = "test-ip-127.0.0.1";
    const config = { maxRequests: 2, windowMs: 10000 };

    const first = checkRateLimitSync(key, config);
    expect(first.limited).toBe(false);
    expect(first.remaining).toBe(1);
    expect(first.headers["RateLimit-Limit"]).toBe("2");

    const second = checkRateLimitSync(key, config);
    expect(second.limited).toBe(false);
    expect(second.remaining).toBe(0);

    const third = checkRateLimitSync(key, config);
    expect(third.limited).toBe(true);
    expect(third.headers["Retry-After"]).toBeDefined();
  });
});

describe("CSRF Protection", () => {
  test("generates valid CSRF token and verifies matching pairs in constant time", () => {
    const token = generateCsrfToken();
    expect(token.length).toBeGreaterThanOrEqual(16);
    expect(verifyCsrfToken(token, token)).toBe(true);
    expect(verifyCsrfToken(token, "different-token-string")).toBe(false);
    expect(verifyCsrfToken(null, token)).toBe(false);
  });
});

describe("RBAC & Authentication Readiness", () => {
  test("hasPermission checks role privileges accurately", () => {
    expect(hasPermission("admin", "manage:users")).toBe(true);
    expect(hasPermission("guest", "manage:users")).toBe(false);
    expect(hasPermission("enterprise", "manage:enterprise_agents")).toBe(true);
    expect(hasPermission("candidate", "apply:internship")).toBe(true);
  });

  test("hasAllPermissions evaluates multiple requirements", () => {
    expect(hasAllPermissions("admin", ["read:public", "manage:users"])).toBe(true);
    expect(hasAllPermissions("guest", ["read:public", "manage:users"])).toBe(false);
  });

  test("getAuthenticatedUser defaults to guest when unauthenticated", () => {
    const anon = getAuthenticatedUser(null, null);
    expect(anon.role).toBe("guest");
    expect(anon.id).toBe("guest-anon");
  });
});

describe("Environment Variable Validation", () => {
  test("validateEnv parses runtime environment parameters", () => {
    const envConfig = validateEnv();
    expect(envConfig.NODE_ENV).toBeDefined();
    expect(envConfig.SITE_URL).toBeDefined();
    expect(envConfig.SESSION_SECRET).toBeDefined();
  });
});
