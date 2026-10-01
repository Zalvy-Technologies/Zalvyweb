import { type ReactNode } from "react";

import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";

import { TRUST_POINTS, type TrustPoint } from "@/data/trust-points";

interface TrustBandProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: TrustPoint[];
}

/**
 * `TrustBand` — a four-tile proof strip reused across platform inner pages and
 * the home/pricing/about surfaces where structural proof is needed.
 *
 * Defaults to the cross-pillar ZALVY trust points so callers who omit the items
 * prop inherit the same canonical story.
 */
export function TrustBand({
  eyebrow = "Operating posture",
  title = "Trust is structural, not promised.",
  description = "The same controls ship in every ZALVY product surface. These are not a tier.",
  items = TRUST_POINTS,
}: TrustBandProps): ReactNode {
  return (
    <Section id="trust" eyebrow={eyebrow} title={title} description={description} rhythm="default">
      <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            key={item.title}
            as="li"
            delay={i * 60}
            animation="blur-in"
            className="rounded-2xl"
          >
            <div className="group bg-surface-raised border-border hover:border-border-strong hover:bg-surface-overlay relative flex h-full flex-col gap-3 rounded-2xl border p-6 transition-[background-color,border-color,box-shadow,transform] duration-300 motion-reduce:transition-none">
              <span className="bg-accent-subtle ring-accent/15 text-accent inline-flex size-10 items-center justify-center rounded-xl ring-1 ring-inset">
                <Icon icon={item.icon} aria-hidden />
              </span>
              <h3 className="t-h5 text-foreground is-balanced">{item.title}</h3>
              <p className="t-body-sm t-muted leading-snug">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
