"use client";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

interface ProductHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}
export function ProductHero({ eyebrow, title, description, primaryCta, secondaryCta }: ProductHeroProps) {
  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <div className="max-w-3xl">
          {eyebrow && <Badge variant="neutral" size="lg" className="mb-4">{eyebrow}</Badge>}
          <h1 className="t-display-2 font-[680] tracking-[-0.04em] leading-[0.95] mb-5">{title}</h1>
          <p className="t-body-lg t-muted mb-8 max-w-2xl">{description}</p>
          <div className="flex flex-wrap gap-3">
            {primaryCta && <Button asChild variant="primary" size="lg"><Link href={primaryCta.href}>{primaryCta.label}</Link></Button>}
            {secondaryCta && <Button asChild variant="secondary" size="lg"><Link href={secondaryCta.href}>{secondaryCta.label}</Link></Button>}
          </div>
        </div>
      </Container>
    </section>
  );
}
