/**
 * ZALVY — Lead Domain Service Layer.
 *
 * Implements core domain logic, deduplication, caching, and repository interaction for inquiries.
 *
 * @module server/services/lead.service
 */

import { type ILeadRepository, defaultLeadRepository } from "../repositories/lead.repository";
import { type ICacheProvider, defaultCacheProvider } from "../cache/cache-provider";
import type { CreateLeadDto, LeadResponseDto } from "../dtos/lead.dto";
import { logAuditEvent } from "@/lib/security/audit-logger";

export class LeadService {
  constructor(
    private repository: ILeadRepository = defaultLeadRepository,
    private cache: ICacheProvider = defaultCacheProvider,
  ) {}

  async processLead(
    dto: CreateLeadDto,
    clientIp = "unknown",
  ): Promise<{ response: LeadResponseDto; duplicate: boolean }> {
    // 1. Check duplicate submissions within past 5 minutes using Cache Layer
    const cacheKey = `lead_recent:${dto.email}:${dto.intent}`;
    const recent = await this.cache.get<boolean>(cacheKey);

    if (recent) {
      logAuditEvent({
        eventType: "LEAD_SUBMITTED",
        severity: "WARN",
        action: "lead_deduplicated",
        ip: clientIp,
        details: { email: dto.email, intent: dto.intent },
      });
    }

    // 2. Persist lead in Repository
    const entity = await this.repository.create({
      intent: dto.intent,
      name: dto.name,
      email: dto.email,
      company: dto.company,
      message: dto.message,
    });

    // 3. Mark cache for deduplication window (300 seconds)
    await this.cache.set(cacheKey, true, 300);

    // 4. Log Audit Telemetry
    logAuditEvent({
      eventType: "LEAD_SUBMITTED",
      severity: "INFO",
      action: "create_lead_success",
      ip: clientIp,
      details: { leadId: entity.id, intent: entity.intent },
    });

    return {
      response: {
        id: entity.id,
        intent: entity.intent,
        name: entity.name,
        email: entity.email,
        company: entity.company,
        createdAt: entity.createdAt,
        status: entity.status,
      },
      duplicate: Boolean(recent),
    };
  }

  async getLeads(): Promise<LeadResponseDto[]> {
    const cached = await this.cache.get<LeadResponseDto[]>("all_leads");
    if (cached) {
      return cached;
    }

    const entities = await this.repository.findAll();
    const dtos: LeadResponseDto[] = entities.map((entity) => ({
      id: entity.id,
      intent: entity.intent,
      name: entity.name,
      email: entity.email,
      company: entity.company,
      createdAt: entity.createdAt,
      status: entity.status,
    }));

    await this.cache.set("all_leads", dtos, 30);
    return dtos;
  }
}

export const defaultLeadService = new LeadService();
