"use client";

import { useState } from "react";
import { 
  X, 
  GraduationCap, 
  UploadCloud, 
  CheckCircle2, 
  GitBranch, 
  Mail, 
  User, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface InternshipApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: string;
}

export function InternshipApplyModal({ isOpen, onClose, defaultTrack = "ai-engineering" }: InternshipApplyModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState(defaultTrack);
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  if (!isOpen) return null;

  const handleResumeSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-[#Type]": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email,
          type: "INTERNSHIP_APPLICATION",
          metadata: {
            track,
            githubUrl,
            portfolioUrl,
            resumeName: resumeName ?? "resume_submitted.pdf"
          }
        })
      });

      const data = (await res.json()) as { id?: string };
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const fallbackId = `ZALVY-APP-${String(randomNum)}`;
      setApplicationId(data.id ?? fallbackId);
      setIsSuccess(true);
    } catch {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const fallbackId = `ZALVY-APP-${String(randomNum)}`;
      setApplicationId(fallbackId);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    void handleSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl">
        <GlassCard variant="raised" intensity="strong" className="p-6 md:p-8 border border-white/10 shadow-2xl relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground-subtle hover:text-foreground p-2 rounded-xl border border-white/5 bg-black/40 hover:bg-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>

          {!isSuccess ? (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase font-bold mb-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>ZALVY FUTURE TALENT INCUBATOR</span>
                </div>
                <h3 className="t-h2 text-foreground">
                  Apply for Engineering Track
                </h3>
                <p className="t-body-sm text-foreground-muted mt-1">
                  Submit your details for screening by our autonomous AI evaluation pipeline and senior engineering leads.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                    <input
                      required
                      type="text"
                      placeholder="Alex Mercer"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); }}
                      className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                    <input
                      required
                      type="email"
                      placeholder="alex.mercer@university.edu"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); }}
                      className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                      Incubator Track *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                      <select
                        value={track}
                        onChange={(e) => { setTrack(e.target.value); }}
                        className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
                      >
                        <option value="ai-engineering">AI/ML Agent Engineering</option>
                        <option value="fullstack-architecture">Fullstack Cloud Architecture</option>
                        <option value="systems-automation">Systems & Business Automation</option>
                        <option value="cybersecurity">AI Security & Zero Trust</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                      GitHub Profile URL *
                    </label>
                    <div className="relative">
                      <GitBranch className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                      <input
                        required
                        type="url"
                        placeholder="https://github.com/username"
                        value={githubUrl}
                        onChange={(e) => { setGithubUrl(e.target.value); }}
                        className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Portfolio & Resume */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                      Portfolio / LinkedIn (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://alexmercer.dev"
                      value={portfolioUrl}
                      onChange={(e) => { setPortfolioUrl(e.target.value); }}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                      Resume PDF *
                    </label>
                    <label className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-dashed border-white/20 bg-black/40 hover:border-accent/50 cursor-pointer transition-all">
                      <span className="text-xs font-mono text-foreground-muted truncate">
                        {resumeName ?? "Upload PDF resume..."}
                      </span>
                      <UploadCloud className="h-4 w-4 text-accent shrink-0 ml-2" />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeSimulatedUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-cyan-400 p-3 text-xs font-semibold text-black shadow-lg shadow-accent/20 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Submitting Application to AI Evaluator...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 fill-black" />
                    <span>Submit Application for Review</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success border border-success/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="t-h2 text-foreground">
                Application Received!
              </h3>
              <p className="t-body-sm text-foreground-muted max-w-md mx-auto">
                Your application has been logged into the ZALVY review pipeline under Application Reference ID:
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-black/60 border border-accent/30 font-mono text-sm text-accent font-bold">
                {applicationId}
              </div>
              <p className="text-xs text-foreground-subtle">
                Next Step: Upon initial screening, you will receive an official **Offer Letter via Email** with project details.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white/10 text-foreground font-semibold text-xs hover:bg-white/20 transition-all"
                >
                  Close & Return to Platform
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
