/**
 * ZALVY — Knowledge Base & RAG Retrieval Engine.
 *
 * Implements document chunking, TF-IDF keyword search, and RAG retrieval
 * designed for seamless integration with vector stores (Pinecone, pgvector).
 *
 * @module lib/ai/knowledge
 */

import type { KnowledgeChunk } from "@/types/ai";

export interface IKnowledgeStore {
  search(query: string, topK?: number): Promise<KnowledgeChunk[]>;
  indexDocument(title: string, source: string, content: string): Promise<void>;
}

export class InMemoryKnowledgeStore implements IKnowledgeStore {
  private chunks: KnowledgeChunk[] = [];

  constructor() {
    this.seedDefaultKnowledge();
  }

  private seedDefaultKnowledge(): void {
    const docs = [
      {
        id: "zalvy-overview",
        title: "Zalvy Platform Overview & Vision",
        source: "src/data/knowledge/platform-overview.md",
        content: `Zalvy is an enterprise intelligent talent development and automation platform.
We combine production AI agent deployment, hands-on internship programs, cryptographic certificate verification, and enterprise recruitment pipelines.
Students on Zalvy build real-world AI microservices, earn SHA-256 verified credentials, and connect directly with hiring tech companies.`,
      },
      {
        id: "zalvy-internships",
        title: "Zalvy AI Internship Program & Process",
        source: "src/data/knowledge/internship-program.md",
        content: `The Zalvy AI Internship Program is a selective 8-12 week practical engineering accelerator.
Interns work in small squads building real production features like AI Chatbots, RAG Pipelines, Code Interpreters, and Automated Workflows.
Key benefits include 1-on-1 mentorship, GitHub project portfolio verification, cryptographic completion certificates, and direct job placement assistance.`,
      },
      {
        id: "zalvy-certificates",
        title: "Zalvy Cryptographic Certificate Verification",
        source: "src/data/knowledge/certificates-guide.md",
        content: `All certificates issued by Zalvy are backed by SHA-256 cryptographic hashes and indexed in an immutable public ledger.
Anyone (recruiters, employers, institutions) can verify a certificate by visiting /verify and entering the certificate hash or scanning the QR code.
Key metrics verified: Student Name, Track Title, Completion Date, Issuer Seal, and Cryptographic Signature.`,
      },
      {
        id: "zalvy-resumes",
        title: "ATS Optimization & Tech Resume Best Practices",
        source: "src/data/knowledge/resume-tips.md",
        content: `For maximum ATS pass rates:
1. Use single-column clean formatting with standard section headings (Experience, Education, Skills, Projects).
2. Quantify achievements (e.g. 'Reduced latency by 45%', 'Built AI pipeline serving 10k daily users').
3. Include specific tech stack keywords (Next.js, TypeScript, PostgreSQL, Docker, Gemini, PyTorch).
4. Avoid images, complex tables, or non-standard fonts that confuse ATS parsers.`,
      },
    ];

    for (const doc of docs) {
      this.chunks.push({
        id: doc.id,
        title: doc.title,
        source: doc.source,
        content: doc.content,
        relevanceScore: 1.0,
      });
    }
  }

  async indexDocument(title: string, source: string, content: string): Promise<void> {
    await Promise.resolve();
    const id = `chunk_${String(Date.now())}_${Math.random().toString(36).substring(2, 7)}`;
    this.chunks.push({
      id,
      title,
      source,
      content,
      relevanceScore: 1.0,
    });
  }

  async search(query: string, topK = 3): Promise<KnowledgeChunk[]> {
    await Promise.resolve();
    const queryTerms = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((t) => t.length > 2);

    if (queryTerms.length === 0) {
      return this.chunks.slice(0, topK);
    }

    const scored = this.chunks.map((chunk) => {
      const textLower = `${chunk.title} ${chunk.content}`.toLowerCase();
      let matchCount = 0;
      for (const term of queryTerms) {
        if (textLower.includes(term)) matchCount++;
      }
      const score = matchCount / queryTerms.length;
      return { ...chunk, relevanceScore: score };
    });

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return scored.filter((c) => c.relevanceScore > 0).slice(0, topK);
  }
}

export const defaultKnowledgeStore = new InMemoryKnowledgeStore();
