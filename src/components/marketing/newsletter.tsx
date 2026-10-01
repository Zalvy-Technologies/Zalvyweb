"use client";

import { useState, type SyntheticEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setSubmitted(true);
    }
  };

  return (
    <div className="surface-raised border-border-strong mx-auto max-w-2xl rounded-3xl border p-8 text-center md:p-12">
      <h3 className="text-h3 font-display text-foreground mb-3 font-bold">
        Stay at the Edge of AI Engineering
      </h3>
      <p className="text-body-sm text-foreground-muted mx-auto mb-8 max-w-md">
        Subscribe to our monthly technical dispatches covering multi-agent architecture, compiler
        optimizations, and AI safety benchmarks.
      </p>

      {submitted ? (
        <div className="bg-success/10 text-success inline-flex items-center gap-2 rounded-2xl p-4 text-sm font-medium">
          <CheckCircle2 className="size-5" />
          <span>Thank you for subscribing! Check your inbox for confirmation.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="enter.your.email@company.com"
            required
            className="bg-surface border-border-strong text-foreground placeholder:text-foreground-subtle focus:ring-accent h-12 flex-1 rounded-xl border px-4 text-sm transition-all focus:ring-2 focus:outline-none"
          />
          <Button type="submit" variant="primary" size="lg" className="gap-2">
            Subscribe <Send className="size-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
