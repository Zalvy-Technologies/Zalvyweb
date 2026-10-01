"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function ProblemSection() {
  return (
    <Section>
      <Container width="default">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="t-overline text-foreground-subtle text-[0.6875rem] uppercase tracking-[0.18em] mb-3">The Challenge</div>
            <h2 className="t-h1 font-[650] tracking-[-0.03em] mb-4">Tools, people, processes — disconnected execution</h2>
            <p className="t-body-lg t-muted max-w-prose">Teams juggle fragmented systems, manual handoffs and brittle integrations. Intelligence stays trapped in silos while execution slows down.</p>
          </div>
          <div className="surface-raised rounded-2xl border border-white/6 p-6 backdrop-blur-xl">
            <p className="t-body t-muted">ZALVY connects intent to execution with autonomous agents and deterministic automation — one coordinated system, observable and policy-gated.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
