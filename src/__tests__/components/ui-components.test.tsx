// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

describe("Reusable UI Components", () => {
  it("renders EmptyState title and description correctly", () => {
    render(
      <EmptyState
        title="No Datasets Found"
        description="Please connect your GCP BigQuery dataset."
      />,
    );
    expect(screen.getByText("No Datasets Found")).toBeDefined();
    expect(screen.getByText("Please connect your GCP BigQuery dataset.")).toBeDefined();
  });

  it("renders ErrorState with alert role", () => {
    render(<ErrorState title="Database Offline" />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(screen.getByText("Database Offline")).toBeDefined();
  });

  it("renders Breadcrumbs with items and current page aria landmark", () => {
    const items = [
      { label: "Platform", href: "/platform" },
      { label: "AI Agents", href: "/platform/agents" },
    ];
    render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeDefined();
    expect(screen.getByText("AI Agents").getAttribute("aria-current")).toBe("page");
  });
});
