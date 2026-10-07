import { expect, test, type Locator } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000" });

async function expectInsideViewport(element: Locator) {
  await expect
    .poll(async () =>
      element.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const viewport = window.visualViewport;
        const left = viewport?.offsetLeft ?? 0;
        const top = viewport?.offsetTop ?? 0;
        const width = viewport?.width ?? window.innerWidth;
        const height = viewport?.height ?? window.innerHeight;
        return (
          rect.left >= left + 11 &&
          rect.top >= top + 11 &&
          rect.right <= left + width - 11 &&
          rect.bottom <= top + height - 11
        );
      })
    )
    .toBe(true);
}

test("chat stays above its mascot and inside the viewport after resizing", async ({
  page,
}) => {
  await page.goto("/product");
  const mascot = page.locator('button[aria-label*="chatbot"]');
  await mascot.click();
  const panel = page.getByRole("dialog", { name: "Trợ lý AIVA" });
  await expect(panel).toBeVisible();
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 667, height: 375 },
  ]) {
    await page.setViewportSize(viewport);
    await expectInsideViewport(panel);
    await expect
      .poll(async () => {
        const chat = await panel.boundingBox();
        const anchor = await mascot.boundingBox();
        return !!chat && !!anchor && chat.y + chat.height <= anchor.y - 11;
      })
      .toBe(true);
    await expect(panel.locator("input")).toBeVisible();
  }
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await mascot.click();
  await expect(panel).toBeVisible();
  await page.mouse.click(20, 20);
  await expect(panel).toHaveCount(0);
});

test("desktop dropdown stays anchored when the navigation moves", async ({
  page,
}) => {
  await page.goto("/product");
  const trigger = page.getByRole("button", { name: "Cho trẻ em" });
  await trigger.hover();
  const link = page.getByRole("link", { name: /Chơi cùng AIVA/ });
  const panel = link.locator("../..");
  await expect(link).toBeVisible();
  await expectInsideViewport(panel);
  await link.hover();
  await expect(link).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 300));
  await expectInsideViewport(panel);
  await expect
    .poll(async () => {
      const floating = await panel.boundingBox();
      const anchor = await trigger.boundingBox();
      return (
        !!floating &&
        !!anchor &&
        Math.abs(floating.y - anchor.y - anchor.height - 8) < 2
      );
    })
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(link).toHaveCount(0);
});
