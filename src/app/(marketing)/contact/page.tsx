"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Building2,
  GraduationCap,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Server,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Briefcase,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { site } from "@/lib/site";

const CONTACT_REASONS = [
  { value: "enterprise", label: "Enterprise AI Solutions", description: "Custom agents, automation, private deployments", icon: Building2 },
  { value: "automation", label: "Business Automation", description: "Workflow automation, ERP/CRM integration", icon: Zap },
  { value: "agents", label: "AI Agent Development", description: "Multi-agent swarms, tool-calling, planning", icon: BrainCircuit },
  { value: "platform", label: "Platform & Developer Tools", description: "SDKs, APIs, inference, evaluation", icon: Server },
  { value: "internship", label: "Internship Program", description: "Apply, partner, or hire our graduates", icon: GraduationCap },
  { value: "security", label: "Security & Compliance", description: "SOC2, penetration testing, audit reports", icon: ShieldCheck },
  { value: "careers", label: "Careers & Partnerships", description: "Full-time roles, research, academic", icon: Briefcase },
  { value: "other", label: "Other", description: "Press, speaking, general inquiries", icon: MessageSquare },
];

const CONTACT_INFO = [
  { icon: Mail, label: "General", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { icon: Building2, label: "Enterprise", value: site.contact.enterprise, href: `mailto:${site.contact.enterprise}` },
  { icon: GraduationCap, label: "Internships", value: site.contact.internships, href: `mailto:${site.contact.internships}` },
  { icon: Phone, label: "Phone", value: site.contact.phone, href: `tel:${site.contact.phone}` },
];

interface FormData {
  name: string;
  email: string;
  company: string;
  reason: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  company: "",
  reason: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.reason) newErrors.reason = "Please select a reason";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 20) newErrors.message = "Message must be at least 20 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("success");
        setFormData(initialFormData);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Container>
      <Section id="hero" rhythm="tight" className="pt-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="iris" size="lg">
            GET IN TOUCH
          </Badge>
          <h1 className="t-display-2 text-foreground is-balanced">
            Start a conversation with our engineering team.
          </h1>
          <p className="t-body-lg text-foreground-muted">
            No sales scripts — just engineers who understand your problem.
          </p>
        </div>
      </Section>

      <Section id="contact-form" rhythm="default">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Reveal delay={0} animation="blur-in">
              <GlassCard variant="raised" intensity="medium" className="p-6 h-full border border-white/5">
                <h3 className="t-h4 text-foreground mb-6">Direct channels</h3>
                <div className="space-y-4">
                  {CONTACT_INFO.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-accent/30 hover:bg-white/5 transition-all"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent border border-accent/20 shrink-0">
                        <Icon icon={item.icon} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="t-caption t-subtle block mb-0.5">{item.label}</span>
                        <span className="t-body-sm text-foreground truncate block">{item.value}</span>
                      </div>
                      <Icon icon={ArrowRight} size="xs" className="text-foreground-subtle group-hover:text-accent transition-colors" />
                    </Link>
                  ))}
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={80} animation="blur-in">
              <GlassCard variant="raised" intensity="medium" className="p-6 border border-white/5">
                <h3 className="t-h4 text-foreground mb-4">What happens next?</h3>
                <ol className="space-y-3">
                  {[
                    "We route your inquiry to the relevant team",
                    "We will review and respond via email",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 t-body-sm t-muted">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-mono font-bold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </GlassCard>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal delay={160} animation="blur-in">
              <GlassCard variant="raised" intensity="medium" className="p-6 lg:p-8 border border-white/5">
                {status === "success" ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success border border-success/20 mb-4">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="t-h3 text-foreground mb-2">Message sent successfully</h3>
                    <p className="t-body t-muted mb-6">Our engineering team will review your message and respond via email.</p>
                    <Button variant="secondary" onClick={() => { setStatus("idle"); }}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6" noValidate>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="t-caption t-subtle block mb-1.5">Full Name *</label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Alex Chen"
                          value={formData.name}
                          onChange={(e) => { handleChange("name", e.target.value); }}
                          error={errors.name}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                        {errors.name && <p id="name-error" className="t-caption text-rose-400 mt-1" role="alert">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="t-caption t-subtle block mb-1.5">Work Email *</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="alex@company.com"
                          value={formData.email}
                          onChange={(e) => { handleChange("email", e.target.value); }}
                          error={errors.email}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && <p id="email-error" className="t-caption text-rose-400 mt-1" role="alert">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="t-caption t-subtle block mb-1.5">Company / Organization</label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Acme Corp (optional)"
                        value={formData.company}
                        onChange={(e) => { handleChange("company", e.target.value); }}
                      />
                    </div>

                    <div>
                      <Select
                        id="reason"
                        name="reason"
                        label="What can we help with? *"
                        options={[
                          { value: "", label: "Select a topic..." },
                          ...CONTACT_REASONS.map((reason) => ({ value: reason.value, label: reason.label })),
                        ]}
                        value={formData.reason}
                        onChange={(e) => { handleChange("reason", e.target.value); }}
                        error={errors.reason}
                        aria-invalid={!!errors.reason}
                        aria-describedby={errors.reason ? "reason-error" : undefined}
                      />
                      {errors.reason && <p id="reason-error" className="t-caption text-rose-400 mt-1" role="alert">{errors.reason}</p>}
                    </div>

                    <div>
                      <label htmlFor="message" className="t-caption t-subtle block mb-1.5">Message *</label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your project, timeline, and any technical requirements... (minimum 20 characters)"
                        value={formData.message}
                        onChange={(e) => { handleChange("message", e.target.value); }}
                        rows={5}
                        error={errors.message}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                      />
                      {errors.message && <p id="message-error" className="t-caption text-rose-400 mt-1" role="alert">{errors.message}</p>}
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send to Engineering Team
                          <Icon icon={ArrowRight} size="sm" />
                        </>
                      )}
                    </Button>

                    <p className="t-caption t-subtle text-center">
                      By submitting, you agree to our <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>. We never spam or share your data.
                    </p>
                  </form>
                )}
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section id="office" rhythm="default" surface="veil">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="t-h2 text-foreground mb-4">Visit us in India</h2>
            <p className="t-body t-muted mb-6">
              Our development hubs and engineering offices are located in India.
              Quarterly team offsites happen here. Candidates and partners visit for in-person syncs.
            </p>
            <div className="flex flex-wrap gap-4">
              <GlassCard variant="raised" intensity="medium" className="p-4 flex items-center gap-3 border border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent border border-accent/20 shrink-0">
                  <Icon icon={MapPin} size="sm" />
                </div>
                <div>
                  <span className="t-caption t-subtle block">Headquarters</span>
                  <span className="t-body-sm text-foreground">India</span>
                </div>
              </GlassCard>
              <GlassCard variant="raised" intensity="medium" className="p-4 flex items-center gap-3 border border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent border border-accent/20 shrink-0">
                  <Icon icon={Users} size="sm" />
                </div>
                <div>
                  <span className="t-caption t-subtle block">Team Size</span>
                  <span className="t-body-sm text-foreground">25+ engineers</span>
                </div>
              </GlassCard>
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--token-iris)/0.1)] via-transparent to-[rgb(var(--token-accent)/0.08)]" />
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center p-8">
                <Icon icon={MapPin} size="xl" className="text-accent/50 mx-auto mb-4" />
                <p className="t-body t-muted">Engineering Hub & Innovation Center</p>
                <p className="t-caption t-subtle mt-2">India (Bengaluru & Noida Operations)</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}