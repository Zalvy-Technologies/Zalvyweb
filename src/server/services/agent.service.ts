/**
 * ZALVY — AI Agent Service Layer.
 *
 * Handles agent deployment orchestration, status caching, and telemetry updates.
 *
 * @module server/services/agent.service
 */

import { type IAgentRepository, defaultAgentRepository } from "../repositories/agent.repository";
import { type ICacheProvider, defaultCacheProvider } from "../cache/cache-provider";
import type { DeployAgentDto, AgentResponseDto } from "../dtos/agent.dto";
import { logAuditEvent } from "@/lib/security/audit-logger";

export class AgentService {
  constructor(
    private repository: IAgentRepository = defaultAgentRepository,
    private cache: ICacheProvider = defaultCacheProvider,
  ) {}

  async deployAgent(dto: DeployAgentDto, clientIp = "unknown"): Promise<AgentResponseDto> {
    const entity = await this.repository.create({
      name: dto.name,
      type: dto.type,
      environment: dto.environment,
    });

    // Invalidate cached agent list
    await this.cache.delete("agents_list");

    logAuditEvent({
      eventType: "LEAD_SUBMITTED",
      severity: "INFO",
      action: "deploy_agent_success",
      ip: clientIp,
      details: { agentId: entity.id, type: entity.type, env: entity.environment },
    });

    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      environment: entity.environment,
      status: entity.status,
      deployedAt: entity.deployedAt,
      metrics: entity.metrics,
    };
  }

  async listAgents(): Promise<AgentResponseDto[]> {
    const cached = await this.cache.get<AgentResponseDto[]>("agents_list");
    if (cached) return cached;

    const entities = await this.repository.findAll();
    const dtos: AgentResponseDto[] = entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      environment: entity.environment,
      status: entity.status,
      deployedAt: entity.deployedAt,
      metrics: entity.metrics,
    }));

    await this.cache.set("agents_list", dtos, 60);
    return dtos;
  }
}

export const defaultAgentService = new AgentService();
