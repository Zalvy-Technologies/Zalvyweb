"use client";

import { useState } from "react";
import { ArrowRight, GraduationCap, ShieldCheck, Users } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { INTERN_COHORTS, INTERNSHIP_FAQS } from "@/data/careers";
import { Breadcrumb, CtaCard, PageHero } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/cn";
import { InternshipApplyModal } from "@/components/marketing/internship-apply-modal";

const PILLARS = [
  {
    title: "Real systems, not toys.",
    body: "You ship a feature that goes to production. Mentors are senior staff engineers who say no when ideas are wrong, and stay when ideas are right.",
    icon: GraduationCap,
  },
  {
    title: "A peer group, not a competition.",
    body: "12 interns per cohort. No forced-ranking curve. The measure is whether your project shipped, not whether you out-positioned someone.",
    icon: Users,
  },
  {
    title: "Same trust every Zalvanian gets.",
    body: "Same laptop, same source access, same on-call seat. You sign the same engineering handbook. You're not a visitor at the company.",
    icon: ShieldCheck,
  },
];

export default function InternshipPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <InternshipApplyModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); }} />

      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Careers", href: "/careers" },
            { label: "Internship Program", href: "/careers/internship", current: true },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Talent Incubator"
        badge="Summer 2026 cohort open"
        title="The ZALVY internship doesn't perform pedagogy — it makes real engineers."
        description="4/6/8/12-week tracks. Senior staff mentors 1:1. You build something that ships to production. Enterprise AI, Cloud Native, Fullstack, and Cybersecurity tracks."
        actions={
          <>
            <Button onClick={() => { setIsModalOpen(true); }} variant="primary" size="lg">
              Apply now for Internship
              <Icon icon={ArrowRight} size="sm" aria-hidden />
            </Button>
          </>
        }
      />

      <Section id="pillars" rhythm="default">
        <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal
              key={p.title}
              as="li"
              delay={i * 60}
              animation="blur-in"
              className="rounded-2xl"
            >
              <div className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors duration-300 md:p-7">
                <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset">
                  <Icon icon={p.icon} aria-hidden />
                </span>
                <h3 className="t-h4 text-foreground is-balanced">{p.title}</h3>
                <p className="t-body-sm t-muted leading-snug">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        id="cohorts"
        surface="veil"
        rhythm="default"
        eyebrow="Cohorts"
        title="Two cohorts per year. 12 interns each."
        description="Rolling review begins on the application date. Two interview rounds — no take-home assignments, no behavioral round, no HR screen. Decision within three weeks."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {INTERN_COHORTS.map((cohort, i) => (
            <Reveal
              key={`${cohort.season}-${cohort.year}`}
              as="div"
              delay={i * 80}
              animation="blur-in"
              className="rounded-2xl"
            >
              <div className="bg-surface-raised border-border hover:border-border-strong flex h-full flex-col gap-5 rounded-2xl border p-6 transition-colors duration-300 md:p-8">
                <div className="flex items-center justify-between">
                  <h3 className="t-h3 text-foreground">
                    {cohort.season} &rsquo;{cohort.year.slice(-2)}
                  </h3>
                  <Badge variant={cohort.status === "open" ? "accent" : "neutral"}>
                    {cohort.status === "open"
                      ? "Applications open"
                      : cohort.status === "upcoming"
                        ? "Upcoming"
                        : "Closed"}
                  </Badge>
                </div>
                <dl className="t-num-tabular grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <dt className="t-subtle text-[0.6875rem] tracking-widest uppercase">Stipend</dt>
                    <dd className="t-h4 text-foreground">{cohort.stipend}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="t-subtle text-[0.6875rem] tracking-widest uppercase">
                      Cohort size
                    </dt>
                    <dd className="t-h4 text-foreground">{cohort.size}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="t-subtle text-[0.6875rem] tracking-widest uppercase">Dates</dt>
                    <dd className="t-body-sm text-foreground">
                      {cohort.startDate} &mdash; {cohort.endDate}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="t-subtle text-[0.6875rem] tracking-widest uppercase">
                      Applications by
                    </dt>
                    <dd className="t-body-sm text-foreground">{cohort.applicationDate}</dd>
                  </div>
                </dl>
                {cohort.status === "open" ? (
                  <Button asChild variant="primary" size="lg" className="mt-1">
                    <Link href="/contact">
                      Apply now
                      <Icon icon={ArrowRight} size="sm" aria-hidden />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="faq"
        rhythm="default"
        eyebrow="Questions"
        title="If you're reading these, you might be ready."
      >
        <FaqAccordion />
      </Section>

      <TrustBand />

      <CtaCard
        title="Ready to build something that ships to production?"
        description="Rolling review begins 12 August. Two rounds, no take-home assignments. The people who interview you are the people you'll work with."
        primary={
          <Button asChild variant="primary" size="lg">
            <Link href="/contact">
              Apply to the bench
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

function FaqAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="mx-auto flex max-w-[42rem] flex-col gap-3">
      {INTERNSHIP_FAQS.map((faq, i) => (
        <Accordion.Item
          key={i}
          value={`faq-${String(i)}`}
          className="border-border bg-surface-raised overflow-hidden rounded-2xl border"
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                "group flex w-full items-center justify-between gap-4 p-5 text-left md:p-6",
                "hover:bg-surface-overlay duration-quick transition-colors",
              )}
            >
              <span className="t-body text-foreground pr-4 font-medium">{faq.question}</span>
              <span className="bg-surface ring-border inline-flex size-7 shrink-0 items-center justify-center rounded-full ring-1 transition-transform duration-200 group-data-[state=open]:rotate-180">
                <Icon icon={ChevronDown} size="xs" aria-hidden />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div className="px-5 pt-0 pb-5 md:px-6 md:pb-6">
              <p className="t-body-sm t-muted leading-relaxed">{faq.answer}</p>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
