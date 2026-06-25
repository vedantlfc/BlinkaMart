import { expect, test, type Page } from "@playwright/test";

type CardMotionState = {
  actionAnimationName: string;
  actionStateAnimationName: string;
  actionText: string;
  bottomCartIsActive: boolean;
  bottomCartIsInViewport: boolean;
  cardAnimationName: string;
  cardBackgroundImage: string;
  cardBorderColor: string;
  cardBoxShadow: string;
  cardClassName: string;
  quantityText: string | null;
};

const productName = "Decision Chips";

async function resetStorage(page: Page) {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
  });
}

async function getProductCardMotionState(
  page: Page,
  product: string,
): Promise<CardMotionState> {
  return page.getByRole("article").filter({ hasText: product }).evaluate((card) => {
    const actions = card.querySelector(".product-card__actions");
    const actionState = card.querySelector(".product-card__action-state");
    const bottomCart = document.querySelector(".bottom-cart-bar");
    const bottomRect = bottomCart?.getBoundingClientRect();
    const cardStyles = getComputedStyle(card);
    const quantity = card.querySelector(".cart-controls__quantity");

    return {
      actionAnimationName: actions ? getComputedStyle(actions).animationName : "",
      actionStateAnimationName: actionState ? getComputedStyle(actionState).animationName : "",
      actionText: actions?.textContent?.trim() ?? "",
      bottomCartIsActive: bottomCart?.classList.contains("bottom-cart-bar--active") ?? false,
      bottomCartIsInViewport: bottomRect
        ? bottomRect.bottom > 0 && bottomRect.top < window.innerHeight
        : false,
      cardAnimationName: cardStyles.animationName,
      cardBackgroundImage: cardStyles.backgroundImage,
      cardBorderColor: cardStyles.borderColor,
      cardBoxShadow: cardStyles.boxShadow,
      cardClassName: card.className,
      quantityText: quantity?.textContent?.trim() ?? null,
    };
  });
}

async function expectCartMotionContract(page: Page) {
  const initial = await getProductCardMotionState(page, productName);
  expect(initial.cardAnimationName).toBe("motion-section-in");
  expect(initial.cardClassName).not.toContain("product-card--in-cart");
  expect(initial.actionText).toBe("Add");
  expect(initial.actionStateAnimationName).toBe("motion-action-swap");

  await page.getByRole("button", { name: `Add ${productName} to cart` }).click();

  const afterAdd = await getProductCardMotionState(page, productName);
  expect(afterAdd.cardClassName).toContain("product-card--in-cart");
  expect(afterAdd.cardClassName).toContain("product-card--cart-pulse");
  expect(afterAdd.cardAnimationName).toBe(initial.cardAnimationName);
  expect(afterAdd.cardBackgroundImage).toBe(initial.cardBackgroundImage);
  expect(afterAdd.cardBorderColor).toBe(initial.cardBorderColor);
  expect(afterAdd.cardBoxShadow).toBe(initial.cardBoxShadow);
  expect(afterAdd.actionAnimationName).toBe("motion-cart-control-pulse");
  expect(afterAdd.actionStateAnimationName).toBe("motion-action-swap");
  expect(afterAdd.actionText).toBe("-1+");
  expect(afterAdd.quantityText).toBe("1");
  expect(afterAdd.bottomCartIsActive).toBe(true);
  expect(afterAdd.bottomCartIsInViewport).toBe(true);

  await expect(page.getByRole("button", { name: `Decrease ${productName} quantity` })).toBeVisible();
  await page.getByRole("button", { name: `Decrease ${productName} quantity` }).click();

  const afterRemove = await getProductCardMotionState(page, productName);
  expect(afterRemove.cardClassName).not.toContain("product-card--in-cart");
  expect(afterRemove.cardClassName).not.toContain("product-card--cart-pulse");
  expect(afterRemove.cardAnimationName).toBe(initial.cardAnimationName);
  expect(afterRemove.actionAnimationName).toBe("none");
  expect(afterRemove.actionStateAnimationName).toBe("motion-action-swap");
  expect(afterRemove.actionText).toBe("Add");
  expect(afterRemove.bottomCartIsActive).toBe(false);
  expect(afterRemove.bottomCartIsInViewport).toBe(false);
}

test.describe("cart interaction motion", () => {
  test.beforeEach(async ({ page }) => {
    await resetStorage(page);
  });

  test("does not replay the product-card entrance when Home quantity returns to zero", async ({
    page,
  }) => {
    await page.goto("/");

    await expectCartMotionContract(page);
  });

  test("does not replay the product-card entrance when Products quantity returns to zero", async ({
    page,
  }) => {
    await page.goto("/products");

    await expectCartMotionContract(page);
  });
});
