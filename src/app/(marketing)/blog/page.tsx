import type { Metadata } from "next";
import { ArrowRight, Calendar, Clock, Tag, FileText, Code2, BrainCircuit, Server, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { buildPageMetadata } from "@/lib/page-metadata";
import { JsonLd } from "@/components/ui/json-ld";
import { blogSchema } from "@/lib/json-ld";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const BLOG_CATEGORIES = [
  { label: "AI Engineering", icon: BrainCircuit, color: "text-iris" },
  { label: "Infrastructure", icon: Server, color: "text-accent" },
  { label: "Agent Systems", icon: Zap, color: "text-amber" },
  { label: "Security", icon: ShieldCheck, color: "text-rose" },
  { label: "Developer Tools", icon: Code2, color: "text-sage" },
  { label: "Research", icon: Sparkles, color: "text-accent" },
] as const;

const BLOG_POSTS = [
  {
    slug: "multi-agent-swarm-architecture",
    title: "Architecting Multi-Agent Swarms for Production",
    excerpt: "How we built ZALVY's autonomous agent orchestration layer that coordinates 50+ specialized workers across global regions with sub-50ms latency.",
    category: "Agent Systems",
    readTime: "12 min",
    date: "2026-08-10",
    author: "Sarah Chen",
    featured: true,
    image: "/blog/multi-agent-swarm.jpg",
  },
  {
    slug: "vector-graph-rag-hybrid-retrieval",
    title: "Hybrid Vector + Graph RAG: Beyond Semantic Search",
    excerpt: "Why pure vector search fails at enterprise scale and how knowledge graph augmentation delivers 40% higher recall for complex queries.",
    category: "AI Engineering",
    readTime: "15 min",
    date: "2026-07-28",
    author: "Marcus Webb",
    featured: false,
    image: "/blog/hybrid-rag.jpg",
  },
  {
    slug: "zero-trust-ai-deployment",
    title: "Zero-Trust AI Deployment on Private Cloud",
    excerpt: "Deploying LLM inference with full data sovereignty — air-gapped Kubernetes, encrypted model weights, and cryptographic audit trails.",
    category: "Security",
    readTime: "18 min",
    date: "2026-07-15",
    author: "Elena Rostova",
    featured: false,
    image: "/blog/zero-trust-ai.jpg",
  },
  {
    slug: "cost-optimization-llm-serving",
    title: "Cutting LLM Inference Costs by 74% with Smart Batching",
    excerpt: "Dynamic batching, speculative decoding, and model routing strategies that reduced our per-token cost from $0.002 to $0.00052.",
    category: "Infrastructure",
    readTime: "10 min",
    date: "2026-07-02",
    author: "David Park",
    featured: false,
    image: "/blog/llm-cost-optimization.jpg",
  },
  {
    slug: "eval-driven-development-ai",
    title: "Eval-Driven Development: Testing AI Systems Like Code",
    excerpt: "Why traditional unit tests fail for non-deterministic systems and how we built a regression evaluation suite that catches 99% of regressions pre-deploy.",
    category: "Developer Tools",
    readTime: "14 min",
    date: "2026-06-20",
    author: "Priya Sharma",
    featured: false,
    image: "/blog/eval-driven-dev.jpg",
  },
  {
    slug: "fine-tuning-enterprise-llms",
    title: "Fine-Tuning Domain LLMs Without Data Leakage",
    excerpt: "Our differential privacy + LoRA approach that achieves 99.8% task accuracy while guaranteeing zero proprietary data exposure.",
    category: "AI Engineering",
    readTime: "16 min",
    date: "2026-06-05",
    author: "Sarah Chen",
    featured: false,
    image: "/blog/fine-tuning-enterprise.jpg",
  },
  {
    slug: "observability-agent-systems",
    title: "Observability for Autonomous Agent Systems",
    excerpt: "Distributed tracing, cost telemetry, and deterministic replay for multi-agent workflows — the observability stack we wish existed.",
    category: "Infrastructure",
    readTime: "11 min",
    date: "2026-05-22",
    author: "Marcus Webb",
    featured: false,
    image: "/blog/observability-agents.jpg",
  },
  {
    slug: "prompt-injection-defense",
    title: "Defending Against Prompt Injection at Scale",
    excerpt: "Real-time prompt injection firewalls, PII redaction pipelines, and adversarial evaluation frameworks for production LLM applications.",
    category: "Security",
    readTime: "13 min",
    date: "2026-05-08",
    author: "Elena Rostova",
    featured: false,
    image: "/blog/prompt-injection.jpg",
  },
];

function BlogPostCard({ post, index }: { post: typeof BLOG_POSTS[0]; index: number }) {
  const categoryConfig = BLOG_CATEGORIES.find((c) => c.label === post.category) ?? BLOG_CATEGORIES[0];

  return (
    <Reveal delay={index * 60} animation="blur-in" className="h-full">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <GlassCard variant="raised" intensity="medium" className="overflow-hidden h-full flex flex-col border border-white/5 hover:border-accent/30 hover:shadow-[0_0_30px_-8px_rgb(var(--token-accent)/0.3)] transition-all duration-500">
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--token-iris)/0.15)] via-transparent to-[rgb(var(--token-accent)/0.1)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon icon={FileText} size="xl" className="text-white/20" />
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              <Badge variant="outline" className={cn("border-white/20 bg-white/10 text-white/80", post.featured && "border-accent/40 bg-accent/20 text-accent")}>
                {post.featured ? "Featured" : "Article"}
              </Badge>
              <Badge variant="outline" className="border-white/20 bg-white/10 text-white/80 text-[10px]">
                <Icon icon={categoryConfig.icon} size="xs" className={cn("mr-1", categoryConfig.color)} />
                {post.category}
              </Badge>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 text-xs text-foreground-subtle mb-3">
              <span className="flex items-center gap-1">
                <Icon icon={Calendar} size="xs" />
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Icon icon={Clock} size="xs" />
                {post.readTime}
              </span>
            </div>
            <h3 className="t-h4 text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <p className="t-body-sm t-muted leading-relaxed mb-4 flex-1">{post.excerpt}</p>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="t-caption t-subtle">{post.author}</span>
              <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all">
                Read more
                <ArrowRight size={12} strokeWidth={2} />
              </span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </Reveal>
  );
}

