import { type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ErrorStateProps {
  /** Icon displayed in the center header */
  icon?: ReactNode;
  /** Primary headline error message */
  title?: string;
  /** Detailed error message */
  description?: string;
  /** Action slot (e.g. Retry Button) */
  action?: ReactNode;
  /** Additional container classes */
  className?: string;
}

/**
 * ErrorState — Reusable component for inline component failure or network error handling.
 */
export function ErrorState({
  icon = <AlertCircle className="text-danger size-8" />,
  title = "Failed to load resource",
  description = "An issue occurred while communicating with the system. Please check your connectivity and retry.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "bg-danger/5 border-danger/20 mx-auto my-6 flex max-w-md flex-col items-center justify-center rounded-3xl border p-8 text-center",
        className,
      )}
    >
      <div className="bg-danger/10 mb-4 flex size-14 items-center justify-center rounded-2xl">
        {icon}
      </div>
      <h3 className="text-h4 font-display text-foreground mb-2 font-semibold">{title}</h3>
      <p className="text-body-sm text-foreground-muted mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
