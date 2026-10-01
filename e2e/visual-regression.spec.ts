import { test, expect, type Page } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "ultrawide", width: 1920, height: 1080 },
];

const PAGES = [
  { path: "/", name: "home" },
  { path: "/platform", name: "platform" },
  { path: "/contact", name: "contact" },
  { path: "/about", name: "about" },
  { path: "/verify", name: "verify" },
  { path: "/services", name: "services" },
  { path: "/blog", name: "blog" },
  { path: "/careers/internship", name: "internship" },
];

const SCREENSHOT_OPTIONS = {
  fullPage: true,
  threshold: 0.1, // 10% pixel difference allowed (particles/aurora drift)
  maxDiffPixels: 1000,
  animations: "disabled",
} as const;

/**
 * Loads a page and settles lazy-loaded sections (IntersectionObserver-based)
 * so full-page captures don't shift height mid-capture.
 *
 * Homepage uses <LazySection> for 10 below-fold chunks — they only load when
 * scrolled into view. We scroll to the bottom, wait until skeletons are gone,
 * then scroll back to top for the screenshot.
 */
async function settlePage(page: Page, path: string) {
  await page.goto(path);
  // `domcontentloaded` is faster than `networkidle` and avoids the blog's
  // persistent web-vitals pings. Lazy chunks are triggered by scrolling.
  await page.waitForLoadState("domcontentloaded");

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Wait until all LazySection skeletons have been replaced (no aria-busy).
  // Pages without lazy sections resolve immediately.
  await page
    .waitForFunction(() => document.querySelectorAll('[aria-busy="true"]').length === 0, {
      timeout: 10000,
    })
    .catch(() => {});

  await page.waitForTimeout(600);

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(400);

  // Allow any reveal animations / fonts to settle. Cap the wait so blog
  // (which may keep connections open) doesn't stall the suite.
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
}

test.describe("Visual Regression Tests", () => {
  for (const viewport of VIEWPORTS) {
    for (const page of PAGES) {
      test(`${page.name} @ ${viewport.name}`, async ({ page: pageObj }) => {
        await pageObj.setViewportSize({ width: viewport.width, height: viewport.height });
        await settlePage(pageObj, page.path);

        await expect(pageObj).toHaveScreenshot(`${page.name}-${viewport.name}.png`, SCREENSHOT_OPTIONS);
      });
    }
  }

  test.describe("Dark/Light Theme Consistency", () => {
    test("homepage dark theme", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await settlePage(page, "/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page).toHaveScreenshot("homepage-dark.png", SCREENSHOT_OPTIONS);
    });

    test("homepage light theme", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await settlePage(page, "/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(page).toHaveScreenshot("homepage-light.png", SCREENSHOT_OPTIONS);
      // Toggle to dark and capture the toggled state as well.
      await page.click("[data-theme-toggle]");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await page.waitForTimeout(400);
    });
  });

  test.describe("Component States", () => {
    test("button variants", async ({ page }) => {
      await settlePage(page, "/");

      // Primary button
      const primaryBtn = page.locator('a[href="/contact"] >> button').first();
      await expect(primaryBtn).toHaveScreenshot("button-primary.png", {
        threshold: 0.1,
        animations: "disabled",
      });

      // Secondary button
      const secondaryBtn = page.locator('a[href="/platform"] >> button').first();
      await expect(secondaryBtn).toHaveScreenshot("button-secondary.png", {
        threshold: 0.1,
        animations: "disabled",
      });
    });

    test("glass card states", async ({ page }) => {
      await settlePage(page, "/platform");

      const cards = page.locator('[class*="glass"]').first();
      await expect(cards).toHaveScreenshot("glass-card.png", {
        threshold: 0.1,
        animations: "disabled",
      });
    });

    test("hero section", async ({ page }) => {
      await settlePage(page, "/");
      await page.waitForTimeout(2000); // Wait for aurora animation

      const hero = page.locator("section").first();
      await expect(hero).toHaveScreenshot("hero-section.png", {
        threshold: 0.1,
        animations: "disabled",
      });
    });
  });
});