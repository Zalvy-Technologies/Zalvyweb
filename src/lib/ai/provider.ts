/**
 * ZALVY — AI Provider Abstraction Interface.
 *
 * Provider-agnostic contract for LLM backends (Gemini, Ollama, OpenAI, Anthropic).
 * Allows dynamic runtime swapping of models and execution backends.
 *
 * @module lib/ai/provider
 */

import type { AIMessage, AIProviderConfig, AIStreamChunk } from "@/types/ai";

export interface AIProvider {
  /**
   * Identifies the provider engine.
   */
  readonly providerId: string;

  /**
   * Generates a single complete text response.
   */
  generateText(messages: AIMessage[], config?: AIProviderConfig): Promise<string>;

  /**
   * Generates a token-by-token readable stream.
   */
  generateStream(
    messages: AIMessage[],
    config?: AIProviderConfig,
  ): Promise<ReadableStream<AIStreamChunk>>;

  /**
   * Generates vector embeddings for a given input text (used for RAG).
   */
  generateEmbedding(text: string): Promise<number[]>;
}
