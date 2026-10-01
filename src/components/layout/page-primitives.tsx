import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

interface PageHeroProps {
  /** Eyebrow chip — usually the section family ("Platform"). */
  eyebrow?: string;
  /** Optional pill label e.g., "Announcing v2" — shown above the title. */
  badge?: string;
  title: ReactNode;
  description: ReactNode;
  /** Optional row of focused CTAs. */
  actions?: ReactNode;
  /** Optional stat row — a quiet engineering colophon under the hero. */
  metrics?: { label: string; value: string }[];
}

/**
 * `PageHero` — the canonical above-the-fold band used on every inner page.
 *
 * Why a single primitive (instead of per-page bespoke heroes):
 *  - Constrained composition prevents the inevitable drift toward "this page
 *    got a different hero treatment". All inner ZALVY pages now share a single
 *    editorial voice — Apple/Linear/Vercel pages do exactly this.
 *  - The aurora wash + optional grid + bottom fade match the homepage hero so
 *    navigation across routes feels continuous, not jumpy.
 *
 * The component is server-safe (no client behavior). Animations are gated by
 * `prefers-reduced-motion` in motion.css. JS reveal is opt-in via <Reveal>.
 */
export function PageHero({ eyebrow, badge, title, description, actions, metrics }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-hero-title"
      className="relative overflow-hidden pt-[calc(var(--section-gap)*0.6)] pb-[calc(var(--section-gap)*0.7)] md:pt-[calc(var(--section-gap)*0.8)] md:pb-[calc(var(--section-gap)*0.9)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="a-aurora absolute top-[-25%] left-1/2 h-[48rem] w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--token-accent)/0.16),transparent_70%)] opacity-40 motion-reduce:animate-none" />
        <div className="a-aurora absolute top-[-10%] right-[-15%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--token-iris)/0.16),transparent_72%)] opacity-30 motion-reduce:animate-none" />
        <div
          aria-hidden
          className="absolute inset-0 h-full opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--token-foreground)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--token-foreground)) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%)",
          }}
        />
      </div>

      <Container className="relative">
        <div className="mx-auto flex max-w-[44rem] flex-col items-start gap-5 text-center md:mx-0 md:text-left">
          {badge ? (
            <Reveal animation="fade">
              <Badge variant="iris" size="lg" className="backdrop-blur-sm">
                {badge}
              </Badge>
            </Reveal>
          ) : null}
          {eyebrow ? (
            <Reveal animation="fade" delay={60}>
              <span className="t-eyebrow justify-center md:justify-start">{eyebrow}</span>
            </Reveal>
          ) : null}
          <Reveal
            as="h1"
            delay={100}
            className="t-display-2 text-foreground is-balanced"
            id="page-hero-title"
          >
            {title}
          </Reveal>
          <Reveal as="p" delay={160} className="t-body-lg t-muted mx-auto max-w-[36rem] md:mx-0">
            {description}
          </Reveal>
          {actions ? (
            <Reveal
              as="div"
              delay={220}
              className="mt-1 flex flex-col items-center gap-3 sm:flex-row md:items-start"
            >
              {actions}
            </Reveal>
          ) : null}
          {metrics && metrics.length > 0 ? (
            <Reveal
              as="dl"
              delay={300}
              className="t-num-tabular mt-10 grid w-full max-w-2xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3"
            >
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className={cn(
                    "flex flex-col gap-0.5 text-center md:text-left",
                    i === metrics.length - 1 && metrics.length % 2 === 1
                      ? "col-span-2 md:col-span-1"
                      : "",
                  )}
                >
                  <dt className="text-overline t-subtle order-2 tracking-widest uppercase">
                    {m.label}
                  </dt>
                  <dd className="t-h4 text-foreground order-1">{m.value}</dd>
                </div>
              ))}
            </Reveal>
          ) : null}
        </div>
      </Container>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[rgb(var(--token-canvas))]"
      />
    </section>
  );
}

interface BreadcrumbProps {
  items: { label: string; href: string; current?: boolean }[];
}

/**
 * `Breadcrumb` — inner-page journey indicator. Uses a styled <ol> with
 * aria-current="page" on the last item per WAI-ARIA Authoring Practices.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="t-subtle flex flex-wrap items-center gap-2 text-[0.8125rem]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="inline-flex items-center gap-2">
              {last || item.current ? (
                <span aria-current="page" className="text-foreground-muted">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-foreground duration-quick transition-colors"
                >
                  {item.label}
                </a>
              )}
              {!last ? (
                <span aria-hidden className="text-foreground-subtle/50">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface FeatureGridProps {
  items: { title: string; description: string; icon: LucideIcon }[];
  columns?: 2 | 3;
}

/**
 * `FeatureGrid` — a uniform grid of capability/feature tiles. Three-column on
 * lg, two on sm. Used across platform inner pages.
 */
export function FeatureGrid({ items, columns = 3 }: FeatureGridProps) {
  return (
    <ul
      className={cn(
        "grid list-none gap-4 p-0",
        columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2",
      )}
    >
      {items.map((item, i) => (
        <Reveal as="li" key={item.title} delay={i * 60} animation="blur-in" className="rounded-2xl">
          <div className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex h-full flex-col gap-3 rounded-2xl border p-6 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:shadow-lg motion-reduce:transition-none md:p-7">
            <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset">
              <Icon icon={item.icon} aria-hidden />
            </span>
            <h3 className="t-h4 text-foreground is-balanced">{item.title}</h3>
            <p className="t-body-sm t-muted leading-snug">{item.description}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

interface StatRowProps {
  stats: { value: string; label: string; caption?: string }[];
  surface?: "plain" | "veil";
}

/**
 * `StatRow` — horizontal proof band used mid-page. Veiled surface variant for
 * subtle differentiation between sections. Numbers use `t-num-tabular` to avoid
 * digit jitter on hydration.
 */
export function StatRow({ stats, surface = "veil" }: StatRowProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-24",
        surface === "veil" && "from-surface/40 via-surface/0 to-surface/40 bg-gradient-to-b",
      )}
    >
      <Container>
        <dl className="t-num-tabular grid grid-cols-2 gap-8 md:gap-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-2">
              <dd className="t-display-3 t-gradient-iris leading-none">{s.value}</dd>
              <dt className="t-h5 text-foreground mt-1">{s.label}</dt>
              {s.caption ? (
                <p className="t-body-sm t-muted max-w-[16rem] leading-snug">{s.caption}</p>
              ) : null}
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

interface CtaCardProps {
  title: string;
  description: string;
  primary?: ReactNode;
  secondary?: ReactNode;
}

/**
 * `CtaCard` — a calm, focused call-to-action block for the foot of any inner
 * page. Pairs a single declarative headline with at most two actions to preserve
 * the editorial voice maintained across the site.
 */
export function CtaCard({ title, description, primary, secondary }: CtaCardProps) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="border-border bg-surface-raised/60 relative overflow-hidden rounded-3xl border p-8 md:p-14">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="a-aurora absolute top-0 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--token-accent)/0.2),transparent_70%)] opacity-30 motion-reduce:animate-none" />
          </div>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <h2 className="t-h2 text-foreground is-balanced">{title}</h2>
            <p className="t-body-lg t-muted max-w-xl">{description}</p>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              {primary}
              {secondary}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
