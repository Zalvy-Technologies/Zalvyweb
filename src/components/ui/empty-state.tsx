import { type ReactNode } from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  /** Icon displayed in the center header */
  icon?: ReactNode;
  /** Primary headline title */
  title: string;
  /** Explanatory description */
  description?: string;
  /** Optional action slot (e.g. CTA Button) */
  action?: ReactNode;
  /** Additional container classes */
  className?: string;
}

/**
 * EmptyState — Reusable zero-data placeholder component.
 */
export function EmptyState({
  icon = <FolderOpen className="text-foreground-subtle size-8" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-raised border-border/60 mx-auto flex max-w-lg flex-col items-center justify-center rounded-3xl border p-12 text-center",
        className,
      )}
    >
      <div className="bg-surface-overlay border-border/40 mb-6 flex size-16 items-center justify-center rounded-2xl border">
        {icon}
      </div>
      <h3 className="text-h4 font-display text-foreground mb-2 font-semibold">{title}</h3>
      {description && (
        <p className="text-body-sm text-foreground-muted mb-6 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
