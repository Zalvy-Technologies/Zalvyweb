/**
 * ZALVY AI Chat State Store (Zustand).
 *
 * Manages chat widget visibility, active agent persona, streaming state,
 * provider selection (Gemini vs Ollama), and real-time SSE stream consumption.
 *
 * @module lib/ai/chat-store
 */

import { create } from "zustand";
import type { AIAgentId, AIMessage, AIProviderType } from "@/types/ai";

interface ChatState {
  isOpen: boolean;
  activeAgentId: AIAgentId;
  activeProvider: AIProviderType;
  messages: AIMessage[];
  isStreaming: boolean;
  error: string | null;

  // Actions
  toggleChat: () => void;
  openChat: (agentId?: AIAgentId) => void;
  closeChat: () => void;
  setAgent: (agentId: AIAgentId) => void;
  setProvider: (provider: AIProviderType) => void;
  clearMessages: () => void;
  sendMessage: (content: string) => Promise<void>;
  hydrate: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  activeAgentId: "zalvy-assistant",
  activeProvider: "gemini",
  messages: [],
  isStreaming: false,
  error: null,

  hydrate: () => {
    set({
      messages: [
        {
          id: "msg_welcome",
          role: "assistant",
          content:
            "Hello! I'm Zalvy Copilot. How can I assist you today with AI projects, resume optimization, mock interviews, or credential verification?",
          timestamp: new Date().toISOString(),
          agentId: "zalvy-assistant",
        },
      ],
    });
  },

  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },
  openChat: (agentId) => {
    set({
      isOpen: true,
      ...(agentId ? { activeAgentId: agentId } : {}),
    });
  },
  closeChat: () => {
    set({ isOpen: false });
  },
  setAgent: (agentId) => {
    set({ activeAgentId: agentId });
  },
  setProvider: (provider) => {
    set({ activeProvider: provider });
  },
  clearMessages: () => {
    set({
      messages: [
        {
          id: `msg_welcome_${String(Date.now())}`,
          role: "assistant",
          content: "Conversation cleared. What would you like to work on next?",
          timestamp: new Date().toISOString(),
          agentId: get().activeAgentId,
        },
      ],
      error: null,
    });
  },

  sendMessage: async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || get().isStreaming) return;

    const userMsg: AIMessage = {
      id: `msg_user_${String(Date.now())}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
      agentId: get().activeAgentId,
    };

    const assistantMsgId = `msg_ast_${String(Date.now())}`;
    const initialAssistantMsg: AIMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      agentId: get().activeAgentId,
    };

    set((state) => ({
      messages: [...state.messages, userMsg, initialAssistantMsg],
      isStreaming: true,
      error: null,
    }));

    const currentMessages = get().messages.filter((m) => m.id !== assistantMsgId);

    let accumulated = "";
    let sseBuffer = "";

    try {
      const response = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages.map((m) => ({ role: m.role, content: m.content })),
          agentId: get().activeAgentId,
          provider: get().activeProvider,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error ${String(response.status)}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split("\n");
        sseBuffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("data: ")) {
            const dataStr = trimmedLine.substring(6);
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr) as { content?: string; error?: string };
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                accumulated += parsed.content;
                set((state) => ({
                  messages: state.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: accumulated } : m,
                  ),
                }));
              }
            } catch {
              // Ignore partial chunk parse failures
            }
          }
        }
      }

      set({ isStreaming: false });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      set((state) => ({
        isStreaming: false,
        error: errorMsg,
        messages: state.messages.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  accumulated ||
                  `AI response stream encountered an error. Please verify server connection or provider configuration (${errorMsg}).`,
              }
            : m,
        ),
      }));
    }
  },
}));