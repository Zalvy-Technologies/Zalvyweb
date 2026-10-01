import { Container } from "@/components/ui/container";
import {
  Bot,
  CircuitBoard,
  Code2,
  GraduationCap,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Icon } from "@/components/ui/icon";
import type { LucideIcon } from "lucide-react";

interface Capability {
  label: string;
  note: string;
  metric: string;
  icon: LucideIcon;
}

const CAPABILITIES: Capability[] = [
  { label: "AI Agents", note: "Autonomous decision systems", metric: "99.8% Deterministic", icon: Bot },
  { label: "Automation", note: "Enterprise workflow engines", metric: "48+ Connectors", icon: Workflow },
  { label: "AI Chatbots", note: "Grounded conversational AI", metric: "Zero Drift", icon: Sparkles },
  { label: "Custom AI", note: "Bespoke neural systems", metric: "Air-Gapped", icon: Code2 },
  { label: "Dev Tools", note: "SDKs & observability", metric: "OTel Native", icon: CircuitBoard },
  { label: "Future Talent", note: "4–12-week apprenticeship", metric: "12 Seats/Cohort", icon: GraduationCap },
];

export function TrustBar() {
  return (
    <section
      aria-label="ZALVY capabilities"
      className="relative border-y border-white/[0.06] bg-[rgb(var(--token-surface)/0.4)] backdrop-blur-xl"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      <Container className="py-10 md:py-12 lg:py-14">
        <div className="grid grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="col-span-12 lg:col-span-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-[rgb(var(--token-accent)/0.6)]" aria-hidden />
              <p className="t-overline t-subtle tracking-[0.18em] text-[0.6875rem]">What we build</p>
            </div>
            <h2 className="t-h4 text-foreground mt-3 max-w-[28rem] leading-[1.25] tracking-[-0.02em] font-[600]">
              Six surfaces of capability, one engineering discipline.
            </h2>
            <p className="t-body-sm t-muted mt-3 max-w-[26rem] leading-relaxed">
              From autonomous agent swarms to intensive 1:1 engineering apprenticeships — every system is built with zero-compromise production rigor.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <ul
              aria-label="Core capabilities"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {CAPABILITIES.map((cap) => (
                <li
                  key={cap.label}
                  className="group flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-surface-raised/40 p-4.5 backdrop-blur transition-all duration-300 hover:border-[rgb(var(--token-accent)/0.3)] hover:bg-surface-overlay/60 hover:shadow-[0_8px_24px_rgb(0_0_0/0.25)] hover:-translate-y-[2px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-accent-subtle text-accent ring-accent/15 inline-flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform duration-300 group-hover:scale-105">
                      <Icon icon={cap.icon} size="sm" aria-hidden strokeWidth={1.75} />
                    </span>
                    <span className="font-mono text-[0.625rem] text-[rgb(var(--token-accent))] bg-[rgb(var(--token-accent)/0.08)] px-2 py-0.5 rounded font-medium">
                      {cap.metric}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 mt-3">
                    <span className="font-display text-[0.9375rem] font-[600] tracking-tight text-foreground">
                      {cap.label}
                    </span>
                    <span className="text-[0.75rem] text-foreground-subtle leading-snug">
                      {cap.note}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}