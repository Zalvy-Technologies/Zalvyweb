"use client";

import { type ReactNode, type SyntheticEvent, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type SubmitHandler = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;

interface SubmissionState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

export function ContactForm() {
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
        setState({ status: "success", message: "We'll be in touch within one business day." });
      } catch (err) {
        setState({
          status: "error",
          message: "Something went wrong. Please email hello@zalvy.com instead.",
        });
        if (err instanceof Error) console.error("[zalvy:leads]", err.message);
      }
    })();
  };

  return (
    <Section id="contact" rhythm="default" align="center">
      <FormOrSuccess
        state={state}
        stateId={stateId}
        intent={intent}
        onIntent={setIntent}
        onSubmit={handleSubmit}
      />
    </Section>
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
  const headingId = "cta-headline";

  if (state.status === "success") {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center"
      >
        <span
          aria-hidden
          className="bg-accent-subtle text-success ring-success/20 inline-flex size-14 items-center justify-center rounded-full ring-1 ring-inset"
        >
          <Icon icon={CheckCircle2} size="lg" aria-hidden />
        </span>
        <h2 id={headingId} className="t-h2 text-foreground is-balanced">
          We received your note.
        </h2>
        <p className="t-body-lg t-muted">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      key="form"
      noValidate
      onSubmit={onSubmit}
      aria-labelledby={headingId}
      aria-describedby={`${stateId}-status`}
      className="border-border bg-surface-raised/60 relative mx-auto max-w-2xl rounded-3xl border p-7 backdrop-blur-xl md:p-10"
    >
      <h2 id={headingId} className="t-h2 text-foreground is-balanced text-center">
        Tell us what you want to build.
      </h2>
      <p className="t-body-lg t-muted mx-auto mt-3 max-w-lg text-center">
        We respond within one business day from people on the engineering team.
      </p>

      <fieldset className="mt-8 grid gap-7">
        <legend className="sr-only">Your request</legend>

        <ContactTypeRadios intent={intent} onIntent={onIntent} />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            id="name"
            label="Full name"
            type="text"
            autoComplete="name"
            required
            placeholder="Dr. Anandi Mehta"
          />
          <Field
            id="email"
            label="Work email"
            type="email"
            autoComplete="email"
            required
            placeholder="anandi@helios.example"
          />
        </div>

        <Field
          id="company"
          label="Company"
          type="text"
          autoComplete="organization"
          required={intent === "enterprise"}
          placeholder="Helios, Inc."
        />

        <Textarea
          id="message"
          label={
            intent === "enterprise"
              ? "Briefly — what would you like ZALVY to engineer?"
              : "A paragraph about why you're interested in the program."
          }
          required
          placeholder="Helios today routes claims via a rules pipeline written between 2014 and 2023. The goal we're scoping: replace ~41% of routable claims with grounded agents, with cost telemetry per step, observability equivalent to current posture, and no clinician escalation regression."
        />

        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <p className="t-caption t-subtle">
            By submitting, you agree to our{" "}
            <a
              href="/legal/privacy"
              className="text-foreground-muted hover:text-foreground underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>
            . No marketing emails; we don&rsquo;t add you to any list.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={state.status === "submitting"}
            aria-busy={state.status === "submitting"}
          >
            {state.status === "submitting" ? "Sending…" : "Send"}
            <Icon icon={Send} aria-hidden size="sm" className="ml-0.5" />
          </Button>
        </div>

        <p
          id={`${stateId}-status`}
          aria-live="assertive"
          className={cn(
            "min-h-[1.5rem] text-sm font-medium",
            state.status === "error" ? "text-danger" : "t-subtle",
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
            onClick={() => {
              onIntent(option);
            }}
            className={cn(
              "duration-quick flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors",
              active
                ? "border-accent/40 bg-accent-subtle"
                : "border-border bg-surface hover:border-border-strong hover:bg-surface-overlay",
            )}
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-4 items-center justify-center rounded-full border",
                  active ? "border-accent text-accent" : "border-border-strong text-transparent",
                )}
              >
                <AnimatePresence>
                  {active ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-accent size-1.5 rounded-full"
                    />
                  ) : null}
                </AnimatePresence>
              </span>
              <span
                className={cn(
                  "t-body font-medium",
                  active ? "text-foreground" : "text-foreground-muted",
                )}
              >
                {option === "enterprise" ? "Enterprise or partnership" : "Internship program"}
              </span>
            </span>
            <span className="t-caption t-subtle pl-6 leading-snug">
              {option === "enterprise"
                ? "Discuss a project, scope an agent run, or talk ops."
                : "Apply or talk to current interns."}
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
      <label htmlFor={id} className="t-body-sm text-foreground font-medium">
        {label}
        {required ? (
          <span aria-hidden className="text-accent ml-0.5">
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "bg-surface border-border h-12 rounded-lg border px-3.5",
          "text-foreground t-body",
          "placeholder:text-foreground-subtle/70",
          "focus-visible:border-accent focus-visible:ring-accent/30 duration-quick transition-colors focus-visible:ring-2 focus-visible:outline-none",
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
      <label htmlFor={id} className="t-body-sm text-foreground font-medium">
        {label}
        {required ? (
          <span aria-hidden className="text-accent ml-0.5">
            *
          </span>
        ) : null}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        rows={5}
        className={cn(
          "bg-surface border-border rounded-lg border p-3.5",
          "text-foreground t-body min-h-[7rem] resize-y leading-relaxed",
          "placeholder:text-foreground-subtle/70",
          "focus-visible:border-accent focus-visible:ring-accent/30 duration-quick transition-colors focus-visible:ring-2 focus-visible:outline-none",
        )}
      />
    </div>
  );
}
