import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * ZALVY sitemap — submitted to search engines via `https://zalvy.com/sitemap.xml`.
 *
 * Routes listed here cover the marketing surface; product surfaces behind auth
 * are intentionally omitted (or marked `noindex` in those route segments).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/platform", priority: 0.9, changeFrequency: "monthly" },
    { path: "/platform/agents", priority: 0.8, changeFrequency: "monthly" },
    { path: "/platform/automation", priority: 0.8, changeFrequency: "monthly" },
    { path: "/platform/chatbots", priority: 0.8, changeFrequency: "monthly" },
    { path: "/studio", priority: 0.7, changeFrequency: "weekly" },
    { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
    { path: "/careers/internship", priority: 0.8, changeFrequency: "weekly" },
    { path: "/careers/bench", priority: 0.5, changeFrequency: "monthly" },
    { path: "/studio/work", priority: 0.7, changeFrequency: "weekly" },
    { path: "/studio/work/helios-agent-routing", priority: 0.6, changeFrequency: "monthly" },
    { path: "/studio/work/quanta-research-ops", priority: 0.6, changeFrequency: "monthly" },
    { path: "/studio/work/aperture-inference", priority: 0.6, changeFrequency: "monthly" },
    { path: "/studio/process", priority: 0.5, changeFrequency: "monthly" },
    { path: "/studio/notes", priority: 0.6, changeFrequency: "weekly" },
    { path: "/studio/oss", priority: 0.5, changeFrequency: "monthly" },
    { path: "/changelog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/search", priority: 0.3, changeFrequency: "monthly" },
    { path: "/login", priority: 0.3, changeFrequency: "monthly" },
    { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/dpa", priority: 0.3, changeFrequency: "yearly" },
    { path: "/security", priority: 0.5, changeFrequency: "monthly" },
  ];

  return entries.map((entry) => ({
    url: `${site.url}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
