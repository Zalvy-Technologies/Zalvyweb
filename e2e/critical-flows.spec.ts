import { test, expect, type Page } from "@playwright/test";

/**
 * The dev server is slow, so hydration can lag several seconds behind `load`.
 * Under the default light color-scheme, hydration flips `data-theme` from the
 * SSR dark default to the system-resolved value — a reliable hydration marker.
 */
async function gotoAndHydrate(page: Page, path = "/") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
}

test.describe("Homepage Critical Path", () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndHydrate(page);
  });

  test("loads homepage with hero section", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("BUILDING");
    await expect(page.locator("h1")).toContainText("SYSTEMS");
    await expect(page.locator("section").first()).toBeVisible();
  });

  test("displays trust bar with selected work", async ({ page }) => {
    await expect(page.locator('[aria-label*="Selected"]')).toBeVisible();
  });

  test("navigates to contact page via CTA", async ({ page }) => {
    await page.click('a[href="/contact"]');
    await page.waitForURL("/contact", { timeout: 30000 });
    await expect(page.locator("h1")).toContainText("Start a conversation with our engineering team");
  });

  test("navigates to platform page via CTA", async ({ page }) => {
    await page.click('a[href="/solutions"]');
    await page.waitForURL("/solutions", { timeout: 30000 });
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndHydrate(page, "/contact");
  });

  test("renders form with all required fields", async ({ page }) => {
    await expect(page.locator('[name="name"]')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="company"]')).toBeVisible();
    await expect(page.locator('[name="message"]')).toBeVisible();
    await expect(page.locator('select[name="reason"]')).toBeVisible();
    await expect(page.locator('select[name="reason"] option[value="enterprise"]')).toHaveText("Enterprise AI Solutions");
    await expect(page.locator('select[name="reason"] option[value="internship"]')).toHaveText("Internship Program");
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("validates required fields using native browser validation", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check that form is still on page (native validation prevented submit)
    await expect(submitButton).toBeVisible();
  });

  test("rejects invalid email via native validation", async ({ page }) => {
    await page.fill('[name="name"]', "John Doe");
    await page.fill('[name="email"]', "invalid-email");
    await page.fill('[name="message"]', "This is a test message that is long enough for validation.");
    await page.selectOption('select[name="reason"]', "enterprise");

    await page.click('button[type="submit"]');
    
    // Form should not submit due to invalid email
    await expect(page.locator('[name="email"]')).toBeVisible();
  });
});

test.describe("Theme Toggle", () => {
  test("toggles between dark and light mode", async ({ page }) => {
    // Pin the environment to a known system scheme so the initial state is deterministic
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check initial theme (dark)
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Click theme toggle
    await page.click('[data-theme-toggle]');

    // Check theme changed to light
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // Click again
    await page.click('[data-theme-toggle]');

    // Check theme back to dark
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndHydrate(page);
  });

  test("mega menu opens on hover", async ({ page }) => {
    await page.hover('button:has-text("Solutions")');
    // Wait for animation
    await page.waitForTimeout(200);
    await expect(page.locator('[role="menu"]')).toBeVisible();
  });

  test("mobile menu opens and closes", async ({ page }) => {
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('[aria-label="Open menu"]');
    await expect(page.locator("#zalvy-mobile-menu")).toBeVisible();
    
    // Close via header close button (not backdrop)
    await page.click('#zalvy-mobile-menu header button[aria-label="Close menu"]');
    await expect(page.locator("#zalvy-mobile-menu")).toBeHidden();
  });
});

test.describe("AI Chat Widget", () => {
  test("opens and closes chat widget", async ({ page }) => {
    await gotoAndHydrate(page);
    
    // Wait for chat widget to load
    await page.waitForSelector('[aria-label="Toggle Zalvy AI Copilot"]');
    
    // Open chat
    await page.click('[aria-label="Toggle Zalvy AI Copilot"]');
    await expect(page.locator('text="ZALVY COPILOT"')).toBeVisible();
    
    // Close chat
    await page.click('button[title="Close Chat"]');
    await expect(page.locator('text="ZALVY COPILOT"')).toBeHidden();
  });
});

test.describe("Accessibility", () => {
  test("skip link works", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator("a[href='#main']:focus")).toBeVisible();
  });

  test("focus visible on interactive elements", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});

test.describe("Performance", () => {
  test("loads homepage within budget", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - start;
    
    // Should load within 5 seconds (more realistic for dev)
    expect(loadTime).toBeLessThan(5000);
  });
});