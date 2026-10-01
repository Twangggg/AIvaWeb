import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 1440, height: 900 },
  isMobile: false,
  hasTouch: false,
  deviceScaleFactor: 1
});

test("Statement desktop starts at scene one and keeps its counter hidden", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  await page.goto("/");
  await page.waitForTimeout(1300);

  const statement = page.locator("#statement");
  await statement.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await expect(statement).toHaveAttribute("data-fp-scene", "0");
  await expect(statement.locator(".cx-statement-progress")).toBeHidden();

  await expect(page.locator("#glasses-3d-showcase")).toHaveJSProperty(
    "offsetHeight",
    1215
  );

  await page.mouse.wheel(0, 100);
  await expect(statement).toHaveAttribute("data-fp-scene", "1");
});

test("Experience paging advances the glasses rotation scene", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  await page.goto("/");
  await page.waitForTimeout(1300);

  const experience = page.locator("#experience");
  await experience.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await expect(experience).toHaveAttribute("data-fp-scene", "0");

  await page.mouse.wheel(0, 100);
  await expect(experience).toHaveAttribute("data-fp-scene", "1");
});

test("Compact laptop keeps experience copy out of the center", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 700 });
  await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  await page.goto("/");
  await page.waitForTimeout(1300);

  const experience = page.locator("#experience");
  await experience.evaluate((element) => element.scrollIntoView({ block: "start" }));

  const activeCard = page.locator("#glasses-3d-showcase .opacity-100").last();
  await expect(activeCard).toBeVisible();
  const box = await activeCard.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.x).toBeLessThan(40);
  expect(box!.y).toBeLessThan(70);
  expect(box!.width).toBeLessThanOrEqual(256);
});
