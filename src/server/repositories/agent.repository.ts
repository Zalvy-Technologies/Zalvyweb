/**
 * ZALVY — AI Agent Repository Pattern.
 *
 * Repository interface and in-memory provider for AI Agent deployments.
 *
 * @module server/repositories/agent.repository
 */

import { type AgentEntity } from "../dtos/agent.dto";

export interface IAgentRepository {
  findById(id: string): Promise<AgentEntity | null>;
  create(
    agentData: Omit<AgentEntity, "id" | "deployedAt" | "status" | "metrics">,
  ): Promise<AgentEntity>;
  findAll(): Promise<AgentEntity[]>;
  updateStatus(id: string, status: AgentEntity["status"]): Promise<AgentEntity | null>;
}

export class InMemoryAgentRepository implements IAgentRepository {
  private agents = new Map<string, AgentEntity>();

  constructor() {
    // Seed default production agent instances
    this.seedDefaultAgents();
  }

  private seedDefaultAgents(): void {
    const defaultAgents: Omit<AgentEntity, "id" | "deployedAt" | "status" | "metrics">[] = [
      { name: "Helios Routing Agent v2", type: "autonomous_workflow", environment: "production" },
      { name: "Quanta Code Interpreter", type: "code_interpreter", environment: "production" },
    ];

    for (const agent of defaultAgents) {
      const id = `agent_${agent.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      this.agents.set(id, {
        ...agent,
        id,
        status: "active",
        deployedAt: new Date().toISOString(),
        metrics: {
          requestsTotal: 14200,
          avgLatencyMs: 145,
          errorRate: 0.001,
        },
      });
    }
  }

  findById(id: string): Promise<AgentEntity | null> {
    return Promise.resolve(this.agents.get(id) ?? null);
  }

  create(
    agentData: Omit<AgentEntity, "id" | "deployedAt" | "status" | "metrics">,
  ): Promise<AgentEntity> {
    const id = `agent_${String(Date.now())}_${Math.random().toString(36).substring(2, 6)}`;
    const deployedAt = new Date().toISOString();

    const entity: AgentEntity = {
      ...agentData,
      id,
      status: "active",
      deployedAt,
      metrics: {
        requestsTotal: 0,
        avgLatencyMs: 0,
        errorRate: 0.0,
      },
    };

    this.agents.set(id, entity);
    return Promise.resolve(entity);
  }

  findAll(): Promise<AgentEntity[]> {
    return Promise.resolve(Array.from(this.agents.values()));
  }

  updateStatus(id: string, status: AgentEntity["status"]): Promise<AgentEntity | null> {
    const agent = this.agents.get(id);
    if (!agent) return Promise.resolve(null);

    const updated = { ...agent, status };
    this.agents.set(id, updated);
    return Promise.resolve(updated);
  }
}

export const defaultAgentRepository: IAgentRepository = new InMemoryAgentRepository();
