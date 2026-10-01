import type { Metadata } from "next";
import { ArrowRight, GraduationCap, CircuitBoard, Users, Code2, BrainCircuit, ShieldCheck, Zap, MapPin, DollarSign, Clock, Heart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/page-metadata";
import { JsonLd } from "@/components/ui/json-ld";
import { jobSchema } from "@/lib/json-ld";
import { cn } from "@/lib/cn";
import { OPEN_ROLES } from "@/data/careers";
import type { JobPosting } from "@/data/careers";

const BENEFITS = [
  { icon: DollarSign, title: "Competitive Equity", desc: "Generous stock options with 4-year vesting, 1-year cliff. We want you to be an owner." },
  { icon: Heart, title: "Health & Wellness", desc: "100% covered medical, dental, vision for you + dependents. Mental health stipend." },
  { icon: Clock, title: "Flexible Schedule", desc: "Core hours 10am-3pm PT. Work when you're productive. 4-day week option for seniors." },
  { icon: MapPin, title: "Remote-First", desc: "Hire anywhere in US/EU. Quarterly offsites in SF. Visa support for exceptional candidates." },
  { icon: Code2, title: "Learning Budget", desc: "$5k/year for courses, conferences, certifications. Paid time for OSS contributions." },
  { icon: Users, title: "Team Offsites", desc: "Quarterly in-person gatherings. Annual company retreat. All expenses covered." },
];

const CULTURE_PRINCIPLES = [
  { icon: Zap, title: "Ship to Production", desc: "A demo is not a delivery. Operating software runs in our infrastructure or we don't call it done." },
  { icon: ShieldCheck, title: "Observability First", desc: "Every system ships with cost telemetry from day one. We prove it works, we don't just hope." },
  { icon: BrainCircuit, title: "Measured Impact", desc: "Every engagement has a written success metric agreed before kickoff. We measure what we build." },
  { icon: Users, title: "Small Teams, High Trust", desc: "We run with few people who trust each other completely. Each person ships, reviews, and operates." },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Careers at ZALVY — Build the Future of AI",
  description: "Join the team building autonomous AI agents, enterprise automation, and developer tooling. Competitive equity, remote-first, 4-day week option. Open roles in AI engineering, ML infrastructure, security, and research.",
  path: "/careers",
});

const jobsJsonLd = jobSchema(
  OPEN_ROLES.map((r) => {
    const salary = r.salary ?? "$140k - $250k + equity";
    const minSalary = /\$(\d+)/.exec(salary)?.[1] ?? "140000";
    const maxSalary = /\$(\d+) - \$(\d+)/.exec(salary)?.[2] ?? "250000";
    return {
      title: r.title,
      description: r.description,
      identifier: { name: "ZALVY", value: r.id },
      datePosted: "2026-08-14",
      validThrough: "2026-12-31",
      employmentType: "FULL_TIME",
      hiringOrganization: { name: "Zalvy Technologies", sameAs: "https://zalvy.com" },
      jobLocation: { address: { addressLocality: r.location.split("/")[0]?.trim() ?? r.location, addressCountry: "INDIA" } },
      baseSalary: {
        currency: "USD",
        value: { minValue: Number.parseInt(minSalary, 10), maxValue: Number.parseInt(maxSalary, 10), unitText: "YEAR" },
      },
    };
  }),
);

function RoleCard({ role, index }: { role: JobPosting; index: number }) {
  const department = role.department ?? role.team;
  const type = role.type ?? "Full-time";
  const salary = role.salary ?? "Competitive";
  const requirements =
    (role as unknown as { requirements?: string[] }).requirements ?? role.qualifications;
  const benefits = role.benefits ?? [];
  void benefits;
  return (
    <Reveal delay={index * 60} animation="blur-in">
      <Link href={`/careers/${role.id}`} className="block">
        <GlassCard variant={role.featured ? "premium" : "raised"} intensity={role.featured ? "strong" : "medium"} className="overflow-hidden h-full flex flex-col border border-white/5 hover:border-accent/30 hover:shadow-[0_0_30px_-8px_rgb(var(--token-accent)/0.3)] transition-all duration-500">
          {role.featured && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgb(var(--token-iris))] to-[rgb(var(--token-accent))]" />
          )}
          <div className="p-6 flex flex-col flex-1 relative">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70">{department}</Badge>
                  <Badge variant={role.featured ? "accent" : "outline"} className={cn("border-white/10 bg-white/5 text-white/70", role.featured && "border-accent/40 bg-accent/20 text-accent")}>
                    {role.featured ? "Featured" : "Open"}
                  </Badge>
                </div>
                <h3 className="t-h3 text-foreground mb-1">{role.title}</h3>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-foreground-subtle mb-4">
              <span className="flex items-center gap-1"><Icon icon={MapPin} size="xs" />{role.location}</span>
              <span className="flex items-center gap-1"><Icon icon={Clock} size="xs" />{type}</span>
              <span className="flex items-center gap-1"><Icon icon={DollarSign} size="xs" />{salary}</span>
            </div>

            <p className="t-body-sm t-muted leading-relaxed mb-4 flex-1">{role.description}</p>

            <div className="border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <span className="t-caption t-subtle">{requirements.length} key requirements</span>
                <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all">
                  View details
                  <ArrowRight size={12} strokeWidth={2} />
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </Reveal>
  );
}

