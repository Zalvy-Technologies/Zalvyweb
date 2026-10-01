"use client";

import { useChatStore } from "@/lib/ai/chat-store";
import { defaultAgentRegistry } from "@/lib/ai/agents";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  FileText,
  Sparkles,
  FolderGit2,
  Award,
  ShieldCheck,
  BookOpen,
  Cpu,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Bot,
  FileText,
  Sparkles,
  FolderGit2,
  Award,
  ShieldCheck,
  BookOpen,
};

export function AgentSelector() {
  const { activeAgentId, setAgent, activeProvider, setProvider } = useChatStore();
  const agents = defaultAgentRegistry.listAgents();

  return (
    <div className="space-y-2 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
      {/* Agent Selector Bar */}
      <div className="custom-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
        {agents.map((agent) => {
          const IconComp = iconMap[agent.iconName] ?? Bot;
          const isActive = activeAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => {
                setAgent(agent.id);
              }}
              title={agent.description}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                  : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <IconComp className="h-3 w-3" />
              <span>{agent.name}</span>
            </button>
          );
        })}
      </div>

      {/* Provider Switcher Bar */}
      <div className="flex items-center justify-between pt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Cpu className="h-3 w-3 text-indigo-400" /> Model Provider:
        </span>
        <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-200 p-0.5 dark:border-slate-700 dark:bg-slate-800">
          <button
            onClick={() => {
              setProvider("gemini");
            }}
            className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
              activeProvider === "gemini"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Gemini 2.5 Flash
          </button>
          <button
            onClick={() => {
              setProvider("ollama");
            }}
            className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
              activeProvider === "ollama"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Ollama (Local)
          </button>
        </div>
      </div>
    </div>
  );
}
