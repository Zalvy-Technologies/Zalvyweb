import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

import { cn } from "@/lib/cn";
import { Container } from "./container";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  rhythm?: "tight" | "compact" | "default" | "spacious";
  surface?: "plain" | "raised" | "panel" | "veil";
  align?: "left" | "center";
}

const rhythmMap = {
  tight: "py-8 md:py-10",
  compact: "py-12 md:py-16",
  default: "py-20 md:py-28 lg:py-32",
  spacious: "py-24 md:py-32 lg:py-40",
};

const surfaceMap = {
  plain: "",
  raised: "bg-surface",
  panel: "bg-surface-raised border-y border-border",
  veil: "bg-gradient-to-b from-surface/40 via-surface/0 to-surface/40",
};

/**
 * `Section` — composes Container + the canonical section heading block.
 *
 * Replaces 200+ bespoke section-header duplications across the site with a
 * single predictable structure: eyebrow → title → description → body.
 * Three knobs (rhythm, surface, align) cover every page composition need.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    id,
    eyebrow,
    title,
    description,
    children,
    rhythm = "default",
    surface = "plain",
    align = "left",
    className,
    ...rest
  },
  ref,
) {
  const showHeading = (eyebrow ?? title ?? description) !== undefined;
  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative", rhythmMap[rhythm], surfaceMap[surface], className)}
      {...rest}
    >
      <Container>
        {showHeading ? (
          <header
            className={cn(
              "mb-12 flex max-w-[42rem] flex-col gap-4 md:mb-14",
              align === "center" && "mx-auto items-center text-center",
            )}
          >
            {eyebrow ? (
              <span className="t-eyebrow tracking-[0.18em] text-[0.6875rem]" data-eyebrow>
                {eyebrow}
              </span>
            ) : null}
            {title ? <h2 className="t-h2 text-foreground is-balanced tracking-[-0.025em]">{title}</h2> : null}
            {description ? <p className="t-body-lg t-muted max-w-[36rem] leading-relaxed">{description}</p> : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
});