function BenefitCard({ benefit, index }: { benefit: typeof BENEFITS[0]; index: number }) {
  return (
    <Reveal delay={index * 60} animation="blur-in">
      <GlassCard variant="raised" intensity="medium" className="p-6 h-full flex flex-col border border-white/5 hover:border-accent/30 transition-all">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20 mb-4">
          <benefit.icon className="h-6 w-6" />
        </div>
        <h4 className="t-h4 text-foreground mb-2">{benefit.title}</h4>
        <p className="t-body-sm t-muted leading-relaxed flex-1">{benefit.desc}</p>
      </GlassCard>
    </Reveal>
  );
}

function CultureCard({ principle, index }: { principle: typeof CULTURE_PRINCIPLES[0]; index: number }) {
  return (
    <Reveal delay={index * 60} animation="blur-in">
      <GlassCard variant="raised" intensity="medium" className="p-6 h-full flex flex-col border border-white/5 hover:border-accent/30 transition-all">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent border border-accent/20 mb-4">
          <principle.icon className="h-5 w-5" />
        </div>
        <h4 className="t-h4 text-foreground mb-2">{principle.title}</h4>
        <p className="t-body-sm t-muted leading-relaxed flex-1">{principle.desc}</p>
      </GlassCard>
    </Reveal>
  );
}

export default function CareersPage() {
  const featuredRole = OPEN_ROLES.find(r => r.featured);
  const otherRoles = OPEN_ROLES.filter(r => !r.featured);

  return (
    <>
      <JsonLd id="jsonld-careers" data={jobsJsonLd} />
      <Container>
        <Section id="hero" rhythm="tight" className="pt-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="iris" size="lg">
              JOIN THE TEAM
            </Badge>
            <h1 className="t-display-2 text-foreground is-balanced">
              Build intelligent systems. Grow the engineers who build what&apos;s next.
            </h1>
            <p className="t-body-lg text-foreground-muted">
              We&apos;re a small, high-trust team shipping autonomous AI agents to production. Every role has ownership, impact, and a path to mastery.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <Link href="/careers/internship" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
                <Icon icon={GraduationCap} size="sm" />
                Internship Program
              </Link>
              <span className="text-foreground-subtle">·</span>
              <Link href="/careers/bench" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
                <Icon icon={CircuitBoard} size="sm" />
                Engineering Bench
              </Link>
            </div>
          </div>
        </Section>

        {featuredRole && (
          <Section id="featured-role" rhythm="default">
            <Reveal delay={0} animation="blur-in">
              <Link href={`/careers/${featuredRole.id}`} className="block">
                <GlassCard variant="premium" intensity="strong" className="relative overflow-hidden p-8 lg:p-12 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--token-iris)/0.08)] via-transparent to-[rgb(var(--token-accent)/0.05)]" />
                  <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="flex-1 max-w-2xl">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="accent" size="lg">Featured Role</Badge>
                        <Badge variant="outline" className="border-white/20 bg-white/10 text-white/80">{featuredRole.department ?? featuredRole.team}</Badge>
                      </div>
                      <h2 className="t-h1 text-foreground mb-4 max-w-xl">{featuredRole.title}</h2>
                      <p className="t-body-lg t-muted mb-6 max-w-xl">{featuredRole.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-foreground-subtle mb-6">
                        <span className="flex items-center gap-1"><Icon icon={MapPin} size="xs" />{featuredRole.location}</span>
                        <span className="flex items-center gap-1"><Icon icon={Clock} size="xs" />{featuredRole.type ?? "Full-time"}</span>
                        <span className="flex items-center gap-1"><Icon icon={DollarSign} size="xs" />{featuredRole.salary ?? "Competitive"}</span>
                      </div>
                      <Button asChild variant="primary" size="lg">
                        <Link href={`/careers/${featuredRole.id}`}>
                          View Role & Apply
                          <Icon icon={ArrowRight} size="sm" />
                        </Link>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3 lg:ml-8">
                      {(featuredRole.benefits ?? []).map((b, i) => (
                        <Badge key={i} variant="outline" className="border-white/10 bg-white/5 text-white/70 text-xs">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </Reveal>
          </Section>
        )}

        <Section id="open-roles" rhythm="default" surface="veil">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="t-overline t-subtle">Open Positions</span>
              <h2 className="t-h2 text-foreground mt-1">All current openings</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherRoles.map((role, i) => (
              <RoleCard key={role.id} role={role} index={i} />
            ))}
          </div>
        </Section>

        <Section id="benefits" rhythm="default">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="t-overline t-subtle">Benefits</span>
            <h2 className="t-h2 text-foreground mt-2 mb-4">Designed for builders who value ownership</h2>
            <p className="t-body t-muted">We optimize for long-term alignment, not perks theater.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, i) => (
              <BenefitCard key={benefit.title} benefit={benefit} index={i} />
            ))}
          </div>
        </Section>

        <Section id="culture" rhythm="default" surface="veil">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="t-overline t-subtle">How We Work</span>
            <h2 className="t-h2 text-foreground mt-2 mb-4">Principles, not policies</h2>
            <p className="t-body t-muted">Four operating principles that guide every decision.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CULTURE_PRINCIPLES.map((principle, i) => (
              <CultureCard key={principle.title} principle={principle} index={i} />
            ))}
          </div>
        </Section>

        <Section id="cta" rhythm="tight" className="text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="t-h2 text-foreground">Don&apos;t see your perfect role?</h2>
            <p className="t-body t-muted">We&apos;re always looking for exceptional engineers. Send us your best work — GitHub, papers, projects, or a note on why ZALVY.</p>
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">
                Start a conversation
                <Icon icon={ArrowRight} size="sm" />
              </Link>
            </Button>
          </div>
        </Section>
      </Container>
    </>
  );
}