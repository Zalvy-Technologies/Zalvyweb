"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Cpu,
  Zap,
  Activity,
  Send,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Database,
  Terminal,
} from "lucide-react";
import { defaultAgentRegistry } from "@/lib/ai/agents";
import { useChatStore } from "@/lib/ai/chat-store";
import type { AIAgentId } from "@/types/ai";

export default function AdminAIPage() {
  const agents = defaultAgentRegistry.listAgents();
  const { openChat, activeProvider, setProvider } = useChatStore();

  const [testPrompt, setTestPrompt] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AIAgentId>("zalvy-assistant");
  const [testResponse, setTestResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTestAgent = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!testPrompt.trim() || loading) return;

    setLoading(true);
    setTestResponse("");

    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: testPrompt }],
          agentId: selectedAgent,
          provider: activeProvider,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`API returned HTTP status ${String(res.status)}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6);
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr) as { content?: string };
              if (parsed.content) {
                text += parsed.content;
                setTestResponse(text);
              }
            } catch {
              // Ignore partial JSON
            }
          }
        }
      }
    } catch (err) {
      setTestResponse(
        `Error executing agent test: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 p-6 shadow-xl md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
              <Sparkles className="h-3 w-3" /> Multi-Agent Architecture
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              Active Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Intelligence & Multi-Agent Operations
          </h1>
          <p className="max-w-2xl text-xs text-slate-400">
            Monitor real-time agent execution, streaming response latency, active LLM model
            providers (Gemini & Ollama), and RAG knowledge indexing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              openChat();
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
          >
            <Bot className="h-4 w-4" /> Open Live Copilot
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered Agents</span>
            <Bot className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{agents.length}</p>
          <p className="flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> 7 Active Personas
          </p>
        </div>

        <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Model Engine</span>
            <Cpu className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-xl font-bold text-white uppercase">{activeProvider}</p>
          <p className="text-[11px] text-slate-400">
            {activeProvider === "gemini" ? "Google Gemini 2.5 Flash" : "Ollama Local Instance"}
          </p>
        </div>

        <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>RAG Documents Indexed</span>
            <Database className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">4 Docs</p>
          <p className="text-[11px] text-slate-400">TF-IDF Vector Fallback Active</p>
        </div>

        <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Streaming API Health</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">99.9%</p>
          <p className="text-[11px] text-slate-400">Average TTFT: 145ms</p>
        </div>
      </div>

      {/* Provider Switcher Bar */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold text-white">Provider Execution Engine:</span>
          <span className="text-xs text-slate-400">
            Select model provider for streaming endpoints
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 p-1">
          <button
            onClick={() => {
              setProvider("gemini");
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeProvider === "gemini"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Google Gemini API
          </button>
          <button
            onClick={() => {
              setProvider("ollama");
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeProvider === "ollama"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Ollama Local Host
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-white">
          <Bot className="h-4 w-4 text-indigo-400" /> Multi-Agent Registry & Personas
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-indigo-500/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/20 font-bold text-indigo-400">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{agent.name}</h3>
                    <p className="font-mono text-[10px] text-indigo-400">{agent.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAgent(agent.id);
                    openChat(agent.id);
                  }}
                  className="rounded-lg border border-indigo-500/30 bg-indigo-600/20 px-2.5 py-1 text-[10px] font-semibold text-indigo-300 transition-all hover:bg-indigo-600 hover:text-white"
                >
                  Test Agent
                </button>
              </div>

              <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
                {agent.description}
              </p>

              <div className="space-y-1.5 border-t border-slate-800 pt-1">
                <span className="text-[10px] font-semibold text-slate-400">Capabilities:</span>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Playground Console */}
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <Terminal className="h-4 w-4 text-indigo-400" /> Interactive Agent Test Console
            </h3>
            <p className="text-xs text-slate-400">
              Test agent prompt execution directly against active provider API
            </p>
          </div>

          <select
            value={selectedAgent}
            onChange={(e) => {
              setSelectedAgent(e.target.value as AIAgentId);
            }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.id})
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={(e) => void handleTestAgent(e)} className="space-y-3">
          <textarea
            value={testPrompt}
            onChange={(e) => {
              setTestPrompt(e.target.value);
            }}
            placeholder={`Enter test prompt for ${selectedAgent}...`}
            rows={3}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Activity className="h-3 w-3 text-indigo-400" /> Active Engine:{" "}
              <strong className="text-white uppercase">{activeProvider}</strong>
            </span>

            <button
              type="submit"
              disabled={!testPrompt.trim() || loading}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {loading ? "Streaming..." : "Run Test Prompt"}
            </button>
          </div>
        </form>

        {testResponse && (
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="font-mono text-[10px] tracking-wider text-indigo-400 uppercase">
              Agent Response Output:
            </span>
            <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-200">
              {testResponse}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
