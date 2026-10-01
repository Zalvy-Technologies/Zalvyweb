"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FileText, Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface ApplicationRecord {
  id: string;
  candidateName: string;
  candidateEmail: string;
  internshipTitle: string;
  companyName: string;
  status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEWING" | "ACCEPTED" | "REJECTED";
  appliedDate: string;
  coverLetter: string;
  resumeUrl: string;
}

const mockApplications: ApplicationRecord[] = [
  {
    id: "APP-901",
    candidateName: "Sarah Jenkins",
    candidateEmail: "sarah.j@gmail.com",
    internshipTitle: "AI Research Intern",
    companyName: "DeepMind Systems",
    status: "INTERVIEWING",
    appliedDate: "2026-07-20",
    coverLetter: "I am passionate about neural architecture search and large language models...",
    resumeUrl: "https://zalvy.io/resumes/sarah-j.pdf",
  },
  {
    id: "APP-902",
    candidateName: "Marcus Vance",
    candidateEmail: "marcus.v@outlook.com",
    internshipTitle: "Full-Stack Developer Intern",
    companyName: "Zalvy Cloud Labs",
    status: "ACCEPTED",
    appliedDate: "2026-07-18",
    coverLetter: "Ex-Next.js contributor with 3 years of React/TypeScript experience...",
    resumeUrl: "https://zalvy.io/resumes/marcus-v.pdf",
  },
  {
    id: "APP-903",
    candidateName: "Elena Rostova",
    candidateEmail: "elena.r@tech.org",
    internshipTitle: "Quant Systems Analyst",
    companyName: "Apex Capital Partners",
    status: "UNDER_REVIEW",
    appliedDate: "2026-07-22",
    coverLetter: "Strong background in Python, C++, and high-frequency order book analytics...",
    resumeUrl: "https://zalvy.io/resumes/elena-r.pdf",
  },
  {
    id: "APP-904",
    candidateName: "David Chen",
    candidateEmail: "david.chen@mit.edu",
    internshipTitle: "Machine Learning Engineering Intern",
    companyName: "Neural Corp",
    status: "SHORTLISTED",
    appliedDate: "2026-07-21",
    coverLetter: "Focused on transformer optimization and GPU kernel acceleration...",
    resumeUrl: "https://zalvy.io/resumes/david-c.pdf",
  },
  {
    id: "APP-905",
    candidateName: "Aisha Patel",
    candidateEmail: "aisha.p@stanford.edu",
    internshipTitle: "Product Design & UI/UX Intern",
    companyName: "Zalvy Studio",
    status: "APPLIED",
    appliedDate: "2026-07-23",
    coverLetter: "Creating human-centric design systems and glassmorphic micro-interactions...",
    resumeUrl: "https://zalvy.io/resumes/aisha-p.pdf",
  },
];

const statusVariants: Record<ApplicationRecord["status"], { variant: "accent" | "iris" | "success" | "warning" | "danger" | "neutral"; label: string }> = {
  ACCEPTED: { variant: "success", label: "ACCEPTED" },
  INTERVIEWING: { variant: "iris", label: "INTERVIEWING" },
  SHORTLISTED: { variant: "accent", label: "SHORTLISTED" },
  UNDER_REVIEW: { variant: "warning", label: "UNDER REVIEW" },
  REJECTED: { variant: "danger", label: "REJECTED" },
  APPLIED: { variant: "neutral", label: "APPLIED" },
};

export default function AdminApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  const columns: Column<ApplicationRecord>[] = [
    {
      header: "ID",
      accessorKey: "id",
      sortable: true,
      cell: (row) => <span className="font-mono font-semibold t-subtle">{row.id}</span>,
    },
    {
      header: "Candidate",
      accessorKey: "candidateName",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="block font-semibold text-foreground">{row.candidateName}</span>
          <span className="text-caption t-subtle">{row.candidateEmail}</span>
        </div>
      ),
    },
    {
      header: "Internship & Company",
      accessorKey: "internshipTitle",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="block font-semibold text-foreground">{row.internshipTitle}</span>
          <span className="text-caption font-medium text-accent">{row.companyName}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => {
        const { variant, label } = statusVariants[row.status];
        return <Badge variant={variant} size="sm">{label}</Badge>;
      },
    },
    {
      header: "Applied Date",
      accessorKey: "appliedDate",
      sortable: true,
      cell: (row) => <span className="t-caption t-muted">{row.appliedDate}</span>,
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant="secondary"
          size="sm"
          className="gap-1"
          onClick={() => {
            setSelectedApp(row);
          }}
        >
          <Icon icon={Eye} size="xs" />
          <span>Review</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="t-h2 text-foreground">Application Pipeline Management</h1>
          <p className="mt-1 t-caption t-muted">
            Review, filter, status update, and export candidate applications across all internship postings.
          </p>
        </div>
      </div>

      <DataTable
        data={mockApplications}
        columns={columns}
        searchPlaceholder="Search candidates, companies, or internship titles..."
        exportFilename="zalvy-applications"
      />

      {selectedApp && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-end bg-surface-overlay/80 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-xl flex-col justify-between space-y-6 overflow-y-auto border-l border-border bg-surface p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="font-mono text-caption font-bold t-subtle">{selectedApp.id}</span>
                  <h3 className="t-h5 text-foreground">{selectedApp.candidateName}</h3>
                  <p className="text-caption t-subtle">{selectedApp.candidateEmail}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedApp(null);
                  }}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-caption font-semibold tracking-wider t-subtle uppercase">Applied Position</h4>
                  <p className="mt-1 t-h5 text-foreground">{selectedApp.internshipTitle}</p>
                  <p className="text-caption font-medium text-accent">{selectedApp.companyName}</p>
                </div>

                <div>
                  <h4 className="text-caption font-semibold tracking-wider t-subtle uppercase">Current Pipeline Status</h4>
                  <div className="mt-1.5">
                    {(() => {
                      const { variant, label } = statusVariants[selectedApp.status];
                      return <Badge variant={variant}>{label}</Badge>;
                    })()}
                  </div>
                </div>

                <div>
                  <h4 className="text-caption font-semibold tracking-wider t-subtle uppercase">Cover Letter</h4>
                  <p className="mt-1.5 t-body-sm t-muted leading-relaxed rounded-2xl border border-border bg-surface/50 p-4">
                    {selectedApp.coverLetter}
                  </p>
                </div>

                <div>
                  <h4 className="text-caption font-semibold tracking-wider t-subtle uppercase">Resume Document</h4>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-4 py-2.5 text-caption font-semibold text-accent transition-all hover:bg-accent-subtle"
                  >
                    <Icon icon={FileText} size="sm" />
                    <span>Open Verified Resume PDF</span>
                    <Icon icon={ExternalLink} size="xs" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-caption t-subtle">Update Status:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedApp({ ...selectedApp, status: "ACCEPTED" });
                  }}
                >
                  Accept Candidate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApp({ ...selectedApp, status: "REJECTED" });
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}