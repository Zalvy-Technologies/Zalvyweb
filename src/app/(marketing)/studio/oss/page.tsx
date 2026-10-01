import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";

import { OSS_PROJECTS } from "@/data/studio";
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
  title: "ZALVY Open Source — Production-Grade AI Engineering Tools",
  description:
    "ZALVY maintains and publishes open-source tools — evaluation harnesses, trace viewers, vector recall toolkits, agent safety frameworks, and SDKs in TypeScript and Python.",
  path: "/studio/oss",
});

const ossJsonLd = graphSchema([
  organizationSchema(),
  websiteSchema(),
  serviceSchema({
    slug: "studio/oss",
    name: "ZALVY Open Source",
    description:
      "ZALVY open-source projects — open-evals, trace-viewer, pgvector-recall, agent-safety-kit, and SDKs in TypeScript and Python. MIT-licensed, production-grade.",
    serviceType: "Open Source Tools",
  }),
]);

export default function OssPage() {
  return (
    <>
      <JsonLd id="jsonld-oss" data={ossJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Studio", href: "/studio" },
            { label: "Open Source", href: "/studio/oss", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Open Source"
        title="The tools we build are the tools we ship."
        description="ZALVY publishes the evaluation harnesses, observability tooling, and SDKs that ship in every production deployment. MIT-licensed, CI-native, and tested against the same regression thresholds we enforce internally."
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="https://github.com/zalvy" external>
                GitHub
                <Icon icon={ArrowUpRight} size="sm" aria-hidden />
              </Link>
            </Button>
          </>
        }
      />

      <Section id="oss-grid" rhythm="default">
        <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
          {OSS_PROJECTS.map((project, i) => (
            <Reveal
              key={project.slug}
              as="li"
              delay={i * 60}
              animation="blur-in"
              className="h-full rounded-2xl"
            >
              <div className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex h-full flex-col justify-between gap-5 rounded-2xl border p-6 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:shadow-lg motion-reduce:transition-none md:p-7">
                <div
                  aria-hidden
                  className="duration-base pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(closest-side,rgb(var(--token-accent)/0.06),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset">
                      <Icon icon={project.icon} aria-hidden />
                    </span>
                    <Badge variant="neutral" size="sm">
                      {project.language}
                    </Badge>
                  </div>

                  <h3 className="t-h4 text-foreground">{project.name}</h3>
                  <p className="t-body-sm t-muted leading-relaxed">{project.description}</p>
                </div>

                <div className="relative flex flex-col gap-3">
                  <div className="t-subtle flex items-center gap-3 text-[0.8125rem]">
                    <span>{project.license}</span>
                    {project.stars ? (
                      <span className="inline-flex items-center gap-1">
                        <span
                          aria-hidden
                          className="bg-foreground-muted inline-flex size-1.5 rounded-full"
                        />
                        {project.stars} stars
                      </span>
                    ) : null}
                    {project.npmDownloads ? (
                      <span className="inline-flex items-center gap-1">
                        <span
                          aria-hidden
                          className="bg-foreground-muted inline-flex size-1.5 rounded-full"
                        />
                        {project.npmDownloads}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={project.url}
                      external
                      className="group/link text-accent hover:text-iris inline-flex items-center gap-1.5 text-[0.875rem] font-medium transition-colors"
                    >
                      GitHub
                      <Icon icon={ArrowUpRight} size="xs" aria-hidden />
                    </Link>
                    {project.docsUrl ? (
                      <Link
                        href={project.docsUrl}
                        external
                        className="group/link text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 text-[0.875rem] font-medium transition-colors"
                      >
                        Docs
                        <Icon icon={BookOpen} size="xs" aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <TrustBand />

      <CtaCard
        title="Ship with the same tools we run in production."
        description="Every ZALVY engagement uses the evaluation harnesses and observability tooling we publish as open source. MIT-licensed, battle-tested."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="https://github.com/zalvy" external>
              Browse on GitHub
              <Icon icon={ArrowUpRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
        secondary={
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">
              Talk to us
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
      />
    </>
  );
}
