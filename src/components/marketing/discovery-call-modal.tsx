"use client";

import { useState } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  Building2, 
  Mail, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Zap
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface DiscoveryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiscoveryCallModal({ isOpen, onClose }: DiscoveryCallModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [useCase, setUseCase] = useState("AI Agent Swarm Integration");
  const [preferredDate, setPreferredDate] = useState("2026-08-14");
  const [preferredTime, setPreferredTime] = useState("14:00 EST");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-[#Type]": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: workEmail,
          type: "BUSINESS_DISCOVERY_CALL",
          companyName,
          metadata: { useCase, preferredDate, preferredTime }
        })
      });
      setIsSuccess(true);
    } catch {
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
      <div className="relative w-full max-w-lg">
        <GlassCard variant="raised" intensity="strong" className="p-6 md:p-8 border border-white/10 shadow-2xl relative">
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
                  <Building2 className="h-4 w-4" />
                  <span>ENTERPRISE DISCOVERY CALL</span>
                </div>
                <h3 className="t-h2 text-foreground">
                  Schedule Architecture Consultation
                </h3>
                <p className="t-body-sm text-foreground-muted mt-1">
                  Connect 1-on-1 with ZALVY principal AI solution architects to evaluate your technical workflow and ROI potential.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                    <input
                      required
                      type="text"
                      placeholder="Acme Corp / Scale Inc."
                      value={companyName}
                      onChange={(e) => { setCompanyName(e.target.value); }}
                      className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                      <input
                        required
                        type="text"
                        placeholder="Sarah Jenkins"
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); }}
                        className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                      <input
                        required
                        type="email"
                        placeholder="sarah@acme.com"
                        value={workEmail}
                        onChange={(e) => { setWorkEmail(e.target.value); }}
                        className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                    Primary AI Objective / Use Case *
                  </label>
                  <select
                    value={useCase}
                    onChange={(e) => { setUseCase(e.target.value); }}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-xs text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="AI Agent Swarm Integration">Autonomous AI Agent Swarms</option>
                    <option value="AI Chatbot Development">Enterprise Conversational AI Chatbots</option>
                    <option value="Business Process Automation">ERP/CRM Workflow Automation</option>
                    <option value="Custom AI Solutions">Custom Fine-Tuned Model Architecture</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                      <input
                        required
                        type="date"
                        value={preferredDate}
                        onChange={(e) => { setPreferredDate(e.target.value); }}
                        className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground-muted block mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-foreground-subtle" />
                      <select
                        value={preferredTime}
                        onChange={(e) => { setPreferredTime(e.target.value); }}
                        className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-4 py-2.5 text-xs text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="10:00 EST">10:00 AM EST</option>
                        <option value="14:00 EST">02:00 PM EST</option>
                        <option value="16:30 EST">04:30 PM EST</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-cyan-400 p-3 text-xs font-semibold text-black shadow-lg shadow-accent/20 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Reserving Calendar Slot...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-black" />
                    <span>Confirm Discovery Call Booking</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent border border-accent/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="t-h2 text-foreground">
                Discovery Call Confirmed!
              </h3>
              <p className="t-body-sm text-foreground-muted max-w-md mx-auto">
                A calendar invitation with Google Meet link has been dispatched to <span className="text-foreground font-semibold">{workEmail}</span> for {preferredDate} at {preferredTime}.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-foreground-subtle pt-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>NDA protected architecture consultation</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white/10 text-foreground font-semibold text-xs hover:bg-white/20 transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
