"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { Icon } from "@/components/ui/icon";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function AdminEmailComposer({ onClose }: { onClose: () => void }) {
  const [emailType, setEmailType] = useState<"offer-letter" | "project-assignment" | "completion" | "payment-reminder" | "payment-verified">("offer-letter");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fieldsByType: Record<string, { key: string; label: string; type: "text" | "email" | "textarea" | "date"; required?: boolean }[]> = {
    "offer-letter": [
      { key: "internshipTitle", label: "Internship Title", type: "text", required: true },
      { key: "startDate", label: "Start Date", type: "date", required: true },
      { key: "endDate", label: "End Date", type: "date", required: true },
      { key: "stipend", label: "Stipend", type: "text", required: true },
      { key: "mentorName", label: "Mentor Name", type: "text" },
      { key: "dashboardUrl", label: "Onboarding URL", type: "text" },
    ],
    "project-assignment": [
      { key: "projectTitle", label: "Project Title", type: "text", required: true },
      { key: "projectDescription", label: "Project Description", type: "textarea", required: true },
      { key: "mentorName", label: "Mentor Name", type: "text", required: true },
      { key: "startDate", label: "Start Date", type: "date", required: true },
      { key: "endDate", label: "End Date", type: "date", required: true },
    ],
    "completion": [
      { key: "certificateNumber", label: "Certificate Number", type: "text", required: true },
      { key: "verificationHash", label: "Verification Hash", type: "text", required: true },
      { key: "verificationUrl", label: "Verification URL", type: "text", required: true },
      { key: "projectTitle", label: "Project Title", type: "text" },
    ],
    "payment-reminder": [
      { key: "stipend", label: "Stipend Amount", type: "text", required: true },
      { key: "startDate", label: "Period Start", type: "date", required: true },
      { key: "endDate", label: "Period End", type: "date", required: true },
      { key: "dashboardUrl", label: "Payment Portal URL", type: "text" },
    ],
    "payment-verified": [
      { key: "stipend", label: "Stipend Amount", type: "text", required: true },
      { key: "verificationHash", label: "Transaction ID", type: "text", required: true },
    ],
  };

  const currentFields = fieldsByType[emailType] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: emailType,
          recipientEmail,
          recipientName,
          data: formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send email");
    }
  };

  return (
    <GlassCard variant="raised" intensity="strong" className="p-6 max-w-2xl w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="t-h5 text-foreground">Compose Admin Email</h2>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <Icon icon={AlertCircle} size="sm" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          value={emailType}
          onChange={(e) => { setEmailType(e.target.value as typeof emailType); }}
          options={[
            { value: "offer-letter", label: "Offer Letter" },
            { value: "project-assignment", label: "Project Assignment" },
            { value: "completion", label: "Completion Certificate" },
            { value: "payment-reminder", label: "Payment Reminder" },
            { value: "payment-verified", label: "Payment Verified" },
          ]}
          className="w-full"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Recipient Email"
            type="email"
            value={recipientEmail}
            onChange={(e) => { setRecipientEmail(e.target.value); }}
            placeholder="intern@example.com"
            required
          />
          <Input
            label="Recipient Name"
            value={recipientName}
            onChange={(e) => { setRecipientName(e.target.value); }}
            placeholder="Alex Johnson"
          />
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <h3 className="t-h6 text-foreground">Template Data</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {currentFields.map((field) => (
              <div key={field.key} className={cn(field.type === "textarea" && "sm:col-span-2")}>
                {field.type === "textarea" ? (
                  <Textarea
                    label={field.label}
                    value={formData[field.key] || ""}
                    onChange={(e) => { setFormData({ ...formData, [field.key]: e.target.value }); }}
                    placeholder={field.label}
                    required={field.required}
                    rows={3}
                  />
                ) : (
                  <Input
                    label={field.label}
                    type={field.type}
                    value={formData[field.key] || ""}
                    onChange={(e) => { setFormData({ ...formData, [field.key]: e.target.value }); }}
                    placeholder={field.label}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {status === "error" && (
          <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger flex items-center gap-2">
            <Icon icon={AlertCircle} size="sm" />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === "success" && (
          <div className="rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-success flex items-center gap-2">
            <Icon icon={CheckCircle2} size="sm" />
            <span>Email sent successfully!</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={status === "sending"}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={status === "sending"}>
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Icon icon={Send} size="sm" mr-2 />
                Send Email
              </>
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}