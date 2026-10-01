"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Trash2, Paperclip } from "lucide-react";
import { useChatStore } from "@/lib/ai/chat-store";

interface ChatInputProps {
  onToggleUpload?: () => void;
}

export function ChatInput({ onToggleUpload }: ChatInputProps) {
  const [input, setInput] = useState("");
  const { sendMessage, isStreaming, clearMessages } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${String(Math.min(textareaRef.current.scrollHeight, 120))}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    const text = input;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-2 transition-colors focus-within:border-indigo-500 dark:border-slate-700/60 dark:bg-slate-800/80">
        {onToggleUpload && (
          <button
            type="button"
            onClick={onToggleUpload}
            className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-indigo-400 dark:hover:bg-slate-700"
            title="Upload Resume or Document"
          >
            <Paperclip className="h-4 w-4" />
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask Zalvy AI anything... (Shift+Enter for newline)"
          rows={1}
          disabled={isStreaming}
          className="max-h-32 flex-1 resize-none border-0 bg-transparent py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none dark:text-slate-100"
        />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearMessages}
            className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-rose-400 dark:hover:bg-slate-700"
            title="Clear Chat History"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 rounded-xl bg-indigo-600 p-2 text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </form>
  );
}
