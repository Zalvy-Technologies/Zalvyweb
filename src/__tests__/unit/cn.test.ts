import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn utility", () => {
  it("combines multiple class strings correctly", () => {
    const result = cn("px-4", "py-2", "bg-black");
    expect(result).toBe("px-4 py-2 bg-black");
  });

  it("handles conditional classes smoothly", () => {
    const isActive = Boolean(1);
    const isDisabled = Boolean(0);
    const result = cn("btn", isActive && "btn-active", isDisabled && "btn-disabled");
    expect(result).toBe("btn btn-active");
  });

  it("deduplicates conflicting Tailwind utility classes using tailwind-merge", () => {
    const result = cn("px-4 px-8", "text-blue-500 text-red-500");
    expect(result).toBe("px-8 text-red-500");
  });

  it("handles undefined, null, and empty inputs gracefully", () => {
    const result = cn("base", undefined, null, "", "accent");
    expect(result).toBe("base accent");
  });
});
