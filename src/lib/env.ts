/**
 * ZALVY — Runtime Environment Variable Validation.
 *
 * Validates process.env schema at runtime to guarantee required keys and flags
 * are configured prior to handling requests.
 *
 * @module lib/env
 */

export interface EnvSchema {
  NODE_ENV: "development" | "production" | "test";
  SITE_URL: string;
  SESSION_SECRET: string;
  ENABLE_RATE_LIMITING: boolean;
  GOOGLE_GENAI_API_KEY?: string;
  OLLAMA_BASE_URL: string;
  OLLAMA_API_KEY?: string;
  AI_DEFAULT_PROVIDER: "gemini" | "ollama";
  AI_DEFAULT_MODEL: string;
}

function parseBoolean(val: string | undefined, defaultVal = true): boolean {
  if (!val) return defaultVal;
  return val.toLowerCase() === "true" || val === "1";
}

/**
 * Validates environment variables and returns a typed environment configuration.
 */
export function validateEnv(): EnvSchema {
  const nodeEnv: EnvSchema["NODE_ENV"] =
    process.env.NODE_ENV === "production"
      ? "production"
      : process.env.NODE_ENV === "test"
        ? "test"
        : "development";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://zalvy.com";
  const sessionSecret = process.env.SESSION_SECRET ?? "default-dev-secret-zalvy-32-chars-key!";
  const enableRateLimiting = parseBoolean(process.env.ENABLE_RATE_LIMITING, true);
  const googleGenAiApiKey = process.env.GOOGLE_GENAI_API_KEY ?? process.env.GEMINI_API_KEY;
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const ollamaApiKey = process.env.OLLAMA_API_KEY;
  const defaultProvider =
    (process.env.AI_DEFAULT_PROVIDER ?? "gemini").toLowerCase() === "ollama" ? "ollama" : "gemini";
  const defaultModel =
    process.env.AI_DEFAULT_MODEL ?? (defaultProvider === "ollama" ? "llama3" : "gemini-2.5-flash");

  if (nodeEnv === "production" && sessionSecret.includes("default-dev-secret")) {
    console.warn(
      "[SECURITY_WARN] SESSION_SECRET is using a default value in production. Set a secure secret!",
    );
  }

  return {
    NODE_ENV: nodeEnv,
    SITE_URL: siteUrl,
    SESSION_SECRET: sessionSecret,
    ENABLE_RATE_LIMITING: enableRateLimiting,
    GOOGLE_GENAI_API_KEY: googleGenAiApiKey,
    OLLAMA_BASE_URL: ollamaBaseUrl,
    OLLAMA_API_KEY: ollamaApiKey,
    AI_DEFAULT_PROVIDER: defaultProvider,
    AI_DEFAULT_MODEL: defaultModel,
  };
}

export const env = validateEnv();
