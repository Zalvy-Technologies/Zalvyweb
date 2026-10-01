"use client";

import { useId } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

interface QA {
  id: string;
  question: string;
  answer: string;
}

const FAQS: QA[] = [
  {
    id: "data-ownership",
    question: "Who owns our data when we deploy ZALVY agents?",
    answer:
      "You do. ZALVY operates in your account on hosting providers you provision, or, in the ZALVY-operated tier, under a customer-of-record contract where we are a subprocessor. Data is never used to train shared models; grounding corpora live isolated per workspace.",
  },
  {
    id: "ontime",
    question: "How quickly can production agents be live?",
    answer:
      "A greenfield team using starter tier is usually live within 2-3 weeks. Teams tier engagements include a structured 6-week velocity plan and may move faster with a dedicated partner team. Operating the agent through quarter 1 is what we measure.",
  },
  {
    id: "internship-eligibility",
    question: "Who is eligible for the internship program?",
    answer:
      "Students in any year of an undergraduate or graduate program, plus career-shifters within 12 months of completing their first technical job. Applications are blind to school name and prior internship history. We care about the repo you point us to and how you talk about it.",
  },
  {
    id: "security",
    question: "What security posture is included with each plan?",
    answer:
      "Starter and Teams run in the ZALVY-operated control plane (SOC 2 II today, HIPAA available on request). Enterprise adds the option to operate within customer VPC and supports custom audit, region pinning, and quarterly pen-test results shared with you.",
  },
  {
    id: "models",
    question: "Which foundation models can we run?",
    answer:
      "Starter includes ZALVY-provisioned usage on common hosted providers (OpenAI, Anthropic, Google) and open models served on ZALVY inference. Teams adds BYOM — bring your own keys, your own private deployments, or your own fine-tunes. Enterprise supports fully air-gapped model environments.",
  },
  {
    id: "no-pilots",
    question: "Why does ZALVY not run pilots?",
    answer:
      "Pilots market the team rather than the system. We prefer paid engagements scoped to a single quarter — both sides agreed on a success metric before kickoff — and we tour the results in a written review at the end. If the result is missing, we say so.",
  },
];

/**
 * ZALVY `Faq` — Radix accordion with keyboard-first single-open mode.
 *
 * The grid is two columns on lg+: leftmost sticky column carries the heading
 * and a one-line CTA "Still curious? Talk to us". Right column carries the
 * accordion itself. Pattern matches Linear/Stripe's anchor + content split.
 */
export function Faq() {
  const fallbackId = useId();

  return (
    <Section id="faq" rhythm="spacious" surface="plain">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
        <header className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:col-span-5">
          <span className="t-eyebrow">Frequently asked</span>
          <h2 className="t-h2 text-foreground is-balanced">Answers before you read sales copy.</h2>
          <p className="t-body-lg t-muted max-w-md">
            We surface the questions we most often receive. If yours isn&rsquo;t here, message us
            and you&rsquo;ll talk to someone on the engineering team.
          </p>
          <a
            href="/contact"
            className="t-body-sm text-accent hover:text-iris inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            Talk to us &rarr;
          </a>
        </header>

        <Accordion.Root
          type="single"
          collapsible
          defaultValue={FAQS[0]?.id}
          aria-label="Frequently asked questions"
          id={fallbackId}
          className="mt-4 self-start lg:col-span-7 lg:mt-0"
        >
          {FAQS.map((qa) => (
            <Accordion.Item
              key={qa.id}
              value={qa.id}
              className={cn(
                "group border-border border-b",
                "data-[state=open]:border-border-strong",
              )}
            >
              <Accordion.Header asChild>
                <Accordion.Trigger
                  className={cn(
                    "group/trigger flex w-full items-center justify-between gap-4 py-5 text-left",
                    "text-foreground hover:text-foreground transition-colors",
                    "focus-visible:outline-none",
                  )}
                >
                  <span className="t-h4 text-foreground is-balanced">{qa.question}</span>
                  <span
                    aria-hidden
                    className="border-border text-foreground-muted group-data-[:state=open]/trigger:border-accent group-data-[:state=open]/trigger:text-accent group-data-[:state=open]/trigger:rotate-45 inline-flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors"
                  >
                    <Icon icon={Plus} size="sm" aria-hidden />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content
                className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none"
                style={{
                  animationDuration: "var(--duration-fast)",
                  animationTimingFunction: "var(--ease-standard)",
                }}
              >
                <div className="t-body t-muted pr-12 pb-6 leading-relaxed">{qa.answer}</div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </Section>
  );
}
