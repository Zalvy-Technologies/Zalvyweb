"use client";

import { useState } from "react";
import { Settings, Shield, AlertTriangle, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("Zalvy Platform");
  const [supportEmail, setSupportEmail] = useState("support@zalvy.io");
  const [rateLimit, setRateLimit] = useState(100);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSaveSettings = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    setTimeout(() => {
      setSavedBanner(false);
    }, 3000);
  };

  return (
    <div className="animate-in fade-in max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Platform Global Settings
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Configure general metadata, rate limiting, security parameters, and maintenance modes.
        </p>
      </div>

      {savedBanner && (
        <div className="animate-in fade-in flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Global platform configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* General Settings Card */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Settings className="h-4 w-4 text-indigo-500" />
            <span>General Platform Parameters</span>
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-500">Platform Brand Name</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => {
                  setPlatformName(e.target.value);
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500">Official Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => {
                  setSupportEmail(e.target.value);
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Security & Rate Limiting Card */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Shield className="h-4 w-4 text-indigo-500" />
            <span>Security & API Threshold Controls</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Global API Rate Limit (Requests per minute per IP)</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {rateLimit} req/min
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={rateLimit}
                onChange={(e) => {
                  setRateLimit(Number(e.target.value));
                }}
                className="mt-2 w-full cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode Card */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Scheduled Maintenance Mode</span>
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                When active, non-admin users will see a maintenance notice page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMaintenanceMode(!maintenanceMode);
              }}
              className={`relative h-6 w-12 rounded-full p-0.5 transition-colors ${
                maintenanceMode ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transition-transform ${
                  maintenanceMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
          >
            <Save className="h-4 w-4" />
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
