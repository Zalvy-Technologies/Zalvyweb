"use client";

import React, { useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { ShieldCheck, ShieldAlert, Plus, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { GlassCard } from "@/components/ui/glass-card";

interface CertificateRecord {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientEmail: string;
  title: string;
  issueDate: string;
  verificationHash: string;
  status: "ISSUED" | "REVOKED";
}

const mockCertificates: CertificateRecord[] = [
  {
    id: "CERT-101",
    certificateNumber: "ZLV-2026-9042",
    recipientName: "Sarah Jenkins",
    recipientEmail: "sarah.j@gmail.com",
    title: "Advanced AI Systems Engineering Internship",
    issueDate: "2026-06-15",
    verificationHash: "0x9a8f2c7e1d4b609832fa05",
    status: "ISSUED",
  },
  {
    id: "CERT-102",
    certificateNumber: "ZLV-2026-9043",
    recipientName: "Marcus Vance",
    recipientEmail: "marcus.v@outlook.com",
    title: "Full-Stack Modern Web Architecture",
    issueDate: "2026-07-01",
    verificationHash: "0x3f5c1d8a9e2b407761ce88",
    status: "ISSUED",
  },
  {
    id: "CERT-103",
    certificateNumber: "ZLV-2026-9044",
    recipientName: "David Chen",
    recipientEmail: "david.chen@mit.edu",
    title: "Quantitative Systems & GPU Acceleration",
    issueDate: "2026-07-10",
    verificationHash: "0x7b2a9e4f0c1d508823bb19",
    status: "REVOKED",
  },
];

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<CertificateRecord[]>(mockCertificates);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; message: string } | null>(null);

  const [newRecipient, setNewRecipient] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const handleIssueCert = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRecipient || !newTitle) return;

    const newRecord: CertificateRecord = {
      id: `CERT-${String(100 + certs.length + 1)}`,
      certificateNumber: `ZLV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
      recipientName: newRecipient,
      recipientEmail: newEmail ? newEmail : "user@zalvy.io",
      title: newTitle,
      issueDate: new Date().toISOString().split("T")[0] ?? "2026-07-23",
      verificationHash: `0x${Math.random().toString(16).substring(2, 18)}`,
      status: "ISSUED",
    };

    setCerts([newRecord, ...certs]);
    setShowIssueModal(false);
    setNewRecipient("");
    setNewEmail("");
    setNewTitle("");
  };

  const handleToggleRevoke = (id: string) => {
    setCerts(
      certs.map((c) =>
        c.id === id ? { ...c, status: c.status === "ISSUED" ? "REVOKED" : "ISSUED" } : c,
      ),
    );
  };

  const handleVerifyHash = () => {
    if (!verifyInput) return;
    const match = certs.find(
      (c) => c.verificationHash.toLowerCase() === verifyInput.trim().toLowerCase(),
    );
    if (match) {
      setVerifyResult({
        valid: true,
        message: `VALID: Certificate #${match.certificateNumber} issued to ${match.recipientName} (${match.status})`,
      });
    } else {
      setVerifyResult({
        valid: false,
        message: "INVALID: No matching verified hash found in system ledger.",
      });
    }
  };

  const columns: Column<CertificateRecord>[] = [
    {
      header: "Certificate #",
      accessorKey: "certificateNumber",
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-foreground">{row.certificateNumber}</span>
      ),
    },
    {
      header: "Recipient",
      accessorKey: "recipientName",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="block font-semibold text-foreground">{row.recipientName}</span>
          <span className="text-caption t-subtle">{row.recipientEmail}</span>
        </div>
      ),
    },
    {
      header: "Credential Title",
      accessorKey: "title",
      sortable: true,
      cell: (row) => <span className="font-medium t-muted">{row.title}</span>,
    },
    {
      header: "Verification Hash",
      accessorKey: "verificationHash",
      cell: (row) => (
        <span className="font-mono text-caption text-accent">{row.verificationHash}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) =>
        row.status === "ISSUED" ? (
          <Badge variant="success" size="sm">
            <Icon icon={ShieldCheck} size="xs" />
            <span>ISSUED</span>
          </Badge>
        ) : (
          <Badge variant="danger" size="sm">
            <Icon icon={ShieldAlert} size="xs" />
            <span>REVOKED</span>
          </Badge>
        ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant={row.status === "ISSUED" ? "outline" : "secondary"}
          size="sm"
          onClick={() => {
            handleToggleRevoke(row.id);
          }}
        >
          {row.status === "ISSUED" ? "Revoke" : "Re-Issue"}
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="t-h2 text-foreground">Certificates & Verification Credentials</h1>
          <p className="mt-1 t-caption t-muted">Issue, inspect, verify, and revoke digital certificate hashes.</p>
        </div>

        <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowIssueModal(true);
              }}
              className="gap-2"
            >
          <Icon icon={Plus} size="sm" />
          <span>Issue Certificate</span>
        </Button>
      </div>

      <GlassCard variant="raised" intensity="medium" className="p-5">
        <h3 className="flex items-center gap-2 t-h5 text-foreground mb-4">
          <Icon icon={Hash} size="sm" className="text-accent" />
          <span>Public Hash Verification Inspector</span>
        </h3>
        <div className="flex max-w-xl items-center gap-2">
          <Input
            type="text"
            value={verifyInput}
            onChange={(e) => {
              setVerifyInput(e.target.value);
            }}
            placeholder="Enter verification hash (e.g. 0x9a8f2c7e...)"
            className="flex-1"
          />
          <Button variant="secondary" size="sm" onClick={() => { handleVerifyHash(); }}>
            Verify Hash
          </Button>
        </div>
        {verifyResult && (
          <p
            className={`mt-3 rounded-xl p-3 text-caption font-semibold ${
              verifyResult.valid
                ? "border border-success/20 bg-success-subtle text-success"
                : "border border-danger/20 bg-[rgb(var(--token-danger)/0.08)] text-danger"
            }`}
          >
            {verifyResult.message}
          </p>
        )}
      </GlassCard>

      <DataTable
        data={certs}
        columns={columns}
        searchPlaceholder="Search certificate numbers, recipients..."
        exportFilename="zalvy-certificates"
      />

      {showIssueModal && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleIssueCert} className="w-full max-w-lg space-y-4">
            <GlassCard variant="raised" intensity="strong" className="p-6">
              <h3 className="t-h5 text-foreground mb-4">Issue Digital Certificate</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-caption font-semibold t-subtle">Recipient Name</label>
<Input
                      type="text"
                      required
                      value={newRecipient}
                      onChange={(e) => {
                        setNewRecipient(e.target.value);
                      }}
                      placeholder="e.g. Alex Johnson"
                    />
                </div>

                <div>
                  <label className="text-caption font-semibold t-subtle">Recipient Email</label>
<Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                      }}
                      placeholder="alex.j@example.com"
                    />
                </div>

                <div>
                  <label className="text-caption font-semibold t-subtle">Credential Title</label>
<Input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => {
                        setNewTitle(e.target.value);
                      }}
                      placeholder="e.g. Senior Machine Learning Fellow"
                    />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4 mt-4">
                <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowIssueModal(false);
                }}
              >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Generate & Issue Hash
                </Button>
              </div>
            </GlassCard>
          </form>
        </div>
      )}
    </div>
  );
}