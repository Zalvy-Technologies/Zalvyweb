// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders button with children text", () => {
    render(<Button>Deploy Agent</Button>);
    const btn = screen.getByRole("button", { name: "Deploy Agent" });
    expect(btn).toBeDefined();
  });

  it("triggers onClick callback when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables click events when disabled prop is true", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Disabled Button" });
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
    expect(btn.getAttribute("aria-disabled")).toBe("true");
  });

  it("applies variant and custom className correctly", () => {
    render(
      <Button variant="secondary" className="custom-class">
        Secondary Action
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Secondary Action" });
    expect(btn.className).toContain("custom-class");
    expect(btn.className).toContain("surface-raised");
  });
});
