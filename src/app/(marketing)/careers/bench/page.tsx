import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { BENCH_MEMBERS } from "@/data/careers";
import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb, CtaCard, PageHero } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

export const metadata: Metadata = buildPageMetadata({
  title: "ZALVY Engineering Bench — Contributors We Sponsor",
  description:
    "Open-source contributors sponsored by ZALVY — evaluation harnesses, trace viewers, agent safety frameworks, and developer tooling maintained with our support.",
  path: "/careers/bench",
});

const benchJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

export default function BenchPage() {
  return (
    <>
      <JsonLd id="jsonld-bench" data={benchJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Careers", href: "/careers" },
            { label: "The Bench", href: "/careers/bench", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Careers"
        title="The ZALVY Engineering Bench — contributors we sponsor."
        description="ZALVY sponsors open-source contributors who ship tooling that the AI engineering community depends on. Bench members receive a stipend, mentorship from ZALVY senior staff, and direct access to the ZALVY platform for their projects."
      />

      <Section id="bench-members" rhythm="default">
        <ul className="grid list-none grid-cols-1 gap-6 p-0">
          {BENCH_MEMBERS.map((member, i) => (
            <Reveal
              key={member.name}
              as="li"
              delay={i * 80}
              animation="blur-in"
              className="rounded-2xl"
            >
              <div className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex flex-col gap-5 rounded-2xl border p-6 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:shadow-lg motion-reduce:transition-none md:p-8">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="bg-accent-subtle ring-accent/15 text-accent font-display inline-flex size-14 shrink-0 items-center justify-center rounded-full text-lg leading-none font-semibold tracking-tight ring-1 ring-inset"
                  >
                    {member.avatarInitials}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="t-h3 text-foreground">{member.name}</h3>
                    <p className="t-body-sm text-accent font-medium">{member.project}</p>
                  </div>
                </div>
                <p className="t-body t-muted leading-relaxed">{member.description}</p>
                <div className="flex items-center gap-4">
                  {member.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      external
                      className="group/link text-accent hover:text-iris inline-flex items-center gap-1.5 text-[0.875rem] font-medium transition-colors"
                    >
                      {link.label}
                      <Icon icon={ArrowUpRight} size="xs" aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <TrustBand />

      <CtaCard
        title="Interested in the bench?"
        description="ZALVY bench positions are by invitation. If you maintain a project the AI engineering community depends on, send your work and a paragraph about what you'd build with ZALVY infrastructure access."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">
              Reach out
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
        secondary={
          <Button asChild variant="secondary" size="lg">
            <Link href="/careers">See all open roles</Link>
          </Button>
        }
      />
    </>
  );
}
