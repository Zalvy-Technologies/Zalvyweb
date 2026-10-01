// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton component", () => {
  it("renders with status accessibility role and aria-busy attribute", () => {
    render(<Skeleton data-testid="skeleton-el" />);
    const el = screen.getByRole("status");
    expect(el).toBeDefined();
    expect(el.getAttribute("aria-busy")).toBe("true");
  });

  it("applies variant classes correctly", () => {
    render(<Skeleton variant="circular" className="size-12" />);
    const el = screen.getByRole("status");
    expect(el.className).toContain("rounded-full");
  });
});
