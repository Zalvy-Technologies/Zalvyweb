"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function CustomErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to enterprise monitoring service in production
    console.error("[zalvy:error_boundary]", error);
  }, [error]);

  return (
    <div className="bg-canvas text-foreground flex min-h-screen items-center justify-center p-6 text-center">
      <div className="surface-raised border-border-strong w-full max-w-md space-y-6 rounded-3xl border p-8">
        <div className="bg-danger/10 text-danger mx-auto flex size-16 items-center justify-center rounded-2xl">
          <AlertTriangle className="size-8" />
        </div>
        <div>
          <h1 className="text-h2 font-display text-foreground mb-2 font-bold">
            System Fault Detected
          </h1>
          <p className="text-body-sm text-foreground-muted">
            An unexpected error occurred while executing this component lifecycle. Our engineering
            team has been notified.
          </p>
          {error.digest && (
            <p className="text-foreground-subtle bg-surface mt-3 inline-block rounded-md px-3 py-1.5 font-mono text-xs">
              Digest ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <Button onClick={reset} variant="primary" className="gap-2">
            <RefreshCw className="size-4" /> Try Again
          </Button>
          <Button asChild variant="secondary" className="gap-2">
            <Link href="/">
              <Home className="size-4" /> Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
