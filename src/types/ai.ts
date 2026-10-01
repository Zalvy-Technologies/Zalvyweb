/**
 * ZALVY — AI & Multi-Agent Architecture Type Definitions.
 *
 * Core data contracts for AI providers, domain agents, streaming payloads,
 * resume analysis, interview coaching, project recommendations, skill assessments,
 * knowledge base indexing, and RAG retrieval.
 *
 * @module types/ai
 */

export type AIProviderType = "gemini" | "ollama" | "openai" | "anthropic";

export type AIRole = "system" | "user" | "assistant";

export interface AIMessage {
  id?: string;
  role: AIRole;
  content: string;
  timestamp?: string;
  agentId?: string;
}

export interface AIProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
  model?: string;
  error?: string;
}

export type AIAgentId =
  | "zalvy-assistant"
  | "resume-analyzer"
  | "interview-coach"
  | "project-recommender"
  | "skill-assessor"
  | "certificate-verifier"
  | "knowledge-base";

export interface AIAgent {
  id: AIAgentId;
  name: string;
  description: string;
  iconName: string;
  systemPrompt: string;
  model?: string;
  temperature?: number;
  capabilities: string[];
}

export interface ResumeSectionScore {
  section: string;
  score: number;
  status: "excellent" | "good" | "needs_improvement" | "critical";
  feedback: string;
}

export interface ResumeAnalysis {
  overallScore: number;
  summary: string;
  sections: ResumeSectionScore[];
  strengths: string[];
  improvements: string[];
  extractedKeywords: string[];
  recommendedRoles: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: "technical" | "behavioral" | "system_design" | "problem_solving";
  difficulty: "beginner" | "intermediate" | "advanced";
  sampleAnswerHint: string;
  keyTopics: string[];
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  requiredSkills: string[];
  outcomes: string[];
  architecturePreview: string;
}

export interface SkillQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface SkillAssessment {
  skill: string;
  calculatedLevel: "Novice" | "Intermediate" | "Advanced" | "Expert";
  scorePercentage: number;
  questions: SkillQuestion[];
  strengths: string[];
  skillGaps: string[];
  learningPath: string[];
}

export interface CertificateVerificationAnalysis {
  isValid: boolean;
  certificateHash: string;
  studentName?: string;
  programTitle?: string;
  issueDate?: string;
  issuer?: string;
  explanation: string;
  securityChecks: {
    checkName: string;
    passed: boolean;
    detail: string;
  }[];
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  content: string;
  source: string;
  relevanceScore: number;
}

export interface ChatConversation {
  id: string;
  agentId: AIAgentId;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AIMessage[];
}
