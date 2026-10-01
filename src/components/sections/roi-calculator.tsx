"use client";

import { useState } from "react";
import { DollarSign, Clock, Users, Zap, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(15);
  const [weeklyManualHours, setWeeklyManualHours] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [automationPercent, setAutomationPercent] = useState(70);

  // Calculations
  const totalWeeklyManualHours = teamSize * weeklyManualHours;
  const annualManualCost = totalWeeklyManualHours * hourlyRate * 52;
  const hoursSavedAnnually = Math.round((totalWeeklyManualHours * 52) * (automationPercent / 100));
  const estimatedAnnualSavings = Math.round(annualManualCost * (automationPercent / 100));
  const estimatedZalvyCost = Math.round(estimatedAnnualSavings * 0.18); // Zalvy ROI ~ 5.5x
  const netSavings = estimatedAnnualSavings - estimatedZalvyCost;
  const roiMultiplier = (netSavings / estimatedZalvyCost).toFixed(1);

  return (
    <GlassCard variant="raised" intensity="medium" className="p-6 md:p-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        {/* Left Inputs Controls */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase mb-1">
              <TrendingUp className="h-4 w-4" />
              <span>Interactive ROI & Efficiency Estimator</span>
            </div>
            <h3 className="t-h2 text-foreground">
              Calculate Enterprise AI Value
            </h3>
            <p className="t-body-sm text-foreground-muted mt-1">
              Estimate team time reclaimed and cost reduction through ZALVY autonomous agents and business process automation.
            </p>
          </div>

          {/* Slider 1: Team Size */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground-muted flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-foreground-subtle" /> Knowledge Workers / Engineers:
              </span>
              <span className="text-foreground font-mono">{teamSize} team members</span>
            </div>
            <input
              type="range"
              min={2}
              max={200}
              value={teamSize}
              onChange={(e) => {
                setTeamSize(Number(e.target.value));
              }}
              className="w-full accent-accent h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Manual Hours / Week */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground-muted flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-foreground-subtle" /> Manual Repetitive Hours / Person / Wk:
              </span>
              <span className="text-foreground font-mono">{weeklyManualHours} hrs/week</span>
            </div>
            <input
              type="range"
              min={5}
              max={35}
              value={weeklyManualHours}
              onChange={(e) => {
                setWeeklyManualHours(Number(e.target.value));
              }}
              className="w-full accent-accent h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 3: Hourly Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground-muted flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-foreground-subtle" /> Blended Hourly Cost ($/hr):
              </span>
              <span className="text-foreground font-mono">${hourlyRate}/hr</span>
            </div>
            <input
              type="range"
              min={30}
              max={250}
              step={5}
              value={hourlyRate}
              onChange={(e) => {
                setHourlyRate(Number(e.target.value));
              }}
              className="w-full accent-accent h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 4: Target Automation % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground-muted flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-foreground-subtle" /> Target AI Automation Level:
              </span>
              <span className="text-accent font-mono">{automationPercent}% automated</span>
            </div>
            <input
              type="range"
              min={30}
              max={95}
              step={5}
              value={automationPercent}
              onChange={(e) => {
                setAutomationPercent(Number(e.target.value));
              }}
              className="w-full accent-accent h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output ROI Metrics Box */}
        <div className="w-full lg:w-1/2 rounded-2xl border border-border bg-surface p-6 md:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">

          <div>
            <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-widest block mb-2">
              PROJECTED ANNUAL FINANCIAL IMPACT
            </span>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-mono">
              ${netSavings.toLocaleString()}
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Net annual savings after ZALVY enterprise platform deployment
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <span className="text-overline text-foreground-subtle uppercase block text-[10px]">Hours Saved Annually</span>
              <span className="t-h3 text-accent font-mono">{hoursSavedAnnually.toLocaleString()} hrs</span>
            </div>

            <div>
              <span className="text-overline text-foreground-subtle uppercase block text-[10px]">Projected ROI Multiplier</span>
              <span className="t-h3 text-success font-mono">{roiMultiplier}x ROI</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-foreground-subtle">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>SOC2 Compliant Architecture</span>
            </div>

            <a
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-black font-semibold text-xs transition-all hover:opacity-90 shadow-md shadow-accent/20"
            >
              <span>Request Architecture Proposal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
