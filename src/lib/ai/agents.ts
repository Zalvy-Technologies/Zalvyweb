/**
 * ZALVY — Multi-Agent Registry & Architecture.
 *
 * Central registry managing all domain-specific AI agents, their configurations,
 * capabilities, and prompt binding.
 *
 * @module lib/ai/agents
 */

import type { AIAgent, AIAgentId } from "@/types/ai";
import { AGENT_SYSTEM_PROMPTS } from "./prompts";

export class AgentRegistry {
  private agents = new Map<AIAgentId, AIAgent>();

  constructor() {
    this.registerDefaultAgents();
  }

  private registerDefaultAgents(): void {
    const defaultList: AIAgent[] = [
      {
        id: "zalvy-assistant",
        name: "Zalvy Copilot",
        description: "General AI assistant for platform guidance, FAQs, and navigation.",
        iconName: "Bot",
        systemPrompt: AGENT_SYSTEM_PROMPTS["zalvy-assistant"],
        temperature: 0.7,
        capabilities: ["Platform FAQs", "Navigation", "General Career Support"],
      },
      {
        id: "resume-analyzer",
        name: "Resume Analyzer",
        description: "ATS optimization, section feedback, and technical skill extraction.",
        iconName: "FileText",
        systemPrompt: AGENT_SYSTEM_PROMPTS["resume-analyzer"],
        temperature: 0.3,
        capabilities: ["ATS Scoring", "Skill Extraction", "Feedback"],
      },
      {
        id: "interview-coach",
        name: "Interview Coach",
        description: "Interactive technical & behavioral mock interview simulator.",
        iconName: "Sparkles",
        systemPrompt: AGENT_SYSTEM_PROMPTS["interview-coach"],
        temperature: 0.6,
        capabilities: ["Mock Interviews", "Coding Questions", "Real-Time Feedback"],
      },
      {
        id: "project-recommender",
        name: "Project Advisor",
        description: "Tailored portfolio project ideas with architecture blueprints.",
        iconName: "FolderGit2",
        systemPrompt: AGENT_SYSTEM_PROMPTS["project-recommender"],
        temperature: 0.5,
        capabilities: ["Portfolio Ideas", "Tech Stack Pairing", "Architecture Guidance"],
      },
      {
        id: "skill-assessor",
        name: "Skill Diagnostic Engine",
        description: "Interactive skill evaluation and personalized learning roadmaps.",
        iconName: "Award",
        systemPrompt: AGENT_SYSTEM_PROMPTS["skill-assessor"],
        temperature: 0.4,
        capabilities: ["Quizzes", "Proficiency Leveling", "Gap Analysis"],
      },
      {
        id: "certificate-verifier",
        name: "Credential Integrity Guard",
        description: "Cryptographic certificate validation and hash verification assistant.",
        iconName: "ShieldCheck",
        systemPrompt: AGENT_SYSTEM_PROMPTS["certificate-verifier"],
        temperature: 0.2,
        capabilities: ["SHA-256 Check", "Authenticity Proof", "Credential Insights"],
      },
      {
        id: "knowledge-base",
        name: "Knowledge Navigator",
        description: "RAG-powered answers grounded in official Zalvy documentation.",
        iconName: "BookOpen",
        systemPrompt: AGENT_SYSTEM_PROMPTS["knowledge-base"],
        temperature: 0.3,
        capabilities: ["RAG Search", "Doc Citation", "Platform Guides"],
      },
    ];

    for (const agent of defaultList) {
      this.agents.set(agent.id, agent);
    }
  }

  getAgent(id: AIAgentId): AIAgent | undefined {
    return this.agents.get(id);
  }

  listAgents(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  registerAgent(agent: AIAgent): void {
    this.agents.set(agent.id, agent);
  }
}

export const defaultAgentRegistry = new AgentRegistry();
