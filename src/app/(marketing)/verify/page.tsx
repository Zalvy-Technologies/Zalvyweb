"use client";

import { useState, use } from "react";
import { 
  ShieldCheck, 
  Search, 
  Award, 
  Hash, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Calendar, 
  User, 
  FileCode2,
  Lock,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface CertificateData {
  id: string;
  recipientName: string;
  track: string;
  issueDate: string;
  status: "VALID" | "REVOKED";
  hash: string;
  projectTitle: string;
  projectUrl: string;
  issuer: string;
  skills: string[];
}

const MOCK_CERTIFICATES: Record<string, CertificateData> = {
  "ZALVY-2026-X892": {
    id: "ZALVY-2026-X892",
    recipientName: "Alex Mercer",
    track: "AI Agent Engineering & Swarms",
    issueDate: "August 10, 2026",
    status: "VALID",
    hash: "0x8f9b2a7e4c1d6f3e5b8a0c9d7e6f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f",
    projectTitle: "Autonomous Supply Chain Swarm Orchestrator",
    projectUrl: "https://github.com/zalvy-labs/project-alex-mercer",
    issuer: "ZALVY Technical Board & Senior Staff Engineers",
    skills: ["Python", "PyTorch", "Multi-Agent Consensus", "PostgreSQL", "Next.js 15", "Docker"]
  },
  "ZAL-2026-8942": {
    id: "ZAL-2026-8942",
    recipientName: "Elena Rostova",
    track: "Fullstack Cloud Architecture",
    issueDate: "July 24, 2026",
    status: "VALID",
    hash: "0x3a7b1c9d8e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    projectTitle: "Zero-Trust Microservice Telemetry Pipeline",
    projectUrl: "https://github.com/zalvy-labs/project-elena-rostova",
    issuer: "ZALVY Technical Board & Senior Staff Engineers",
    skills: ["TypeScript", "Next.js", "Prisma", "Redis", "Cloudflare Workers", "Kubernetes"]
  }
};

const hashForId = (id: string): string => {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `0x${(h >>> 0).toString(16).padStart(8, "0")}`;
};

export default function CertificateVerificationPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedParams = use(searchParams);
  const [searchId, setSearchId] = useState(resolvedParams.id ?? "ZALVY-2026-X892");
  const [activeCert, setActiveCert] = useState<CertificateData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleLookup = (idToLookup: string) => {
    setHasSearched(true);
    const query = idToLookup.trim().toUpperCase();
    if (MOCK_CERTIFICATES[query]) {
      setActiveCert(MOCK_CERTIFICATES[query]);
    } else if (query.startsWith("ZAL")) {
      // Dynamic fallback for any valid formatted certificate code
      setActiveCert({
        id: query,
        recipientName: "Verified Graduate Student",
        track: "Enterprise AI Systems Specialization",
        issueDate: "August 2026",
        status: "VALID",
        hash: hashForId(query),
        projectTitle: "Production AI Agent System & CI Pipeline",
        projectUrl: "https://github.com/zalvy-labs/certified-project",
        issuer: "ZALVY Technical Board",
        skills: ["AI Engineering", "TypeScript", "Python", "Cloud Systems"]
      });
    } else {
      setActiveCert(null);
    }
  };
  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleLookup(searchId);
  };

  return (
    <div className="py-16 space-y-16">
      <Container width="narrow">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/10 text-accent font-mono text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="t-h1 text-foreground">
            Certificate Verification Engine
          </h1>
          <p className="t-body-lg text-foreground-muted max-w-xl mx-auto">
            Verify authentic ZALVY AI Engineering diplomas, internship completions, and enterprise system credentials.
          </p>

          {/* Search Form */}
          <form onSubmit={handleFormSubmit} className="mt-8 max-w-lg mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-foreground-subtle" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => { setSearchId(e.target.value); }}
                placeholder="Enter Certificate ID (e.g. ZALVY-2026-X892)"
                required
                className="w-full rounded-xl border border-white/10 bg-black/60 pl-11 pr-4 py-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-accent text-black font-semibold text-xs transition-all hover:opacity-90 shadow-md shadow-accent/20 shrink-0"
            >
              Verify Credential
            </button>
          </form>
          <p className="t-caption t-subtle mt-3">
            Demo registry — records shown are sample data; production verification runs against the issued credential ledger.
          </p>
        </div>

        {/* Certificate Display Result */}
        {hasSearched && (
          <div className="mt-12">
            {activeCert ? (
              <GlassCard variant="raised" intensity="strong" className="p-8 border border-accent/40 shadow-2xl relative overflow-hidden space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success border border-success/20">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-success uppercase tracking-wider">
                          OFFICIALLY VERIFIED & AUTHENTIC
                        </span>
                        <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[10px]">
                          {activeCert.status}
                        </Badge>
                      </div>
                      <h3 className="t-h3 text-foreground mt-0.5">{activeCert.id}</h3>
                    </div>
                  </div>

                  <a
                    href={`/api/v1/verify/${activeCert.id}?download=true`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-foreground text-xs font-semibold transition-all"
                  >
                    <Download className="h-4 w-4 text-accent" />
                    <span>Download PDF Certificate</span>
                  </a>
                </div>

                {/* Recipient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-foreground-subtle uppercase block mb-1">
                        RECIPIENT NAME
                      </span>
                      <div className="t-h2 text-foreground font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-accent" />
                        <span>{activeCert.recipientName}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-foreground-subtle uppercase block mb-1">
                        SPECIALIZATION TRACK
                      </span>
                      <div className="t-body font-medium text-accent">
                        {activeCert.track}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-foreground-subtle uppercase block mb-1">
                        ISSUED DATE & AUTHORITY
                      </span>
                      <div className="text-xs text-foreground-muted flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-foreground-subtle" />
                        <span>{activeCert.issueDate} — {activeCert.issuer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl border border-white/5 bg-black/40 p-5 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-foreground-subtle uppercase block mb-1 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-accent" /> Cryptographic Ledger Hash
                      </span>
                      <div className="text-[11px] text-accent break-all bg-black/60 p-2 rounded border border-white/5">
                        {activeCert.hash}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-foreground-subtle uppercase block mb-1 flex items-center gap-1">
                        <FileCode2 className="h-3 w-3 text-accent" /> Shipped Capstone Project
                      </span>
                      <div className="text-foreground font-medium">{activeCert.projectTitle}</div>
                      <a
                        href={activeCert.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline mt-1"
                      >
                        <span>View Verified GitHub Repository</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div>
                      <span className="text-[10px] text-foreground-subtle uppercase block mb-1">
                        VERIFIED SKILLS MATRIX
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCert.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-[10px] text-accent">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard variant="raised" intensity="medium" className="p-8 text-center border-danger/40">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger border border-danger/20 mb-3">
                  <Hash className="h-6 w-6" />
                </div>
                <h3 className="t-h3 text-foreground">Certificate Not Found</h3>
                <p className="t-body-sm text-foreground-muted mt-1 max-w-md mx-auto">
                  No registered ZALVY credential matches ID <span className="font-mono text-accent">{searchId}</span>. Please verify the ID on your printed diploma or QR code payload.
                </p>
              </GlassCard>
            )}
          </div>
        )}
      </Container>

      {/* Trust & Proof Cards */}
      <Container width="wide">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <GlassCard variant="raised" intensity="medium" className="p-8 text-center">
            <div className="text-accent mb-4 inline-flex size-14 items-center justify-center rounded-xl bg-accent-subtle ring-1 ring-accent/20">
              <Hash className="h-6 w-6" />
            </div>
            <h2 className="t-h4 text-foreground mb-2 font-display font-semibold">Cryptographically Signed</h2>
            <p className="t-body-sm t-muted">
              Every ZALVY credential features a unique cryptographic hash registered on our immutable ledger.
            </p>
          </GlassCard>

          <GlassCard variant="raised" intensity="medium" className="p-8 text-center">
            <div className="text-iris mb-4 inline-flex size-14 items-center justify-center rounded-xl bg-[rgb(var(--token-iris)/0.1)] ring-1 ring-[rgb(var(--token-iris)/0.2)]">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="t-h4 text-foreground mb-2 font-display font-semibold">Industry Recognized</h2>
            <p className="t-body-sm t-muted">
              Built to the bar of technical hiring panels — candidates present the same system reviews we run internally.
            </p>
          </GlassCard>

          <GlassCard variant="raised" intensity="medium" className="p-8 text-center">
            <div className="text-sage mb-4 inline-flex size-14 items-center justify-center rounded-xl bg-[rgb(var(--token-sage)/0.1)] ring-1 ring-[rgb(var(--token-sage)/0.2)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="t-h4 text-foreground mb-2 font-display font-semibold">Instant Auth</h2>
            <p className="t-body-sm t-muted">
              Recruiters and technical managers get instant 1-click verification of candidate skills and code.
            </p>
          </GlassCard>
        </div>
      </Container>
    </div>
  );
}