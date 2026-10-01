import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbSchema } from "@/lib/json-ld";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: `Featured Projects & Case Studies — ${site.name}`,
  description:
    "Explore ZALVY's flagship AI projects, high-throughput agent routing engines, and enterprise automation case studies.",
  alternates: { canonical: "/projects" },
};

const projects = [
  {
    title: "Project Helios — Agentic Routing Engine",
    slug: "helios-agent-routing",
    client: "Global Fintech Leader",
    impact: "99.98% accuracy on 4.2M daily automated financial queries",
    description:
      "A multi-model agent router that dynamically directs complex financial operations to specialized specialized micro-agents.",
  },
  {
    title: "Quanta — Research Automation Pipeline",
    slug: "quanta-research-ops",
    client: "Biotech Enterprise",
    impact: "14x speedup in literature synthesis and clinical trial parsing",
    description:
      "Automated extraction and structured knowledge graph construction from PubMed and arXiv clinical repositories.",
  },
  {
    title: "Aperture — Microsecond LLM Inference Middleware",
    slug: "aperture-inference",
    client: "AI Developer Tooling",
    impact: "<40ms P99 latency with zero payload corruption",
    description:
      "Ultra-low latency streaming relay for real-time code generation and autonomous developer agent feedback loops.",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />
      <Section className="border-border/40 border-b pt-24 pb-16 md:pt-32 md:pb-24">
        <Container width="wide">
          <p className="text-accent mb-4 font-mono text-xs font-medium tracking-wider uppercase">
            Production Engineering Portfolio
          </p>
          <h1 className="text-display-2 font-display tracking-display text-foreground mb-4 font-bold">
            Featured Enterprise Projects
          </h1>
          <p className="text-body-lg text-foreground-muted max-w-2xl">
            Real-world systems engineered for scale, reliability, and high-concurrency enterprise
            environments.
          </p>
        </Container>
      </Section>

      <Section className="py-16 md:py-24">
        <Container width="wide">
          <div className="space-y-8">
            {projects.map((proj) => (
              <div
                key={proj.slug}
                className="group surface-raised border-border/60 hover:border-accent/40 grid grid-cols-1 items-center gap-8 rounded-3xl border p-8 transition-all md:p-12 lg:grid-cols-12"
              >
                <div className="lg:col-span-8">
                  <div className="text-accent mb-3 flex items-center gap-3 font-mono text-xs">
                    <Layers className="size-4" />
                    <span>{proj.client}</span>
                  </div>
                  <h2 className="text-h2 font-display text-foreground group-hover:text-accent mb-4 font-bold transition-colors">
                    {proj.title}
                  </h2>
                  <p className="text-body text-foreground-muted mb-6">{proj.description}</p>
                  <div className="bg-accent-subtle text-accent inline-block rounded-xl px-4 py-2 font-mono text-sm font-medium">
                    Impact: {proj.impact}
                  </div>
                </div>

                <div className="lg:col-span-4 lg:text-right">
                  <Link
                    href={`/studio/work/${proj.slug}`}
                    className="bg-accent text-accent-foreground inline-flex h-12 items-center gap-2 rounded-xl px-6 font-medium transition-all hover:brightness-110"
                  >
                    View Case Study <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
