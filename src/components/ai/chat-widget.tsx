"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Sparkles, Maximize2, Minimize2 } from "lucide-react";
import { useChatStore } from "@/lib/ai/chat-store";
import { AgentSelector } from "./agent-selector";
import { ChatMessageItem } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ResumeUploadModal } from "./resume-upload";

export function ChatWidget() {
  const { isOpen, toggleChat, messages, isStreaming, hydrate } = useChatStore();
  const [showUpload, setShowUpload] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={toggleChat}
        aria-label="Toggle Zalvy AI Copilot"
        className="fixed right-5 bottom-5 z-[500] flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="hidden font-semibold tracking-wide sm:inline">ZALVY AI</span>
      </button>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div
          className={`fixed right-5 bottom-20 z-[500] flex flex-col overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            isExpanded ? "h-[80vh] w-[92vw] sm:w-[650px]" : "h-[580px] w-[92vw] sm:w-[420px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-bold text-white">
                  ZALVY COPILOT <Sparkles className="h-3 w-3 text-cyan-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Multi-Agent AI Systems Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                title="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Agent Persona Selector */}
          <AgentSelector />

          {/* Resume Upload Drawer */}
          {showUpload && (
            <ResumeUploadModal
              onClose={() => {
                setShowUpload(false);
              }}
            />
          )}

          {/* Messages Stream Container */}
          <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto bg-slate-950/50 p-3">
            {messages.map((msg, idx) => {
              const isLastAssistant = idx === messages.length - 1 && msg.role === "assistant";
              return (
                <ChatMessageItem
                  key={msg.id ?? idx}
                  message={msg}
                  isStreaming={isLastAssistant && isStreaming}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <ChatInput
            onToggleUpload={() => {
              setShowUpload(!showUpload);
            }}
          />
        </div>
      )}
    </>
  );
}
