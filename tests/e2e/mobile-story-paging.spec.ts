import { expect, test, type Page } from "@playwright/test";

async function swipeStory(page: Page, fromY = 640, toY = 300) {
  const cdp = await page.context().newCDPSession(page);
  const point = (y: number) => ({ x: 195, y, id: 1 });

  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point(fromY)] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point(toY)] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await cdp.detach();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  await page.goto("/");
  await expect(page.locator("#statement")).toBeAttached();
  // Let the page preloader unmount before testing touch input.
  await page.waitForTimeout(1300);
});

test("Statement mobile: one swipe reveals exactly one new sentence", async ({ page }) => {
  const statement = page.locator("#statement");
  const lines = statement.locator(".cx-statement-line");

  await statement.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await expect(statement).toHaveAttribute("data-fp-scene", "0");
  await expect(lines.nth(0)).toHaveCSS("opacity", "1");
  await expect(lines.nth(1)).toHaveCSS("opacity", "0");

  await swipeStory(page);
  await expect(statement).toHaveAttribute("data-fp-scene", "1");

  // The hold prevents a momentum-like second gesture from skipping scene 2.
  await swipeStory(page);
  await expect(statement).toHaveAttribute("data-fp-scene", "1");

  await expect(lines.nth(1)).toHaveCSS("opacity", "1");
  await expect(lines.nth(2)).toHaveCSS("opacity", "0");
  await expect(lines.nth(0)).toHaveCSS("opacity", "0");

  await page.waitForTimeout(1500);
  await swipeStory(page);
  await expect(statement).toHaveAttribute("data-fp-scene", "2");
  await expect(lines.nth(2)).toHaveCSS("opacity", "1");
  await expect(lines.nth(1)).toHaveCSS("opacity", "0");
});
