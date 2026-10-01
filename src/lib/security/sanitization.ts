/**
 * ZALVY — Security & Sanitization Utilities.
 *
 * Provides defense-in-depth protection against:
 *  - Cross-Site Scripting (XSS)
 *  - HTML/Script Injection
 *  - Parameter Tampering & Null-Byte Injections
 *  - Header Injections
 *
 * @module lib/security/sanitization
 */

/**
 * Escapes special HTML characters to prevent XSS when rendering user-supplied strings.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitizes input text by stripping control characters, null bytes, and dangerous tags.
 * Preserves safe text characters, newlines, and unicode text.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }

  return (
    input
      // Remove null bytes and non-printable control characters (except tab \t, newline \n, carriage return \r)
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // Strip HTML script and style tags along with content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      // Strip HTML tags
      .replace(/<[^>]*>/g, "")
      // Collapse redundant spaces
      .replace(/[ \t]+/g, " ")
      .trim()
  );
}

/**
 * Sanitizes email addresses — lowercases, strips whitespace, control characters, and invalid chars.
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== "string") {
    return "";
  }
  return (
    email
      .trim()
      .toLowerCase()
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x20\x7F]/g, "")
  );
}

/**
 * Sanitizes URLs to prevent `javascript:`, `data:`, or `vbscript:` URI attacks.
 * Allows only `http:`, `https:`, `mailto:`, and relative paths (`/`).
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== "string") {
    return "";
  }
  const trimmed = url.trim();

  // Allow relative URLs starting with / (excluding // protocol-relative)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();
    if (protocol === "http:" || protocol === "https:" || protocol === "mailto:") {
      return parsed.href;
    }
  } catch {
    // Invalid URL syntax
  }

  return "";
}

/**
 * Redacts sensitive fields (passwords, tokens, credit card numbers, PII) in objects for safe logging.
 */
export function redactSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = new Set([
    "password",
    "token",
    "secret",
    "authorization",
    "credit_card",
    "ssn",
    "cvv",
    "apiKey",
    "session",
  ]);

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.has(lowerKey)) {
      result[key] = "[REDACTED]";
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = redactSensitiveData(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}
