import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Not found",
  description: `This page could not be found on ${site.name}.`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main>
      <Container className="flex min-h-[80dvh] flex-col items-center justify-center gap-8 py-32 text-center">
        <div className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-16 items-center justify-center rounded-full ring-1">
          <Icon icon={Compass} size="lg" aria-hidden />
        </div>
        <div className="flex flex-col gap-3">
          <p className="t-eyebrow justify-center">404 · Lost</p>
          <h1 className="t-h1 text-foreground">This page drifted off-map.</h1>
          <p className="t-body-lg t-muted mx-auto max-w-md">
            The page you&rsquo;re looking for may have been renamed, removed, or never existed. Try
            heading back to the route you started from.
          </p>
        </div>

        <Button asChild variant="primary" size="lg">
          <Link href="/">
            <Icon icon={ArrowLeft} size="sm" aria-hidden />
            Return home
          </Link>
        </Button>
      </Container>
    </main>
  );
}
