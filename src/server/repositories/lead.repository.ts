/**
 * ZALVY — Lead Repository Pattern.
 *
 * Abstract repository decouples persistence strategy (PostgreSQL/Prisma/Spanner/In-Memory)
 * from business logic.
 *
 * @module server/repositories/lead.repository
 */

import { type LeadEntity } from "../dtos/lead.dto";
import { prisma } from "@/lib/prisma";

export interface ILeadRepository {
  findById(id: string): Promise<LeadEntity | null>;
  findByEmail(email: string): Promise<LeadEntity[]>;
  create(lead: Omit<LeadEntity, "id" | "createdAt" | "status">): Promise<LeadEntity>;
  findAll(): Promise<LeadEntity[]>;
}

export class InMemoryLeadRepository implements ILeadRepository {
  private leads = new Map<string, LeadEntity>();

  findById(id: string): Promise<LeadEntity | null> {
    return Promise.resolve(this.leads.get(id) ?? null);
  }

  findByEmail(email: string): Promise<LeadEntity[]> {
    const results: LeadEntity[] = [];
    for (const lead of this.leads.values()) {
      if (lead.email.toLowerCase() === email.toLowerCase()) {
        results.push(lead);
      }
    }
    return Promise.resolve(results);
  }

  create(leadData: Omit<LeadEntity, "id" | "createdAt" | "status">): Promise<LeadEntity> {
    const id = `lead_${String(Date.now())}_${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    const entity: LeadEntity = {
      ...leadData,
      id,
      createdAt,
      status: "pending",
    };

    this.leads.set(id, entity);
    return Promise.resolve(entity);
  }

  findAll(): Promise<LeadEntity[]> {
    return Promise.resolve(Array.from(this.leads.values()));
  }

  clear(): void {
    this.leads.clear();
  }
}

export class PrismaLeadRepository implements ILeadRepository {
  async findById(id: string): Promise<LeadEntity | null> {
    const lead = await prisma.lead.findUnique({ where: { id } });
    return lead ? this.toEntity(lead) : null;
  }

  async findByEmail(email: string): Promise<LeadEntity[]> {
    const leads = await prisma.lead.findMany({
      where: { email: { equals: email, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
    });
    return leads.map((lead) => this.toEntity(lead));
  }

  async create(
    leadData: Omit<LeadEntity, "id" | "createdAt" | "status">
  ): Promise<LeadEntity> {
    const lead = await prisma.lead.create({
      data: {
        intent: leadData.intent,
        name: leadData.name,
        email: leadData.email,
        company: leadData.company,
        message: leadData.message,
        status: "pending",
      },
    });
    return this.toEntity(lead);
  }

  async findAll(): Promise<LeadEntity[]> {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return leads.map((lead) => this.toEntity(lead));
  }

  private toEntity(lead: {
    id: string;
    intent: string;
    name: string;
    email: string;
    company: string | null;
    message: string;
    createdAt: Date;
    status: string;
  }): LeadEntity {
    return {
      id: lead.id,
      intent: lead.intent as LeadEntity["intent"],
      name: lead.name,
      email: lead.email,
      company: lead.company ?? undefined,
      message: lead.message,
      createdAt: lead.createdAt.toISOString(),
      status: lead.status as LeadEntity["status"],
    };
  }
}

/**
 * Factory function to get the appropriate repository based on environment.
 * Uses Prisma in production, in-memory for development/testing.
 */
export function getLeadRepository(): ILeadRepository {
  if (process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
    return new PrismaLeadRepository();
  }
  return new InMemoryLeadRepository();
}

export const defaultLeadRepository: ILeadRepository = getLeadRepository();
