"use client";

import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    const encoded = encodeURIComponent(trimmed);
    window.location.href = `https://docs.zalvy.com/search?q=${encoded}`;
  };

  return (
    <div className="flex min-h-[70dvh] items-center justify-center py-32">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-10 px-4 text-center">
        <div className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-16 items-center justify-center rounded-full ring-1">
          <Icon icon={SearchIcon} size="lg" aria-hidden />
        </div>

        <div className="flex flex-col gap-3">
          <p className="t-eyebrow justify-center">Search</p>
          <h1 className="t-h1 text-foreground">Search ZALVY documentation and resources.</h1>
          <p className="t-body-lg t-muted mx-auto max-w-md">
            Search across ZALVY documentation, engineering notes, SDK references, and platform
            guides.
          </p>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex w-full flex-col gap-3"
        >
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Search docs, SDKs, guides…"
            className={cn(
              "bg-surface border-border h-14 rounded-xl border px-5",
              "text-foreground t-body",
              "placeholder:text-foreground-subtle/70",
              "focus-visible:border-accent focus-visible:ring-accent/30 duration-quick transition-colors focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={query.trim().length === 0}
          >
            Search docs
            <Icon icon={SearchIcon} size="sm" aria-hidden />
          </Button>
        </form>
      </div>
    </div>
  );
}
