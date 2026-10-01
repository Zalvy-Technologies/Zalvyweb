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
  title: "Privacy Policy",
  description: `Privacy Policy for ${site.name}. We describe what information we collect, how we use it, and your rights regarding your data.`,
  path: "/legal/privacy",
});

const privacyJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

export default function PrivacyPage() {
  return (
    <>
      <JsonLd id="jsonld-privacy" data={privacyJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy", href: "/legal/privacy", current: true },
          ]}
        />
      </Container>

      <Section id="content" rhythm="default">
        <div className="prose prose-zinc dark:prose-invert t-body t-muted max-w-[42rem] space-y-6 leading-relaxed">
          <h1 className="t-h2 text-foreground">Privacy Policy</h1>
          <p className="t-caption t-subtle">Last updated: July 2026</p>

          <h2 className="t-h3 text-foreground mt-10">1. Introduction</h2>
          <p>
            {site.legalName} (&ldquo;ZALVY,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit our website
            zalvy.com, use our platform services, or interact with us through other channels.
          </p>
          <p>
            By using the ZALVY platform or website, you agree to the collection and use of
            information in accordance with this policy. If you do not agree with this policy, please
            do not use our services.
          </p>

          <h2 className="t-h3 text-foreground mt-10">2. Information We Collect</h2>
          <h3 className="t-h4 text-foreground mt-6">2.1 Information You Provide Directly</h3>
          <p>
            We collect information you voluntarily provide when you communicate with us &mdash;
            including when you submit a contact form, sign up for a workspace, apply for the
            internship program, or email us. This may include your name, email address, company
            name, role, and the content of your message.
          </p>
          <h3 className="t-h4 text-foreground mt-6">2.2 Information Collected Automatically</h3>
          <p>
            When you access our website, we may automatically collect certain information about your
            device and usage, including IP address, browser type, operating system, referring URLs,
            pages visited, and time spent. We use this information to operate, maintain, and improve
            our services.
          </p>
          <h3 className="t-h4 text-foreground mt-6">2.3 Information We Do Not Collect</h3>
          <p>
            ZALVY does not sell personal data. We do not use data from customer workspaces to train
            shared models. We do not aggregate customer data across workspaces for any purpose
            beyond the operation of the platform itself. We do not install tracking pixels from
            third-party advertising networks on our marketing website.
          </p>

          <h2 className="t-h3 text-foreground mt-10">3. How We Use Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="space-y-1">
            <li>Provide, operate, and maintain our services.</li>
            <li>
              Respond to your inquiries, including enterprise engagement requests and internship
              applications.
            </li>
            <li>Improve, personalize, and expand the functionality of our platform.</li>
            <li>
              Send service-related communications, including account notifications, platform
              updates, and changelog entries.
            </li>
            <li>
              Ensure the security, availability, and compliance of our platform &mdash; including
              SOC 2 Type II audit requirements.
            </li>
            <li>Meet legal obligations, resolve disputes, and enforce our agreements.</li>
          </ul>

          <h2 className="t-h3 text-foreground mt-10">4. Data Retention</h2>
          <p>
            We retain personal information for as long as necessary to fulfill the purposes for
            which it was collected, including for the purposes of satisfying any legal, accounting,
            or reporting requirements. Workspace data is retained for the duration of your
            engagement or subscription. Upon termination, data is deleted within 90 days unless a
            longer retention period is required by law or agreed in a separate data processing
            agreement.
          </p>

          <h2 className="t-h3 text-foreground mt-10">5. Data Protection</h2>
          <p>
            ZALVY implements and maintains industry-standard security measures designed to protect
            information from unauthorized access, use, alteration, and disclosure. All traffic is
            encrypted via TLS 1.3; stored data is encrypted at rest using AES-256. Access to user
            data is restricted to authorised engineers through access controls and audit logging.
            External audits be SOC 2 Type II performed annually.
          </p>

          <h2 className="t-h3 text-foreground mt-10">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request on correction of inaccurate or incomplete data.</li>
            <li>
              Request deletion of your personal data, subject to legal retention requirements.
            </li>
            <li>Object to or restrict processing of your data in certain circumstances.</li>
            <li>Data portability — receive your data in a structured, commonly used format.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at {site.contact.email}. We respond to all
            requests within 30 calendar days.
          </p>

          <h2 className="t-h3 text-foreground mt-10">7. Contact</h2>
          <p>
            For questions about this Privacy Policy or our data practices, contact {site.legalName},
            Inc. at:
          </p>
          <p>
            {site.contact.email}
            <br />
            India
          </p>
        </div>
      </Section>

      <TrustBand />
    </>
  );
}
