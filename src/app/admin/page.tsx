"use client";

import { useState } from "react";
import { Users, FileText, Award, DollarSign, ArrowUpRight, Activity } from "lucide-react";
import { AreaChart, BarChart, DonutChart } from "@/components/admin/charts";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const areaData = [
    { label: "Week 1", value: 420, secondaryValue: 280 },
    { label: "Week 2", value: 680, secondaryValue: 410 },
    { label: "Week 3", value: 950, secondaryValue: 620 },
    { label: "Week 4", value: 1240, secondaryValue: 890 },
    { label: "Week 5", value: 1580, secondaryValue: 1150 },
    { label: "Week 6", value: 1920, secondaryValue: 1420 },
  ];

  const barData = [
    { label: "Jan", value: 340 },
    { label: "Feb", value: 520 },
    { label: "Mar", value: 780 },
    { label: "Apr", value: 960 },
    { label: "May", value: 1200 },
    { label: "Jun", value: 1450 },
  ];

  const donutData = [
    { label: "Accepted", value: 420, color: "rgb(var(--token-success))" },
    { label: "Interviewing", value: 310, color: "rgb(var(--token-iris))" },
    { label: "Under Review", value: 580, color: "rgb(var(--token-amber))" },
    { label: "Rejected", value: 240, color: "rgb(var(--token-danger))" },
  ];

  return (
    <div className="animate-in fade-in space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="t-h1 text-foreground">
            Analytics & Executive Overview
          </h1>
          <p className="mt-1 t-caption t-subtle">
            Real-time platform metrics, application throughput, and growth trends.
          </p>
        </div>

        <div className="flex items-center self-start rounded-2xl border border-border bg-surface/50 p-1 shadow-sm backdrop-blur-sm">
          {(["7d", "30d", "90d", "1y"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTimeframe(t);
              }}
              className={`rounded-xl px-3 py-1.5 t-caption font-semibold uppercase transition-all ${
                timeframe === t
                  ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                  : "text-foreground-muted hover:text-foreground dark:text-foreground-subtle dark:hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard variant="raised" intensity="medium" className="p-5 transition-all hover:border-accent/30">
          <div className="flex items-center justify-between">
            <span className="t-overline t-subtle">Total Users</span>
            <div className="rounded-xl bg-accent-subtle p-2 text-accent">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="t-h4 text-foreground t-num-tabular">2,482</span>
            <div className="mt-1 flex items-center gap-1 t-caption font-semibold text-success">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+18.4% vs last period</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="raised" intensity="medium" className="p-5 transition-all hover:border-accent/30">
          <div className="flex items-center justify-between">
            <span className="t-overline t-subtle">Applications</span>
            <div className="rounded-xl bg-[rgb(var(--token-accent)/0.1)] p-2 text-accent">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="t-h4 text-foreground t-num-tabular">1,550</span>
            <div className="mt-1 flex items-center gap-1 t-caption font-semibold text-success">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+24.1% application throughput</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="raised" intensity="medium" className="p-5 transition-all hover:border-accent/30">
          <div className="flex items-center justify-between">
            <span className="t-overline t-subtle">Issued Credentials</span>
            <div className="rounded-xl bg-[rgb(var(--token-amber)/0.1)] p-2 text-amber">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="t-h4 text-foreground t-num-tabular">840</span>
            <div className="mt-1 flex items-center gap-1 t-caption font-semibold text-success">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>100% verified hashes</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="raised" intensity="medium" className="p-5 transition-all hover:border-accent/30">
          <div className="flex items-center justify-between">
            <span className="t-overline t-subtle">Total Stipends</span>
            <div className="rounded-xl bg-[rgb(var(--token-success)/0.1)] p-2 text-success">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="t-h4 text-foreground t-num-tabular">$142,500</span>
            <div className="mt-1 flex items-center gap-1 t-caption font-semibold text-success">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+12.8% payout growth</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard variant="raised" intensity="medium" className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="t-h5 text-foreground">Application Volume Over Time</h3>
              <p className="t-caption t-subtle">
                Primary line (Iris): Total Submitted vs Secondary line (Accent): Review Completed
              </p>
            </div>
            <div className="flex items-center gap-3 t-caption">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded" style={{ background: "rgb(var(--token-iris))" }} />
                <span className="font-medium t-muted">Submitted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded" style={{ background: "rgb(var(--token-accent))" }} />
                <span className="font-medium t-muted">Reviewed</span>
              </div>
            </div>
          </div>
          <AreaChart data={areaData} height={240} />
        </GlassCard>

        <GlassCard variant="raised" intensity="medium" className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="t-h5 text-foreground">Pipeline Status Breakdown</h3>
            <p className="t-caption t-subtle">
              Current status distribution across active applications
            </p>
          </div>
          <DonutChart data={donutData} centerValue="1,550" centerLabel="Total Apps" />
          <Link
            href="/admin/applications"
            className="block border-t border-border pt-2 text-center t-caption font-semibold text-accent hover:underline"
          >
            View Application Pipeline →
          </Link>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard variant="raised" intensity="medium" className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="t-h5 text-foreground">Monthly User Acquisition</h3>
              <p className="t-caption t-subtle">
                New candidate and company member signups per month
              </p>
            </div>
            <span className="rounded-full bg-accent-subtle px-2.5 py-1 t-caption font-bold text-accent">
              +1,450 YTD
            </span>
          </div>
          <BarChart data={barData} height={200} />
        </GlassCard>

        <GlassCard variant="raised" intensity="medium" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 t-h5 text-foreground">
              <Activity className="h-4 w-4 text-accent" />
              <span>Live System Events</span>
            </h3>
            <Link
              href="/admin/activity"
              className="t-caption font-semibold text-accent hover:underline"
            >
              All Events
            </Link>
          </div>

          <div className="space-y-3 t-caption">
            <div className="flex items-start gap-3 rounded-xl bg-surface/50 p-2.5 backdrop-blur-sm">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-success" />
              <div>
                <p className="font-semibold text-foreground">Company Verified</p>
                <p className="text-[11px] t-muted">DeepMind Tech tax ID verified</p>
                <span className="text-[10px] t-subtle">3 mins ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-surface/50 p-2.5 backdrop-blur-sm">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-iris" />
              <div>
                <p className="font-semibold text-foreground">Certificate Issued</p>
                <p className="text-[11px] t-muted">Hash #0x9a8f2c generated</p>
                <span className="text-[10px] t-subtle">14 mins ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-surface/50 p-2.5 backdrop-blur-sm">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber" />
              <div>
                <p className="font-semibold text-foreground">Security Rule Alert</p>
                <p className="text-[11px] t-muted">Rate limit triggered on /api/verify</p>
                <span className="text-[10px] t-subtle">42 mins ago</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}