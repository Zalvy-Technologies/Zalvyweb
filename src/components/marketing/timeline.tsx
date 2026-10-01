import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  badge?: string;
  icon?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * Timeline — Reusable chronological process / milestone display component.
 */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <div
      className={cn(
        "before:bg-border-strong relative space-y-8 before:absolute before:inset-0 before:left-3.5 before:w-0.5",
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="relative flex items-start gap-6 pl-10">
          <div className="bg-surface-raised border-border-strong text-accent absolute top-1 left-0 flex size-7 items-center justify-center rounded-full border shadow-sm">
            {item.icon ?? <div className="bg-accent size-2 rounded-full" />}
          </div>
          <div className="surface-raised border-border/60 flex-1 rounded-2xl border p-6">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-accent font-mono text-xs font-medium">{item.date}</span>
              {item.badge && (
                <span className="text-overline bg-accent-subtle text-accent border-accent/20 rounded-full border px-2 py-0.5 font-mono">
                  {item.badge}
                </span>
              )}
            </div>
            <h4 className="text-h4 font-display text-foreground mb-2 font-semibold">
              {item.title}
            </h4>
            <p className="text-body-sm text-foreground-muted leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
