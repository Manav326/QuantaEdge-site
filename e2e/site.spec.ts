import { expect, test } from "@playwright/test";

async function revealEntirePage(page: import("@playwright/test").Page) {
  const dimensions = await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    return { height: document.documentElement.scrollHeight, viewport: window.innerHeight };
  });
  const step = Math.max(360, Math.floor(dimensions.viewport * 0.75));
  for (let top = 0; top < dimensions.height; top += step) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(120);
}


test.describe("QuantaEdge corporate website", () => {
  test("desktop: renders the corporate story and all four product showcases", async ({ page }, testInfo) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await expect(page).toHaveTitle(/QuantaEdge — Engineering that matters/);
    await expect(page.getByRole("heading", { name: "Engineering that matters." })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();

    const productCards = page.locator(".product-card");
    await expect(productCards).toHaveCount(4);
    for (const name of ["mPay", "QuantaEdge Learning", "Lucky Bajaj Dealership", "SmartPrint"]) {
      await expect(productCards.getByRole("heading", { name })).toBeVisible();
    }

    await page.getByRole("tab", { name: "Learning systems" }).click();
    await expect(page.locator(".architecture-intro h3")).toHaveText("Learning systems");
    await expect(page.locator(".architecture-detail")).toContainText("verified source material");

    await revealEntirePage(page);
    const productImages = page.locator(".product-photo");
    await expect(productImages).toHaveCount(4);
    const imageDiagnostics = [];
    for (let index = 0; index < 4; index += 1) {
      const image = productImages.nth(index);
      await image.scrollIntoViewIfNeeded();
      const decoded = await image.evaluate(async (element) => {
        const img = element as HTMLImageElement;
        try {
          await img.decode();
          return { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
        } catch {
          return { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
        }
      });
      imageDiagnostics.push(decoded);
      expect(decoded.complete, "Product image " + index + " should finish loading").toBe(true);
      expect(decoded.naturalWidth, "Product image " + index + " should decode to a usable width").toBeGreaterThanOrEqual(400);
      expect(decoded.naturalHeight, "Product image " + index + " should decode to a usable height").toBeGreaterThanOrEqual(240);
    }
    console.log("Product image dimensions:", JSON.stringify(imageDiagnostics));
    await page.screenshot({
      path: testInfo.outputPath("desktop-home.png"),
      fullPage: true,
      animations: "disabled"
    });
    expect(pageErrors).toEqual([]);
  });

  test("product links open their public live applications and never route visitors to GitHub", async ({ page }) => {
    await page.goto("/");

    const destinations = [
      { name: "mPay", url: "https://mpay.quantaedge.in/" },
      { name: "QuantaEdge Learning", url: "https://qe.quantaedge.in/" },
      { name: "Lucky Bajaj Dealership", url: "https://luckybajaj.quantaedge.in/" },
      { name: "SmartPrint", url: "https://smartprint.quantaedge.in/" }
    ];

    const footerProducts = page.locator(".footer-links > div:nth-child(3)");
    for (const product of destinations) {
      const card = page.locator(".product-card").filter({
        has: page.getByRole("heading", { name: product.name, exact: true })
      });
      await expect(card).toHaveCount(1);

      const cardLink = card.getByRole("link", { name: `Visit ${product.name} live application` });
      await expect(cardLink).toHaveAttribute("href", product.url);
      await expect(cardLink).toHaveAttribute("target", "_blank");
      await expect(cardLink).toHaveAttribute("rel", "noopener noreferrer");

      const footerLink = footerProducts.getByRole("link", { name: `Visit ${product.name} live application` });
      await expect(footerLink).toHaveAttribute("href", product.url);
      await expect(footerLink).toHaveAttribute("target", "_blank");
      await expect(footerLink).toHaveAttribute("rel", "noopener noreferrer");
    }

    await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
  });

  test("mobile: navigation, layout width and interactive architecture remain usable", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: "Open navigation" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");

    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Our work" }).click();
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#work")).toBeInViewport();

    await page.getByRole("tab", { name: "Cloud + edge" }).click();
    await expect(page.locator(".architecture-intro h3")).toHaveText("Cloud + edge");

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport + 1);

    await revealEntirePage(page);
    await page.screenshot({
      path: testInfo.outputPath("mobile-home.png"),
      fullPage: true,
      animations: "disabled"
    });
  });

  test("tablet: main content does not create horizontal page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
    await expect(page.locator(".product-card")).toHaveCount(4);
  });

  test("enquiry form reports delivery failure honestly and preserves a copyable brief", async ({ page }) => {
    await page.route("**/api/enquiry", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Enquiry delivery is not configured on this deployment. Your details have not been sent."
        })
      });
    });

    await page.goto("/#contact");
    await page.getByLabel("Your name").fill("Test Visitor");
    await page.getByLabel("Work email").fill("visitor@example.com");
    await page.getByLabel("Tell us about the problem or idea").fill(
      "We need a business workflow platform with customer management and reporting."
    );
    await page.getByRole("button", { name: /Send project enquiry/ }).click();

    await expect(page.getByText(/Your details have not been sent/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy your project brief" })).toBeVisible();
    await expect(page.getByText(/Your enquiry has been sent/)).toHaveCount(0);
  });

  test("privacy notice is reachable and readable", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Privacy notice" })).toBeVisible();
    await expect(page.getByText(/Google Fonts/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to QuantaEdge/ })).toHaveAttribute("href", "/");
  });

  test("enquiry API validates malformed email addresses before delivery", async ({ request }) => {
    const response = await request.post("/api/enquiry", {
      data: {
        name: "Test Visitor",
        email: "not-an-email",
        interest: "Custom software development",
        message: "A sufficiently detailed project enquiry for validation."
      }
    });
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "Enter a valid email address." });
  });
});

  
  test("reduced-motion preference is respected", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const duration = await page.locator(".hero-float-card").first().evaluate((element) => getComputedStyle(element).animationDuration);
    const durationMs = duration.endsWith("ms") ? Number.parseFloat(duration) : Number.parseFloat(duration) * 1000;
    expect(durationMs).toBeLessThan(1);
    await expect(page.getByRole("heading", { name: "Engineering that matters." })).toBeVisible();
  });
