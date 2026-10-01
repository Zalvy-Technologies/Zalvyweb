import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { OPEN_ROLES, jobById } from "@/data/careers";
import { buildPageMetadata } from "@/lib/page-metadata";
import {
  graphSchema,
  organizationSchema,
  websiteSchema,
  jobPostingSchema,
  breadcrumbSchema,
} from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb, CtaCard, PageHero } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return OPEN_ROLES.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = jobById(id);
  if (!job) return {};
  return buildPageMetadata({
    title: `${job.title} — ZALVY Careers`,
    description: job.description,
    path: `/careers/${id}`,
  });
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = jobById(id);

  if (!job) notFound();

  const jsonLd = graphSchema([
    organizationSchema(),
    websiteSchema(),
    jobPostingSchema({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      remote: job.remote,
      postedAt: job.postedAt,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Careers", path: "/careers" },
      { name: job.title, path: `/careers/${id}` },
    ]),
  ]);

  return (
    <>
      <JsonLd id={`jsonld-job-${id}`} data={jsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Careers", href: "/careers" },
            { label: job.title, href: `/careers/${id}`, current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow={job.team}
        title={job.title}
        description={job.description}
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">
                Apply now
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
          </>
        }
        metrics={[
          { label: "Location", value: job.location },
          { label: "Remote", value: job.remote ? "Yes" : "In-office" },
          { label: "Posted", value: formatDate(job.postedAt) },
        ]}
      />

      <Section id="responsibilities" rhythm="default">
        <h2 className="t-h3 text-foreground is-balanced mb-6">What you&rsquo;ll do</h2>
        <ul className="list-none space-y-3 p-0">
          {job.responsibilities.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                aria-hidden
                className="bg-accent mt-1.5 inline-flex size-1.5 shrink-0 rounded-full"
              />
              <p className="t-body t-muted leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="qualifications" rhythm="compact">
        <h2 className="t-h3 text-foreground is-balanced mb-6">What we&rsquo;re looking for</h2>
        <ul className="space-y-3">
          {job.qualifications.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                aria-hidden
                className="bg-iris mt-1.5 inline-flex size-1.5 shrink-0 rounded-full"
              />
              <span className="t-body t-muted leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <TrustBand />

      <CtaCard
        title="Ready to apply?"
        description="We respond within one business day. Two rounds, no take-home assignments — just a pair programming session and a system design conversation with the people you'll work with."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">
              Apply now
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Link>
          </Button>
        }
        secondary={
          <Button asChild variant="secondary" size="lg">
            <Link href="/careers">See all roles</Link>
          </Button>
        }
      />
    </>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
