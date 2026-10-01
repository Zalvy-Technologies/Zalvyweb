"use client";

import { type ReactNode, type SyntheticEvent, useId, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type SubmitHandler = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;

interface SubmissionState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

export function CtaBand() {
  const stateId = useId();

  const [state, setState] = useState<SubmissionState>({ status: "idle" });
  const [intent, setIntent] = useState<"enterprise" | "internship">("enterprise");

  const handleSubmit: SubmitHandler = (e) => {
    e.preventDefault();
    void (async () => {
      const form = e.currentTarget;
      setState({ status: "submitting" });
      try {
        const formData = new FormData(form);
        formData.append("intent", intent);
        const resp = await fetch("/api/leads", { method: "POST", body: formData });
        if (!resp.ok) throw new Error("Server returned non-OK response.");
        setState({ status: "success", message: "We'll review your scope and respond within one business day." });
      } catch (err) {
        setState({
          status: "error",
          message: "Something went wrong. Please email zalvyofficial@gmail.com instead.",
        });
        if (err instanceof Error) console.error("[zalvy:leads]", err.message);
      }
    })();
  };

  return (
    <section
      id="contact"
      aria-labelledby="cta-headline"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      {/* Immersive cinematic background wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[48rem] w-[72rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--token-accent)/0.09),transparent_70%)] opacity-80" />
        <div className="absolute top-1/3 right-10 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--token-iris)/0.07),transparent_70%)]" />
      </div>

      <Container width="narrow">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="iris" size="sm" className="mb-4">
            Initiate Architecture Review
          </Badge>
          <h2 id="cta-headline" className="t-display-2 font-display font-semibold text-foreground is-balanced">
            Let&rsquo;s engineer what&rsquo;s next.
          </h2>
          <p className="t-body-lg t-muted mx-auto mt-4 max-w-xl">
            Direct access to senior engineering staff. Whether scoping enterprise AI agents or applying for apprenticeship, we respond within 24 hours.
          </p>
        </div>

        <FormOrSuccess
          state={state}
          stateId={stateId}
          intent={intent}
          onIntent={setIntent}
          onSubmit={handleSubmit}
        />
      </Container>
    </section>
  );
}

type Intent = "enterprise" | "internship";

interface Props {
  state: SubmissionState;
  stateId: string;
  intent: Intent;
  onIntent: (intent: Intent) => void;
  onSubmit: SubmitHandler;
}

function FormOrSuccess({ state, stateId, intent, onIntent, onSubmit }: Props) {
  if (state.status === "success") {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-accent/30 bg-surface-raised/90 p-10 text-center shadow-2xl backdrop-blur-2xl"
      >
        <span
          aria-hidden
          className="bg-accent-subtle text-accent ring-accent/30 inline-flex size-16 items-center justify-center rounded-full ring-1 ring-inset shadow-[0_0_20px_rgb(var(--token-accent)/0.3)]"
        >
          <Icon icon={CheckCircle2} size="lg" aria-hidden />
        </span>
        <h3 className="t-h2 text-foreground font-display font-semibold">
          Submission Received
        </h3>
        <p className="t-body-lg t-muted max-w-md">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      key="form"
      noValidate
      onSubmit={onSubmit}
      aria-describedby={`${stateId}-status`}
      className="relative mx-auto max-w-2xl rounded-3xl border border-white/[0.09] bg-surface-raised/80 p-7 sm:p-10 backdrop-blur-2xl shadow-2xl"
    >
      <fieldset className="grid gap-6">
        <legend className="sr-only">Your request</legend>

        <ContactTypeRadios intent={intent} onIntent={onIntent} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="name"
            label="Full Name"
            type="text"
            autoComplete="name"
            required
            placeholder="Dr. Anandi Mehta"
          />
          <Field
            id="email"
            label="Work Email"
            type="email"
            autoComplete="email"
            required
            placeholder="anandi@company.com"
          />
        </div>

        <Field
          id="company"
          label={intent === "enterprise" ? "Organization / Company" : "University / Current Organization"}
          type="text"
          autoComplete="organization"
          required={intent === "enterprise"}
          placeholder={intent === "enterprise" ? "Helios Systems, Inc." : "Stanford / Self-Employed"}
        />

        <Textarea
          id="message"
          label={
            intent === "enterprise"
              ? "Project Scope & Target Latency / Safety Constraints"
              : "Technical Background & Links (GitHub, Repos, Proof of Work)"
          }
          required
          placeholder={
            intent === "enterprise"
              ? "Replacing our rule-based claims triage with grounded autonomous agents. Target latency < 100ms p99 with strict OTel observability..."
              : "https://github.com/username — built an async raft consensus engine and want to work on production inference serving..."
          }
        />

        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center pt-2">
          <p className="t-caption text-foreground-subtle text-xs">
            Zero marketing spam. We strictly use your email for engineering correspondence.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={state.status === "submitting"}
            aria-busy={state.status === "submitting"}
            className="sm:min-w-[10rem]"
          >
            {state.status === "submitting" ? "Transmitting..." : "Send Request"}
            <Icon icon={Send} aria-hidden size="sm" />
          </Button>
        </div>

        <p
          id={`${stateId}-status`}
          aria-live="assertive"
          className={cn(
            "min-h-[1.25rem] text-xs font-mono",
            state.status === "error" ? "text-danger" : "text-foreground-subtle",
          )}
        >
          {state.status === "error" ? state.message : null}
        </p>
      </fieldset>
    </motion.form>
  );
}

function ContactTypeRadios({
  intent,
  onIntent,
}: {
  intent: Intent;
  onIntent: (i: Intent) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="What are you contacting us about?"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {(["enterprise", "internship"] as const).map((option) => {
        const active = intent === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => { onIntent(option); }}
            className={cn(
              "flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all duration-200",
              active
                ? "border-accent/50 bg-accent-subtle shadow-sm"
                : "border-white/[0.07] bg-surface/70 hover:border-white/15 hover:bg-surface-raised",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-3.5 items-center justify-center rounded-full border",
                  active ? "border-accent bg-accent" : "border-white/20",
                )}
              />
              <span
                className={cn(
                  "font-display text-sm font-semibold",
                  active ? "text-foreground" : "text-foreground-muted",
                )}
              >
                {option === "enterprise" ? "Enterprise Solutions" : "Talent Apprenticeship"}
              </span>
            </div>
            <span className="t-caption text-foreground-subtle text-[0.75rem] pl-5 leading-snug">
              {option === "enterprise"
                ? "Autonomous agents, automation & bespoke AI."
                : "4–12 week production engineering immersion."}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "tel";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

function Field({ id, label, type, required, placeholder, autoComplete }: FieldProps): ReactNode {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-mono font-medium text-foreground-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "bg-surface border border-white/[0.08] h-11 rounded-xl px-3.5",
          "text-foreground text-sm font-sans",
          "placeholder:text-foreground-subtle/50",
          "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 transition-all duration-200 outline-none",
        )}
      />
    </div>
  );
}

function Textarea({
  id,
  label,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}): ReactNode {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-mono font-medium text-foreground-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        rows={4}
        className={cn(
          "bg-surface border border-white/[0.08] rounded-xl p-3.5",
          "text-foreground text-sm font-sans min-h-[6.5rem] resize-y leading-relaxed",
          "placeholder:text-foreground-subtle/50",
          "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 transition-all duration-200 outline-none",
        )}
      />
    </div>
  );
}