export const metadata: Metadata = buildPageMetadata({
  title: "Engineering Blog — ZALVY",
  description: "Deep technical writing on AI agents, multi-agent systems, LLM infrastructure, zero-trust security, and developer tooling from the ZALVY engineering team.",
  path: "/blog",
});

const blogJsonLd = blogSchema(
  BLOG_POSTS.map((p) => ({
    headline: p.title,
    description: p.excerpt,
    url: `${site.url}/blog/${p.slug}`,
    datePublished: p.date,
    author: { name: p.author },
    image: `${site.url}${p.image}`,
  })),
);

export default function BlogPage() {
  const featuredPost = BLOG_POSTS.find(p => p.featured);
  const regularPosts = BLOG_POSTS.filter(p => !p.featured);

  return (
    <>
      <JsonLd id="jsonld-blog" data={blogJsonLd} />
      <Container>
        <Section id="hero" rhythm="tight" className="pt-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="iris" size="lg">
              ENGINEERING BLOG
            </Badge>
            <h1 className="t-display-2 text-foreground is-balanced">
              Deep technical writing from the front lines of AI.
            </h1>
            <p className="t-body-lg text-foreground-muted">
              We publish production-grade architectures, hard-won lessons, and open-source tooling. No marketing fluff — just engineering.
            </p>
          </div>
        </Section>

        {featuredPost && (
          <Section id="featured" rhythm="default">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="t-overline t-subtle">Featured</span>
                <h2 className="t-h2 text-foreground mt-1">Our latest deep dive</h2>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Reveal delay={0} animation="blur-in">
                  <Link href={`/blog/${featuredPost.slug}`} className="block h-full group">
                    <GlassCard variant="premium" intensity="strong" className="relative overflow-hidden h-full min-h-[360px] flex flex-col border border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--token-iris)/0.1)] via-transparent to-[rgb(var(--token-accent)/0.08)]" />
                      <div className="relative flex-1 flex items-end p-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="border-accent/40 bg-accent/20 text-accent">Featured</Badge>
                          {BLOG_CATEGORIES.filter(c => c.label === featuredPost.category).map(c => (
                            <Badge key={c.label} variant="outline" className="border-white/20 bg-white/10 text-white/80">
                              <Icon icon={c.icon} size="xs" className={cn("mr-1", c.color)} />
                              {c.label}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="t-h2 text-foreground mb-3 max-w-2xl">{featuredPost.title}</h3>
                        <p className="t-body t-muted max-w-xl mb-6">{featuredPost.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-foreground-subtle mb-6">
                          <span className="flex items-center gap-1">
                            <Icon icon={Calendar} size="xs" />
                            {new Date(featuredPost.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon icon={Clock} size="xs" />
                            {featuredPost.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon icon={Tag} size="xs" />
                            {featuredPost.author}
                          </span>
                        </div>
                        <span className={cn(buttonVariants({ variant: "primary", size: "lg" }), "inline-flex items-center gap-2 group-hover:brightness-110")}>
                          Read Article
                          <Icon icon={ArrowRight} size="sm" />
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                </Reveal>
              </div>
              <div className="space-y-4">
                {regularPosts.slice(0, 2).map((post, i) => (
                  <Reveal key={post.slug} delay={100 + i * 60} animation="blur-in">
                    <Link href={`/blog/${post.slug}`} className="block">
                      <GlassCard variant="raised" intensity="medium" className="p-4 flex gap-4 hover:border-accent/30 transition-all">
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[rgb(var(--token-iris)/0.15)] to-[rgb(var(--token-accent)/0.1)] flex items-center justify-center shrink-0">
                          <Icon icon={FileText} size="lg" className="text-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="border-white/10 bg-white/5 text-white/60 text-[10px] mb-2">{post.category}</Badge>
                          <h4 className="t-body font-medium text-foreground line-clamp-2 mb-1">{post.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                            <Icon icon={Calendar} size="xs" />
                            <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            <span>·</span>
                            <Icon icon={Clock} size="xs" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </Section>
        )}

        <Section id="all-posts" rhythm="default" surface="veil">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="t-overline t-subtle">All Articles</span>
              <h2 className="t-h2 text-foreground mt-1">Recent publications</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <Badge key={cat.label} variant="outline" className="border-white/10 bg-white/5 text-white/70 hover:border-accent/30 hover:text-accent hover:bg-accent/10 transition-all">
                  <Icon icon={cat.icon} size="xs" className={cn("mr-1", cat.color)} />
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, i) => (
              <BlogPostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </Section>

        <Section id="newsletter" rhythm="tight" className="text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="t-h2 text-foreground">Get the next deep dive in your inbox</h2>
            <p className="t-body t-muted">Monthly. No spam. Unsubscribe anytime.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="you@company.com"
                required
                className="flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Button type="submit" variant="primary" size="lg">
                Subscribe
                <Icon icon={ArrowRight} size="sm" />
              </Button>
            </form>
            <p className="t-caption t-subtle">By subscribing, you agree to our <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.</p>
          </div>
        </Section>
      </Container>
    </>
  );
}