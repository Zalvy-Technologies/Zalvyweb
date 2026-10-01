import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbSchema, serviceSchema } from "@/lib/json-ld";
import Link from "next/link";
import { Cpu, Bot, Workflow, Code2, GraduationCap, ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { GradientGlow } from "@/components/ui/gradient-glow";

export const metadata: Metadata = {
  title: `Engineering Services & Solutions — ${site.name}`,
  description:
    "Explore ZALVY's enterprise engineering services: AI Autonomous Agents, Enterprise Automation, Custom AI Software, and Elite Talent Programs.",
  alternates: { canonical: "/services" },
};

const servicesList = [
  {
    icon: Bot,
    title: "Autonomous AI Agents",
    description:
      "Custom multi-agent systems designed for complex operational workflows, code generation, and multi-modal reasoning.",
    href: "/platform/agents",
  },
  {
    icon: Workflow,
    title: "Enterprise Automation",
    description:
      "End-to-end process automation powered by custom LLM pipelines, deterministic fallback mechanisms, and robust telemetry.",
    href: "/platform/automation",
  },
  {
    icon: Cpu,
    title: "AI Chatbots & Conversational UI",
    description:
      "Production-grade conversational interfaces built with low latency, streaming responses, and contextual RAG knowledge bases.",
    href: "/platform/chatbots",
  },
  {
    icon: Code2,
    title: "Custom Software Engineering",
    description:
      "Full-stack cloud-native software built using Next.js, Rust, Python, and scalable distributed database architectures.",
    href: "/studio",
  },
  {
    icon: GraduationCap,
    title: "Internship & Engineering Talent Programs",
    description:
      "Immersive 12-week fellowship pairing rising talent with senior Google and OpenAI alumni to build real-world AI systems.",
    href: "/careers/internship",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          slug: "services",
          name: "ZALVY Enterprise Services",
          description: site.description,
          serviceType: "AI Technology & Software Engineering Services",
        })}
      />
      <Section className="border-border/40 border-b pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <GradientGlow color="iris" size="lg" position="top-left" intensity={0.12} />
        <GradientGlow color="accent" size="md" position="top-right" intensity={0.1} />
        <Container width="wide">
          <div className="max-w-3xl relative z-10">
            <span className="t-eyebrow inline-flex mb-4">Enterprise Services & Capability Matrix</span>
            <h1 className="t-display-2 text-foreground is-balanced mb-6 font-display tracking-display">
              Building Intelligent Systems. Empowering Future Talent.
            </h1>
            <p className="t-body-lg t-muted mb-8">
              We partner with forward-thinking enterprises and startups to architect, deploy, and
              scale state-of-the-art AI infrastructure.
            </p>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">Schedule Engineering Consultation</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="py-16 md:py-24">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicesList.map((service) => {
              const IconComp = service.icon;
              return (
                <GlassCard
                  key={service.title}
                  variant="raised"
                  intensity="medium"
                  glow
                  className="p-8 flex flex-col h-full group transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="bg-accent-subtle text-accent mb-6 inline-flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                      <Icon icon={IconComp} size="lg" aria-hidden />
                    </div>
                    <h2 className="t-h4 text-foreground mb-3 font-display font-semibold">{service.title}</h2>
                    <p className="t-body-sm t-muted mb-6">{service.description}</p>
                  </div>
                  <Link
                    href={service.href}
                    className="text-accent hover:text-iris inline-flex items-center gap-2 t-body font-medium transition-colors"
                  >
                    Learn More
                    <Icon icon={ArrowRight} size="sm" />
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}