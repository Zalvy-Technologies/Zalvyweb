import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { 
  Layers, 
  ArrowRight, 
  Database, 
  MessageSquare, 
  FileSpreadsheet, 
  BarChart,
  ShieldCheck,
  Zap,
  RotateCcw,
  CheckCircle2,
  Workflow
} from "lucide-react";
import { RoiCalculator } from "@/components/sections/roi-calculator";
import { AutomationFlowSection } from "@/components/sections/automation-flow";

export const metadata: Metadata = {
  title: "Autonomous Enterprise Business Automation — ZALVY",
  description: "Connect ERPs, CRMs, cloud data lakes, and webhooks with ZALVY's self-healing autonomous automation engine. 99.9% error-free execution with per-step telemetry.",
  alternates: { canonical: "/automation" },
};

const CONNECTORS = [
  { name: "SAP S/4HANA & ERP", category: "Enterprise Resource Planning", icon: Database, metric: "Sub-50ms sync" },
  { name: "Salesforce & Hubspot", category: "Customer Relationship Management", icon: BarChart, metric: "Bi-directional" },
  { name: "PostgreSQL & Snowflake", category: "Data Warehouses & Lakes", icon: Layers, metric: "CDC stream" },
  { name: "Slack & Microsoft Teams", category: "Incident Alerting & Human-in-the-Loop", icon: MessageSquare, metric: "Real-time" },
  { name: "Stripe & Financial Gateways", category: "Billing & Settlement Pipelines", icon: Zap, metric: "SOC2 audited" },
  { name: "Excel, CSV & Google Sheets", category: "Multi-Format Ingestion", icon: FileSpreadsheet, metric: "Auto-parse" },
];

const ARCHITECTURAL_PILLARS = [
  {
    icon: RotateCcw,
    title: "Idempotent Replayable State Machines",
    description: "Every step is recorded as an immutable transition. If downstream vendor APIs fail or rate-limit, ZALVY gracefully retries with exponential backoff without duplicating state.",
  },
  {
    icon: ShieldCheck,
    title: "Air-Gapped Privacy & Policy Guardrails",
    description: "Zero data leaves your VPC boundaries without cryptographically signed authorization. Automatic PII anonymization occurs prior to any neural reasoning.",
  },
  {
    icon: Workflow,
    title: "Human-in-the-Loop Escalation",
    description: "High-value financial payouts or sensitive contract modifications pause automatically for slack-based one-click executive confirmation when confidence drops below threshold.",
  },
];

export default function AutomationPage() {
  return (
    <div className="pt-12 pb-20 space-y-20">
      <Container>
        {/* Header Hero */}
        <div className="grid grid-cols-12 gap-8 items-end border-b border-white/[0.06] pb-12">
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 self-start">
              <span className="h-px w-6 bg-[rgb(var(--token-accent)/0.6)]" aria-hidden />
              <Badge variant="iris" size="sm">Autonomous Automation Engine</Badge>
            </div>
            <h1 className="t-h1 text-foreground tracking-[-0.03em] leading-[1.02] is-balanced">
              Autonomous operations <span className="text-foreground-muted font-[400]">without brittle scripts.</span>
            </h1>
            <p className="t-body-lg t-muted max-w-[36rem] leading-relaxed">
              Connect legacy enterprise tools, data warehouses, and webhooks to self-healing neural state machines. Reclaim thousands of human hours each month with 99.9% error-free execution.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5 flex lg:justify-end">
            <Button asChild variant="primary" size="lg" className="w-full lg:w-auto">
              <Link href="/contact">
                Automate Your Operations
                <Icon icon={ArrowRight} size="sm" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        {/* Live Interactive Pipeline */}
        <div className="mt-14">
          <AutomationFlowSection />
        </div>

        {/* Architectural Pillars */}
        <div className="mt-20">
          <div className="max-w-2xl">
            <Badge variant="neutral" size="sm">Engineering Maturity</Badge>
            <h2 className="t-h2 text-foreground mt-3 tracking-tight">Built for failure modes other tools ignore.</h2>
            <p className="t-body t-muted mt-2">Enterprise automation must withstand database failovers, upstream API timeouts, and edge cases gracefully.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {ARCHITECTURAL_PILLARS.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <GlassCard key={idx} variant="raised" intensity="medium" className="p-7 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent ring-1 ring-accent/15 ring-inset">
                      <IconComp size={20} />
                    </span>
                    <h3 className="t-h4 text-foreground mt-5 tracking-tight">{p.title}</h3>
                    <p className="t-body-sm t-muted mt-2.5 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-[0.75rem] font-mono text-[rgb(var(--token-accent))]">
                    <CheckCircle2 size={13} />
                    <span>Verified in production</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Integration Connectors Grid */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <Badge variant="neutral" size="sm">Ecosystem</Badge>
              <h2 className="t-h2 text-foreground mt-2 tracking-tight">Native Enterprise Connectors</h2>
              <p className="t-body-sm t-muted mt-1">Pre-built zero-trust connectors with streaming OpenTelemetry telemetry.</p>
            </div>
            <span className="font-mono text-xs text-[rgb(var(--token-accent))] bg-[rgb(var(--token-accent)/0.08)] px-3 py-1.5 rounded-lg border border-[rgb(var(--token-accent)/0.2)]">
              48+ Supported Integrations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONNECTORS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <GlassCard key={idx} variant="raised" intensity="medium" className="p-6 flex items-start gap-4 hover:border-accent/40 transition-all">
                  <div className="h-11 w-11 rounded-xl bg-accent-subtle text-accent border border-accent/20 flex items-center justify-center shrink-0">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[0.9375rem] font-semibold text-foreground truncate">{item.name}</h3>
                    </div>
                    <p className="text-[0.75rem] text-foreground-subtle mt-0.5">{item.category}</p>
                    <span className="inline-block mt-2 font-mono text-[0.6875rem] text-[rgb(var(--token-accent))]">
                      ↳ {item.metric}
                    </span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Embedded ROI Calculator */}
        <div className="mt-20">
          <RoiCalculator />
        </div>
      </Container>
    </div>
  );
}
