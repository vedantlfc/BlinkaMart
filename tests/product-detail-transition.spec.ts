import { expect, test, type Page } from "@playwright/test";

const productName = "Decision Chips";

async function resetStorage(page: Page) {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
  });
}

async function openProductDetails(page: Page, route: string) {
  await resetStorage(page);
  await page.goto(route);

  const detailsTrigger = page
    .getByRole("button", { name: `View details for ${productName}` })
    .first();
  await expect(detailsTrigger).toBeVisible();
  await detailsTrigger.click();

  return detailsTrigger;
}

test.describe("product detail shared transition", () => {
  for (const { label, route } of [
    { label: "Home", route: "/" },
    { label: "Products", route: "/products" },
  ]) {
    test(`${label} opens details through the shared transition and preserves modal accessibility`, async ({
      page,
    }) => {
      const detailsTrigger = await openProductDetails(page, route);
      const dialog = page.getByRole("dialog", { name: productName });
      const closeButton = page.getByRole("button", {
        name: `Close details for ${productName}`,
      });
      const addButton = page.getByRole("button", {
        name: `Add ${productName} to cart`,
      });

      await expect(page.locator(".product-detail-transition-layer")).toBeVisible();
      await expect(dialog).toBeVisible();
      await expect(page.locator("#root")).toHaveAttribute("inert", "");
      await expect(page.locator("#root")).toHaveAttribute("aria-hidden", "true");
      await expect(page.locator(".product-detail-transition-layer")).toHaveCount(0);
      await expect(closeButton).toBeFocused();

      await page.keyboard.press("Shift+Tab");
      await expect(addButton).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(closeButton).toBeFocused();

      await addButton.click();
      await expect(
        page.getByRole("button", { name: `Decrease ${productName} quantity` }),
      ).toBeVisible();
      await expect(page.locator(".cart-fly-light")).toHaveCount(0);
      await expect(page.locator(".bottom-cart-bar--active")).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(page.locator("#root")).not.toHaveAttribute("aria-hidden", "true");
      await expect(detailsTrigger).toBeFocused();
    });
  }

  test("reduced motion opens details without the shared zoom layer", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openProductDetails(page, "/products");

    await expect(page.locator(".product-detail-transition-layer")).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: productName })).toBeVisible();
    await expect(page.locator(".product-detail-modal")).not.toHaveClass(/shared-opening/);
  });
});
