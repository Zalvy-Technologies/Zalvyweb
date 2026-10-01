"use client";

import { useState } from "react";
import { Code, Eye, Send, Check, Tag } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
}

const templates: EmailTemplate[] = [
  {
    id: "welcome-email",
    name: "Welcome Email",
    subject: "Welcome to Zalvy Platform, {{first_name}}!",
    htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff;">
  <h1 style="color: #6366f1;">Welcome to Zalvy, {{first_name}}!</h1>
  <p>We are excited to help you launch your software & AI career.</p>
  <p><a href="{{login_link}}" style="background: #6366f1; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Explore Internships</a></p>
</div>`,
    variables: ["{{first_name}}", "{{login_link}}", "{{user_email}}"],
  },
  {
    id: "application-received",
    name: "Application Received",
    subject: "Your Application for {{internship_title}} at {{company_name}}",
    htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff;">
  <h2>Application Received!</h2>
  <p>Hi {{first_name}}, your application for <strong>{{internship_title}}</strong> has been submitted to {{company_name}}.</p>
</div>`,
    variables: ["{{first_name}}", "{{internship_title}}", "{{company_name}}"],
  },
  {
    id: "certificate-issued",
    name: "Certificate Issued",
    subject: "Your Verified Certificate #{{cert_number}} is Ready!",
    htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff;">
  <h2 style="color: #10b981;">Congratulations {{first_name}}!</h2>
  <p>Your verified digital certificate #{{cert_number}} has been issued.</p>
  <p><a href="{{cert_url}}" style="background: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px;">View Credential</a></p>
</div>`,
    variables: ["{{first_name}}", "{{cert_number}}", "{{cert_url}}"],
  },
];

export default function AdminEmailTemplatesPage() {
  const initial = templates[0] ?? {
    id: "",
    name: "",
    subject: "",
    category: "",
    htmlContent: "",
    variables: [],
  };
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(initial);
  const [subject, setSubject] = useState(initial.subject);
  const [htmlCode, setHtmlCode] = useState(initial.htmlContent);
  const [activeTab, setActiveTab] = useState<"CODE" | "PREVIEW">("PREVIEW");
  const [testSent, setTestSent] = useState(false);

  const handleSelectTemplate = (t: EmailTemplate) => {
    setSelectedTemplate(t);
    setSubject(t.subject);
    setHtmlCode(t.htmlContent);
    setTestSent(false);
  };

  const insertVariable = (varTag: string) => {
    setHtmlCode((prev) => prev + ` ` + varTag);
  };

  const handleSendTestEmail = () => {
    setTestSent(true);
    setTimeout(() => {
      setTestSent(false);
    }, 3000);
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transactional Email Templates Manager
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Design, edit HTML templates, insert dynamic variables, and preview transactional emails.
          </p>
        </div>

        <button
          onClick={handleSendTestEmail}
          className="flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
        >
          {testSent ? <Check className="h-4 w-4 text-emerald-300" /> : <Send className="h-4 w-4" />}
          <span>{testSent ? "Test Email Sent!" : "Send Test Email"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-2 px-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
            Available Templates
          </h3>
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                handleSelectTemplate(t);
              }}
              className={`w-full rounded-xl p-3 text-left text-xs font-semibold transition-all ${
                selectedTemplate.id === t.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="max-w-md flex-1">
              <label className="text-xs font-semibold text-slate-500">Email Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-900 focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-white"
              />
            </div>

            <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => {
                  setActiveTab("PREVIEW");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "PREVIEW"
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Live Preview</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("CODE");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "CODE"
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                <span>HTML Code</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Tag className="h-3 w-3" /> Insert Variable:
            </span>
            {selectedTemplate.variables.map((varTag) => (
              <button
                key={varTag}
                onClick={() => {
                  insertVariable(varTag);
                }}
                className="rounded-lg bg-indigo-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-indigo-600 transition-colors hover:bg-indigo-500/20 dark:text-indigo-400"
              >
                {varTag}
              </button>
            ))}
          </div>

          {activeTab === "CODE" ? (
            <textarea
              rows={12}
              value={htmlCode}
              onChange={(e) => {
                setHtmlCode(e.target.value);
              }}
              className="w-full rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-400 focus:outline-none"
            />
          ) : (
            <div className="min-h-[300px] overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-4 dark:border-slate-800">
              <div
                dangerouslySetInnerHTML={{
                  __html: htmlCode.replace(/\{\{first_name\}\}/g, "Sarah"),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
