"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Plus } from "lucide-react";

interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  viewsCount: number;
  readTimeMinutes: number;
  publishedAt: string;
  metaTitle: string;
}

const mockPosts: BlogPostRecord[] = [
  {
    id: "BLOG-1",
    title: "Architecting High-Throughput Micro-Frontends in 2026",
    slug: "architecting-high-throughput-micro-frontends-2026",
    status: "PUBLISHED",
    viewsCount: 4280,
    readTimeMinutes: 5,
    publishedAt: "2026-07-01",
    metaTitle: "High-Throughput Micro-Frontends Guide | Zalvy",
  },
  {
    id: "BLOG-2",
    title: "The Future of AI-Powered Talent Verification",
    slug: "future-ai-powered-talent-verification",
    status: "PUBLISHED",
    viewsCount: 2910,
    readTimeMinutes: 4,
    publishedAt: "2026-07-12",
    metaTitle: "AI Talent Verification Platform | Zalvy Engineering",
  },
  {
    id: "BLOG-3",
    title: "Optimizing PostgreSQL JSONB Queries for Enterprise Audit Logs",
    slug: "optimizing-postgresql-jsonb-audit-logs",
    status: "DRAFT",
    viewsCount: 0,
    readTimeMinutes: 8,
    publishedAt: "—",
    metaTitle: "PostgreSQL JSONB Audit Logs Optimization Guide",
  },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostRecord[]>(mockPosts);
  const [showEditorModal, setShowEditorModal] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");

  const handleSavePost = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const newPost: BlogPostRecord = {
      id: `BLOG-${String(posts.length + 1)}`,
      title,
      slug,
      status: "DRAFT",
      viewsCount: 0,
      readTimeMinutes: Math.max(2, Math.ceil(content.length / 500)),
      publishedAt: "Draft",
      metaTitle: metaTitle || title,
    };

    setPosts([newPost, ...posts]);
    setShowEditorModal(false);
    setTitle("");
    setContent("");
    setMetaTitle("");
  };

  const togglePublish = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          const nextStatus: "PUBLISHED" | "DRAFT" =
            p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
          const pubDate: string = new Date().toISOString().split("T")[0] ?? "2026-07-23";
          return {
            ...p,
            status: nextStatus,
            publishedAt: pubDate,
          };
        }
        return p;
      }),
    );
  };

  const columns: Column<BlogPostRecord>[] = [
    {
      header: "Title & Slug",
      accessorKey: "title",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="block font-bold text-slate-900 dark:text-white">{row.title}</span>
          <span className="font-mono text-[11px] text-slate-400">/{row.slug}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            row.status === "PUBLISHED"
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              : "border border-amber-500/20 bg-amber-500/10 text-amber-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Views",
      accessorKey: "viewsCount",
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-slate-900 dark:text-white">
          {row.viewsCount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Read Time",
      accessorKey: "readTimeMinutes",
      cell: (row) => (
        <span className="text-slate-500 dark:text-slate-400">{row.readTimeMinutes} mins</span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <button
          onClick={() => {
            togglePublish(row.id);
          }}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
            row.status === "PUBLISHED"
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800"
              : "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500"
          }`}
        >
          {row.status === "PUBLISHED" ? "Unpublish" : "Publish Article"}
        </button>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Blog CMS & Editorial Studio
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage editorial posts, SEO metadata, reading times, and publication states.
          </p>
        </div>

        <button
          onClick={() => {
            setShowEditorModal(true);
          }}
          className="flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>New Article Draft</span>
        </button>
      </div>

      <DataTable
        data={posts}
        columns={columns}
        searchPlaceholder="Search post titles or slugs..."
        exportFilename="zalvy-blog-posts"
      />

      {showEditorModal && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSavePost}
            className="w-full max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Editorial Article
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Article Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="e.g. Scaling Real-Time WebSocket Infrastructure"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Content Body (Markdown Supported)
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  placeholder="Write editorial content here..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">SEO Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => {
                    setMetaTitle(e.target.value);
                  }}
                  placeholder="SEO optimized browser tab title"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowEditorModal(false);
                }}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20"
              >
                Save Draft
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
