/**
 * ZALVY — AI Streaming & SSE Utilities.
 *
 * Provides Web Streams API wrappers for Server-Sent Events (SSE) streaming,
 * provider execution routing, and client-side stream reading.
 *
 * @module lib/ai/stream
 */

import type { AIProvider } from "./provider";
import { defaultGeminiAdapter } from "./gemini-adapter";
import { defaultOllamaAdapter } from "./ollama-adapter";
import type { AIMessage, AIProviderConfig } from "@/types/ai";

/**
 * Resolves the active provider adapter based on config or process.env setting.
 */
export function getAIProvider(providerType?: string): AIProvider {
  const preferred = (providerType ?? process.env.AI_DEFAULT_PROVIDER ?? "gemini").toLowerCase();

  if (preferred === "ollama") {
    return defaultOllamaAdapter;
  }

  // Default to Gemini adapter
  return defaultGeminiAdapter;
}

/**
 * Creates an SSE (Server-Sent Events) Response stream for Next.js Route Handlers.
 */
export async function createAISSEStreamResponse(
  messages: AIMessage[],
  config?: AIProviderConfig & { provider?: string },
): Promise<Response> {
  const provider = getAIProvider(config?.provider);
  const stream = await provider.generateStream(messages, config);

  const encoder = new TextEncoder();

  const sseStream = new ReadableStream({
    async start(controller) {
      const reader = stream.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done || value.done) {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            break;
          }
          if (value.content) {
            const dataStr = JSON.stringify({ content: value.content });
            controller.enqueue(encoder.encode(`data: ${dataStr}\n\n`));
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        const dataStr = JSON.stringify({ error: errorMsg });
        controller.enqueue(encoder.encode(`data: ${dataStr}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
