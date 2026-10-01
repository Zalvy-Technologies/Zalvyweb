import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Code, Award, GitPullRequest } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/cn";

interface Pillar {
  step: string;
  title: string;
  body: string;
  icon: LucideIcon;
  tags: string[];
}

const PILLARS: Pillar[] = [
  {
    step: "01. BUILD",
    title: "Production systems, zero simulations.",
    body: "You write and ship real code to active repositories. Mentored directly by senior engineers who enforce production rigor, clean architecture, and exhaustive test coverage.",
    icon: Code,
    tags: ["Real Repos", "CI/CD Pipelines", "PR Reviews"],
  },
  {
    step: "02. PROVE",
    title: "GitHub-evaluated performance.",
    body: "No subjective grading. Your impact is measured by your merged pull requests, architecture design documents, and operational resilience under real load.",
    icon: GitPullRequest,
    tags: ["Verified Merges", "Deterministic Evals"],
  },
  {
    step: "03. GROW",
    title: "Cryptographically verified credentials.",
    body: "Earn tamper-proof digital completion certificates with instant public verification, backed by verifiable repository commits and architectural peer endorsements.",
    icon: Award,
    tags: ["On-Chain Verification", "Alumni Network"],
  },
];

export function InternshipProgram() {
  return (
    <Section
      id="internship"
      surface="veil"
      rhythm="spacious"
      eyebrow="Future Talent Ecosystem"
      title="Engineering apprenticeships. Measured by code."
      description="4/6/8/12-week tracks. Rigorous 1:1 mentorship from senior staff — cohorts who ship real production systems end-to-end."
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:col-span-8">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70} animation="blur-in" className="h-full">
              <div
                className={cn(
                  "group relative flex h-full flex-col justify-between rounded-[1.35rem] border border-white/[0.06] bg-surface-raised/55 p-6 backdrop-blur-xl transition-all duration-300",
                  "hover:border-white/[0.10] hover:bg-surface-overlay/70 hover:shadow-[var(--shadow-premium-card)] hover:-translate-y-[1px]",
                )}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" aria-hidden />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6875rem] font-semibold tracking-[0.14em] text-accent">{p.step}</span>
                    <span className="inline-flex size-8 items-center justify-center rounded-[0.65rem] bg-accent-subtle text-accent ring-1 ring-accent/12 ring-inset">
                      <Icon icon={p.icon} size="sm" aria-hidden strokeWidth={1.7} />
                    </span>
                  </div>
                  <div>
                    <h3 className="t-h4 text-foreground font-display font-semibold tracking-tight is-balanced">{p.title}</h3>
                    <p className="t-body-sm t-muted mt-2 leading-relaxed">{p.body}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/[0.05] pt-4">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-white/[0.05] bg-white/[0.025] px-2 py-0.5 text-[0.6875rem] font-mono text-foreground-subtle/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} animation="blur-in" className="lg:col-span-4 h-full">
          <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/[0.07] bg-surface-raised/80 p-7 sm:p-8 backdrop-blur-2xl shadow-[var(--shadow-premium-card)] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" aria-hidden />
            <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-[radial-gradient(closest-side,rgb(var(--token-accent)/0.11),transparent_70%)] blur-[0.5px]" />

            <div>
              <div className="flex items-center gap-2">
                <Badge variant="iris" size="sm">Active Admissions</Badge>
                <span className="t-caption font-mono text-[0.6875rem] tracking-wide text-foreground-subtle">Cohort 2026</span>
              </div>
              <h3 className="t-h3 text-foreground font-display font-semibold tracking-tight mt-3">Fall 2026 Immersion</h3>
              <p className="t-body-sm t-muted mt-2.5 leading-relaxed">
                Rolling applications reviewed by technical mentors. Two technical rounds — system design and practical engineering.
              </p>
              <dl className="t-num-tabular mt-6 grid grid-cols-3 gap-3 border-y border-white/[0.06] py-4">
                <Pair label="Program" value="4–12 Wks" />
                <Pair label="Mentorship" value="1:1 Staff" />
                <Pair label="Outcome" value="Verified" />
              </dl>
            </div>
            <div className="mt-8 flex flex-col gap-2.5">
              <Button asChild variant="primary" size="lg" fullWidth>
                <Link href="/careers/internship">
                  Apply for Apprenticeship
                  <Icon icon={ArrowUpRight} aria-hidden size="sm" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" fullWidth className="text-foreground-muted hover:text-foreground">
                <Link href="/verify">Verify certificate →</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-foreground-subtle font-mono text-[0.6875rem] uppercase tracking-wider">{label}</dt>
      <dd className="font-display text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
