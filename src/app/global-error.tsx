"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[zalvy:global_error]", error);
  }, [error]);

  return (
    <html lang="en" data-theme="dark">
      <body className="flex min-h-screen items-center justify-center bg-black p-6 text-center font-sans text-white antialiased">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-neutral-800 bg-neutral-900 p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertOctagon className="size-8" />
          </div>
          <div>
            <h1 className="mb-2 text-2xl font-bold">Critical Application Error</h1>
            <p className="text-sm text-neutral-400">
              A global exception occurred in the root document layout.
            </p>
          </div>
          <button
            onClick={() => {
              reset();
            }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 font-medium text-black transition-colors hover:bg-neutral-200"
          >
            <RefreshCw className="size-4" /> Reload System
          </button>
        </div>
      </body>
    </html>
  );
}
