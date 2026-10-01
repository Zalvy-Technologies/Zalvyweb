"use client";

import { memo } from "react";

interface StreamingTextProps {
  content: string;
  isStreaming?: boolean;
}

export const StreamingText = memo(function StreamingText({
  content,
  isStreaming = false,
}: StreamingTextProps) {
  if (!content && isStreaming) {
    return (
      <div className="flex items-center gap-1.5 py-1 text-slate-400">
        <span className="h-2 w-2 animate-ping rounded-full bg-indigo-500" />
        <span className="text-xs font-medium">Zalvy Copilot is thinking...</span>
      </div>
    );
  }

  return (
    <div className="prose prose-invert prose-sm max-w-none text-xs leading-relaxed whitespace-pre-wrap">
      {content}
      {isStreaming && (
        <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-indigo-400 align-middle" />
      )}
    </div>
  );
});
