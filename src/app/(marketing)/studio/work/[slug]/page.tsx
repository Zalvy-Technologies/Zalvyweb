import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { CASE_STUDIES, caseStudyBySlug } from "@/data/studio";
import { buildPageMetadata } from "@/lib/page-metadata";
import {
  graphSchema,
  organizationSchema,
  websiteSchema,
  serviceSchema,
  breadcrumbSchema,
} from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb, CtaCard, PageHero, StatRow } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) return {};
  return buildPageMetadata({
    title: `${study.customer} — ${study.title} | ZALVY Studio`,
    description: study.summary,
    path: `/studio/work/${slug}`,
  });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);

  if (!study) notFound();

  const jsonLd = graphSchema([
    organizationSchema(),
    websiteSchema(),
    serviceSchema({
      slug: `studio/work/${slug}`,
      name: `${study.customer} — ${study.title}`,
      description: study.summary,
      serviceType: "AI Engineering Case Study",
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Studio", path: "/studio" },
      { name: "Case Studies", path: "/studio/work" },
      { name: study.title, path: `/studio/work/${slug}` },
    ]),
  ]);

  return (
    <>
      <JsonLd id={`jsonld-case-study-${slug}`} data={jsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Studio", href: "/studio" },
            { label: "Case Studies", href: "/studio/work" },
            { label: study.title, href: `/studio/work/${slug}`, current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow={study.sector}
        badge={study.sector}
        title={study.title}
        description={study.summary}
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">
                Talk to us
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
          </>
        }
        metrics={[
          { label: "Engagement", value: study.customer },
          { label: "Timeline", value: study.timeline },
          { label: "Team", value: study.teamSize },
        ]}
      />

      <Section id="representative-note" rhythm="tight">
        <p className="t-body-sm t-muted mx-auto max-w-[42rem] rounded-xl border border-border bg-surface-raised/60 px-5 py-4 leading-relaxed">
          Representative engagement — anonymized for client confidentiality. Figures illustrate
          the shape of typical outcomes rather than an audited claim.
        </p>
      </Section>

      <Section id="challenge" rhythm="default">
        <h2 className="t-h3 text-foreground is-balanced mb-4">The challenge</h2>
        <p className="t-body-lg t-muted max-w-[42rem] leading-relaxed">{study.challenge}</p>
      </Section>

      <Section id="approach" rhythm="compact">
        <h2 className="t-h3 text-foreground is-balanced mb-4">Our approach</h2>
        <p className="t-body-lg t-muted max-w-[42rem] leading-relaxed">{study.approach}</p>
      </Section>

      <Section id="solution" rhythm="compact">
        <h2 className="t-h3 text-foreground is-balanced mb-4">What shipped</h2>
        <p className="t-body-lg t-muted max-w-[42rem] leading-relaxed">{study.solution}</p>
      </Section>

      <StatRow stats={study.results} surface="veil" />

      <Section id="note" rhythm="compact" align="center">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
          <blockquote className="t-h3 md:t-h2 text-foreground is-balanced font-display leading-[1.18] tracking-tight">
            <p>{study.note.body}</p>
          </blockquote>
          <figcaption className="flex flex-col items-center gap-1">
            <p className="t-body-sm t-muted">{study.note.attribution}</p>
          </figcaption>
        </Reveal>
      </Section>

      <Section id="technologies" rhythm="compact" align="center">
        <div className="flex flex-col items-center gap-6">
          <h2 className="t-h4 text-foreground">Technologies used</h2>
          <ul className="flex list-none flex-wrap items-center justify-center gap-2 p-0">
            {study.technologies.map((tech) => (
              <Badge key={tech} variant="neutral" className="h-7 px-3 text-[0.875rem]">
                {tech}
              </Badge>
            ))}
          </ul>
        </div>
      </Section>

      <TrustBand />

      <CtaCard
        title="Ready to scope your engagement?"
        description="We respond within one business day from engineers on the team. Each engagement begins with a paid research brief and a success metric agreed in writing."
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
            <Link href="/studio/work">See all case studies</Link>
          </Button>
        }
      />
    </>
  );
}
