/** Runtime contracts for every public AI endpoint. Keep these in sync with OpenAPI. */
import { z } from "zod";

export const providerSchema = z.enum(["gemini", "ollama"]).optional();
export const agentIdSchema = z.enum([
  "zalvy-assistant",
  "resume-analyzer",
  "interview-coach",
  "project-recommender",
  "skill-assessor",
  "certificate-verifier",
  "knowledge-base",
]);

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(12_000),
}).strict();

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
  agentId: agentIdSchema.optional(),
  provider: providerSchema,
}).strict();
export const resumeRequestSchema = z.object({ resumeText: z.string().trim().min(50).max(50_000), provider: providerSchema }).strict();
export const interviewRequestSchema = z.object({
  role: z.string().trim().min(2).max(100).default("Fullstack AI Engineer"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  provider: providerSchema,
}).strict();
export const recommendRequestSchema = z.object({
  skills: z.array(z.string().trim().min(1).max(80)).min(1).max(20).default(["React", "TypeScript", "Python"]),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
  provider: providerSchema,
}).strict();
export const assessRequestSchema = z.object({ skill: z.string().trim().min(2).max(100).default("TypeScript"), provider: providerSchema }).strict();
export const knowledgeRequestSchema = z.object({ query: z.string().trim().min(2).max(500), topK: z.number().int().min(1).max(10).default(3) }).strict();
export const verifyRequestSchema = z.object({ certificateHash: z.string().trim().regex(/^[a-fA-F0-9]{64}$/, "certificateHash must be a SHA-256 hash.") }).strict();

export function parseJson<T extends z.ZodType>(schema: T, body: unknown): z.output<T> | null {
  const parsed = schema.safeParse(body);
  return parsed.success ? parsed.data : null;
}
