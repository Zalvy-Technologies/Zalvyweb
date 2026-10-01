"use client";

import { useState } from "react";
import { Bot, User, Copy, Check, Sparkles } from "lucide-react";
import { StreamingText } from "./streaming-text";
import type { AIMessage } from "@/types/ai";

interface ChatMessageProps {
  message: AIMessage;
  isStreaming?: boolean;
}

export function ChatMessageItem({ message, isStreaming = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    void navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className={`my-2 flex gap-3 text-xs transition-all ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${
          isUser
            ? "border border-slate-600 bg-slate-700 dark:bg-slate-800"
            : "bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-sm shadow-indigo-500/20"
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div className={`group relative max-w-[82%] ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
            isUser
              ? "rounded-tr-none bg-indigo-600 text-white"
              : "rounded-tl-none border border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700/60 dark:bg-slate-800/90 dark:text-slate-100"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <StreamingText content={message.content} isStreaming={isStreaming} />
          )}
        </div>

        {!isUser && message.content && (
          <div className="mt-1 flex items-center gap-2 px-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-500">
              <Sparkles className="h-2.5 w-2.5 text-indigo-400" /> Zalvy AI
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
