"use client";

import { useState } from "react";
import { 
  Zap, 
  BrainCircuit, 
  Scale, 
  Workflow, 
  CheckCircle2, 
  Database, 
  BarChart3, 
  MessageSquare, 
  Layers, 
  Mail, 
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

interface AutomationScenario {
  id: string;
  name: string;
  triggerSource: string;
  triggerEvent: string;
  understanding: string;
  decision: string;
  actions: { system: string; action: string; icon: typeof Database }[];
  resultSummary: string;
  timeSaved: string;
}

const SCENARIOS: [AutomationScenario, ...AutomationScenario[]] = [
  {
    id: "invoice-reconciliation",
    name: "Multi-Currency Vendor Invoice Matching",
    triggerSource: "SAP S/4HANA & Email Gateway",
    triggerEvent: "Unstructured vendor PDF invoice received with $42,500 mismatch against PO #9914",
    understanding: "Extracted line-item taxes, currency conversion rates, and matched against purchase order ledger in under 80ms.",
    decision: "Identified legitimate 2% early-payment freight discount. Applied automatic approval policy under Tier-2 financial thresholds.",
    actions: [
      { system: "SAP ERP", action: "Matched PO & Cleared Voucher", icon: Database },
      { system: "Salesforce Financials", action: "Updated Vendor Ledger", icon: BarChart3 },
      { system: "Slack #finance-ops", action: "Dispatched Audit Summary", icon: MessageSquare },
    ],
    resultSummary: "Zero human intervention required. Reconciled, audited, and scheduled for discount payout in 1.4 seconds.",
    timeSaved: "3.5 human hours saved per ticket",
  },
  {
    id: "customer-churn",
    name: "Autonomous High-Value Account Retention",
    triggerSource: "PostgreSQL Event Bus & Stripe",
    triggerEvent: "Enterprise customer usage dropped by 45% over 7 days + failed renewal card attempt",
    understanding: "Correlated API usage telemetry, recent support tickets, and identified expired virtual corporate card.",
    decision: "Categorized as technical billing friction, not customer churn intent. Triggered white-glove renewal escalation protocol.",
    actions: [
      { system: "PostgreSQL Lakehouse", action: "Flagged Usage Baseline", icon: Layers },
      { system: "HubSpot CRM", action: "Assigned Executive Account Rep", icon: Mail },
      { system: "Stripe Billing Engine", action: "Deferred Grace Period 72h", icon: BarChart3 },
    ],
    resultSummary: "Saved $120k ARR contract automatically within 3 minutes of usage drop detection.",
    timeSaved: "100% automated SLA guard",
  },
  {
    id: "incident-triage",
    name: "Production Cloud Outage Auto-Remediation",
    triggerSource: "Datadog / AWS CloudWatch Alarm",
    triggerEvent: "Database read replica replication lag exceeded 4,500ms threshold in eu-central-1",
    understanding: "Identified slow query runaway on unindexed reporting view blocking master replication thread.",
    decision: "Triggered non-blocking query termination, provisioned emergency read replica, and notified on-call engineering lead.",
    actions: [
      { system: "AWS Cloud Infrastructure", action: "Terminated Runaway Thread", icon: Layers },
      { system: "PostgreSQL Primary", action: "Restored Replication Pool", icon: Database },
      { system: "PagerDuty & Slack", action: "Posted Post-Mortem Trace", icon: MessageSquare },
    ],
    resultSummary: "Mean time to resolution (MTTR) reduced from 28 minutes to 4.2 seconds.",
    timeSaved: "Zero customer-facing downtime",
  },
];

const DEFAULT_SCENARIO: AutomationScenario = SCENARIOS[0];

export function AutomationFlowSection() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("invoice-reconciliation");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) ?? DEFAULT_SCENARIO;

  const handleSimulate = () => {
    setIsSimulating(true);
    setActiveStep(0);

    const timer1 = setTimeout(() => { setActiveStep(1); }, 400);
    const timer2 = setTimeout(() => { setActiveStep(2); }, 900);
    const timer3 = setTimeout(() => { setActiveStep(3); }, 1400);
    const timer4 = setTimeout(() => {
      setActiveStep(4);
      setIsSimulating(false);
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const steps = [
    {
      num: "01",
      name: "TRIGGER",
      icon: Zap,
      title: "Event Ingestion",
      desc: scenario.triggerEvent,
      meta: scenario.triggerSource,
    },
    {
      num: "02",
      name: "UNDERSTAND",
      icon: BrainCircuit,
      title: "Semantic Analysis",
      desc: scenario.understanding,
      meta: "Neural Parser · Vector Match",
    },
    {
      num: "03",
      name: "DECIDE",
      icon: Scale,
      title: "Policy & Logic Gate",
      desc: scenario.decision,
      meta: "Rule Consensus · SOC2 Gated",
    },
    {
      num: "04",
      name: "ACT",
      icon: Workflow,
      title: "Multi-Connector Dispatch",
      desc: `${String(scenario.actions.length)} enterprise systems updated simultaneously`,
      meta: "Idempotent Replayable API",
    },
    {
      num: "05",
      name: "RESULT",
      icon: CheckCircle2,
      title: "Verified Resolution",
      desc: scenario.resultSummary,
      meta: scenario.timeSaved,
    },
  ];

  return (
    <Section
      id="automation-pipeline"
      eyebrow="Business Automation Engine"
      title="Autonomous workflows that replace thousands of manual hours."
      description="Connect your legacy ERPs, CRMs, cloud databases, and communication channels. ZALVY state machines observe events, reason with policy guardrails, and execute deterministic actions with zero errors."
      rhythm="spacious"
      align="left"
    >
      {/* Scenario Selector & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => {
            const isSelected = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveScenarioId(s.id);
                  setActiveStep(0);
                }}
                className={`rounded-xl border px-3.5 py-2 text-[0.8125rem] font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-[rgb(var(--token-accent)/0.5)] bg-white/[0.08] text-foreground shadow-[0_0_20px_rgb(var(--token-accent)/0.12)]"
                    : "border-white/[0.06] bg-white/[0.02] text-foreground-muted hover:border-white/[0.12] hover:text-foreground"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleSimulate}
          disabled={isSimulating}
          variant="primary"
          size="sm"
          className="self-start sm:self-auto gap-2"
        >
          <RefreshCw size={14} className={isSimulating ? "animate-spin" : ""} />
          {isSimulating ? "Simulating Execution..." : "Run Live Simulation"}
        </Button>
      </div>

      {/* 5-Step Continuous Workflow Pipeline Visualizer */}
      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[rgb(var(--token-surface-raised)/0.7)] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isStepActive = isSimulating ? activeStep === idx : true;
            const isCompleted = isSimulating ? activeStep >= idx : true;

            return (
              <div
                key={step.num}
                className={`relative flex flex-col p-4 rounded-xl border transition-all duration-300 ${
                  isStepActive
                    ? "border-[rgb(var(--token-accent)/0.4)] bg-white/[0.06] shadow-[0_0_24px_rgb(var(--token-accent)/0.1)]"
                    : isCompleted
                      ? "border-white/[0.08] bg-white/[0.02]"
                      : "border-white/[0.04] bg-transparent opacity-40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[0.6875rem] font-bold text-[rgb(var(--token-accent))]">
                    {step.num} · {step.name}
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground">
                    <Icon size={14} />
                  </span>
                </div>

                <h4 className="font-sans text-[0.875rem] font-semibold text-foreground">
                  {step.title}
                </h4>
                
                <p className="mt-1.5 text-[0.75rem] text-foreground-muted leading-relaxed flex-1">
                  {step.desc}
                </p>

                <div className="mt-3 pt-2 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="font-mono text-[0.625rem] text-[rgb(var(--token-accent))] truncate">
                    {step.meta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Connectors Active in this Scenario */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.75rem] text-foreground-subtle uppercase tracking-wider">
              Target Connectors:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {scenario.actions.map((act, i) => {
                const ActionIcon = act.icon;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[0.75rem] font-medium text-foreground"
                  >
                    <ActionIcon size={13} className="text-[rgb(var(--token-accent))]" />
                    <span>{act.system}</span>
                    <span className="text-foreground-subtle font-mono text-[0.6875rem]">({act.action})</span>
                  </span>
                );
              })}
            </div>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/automation">
              Explore 48+ Native Connectors
              <ArrowRight size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
