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
  title: "Terms of Service",
  description: `Terms of Service for ${site.name}. Our agreement covers acceptance, services offered, user obligations, intellectual property, payment, liability, and termination.`,
  path: "/legal/terms",
});

const termsJsonLd = graphSchema([organizationSchema(), websiteSchema()]);

export default function TermsPage() {
  return (
    <>
      <JsonLd id="jsonld-terms" data={termsJsonLd} />
      <Container>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Terms of Service", href: "/legal/terms", current: true },
          ]}
        />
      </Container>

      <Section id="content" rhythm="default">
        <div className="prose prose-zinc dark:prose-invert t-body t-muted max-w-[42rem] space-y-6 leading-relaxed">
          <h1 className="t-h2 text-foreground">Terms of Service</h1>
          <p className="t-caption t-subtle">Last updated: July 2026</p>

          <h2 className="t-h3 text-foreground mt-10">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the {site.name} website and platform (&ldquo;Services&rdquo;), you
            agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you are using the
            Services on behalf of an organization, you represent that you are authorized to bind
            that organization to these Terms. If you do not agree, do not use the Services.
          </p>

          <h2 className="t-h3 text-foreground mt-10">2. Services Description</h2>
          <p>
            {site.legalName} provides a platform for AI agents, enterprise automation, AI chatbots,
            model inference, custom software engineering, and developer tools. Services are accessed
            via a web application, SDKs, and APIs. Specific capacity, features, and support level
            depend on your chosen subscription plan.
          </p>

          <h2 className="t-h3 text-foreground mt-10">3. User Obligations</h2>
          <p>When using ZALVY Services, you agree to:</p>
          <ul className="space-y-1">
            <li>Provide accurate, complete, and current information for your workspace account.</li>
            <li>Maintain the security and confidentiality of your workspace credentials.</li>
            <li>Use the Services in compliance with all applicable laws and regulations.</li>
            <li>
              Not use the Services to develop, test, or deploy systems that violate the terms of use
              of third-party model providers integrated through ZALVY.
            </li>
            <li>
              Not attempt to circumvent security controls, access workspaces other than your own, or
              interfere with the operation of the platform for other customers.
            </li>
          </ul>

          <h2 className="t-h3 text-foreground mt-10">4. Intellectual Property Rights</h2>
          <h3 className="t-h4 text-foreground mt-6">4.1 ZALVY IP</h3>
          <p>
            The ZALVY platform, SDKs, documentation, website, design system, branding, and all
            associated intellectual property are owned by {site.legalName}, Inc. and protected by
            copyright, trademark, and other applicable intellectual property laws. You may not
            reproduce, distribute, modify, or create derivative works of ZALVY&apos;s intellectual
            property without express written permission, except as permitted through open-source
            licenses for ZALVY-maintained open-source projects.
          </p>
          <h3 className="t-h4 text-foreground mt-6">4.2 Customer IP</h3>
          <p>
            You retain all rights to your data, models, prompts, configurations, and outputs
            generated through your use of the ZALVY platform. ZALVY does not use your data or models
            to train shared or third-party models. Your data remains in your workspace and is not
            shared across customer accounts.
          </p>

          <h2 className="t-h3 text-foreground mt-10">5. Payment Terms</h2>
          <p>
            Pricing, billing frequency, and payment terms are specified in your subscription
            agreement or order form. Unless otherwise agreed in writing, fees are billed in advance
            on a monthly or annual basis. Annual subscriptions receive a 17% discount on the
            equivalent monthly rate. All fees are non-cancellable and non-refundable except as
            explicitly stated in your service order or where required by law.
          </p>
          <p>
            Enterprise engagements under ZALVY Studio are scoped individually and invoiced at
            milestone intervals agreed in the engagement brief. Billing terms for custom engagements
            are specified in the engagement agreement.
          </p>

          <h2 className="t-h3 text-foreground mt-10">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, {site.legalName} shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages resulting from
            the use or inability to use the Services, including but not limited to loss of revenue,
            data, or profits. ZALVY&rsquo;s total liability for any claim arising out of or relating
            to these Terms or the Services shall not exceed the amount you paid ZALVY in the twelve
            (12) months preceding the claim.
          </p>
          <p>
            These limitations do not apply to liability for death or personal injury, fraud, gross
            negligence, or willful misconduct to the extent such limitation is prohibited by
            applicable law.
          </p>

          <h2 className="t-h3 text-foreground mt-10">7. Termination</h2>
          <p>
            Either party may terminate a subscription by providing written notice consistent with
            the billing cycle specified in your order. Upon termination, ZALVY will cease access to
            the Services and, within 90 days, delete annexed customer data and model configurations
            from the platform unless required to retain by law or agreed in a data processing
            agreement. Any unpaid fees for services rendered before termination remain due and
            payable.
          </p>

          <h2 className="t-h3 text-foreground mt-10">8. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of
            India, without regard to its conflict of law provisions. Any legal action
            arising out of or relating to these Terms shall be brought exclusively in the
            courts located in India.
          </p>
        </div>
      </Section>

      <TrustBand />
    </>
  );
}
