import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/page-metadata";
import { graphSchema, organizationSchema, websiteSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/ui/json-ld";
import { Breadcrumb } from "@/components/layout/page-primitives";
import { TrustBand } from "@/components/layout/trust-band";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Data Processing Agreement",
  description: `Data Processing Agreement for ${site.name}. Covers scope, processing terms, subprocessors, technical security measures, data subject rights, breach notification, audit rights, and cross-border data transfers.`,
  path: "/legal/dpa",
});

const dpaJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

export default function DpaPage() {
  return (
    <>
      <JsonLd id="jsonld-dpa" data={dpaJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Data Processing Agreement", href: "/legal/dpa", current: true },
          ]}
        />
      </Container>

      <Section id="content" rhythm="default">
        <div className="prose prose-zinc dark:prose-invert t-body t-muted max-w-[42rem] space-y-6 leading-relaxed">
          <h1 className="t-h2 text-foreground">Data Processing Agreement</h1>
          <p className="t-caption t-subtle">Last updated: July 2026</p>

          <h2 className="t-h3 text-foreground mt-10">1. Scope of Agreement</h2>
          <p>
            This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the subscription
            agreement or services order (&ldquo;Principal Agreement&rdquo;) between {site.legalName}
            , Inc. (&ldquo;ZALVY,&rdquo; &ldquo;us,&rdquo; &ldquo;we,&rdquo; &ldquo;our&rdquo;) and
            the customer (&ldquo;you,&rdquo; &ldquo;your&rdquo;) governing your use of the ZALVY
            platform. Capitalized terms not defined in this DPA have the meaning ascribed to them in
            the Principal Agreement.
          </p>
          <p>
            This DPA applies where ZALVY acts as a data processor on behalf of the Customer. The
            Customer acts as a data controller. Both of these roles are as defined under applicable
            data protection law, including the General Data Protection Regulation (GDPR), the UK
            Data Protection Act 2018, and the California Consumer Privacy Act (CCPA).
          </p>

          <h2 className="t-h3 text-foreground mt-10">2. Data Processing Terms</h2>
          <p>
            The subject matter, nature, and purpose of processing, the duration of processing, the
            categories of data subjects, and the types of personal data are as follows:
          </p>
          <div className="my-6 overflow-x-auto">
            <table className="border-border w-full border-collapse overflow-hidden rounded-lg border text-left">
              <thead>
                <tr className="bg-surface">
                  <th className="border-border text-foreground w-[30%] border p-3 text-sm font-medium">
                    Category
                  </th>
                  <th className="border-border text-foreground-muted border p-3 text-sm">Detail</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="border-border text-foreground border p-3 font-medium">
                    Subject matter
                  </td>
                  <td className="border-border border p-3">
                    Provision of the ZALVY platform: AI agents, enterprise automation, chatbots,
                    inference, custom software, and developer tools as subscribed.
                  </td>
                </tr>
                <tr>
                  <td className="border-border text-foreground border p-3 font-medium">Duration</td>
                  <td className="border-border border p-3">
                    Term of the Principal Tier plus the period from termination until deletion; of
                    Customer Data in accordance with section 5 (Data Retention).
                  </td>
                </tr>
                <tr>
                  <td className="border-border text-foreground border p-3 font-medium">
                    Nature & purpose
                  </td>
                  <td className="border-border border p-3">
                    Hosting, managing, inspecting, and operating the ZALVY platform and the services
                    requested under the Principal Agreement. Includes platform security, resilience,
                    and availability.
                  </td>
                </tr>
                <tr>
                  <td className="border-border text-foreground border p-3 font-medium">
                    Data types
                  </td>
                  <td className="border-border border p-3">
                    Workspace metadata, configuration settings, model prompts, knowledge-business
                    documents, conversation logs, agent tool-call records, trace data, and any other
                    data Customer uploads to or generates on the platform.
                  </td>
                </tr>
                <tr>
                  <td className="border-border text-foreground border p-3 font-medium">
                    Data subjects
                  </td>
                  <td className="border-border border p-3">
                    End users of Customer&rsquo;s ZALVY-powered services, Customer personnel with
                    platform access, and contacts within Customer&rsquo;s operations team.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="t-h3 text-foreground mt-10">3. Subprocessors</h2>
          <p>ZALVY engages the following subprocessors to operate the platform:</p>
          <ul className="space-y-1">
            <li>
              <strong>Amazon Web Services (AWS)</strong> — Cloud infrastructure and compute. Region:
              US West (Oregon, N. California).
            </li>
            <li>
              <strong>Anthropic</strong> — LLM inference serving for agent and chatbot workloads
              (BYOK available on Enterprise).
            </li>
            <li>
              <strong>OpenAI</strong> — LLM inference serving for agent and evaluation workloads
              (BYOK available on Enterprise).
            </li>
            <li>
              <strong>Datadog</strong> — Observability and infrastructure monitoring.
            </li>
          </ul>
          <p>
            A current list of subprocessors is maintained and available to Enterprise customers via
            the ZALVY Trust Center. We notify customers of any intended addition or replacement of
            subprocessors at least 30 days before the change takes effect. Customers have the right
            to object to new subprocessors on reasonable grounds related to data protection.
          </p>

          <h2 className="t-h3 text-foreground mt-10">
            4. Technical and Organizational Security Measures
          </h2>
          <p>ZALVY implements and maintains the following security measures:</p>
          <ul className="space-y-1">
            <li>
              <strong>Access control:</strong> Role-based access, multi-factor authentication, audit
              logging of all access events.
            </li>
            <li>
              <strong>Encryption:</strong> TLS 1.3 for all data in transit. AES-256 for data at
              rest. Customer-managed encryption keys available on Enterprise tier.
            </li>
            <li>
              <strong>Workspace isolation:</strong> Know-segregation means customer data is
              logically separated per workspace. No cross-customer data share. No shared training
              corpora.
            </li>
            <li>
              <strong>Audit and compliance:</strong> SOC 2 Type II certified (security,
              availability, confidential). HIPAA Business Associate Agreement available on
              Enterprise tier.
            </li>
            <li>
              <strong>Vulnerability management:</strong> Regular vulnerability scans, annual
              penetration testing by an independent third party. Test summaries available to
              Enterprise customers under NDA.
            </li>
            <li>
              <strong>Incident response:</strong> Documented incident response plan with engineering
              on-call rotation. P0 incidents reach a name (not a ticket queue) and begin remedial
              action within 30 minutes of detection.
            </li>
            <li>
              <strong>Personnel security:</strong> All ZALVY personnel are subject to background
              checks, sign confidentiality agreements, and complete mandatory security training
              annually.
            </li>
          </ul>

          <h2 className="t-h3 text-foreground mt-10">5. Data Subject Rights</h2>
          <p>
            If ZALVY receives a request from a data subject exercising their rights under applicable
            data protection law, ZALVY will forward the request to the Customer within five (5)
            business days. ZALVY will provide requested assistance to the Customer in responding to
            such requests, to the extent commercially reasonable and within the technical
            constraints of the platform.
          </p>
          <p>
            To submit a request, contact {site.contact.email}. Where a request requires ZALVY to
            non-recoverably delete personal data, deletion will be completed within 30 days.
            Regulation-enforced retention periods affecting the requested data will be communicated
            to the Customer in writing.
          </p>

          <h2 className="t-h3 text-foreground mt-10">6. Breach Notification</h2>
          <p>
            ZALVY will notify the Customer of a personal data breach involving Customer Data within
            72 hours of becoming aware of the breach. The notification will include:
          </p>
          <ul className="space-y-1">
            <li>
              The nature of the breach, including categories and approximate number of affected data
              subjects and records.
            </li>
            <li>
              The contact details of ZALVY&rsquo;s Head of Security or incident response lead.
            </li>
            <li>The likely consequences of the breach.</li>
            <li>The measures taken or proposed to address the breach and mitigate its impact.</li>
          </ul>
          <p>
            ZALVY will document all personal data breaches in an internal incident register,
            including facts, root cause analysis, corrective measures, and recovery timelines. The
            register is available for review by Customer or the Customer&rsquo;s auditor under
            Section 7 (Audit Rights).
          </p>

          <h2 className="t-h3 text-foreground mt-10">7. Audit Rights</h2>
          <p>
            ZALVY makes available to Enterprise customers its SOC 2 Type II report (issued annually)
            and its penetration test summary (issued annually). If a Customer requires a performed
            audit, ZALVY and the Customer will agree on time, scope and duration prior to the audit
            to minimize operational impact. All costs incurred by ZALVY in connection with the audit
            shall be borne by the Customer uncovered non-compliance of the DPA or applicable law is
            verified.
          </p>
          <p>
            Customers can conduct non-more-than return one audit every each 12-month period except
            where: (i) a previous audit identified a material inconsistency that ZALVY committed to
            remediate, and (ii) the Customer wants to verify completion of remediation.
          </p>

          <h2 className="t-h3 text-foreground mt-10">8. Cross-Border Data Transfers</h2>
          <p>
            ZALVY hosts its core platform infrastructure in United States (AWS US regions, Oregon
            and N. California). For international customers requiring additional safeguards for
            cross-border transfers of personal data from the EEA, UK, or Switzerland to the United
            States, ZALVY agrees to authorize the amended Standard Contractual Clauses (SCCs)
            approved by the European Commission (Commission Implementing Decision (EU) 2021/914 of 4
            June 2021), as well as any relevant UK or Swiss addenda.
          </p>
          <p>
            ZALVY maintains a technical Transfer Impact Assessment (TIA) for each affected data
            transfer, available to Enterprise customers reviewing the ZALVY transfer mechanism for
            cross-border compliance.
          </p>
          <p>
            For questions about this DPA or cross-border data flows, contact ZALVY at{" "}
            {site.contact.enterprise}.
          </p>
        </div>
      </Section>

      <TrustBand />
    </>
  );
}
