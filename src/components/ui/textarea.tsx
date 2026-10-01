"use client";

import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, helperText, className, id, ...rest }, ref) {
    const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-caption font-semibold t-subtle mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${error ? errorId : ""} ${helperText ? helperId : ""}`.trim() || undefined}
          className={cn(
            "w-full rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 text-body-sm text-foreground placeholder:text-foreground-subtle",
            "transition-all duration-quick resize-y min-h-[7rem]",
            "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:border-border-strong",
            error && "border-danger focus:ring-danger/40 focus:border-danger",
            className,
          )}
          {...rest}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-caption text-danger" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-caption t-subtle">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";