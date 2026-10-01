/**
 * ZALVY — AI Agent Data Transfer Objects (DTOs).
 *
 * Data contracts for deploying and monitoring enterprise AI Agents.
 *
 * @module server/dtos/agent.dto
 */

import { validateName, validateEnum } from "@/lib/security/validation";
import { sanitizeText } from "@/lib/security/sanitization";

export type AgentType =
  "autonomous_workflow" | "code_interpreter" | "customer_support" | "research_analyst";

export interface DeployAgentDtoInput {
  name?: unknown;
  type?: unknown;
  environment?: unknown;
  modelConfig?: Record<string, unknown>;
}

export interface AgentEntity {
  id: string;
  name: string;
  type: AgentType;
  environment: "staging" | "production";
  status: "deploying" | "active" | "paused" | "failed";
  deployedAt: string;
  metrics: {
    requestsTotal: number;
    avgLatencyMs: number;
    errorRate: number;
  };
}

export interface AgentResponseDto {
  id: string;
  name: string;
  type: AgentType;
  environment: string;
  status: string;
  deployedAt: string;
  metrics: {
    requestsTotal: number;
    avgLatencyMs: number;
    errorRate: number;
  };
}

const ALLOWED_TYPES: readonly AgentType[] = [
  "autonomous_workflow",
  "code_interpreter",
  "customer_support",
  "research_analyst",
];

const ALLOWED_ENVS = ["staging", "production"] as const;

export class DeployAgentDto {
  readonly name: string;
  readonly type: AgentType;
  readonly environment: "staging" | "production";

  private constructor(name: string, type: AgentType, environment: "staging" | "production") {
    this.name = name;
    this.type = type;
    this.environment = environment;
  }

  static parse(input: DeployAgentDtoInput): { dto?: DeployAgentDto; error?: string } {
    const nameRes = validateName(input.name, 3, 100);
    if (!nameRes.success || !nameRes.data) {
      return { error: nameRes.error ?? "Agent name must be between 3 and 100 characters." };
    }

    const typeRes = validateEnum(input.type, ALLOWED_TYPES, "agent type");
    if (!typeRes.success || !typeRes.data) {
      return { error: typeRes.error ?? "Invalid agent type." };
    }

    const rawEnv = input.environment ?? "production";
    const envRes = validateEnum(rawEnv, ALLOWED_ENVS, "environment");
    if (!envRes.success || !envRes.data) {
      return { error: envRes.error ?? "Invalid environment." };
    }

    return {
      dto: new DeployAgentDto(sanitizeText(nameRes.data), typeRes.data, envRes.data),
    };
  }
}
