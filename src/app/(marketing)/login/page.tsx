"use client";

import { type SyntheticEvent, useState } from "react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/cn";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);
  };

  return (
    <div className="flex min-h-[80dvh] items-center justify-center py-24">
      <Container width="narrow">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-8">
          <Link href="/" aria-label="ZALVY — home" silentFocus>
            <Logo />
          </Link>

          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="t-h2 text-foreground">Sign in to your workspace</h1>
            <p className="t-body-sm t-muted">Enter your email and password to continue.</p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="t-body-sm text-foreground font-medium">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className={cn(
                  "bg-surface border-border h-12 rounded-lg border px-3.5",
                  "text-foreground t-body",
                  "placeholder:text-foreground-subtle/70",
                  "focus-visible:border-accent focus-visible:ring-accent/30 duration-quick transition-colors focus-visible:ring-2 focus-visible:outline-none",
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="t-body-sm text-foreground font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className={cn(
                  "bg-surface border-border h-12 rounded-lg border px-3.5",
                  "text-foreground t-body",
                  "placeholder:text-foreground-subtle/70",
                  "focus-visible:border-accent focus-visible:ring-accent/30 duration-quick transition-colors focus-visible:ring-2 focus-visible:outline-none",
                )}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={submitting}
              aria-busy={submitting}
              className="mt-2"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="t-caption t-muted text-center">
            Need access? Contact your workspace administrator. Don&rsquo;t have an account?{" "}
            <Link
              href="/contact"
              className="text-accent hover:text-iris underline underline-offset-2"
            >
              Talk to us
            </Link>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
