"use client";

import { useState } from "react";
import { Upload, X, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import type { ResumeAnalysis } from "@/types/ai";

interface ResumeUploadProps {
  onClose: () => void;
}

export function ResumeUploadModal({ onClose }: ResumeUploadProps) {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      if (typeof text === "string") {
        setResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        analysis?: ResumeAnalysis;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.analysis) {
        throw new Error(data.error ?? "Failed to evaluate resume.");
      }
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 border-t border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <FileText className="h-4 w-4 text-indigo-400" /> Resume ATS Analyzer
        </h4>
        <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {!analysis ? (
        <div className="space-y-3">
          <textarea
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
            }}
            placeholder="Paste your raw resume text here or upload a .txt / markdown file..."
            rows={4}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
          />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400">
              <Upload className="h-3.5 w-3.5" /> Upload File
              <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={() => void handleAnalyze()}
              disabled={!resumeText.trim() || loading}
              className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Evaluate ATS Score"}
            </button>
          </div>

          {error && (
            <p className="flex items-center gap-1 text-[11px] text-rose-400">
              <AlertCircle className="h-3 w-3" /> {error}
            </p>
          )}
        </div>
      ) : (
        <div className="custom-scrollbar max-h-80 space-y-3 overflow-y-auto pr-1 text-xs">
          <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/60 p-2.5">
            <div>
              <span className="text-[11px] text-slate-400">Overall ATS Score</span>
              <p className="text-xl font-bold text-indigo-400">{analysis.overallScore} / 100</p>
            </div>
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>

          <p className="leading-relaxed text-slate-300">{analysis.summary}</p>

          <div className="space-y-1">
            <h5 className="font-semibold text-white">Strengths:</h5>
            <ul className="list-inside list-disc space-y-0.5 text-slate-300">
              {analysis.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-1">
            <h5 className="font-semibold text-white">Recommended Improvements:</h5>
            <ul className="list-inside list-disc space-y-0.5 text-rose-300">
              {analysis.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => {
              setAnalysis(null);
            }}
            className="w-full py-1.5 text-center text-xs text-indigo-400 underline hover:text-indigo-300"
          >
            Analyze another resume
          </button>
        </div>
      )}
    </div>
  );
}
