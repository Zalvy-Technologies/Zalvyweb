"use client";

import { useState } from "react";
import { ExternalLink, Star, Code2 } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  userName: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  isFeatured: boolean;
  status: "APPROVED" | "PENDING" | "FLAGGED";
}

const mockProjects: ProjectItem[] = [
  {
    id: "PRJ-1",
    title: "Autonomous Neural Agent Framework",
    userName: "Marcus Vance",
    description:
      "High-throughput agent orchestration engine built with TypeScript, Rust, and WebSockets.",
    techStack: ["Next.js", "Rust", "WebSockets", "Tailwind"],
    githubUrl: "https://github.com/marcusv/neural-agent",
    demoUrl: "https://neural-agent.dev",
    isFeatured: true,
    status: "APPROVED",
  },
  {
    id: "PRJ-2",
    title: "DeFi Portfolio Analytics Engine",
    userName: "Elena Rostova",
    description:
      "Real-time order book analytics and multi-chain swap route optimization dashboard.",
    techStack: ["React", "Python", "FastAPI", "PostgreSQL"],
    githubUrl: "https://github.com/elena-r/defi-analytics",
    demoUrl: "https://defi-analytics.io",
    isFeatured: false,
    status: "APPROVED",
  },
  {
    id: "PRJ-3",
    title: "Generative UI Component Copilot",
    userName: "Aisha Patel",
    description: "Figma-to-Code compiler using fine-tuned vision models and glassmorphic styling.",
    techStack: ["TypeScript", "PyTorch", "TailwindCSS"],
    githubUrl: "https://github.com/aisha-p/gen-ui-copilot",
    demoUrl: "https://gen-ui.design",
    isFeatured: true,
    status: "PENDING",
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects);

  const toggleFeatured = (id: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p)));
  };

  const updateStatus = (id: string, status: ProjectItem["status"]) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Showcase Projects Moderation
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Review student portfolio projects, feature highlight entries, and verify repository URLs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((prj) => (
          <div
            key={prj.id}
            className={`flex flex-col justify-between space-y-4 rounded-2xl border bg-white p-5 shadow-sm transition-all dark:bg-slate-900 ${
              prj.isFeatured
                ? "border-amber-500/40 ring-1 ring-amber-500/20"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">{prj.userName}</span>
                <button
                  onClick={() => {
                    toggleFeatured(prj.id);
                  }}
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
                    prj.isFeatured
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  <Star
                    className={`h-3 w-3 ${prj.isFeatured ? "fill-amber-400 text-amber-400" : ""}`}
                  />
                  <span>{prj.isFeatured ? "Featured" : "Standard"}</span>
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">{prj.title}</h3>
              <p className="line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {prj.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {prj.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <a
                    href={prj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Code2 className="h-4 w-4" />
                    <span>Repo</span>
                  </a>
                  <a
                    href={prj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-indigo-500"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Demo</span>
                  </a>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    prj.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : prj.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {prj.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateStatus(prj.id, "APPROVED");
                  }}
                  className="flex-1 rounded-xl bg-emerald-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    updateStatus(prj.id, "FLAGGED");
                  }}
                  className="flex-1 rounded-xl bg-slate-100 py-1.5 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-500/10 dark:bg-slate-800"
                >
                  Flag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
