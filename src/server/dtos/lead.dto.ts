/**
 * ZALVY — Lead Data Transfer Objects (DTOs).
 *
 * Provides strongly-typed data contracts and validation for enterprise leads.
 *
 * @module server/dtos/lead.dto
 */

import {
  validateEmail,
  validateName,
  validateMessage,
  validateEnum,
} from "@/lib/security/validation";
import { sanitizeText, sanitizeEmail } from "@/lib/security/sanitization";

export type LeadIntent = "enterprise" | "internship";

export interface CreateLeadDtoInput {
  intent?: unknown;
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
}

export interface LeadEntity {
  id: string;
  intent: LeadIntent;
  name: string;
  email: string;
  company?: string;
  message: string;
  createdAt: string;
  status: "pending" | "reviewed" | "archived";
}

export interface LeadResponseDto {
  id: string;
  intent: LeadIntent;
  name: string;
  email: string;
  company?: string;
  createdAt: string;
  status: string;
}

const ALLOWED_INTENTS: readonly LeadIntent[] = ["enterprise", "internship"];

export class CreateLeadDto {
  readonly intent: LeadIntent;
  readonly name: string;
  readonly email: string;
  readonly company?: string;
  readonly message: string;

  private constructor(
    intent: LeadIntent,
    name: string,
    email: string,
    message: string,
    company?: string,
  ) {
    this.intent = intent;
    this.name = name;
    this.email = email;
    this.message = message;
    this.company = company;
  }

  static parse(input: CreateLeadDtoInput): { dto?: CreateLeadDto; error?: string } {
    const intentRes = validateEnum(input.intent, ALLOWED_INTENTS, "intent");
    if (!intentRes.success || !intentRes.data) {
      return { error: intentRes.error ?? "Invalid request intent." };
    }

    const nameRes = validateName(input.name, 2, 200);
    if (!nameRes.success || !nameRes.data) {
      return { error: nameRes.error ?? "Name must be between 2 and 200 characters." };
    }

    const emailRes = validateEmail(input.email);
    if (!emailRes.success || !emailRes.data) {
      return { error: emailRes.error ?? "Please provide a valid email address." };
    }

    const messageRes = validateMessage(input.message, 20, 8000);
    if (!messageRes.success || !messageRes.data) {
      return { error: messageRes.error ?? "Message must be between 20 and 8000 characters." };
    }

    const sanitizedCompany = input.company ? sanitizeText(input.company) : undefined;

    return {
      dto: new CreateLeadDto(
        intentRes.data,
        sanitizeText(nameRes.data),
        sanitizeEmail(emailRes.data),
        sanitizeText(messageRes.data),
        sanitizedCompany,
      ),
    };
  }
}
