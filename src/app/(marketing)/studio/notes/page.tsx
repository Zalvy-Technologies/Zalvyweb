import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { ENGINEERING_NOTES } from "@/data/studio";
import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema, serviceSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb, CtaCard, PageHero } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

export const metadata: Metadata = buildPageMetadata({
  title: "ZALVY Engineering Notes — Production AI Engineering Writing",
  description:
    "Engineering notes from the ZALVY platform team — agents, cost telemetry, inference serving, evaluation, and incident postmortem analysis.",
  path: "/studio/notes",
});

const notesJsonLd = graphSchema([
  organizationSchema(),
  websiteSchema(),
  serviceSchema({
    slug: "studio/notes",
    name: "ZALVY Engineering Notes",
    description:
      "Published engineering notes from the ZALVY platform team — production AI architecture, observability, cost telemetry, evaluation, and postmortem analysis.",
    serviceType: "Engineering Writing",
  }),
]);

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function EngineeringNotesPage() {
  return (
    <>
      <JsonLd id="jsonld-notes" data={notesJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Studio", href: "/studio" },
            { label: "Engineering Notes", href: "/studio/notes", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Engineering Notes"
        title="Writing from the people who ship the platform."
        description="Notes published by ZALVY platform engineering — agents, cost telemetry, cold-start enforcement, evaluation infrastructure, and production incident analysis. Each note documents a decision or a lesson from running AI in production."
      />

      <Section id="notes-list" rhythm="default">
        <ol className="grid list-none grid-cols-1 gap-4 p-0">
          {ENGINEERING_NOTES.map((note, i) => (
            <Reveal
              key={note.slug}
              as="li"
              delay={i * 80}
              animation="blur-in"
              className="rounded-2xl"
            >
              <Link
                href={`https://docs.zalvy.com/notes/${note.slug}`}
                external
                className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex flex-col gap-5 rounded-2xl border p-6 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:shadow-lg motion-reduce:transition-none md:p-8"
              >
                <div
                  aria-hidden
                  className="duration-base pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(60%_70%_at_50%_0%,rgb(var(--token-accent)/0.06),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="t-caption t-subtle tracking-widest uppercase">
                        {formatDate(note.date)}
                      </span>
                      <span className="t-caption t-subtle">by {note.author}</span>
                    </div>
                    <h3 className="t-h3 text-foreground is-balanced">{note.title}</h3>
                  </div>
                  <span className="text-foreground-muted group-hover:text-accent shrink-0 transition-colors">
                    <Icon icon={ArrowUpRight} aria-hidden />
                  </span>
                </div>

                <div className="relative flex flex-col gap-3">
                  <p className="t-body t-muted max-w-prose leading-relaxed">{note.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="neutral" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ol>
      </Section>

      <TrustBand />

      <CtaCard
        title="Want the team that writes these notes on your engagement?"
        description="We respond within one business day from engineers on the team. Each engagement begins with a paid research brief."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">
              Talk to us
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
        secondary={
          <Button asChild variant="secondary" size="lg">
            <Link href="/studio/work">See case studies</Link>
          </Button>
        }
      />
    </>
  );
}
