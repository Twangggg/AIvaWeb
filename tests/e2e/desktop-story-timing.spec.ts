import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 1440, height: 900 },
  isMobile: false,
  hasTouch: false,
  deviceScaleFactor: 1,
});

test("Product model lets visitors rotate the glasses without information cards", async ({ page }) => {
  await page.goto("/product");
  const stage = page.locator("#glasses-3d-showcase");
  await stage.scrollIntoViewIfNeeded();
  const canvas = stage.locator("canvas");
  await expect(canvas).toBeVisible();
  await expect(stage.locator(".glasses-info-card")).toHaveCount(0);
  await expect(stage).toContainText("Kéo để xoay kính");
  await page.waitForTimeout(2500);
  const before = await canvas.screenshot();
  const box = await canvas.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + 180, box!.y + box!.height / 2 + 50, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(800);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  const start = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(start + 100);
});

test("FAQ scrolls through expanded answers and reaches the footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hero")).toHaveAttribute("data-fp-active", "true");
  const faq = page.locator("#faq");
  await faq.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await faq.locator("details").evaluateAll((items) => {
    items.forEach((item) => item.setAttribute("open", ""));
  });
  await faq.evaluate((el) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: Element, options: { immediate: boolean }) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { immediate: true });
    else el.scrollIntoView({ block: "start" });
  });
  await expect(faq.locator("summary").first()).toBeInViewport();
  const start = await page.evaluate(() => window.scrollY);
  await page.mouse.move(750, 450);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(start + 100);
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(500);
  }
  await expect(page.locator("footer")).toBeInViewport();
  const bottom = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, -450);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(bottom - 100);
});

test("Statement desktop starts at scene one and keeps its counter hidden", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  await page.goto("/");
  await page.waitForTimeout(1300);

  const statement = page.locator("#statement");
  await statement.evaluate((element) =>
    element.scrollIntoView({ block: "start" })
  );
  await expect(statement).toHaveAttribute("data-fp-scene", "0");
  await expect(statement.locator(".cx-statement-progress")).toBeHidden();

  await expect(page.locator("#glasses-3d-showcase")).toHaveJSProperty(
    "offsetHeight",
    1215
  );

  await page.mouse.wheel(0, 100);
  await expect(statement).toHaveAttribute("data-fp-scene", "1");
});

test("Experience paging advances the glasses rotation scene", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  await page.goto("/");
  await page.waitForTimeout(1300);

  const experience = page.locator("#experience");
  await experience.evaluate((element) =>
    element.scrollIntoView({ block: "start" })
  );
  await expect(experience).toHaveAttribute("data-fp-scene", "0");

  await page.mouse.wheel(0, 100);
  await expect(experience).toHaveAttribute("data-fp-scene", "1");
});

test("Compact laptop keeps experience copy out of the center", async ({
  page,
}) => {
  await page.setViewportSize({ width: 800, height: 700 });
  await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  await page.goto("/");
  await page.waitForTimeout(1300);

  const experience = page.locator("#experience");
  await experience.evaluate((element) =>
    element.scrollIntoView({ block: "start" })
  );

  const activeCard = page.locator("#glasses-3d-showcase .opacity-100").last();
  await expect(activeCard).toBeVisible();
  const box = await activeCard.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.x).toBeLessThan(40);
  expect(box!.y).toBeLessThan(70);
  expect(box!.width).toBeLessThanOrEqual(256);
});

test("Tall screen enters the play corner and trackpad momentum cannot skip it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1858, height: 1200 });
  await page.goto("/");
  await expect(page.locator("#hero")).toHaveAttribute("data-fp-active", "true");

  const playCorner = page.locator("#play-corner");
  const discover = page.locator("#discover");
  const hero = page.locator("#hero");
  // At the top, the following chapter is already partly visible. It must
  // not own this gesture until we have actually arrived there.
  await page.mouse.wheel(0, 100);
  await expect
    .poll(() =>
      playCorner.evaluate((el) => Math.abs(el.getBoundingClientRect().top))
    )
    .toBeLessThan(5);

  await expect
    .poll(() =>
      page
        .locator("#hero .garden-ribbon")
        .evaluate((el) => el.getBoundingClientRect().bottom)
    )
    .toBeLessThanOrEqual(1);

  // A sustained gesture outlasts the old 1400 ms fixed input lock.
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 80);
    await page.waitForTimeout(150);
  }
  await expect
    .poll(() =>
      playCorner.evaluate((el) => Math.abs(el.getBoundingClientRect().top))
    )
    .toBeLessThan(5);
  await expect
    .poll(() => discover.evaluate((el) => el.getBoundingClientRect().top))
    .toBeGreaterThan(1100);

  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, 100);
  await expect
    .poll(() =>
      discover.evaluate((el) => Math.abs(el.getBoundingClientRect().top - 100))
    )
    .toBeLessThan(5);

  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, -100);
  await expect
    .poll(() =>
      playCorner.evaluate((el) => Math.abs(el.getBoundingClientRect().top))
    )
    .toBeLessThan(5);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, -100);
  await expect
    .poll(() => hero.evaluate((el) => Math.abs(el.getBoundingClientRect().top)))
    .toBeLessThan(5);
});

for (const width of [1280, 1366]) {
  test(`Laptop ${width}: product cards stay compact and outside the centre`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 768 });
    await page.goto("/");
    const experience = page.locator("#experience");
    await experience.evaluate((el) => el.scrollIntoView({ block: "start" }));
    for (let scene = 0; scene < 4; scene++) {
      await experience.evaluate(
        (el, step) =>
          el.dispatchEvent(
            new CustomEvent("fp-scene", { detail: { step, dir: 1 } })
          ),
        scene
      );
      const card = page.locator(`.glasses-info-card[data-scene="${scene}"]`);
      await expect(card).toHaveCSS("opacity", "1");
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeLessThanOrEqual(300);
      expect(box!.height).toBeLessThan(250);
      expect(
        box!.x + box!.width <= width * 0.3 || box!.x >= width * 0.7
      ).toBeTruthy();
      expect(
        await card
          .locator("h2")
          .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
      ).toBeLessThanOrEqual(24);
      if (scene === 0)
        await page.screenshot({
          path: `/tmp/aiva-glasses-laptop-${width}.png`,
        });
    }
  });
}

for (const width of [390, 1440]) {
  test(`Friendly story chapters at ${width} keep their scenes and controls`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#hero")).toHaveAttribute(
      "data-fp-active",
      "true"
    );
    for (const id of [
      "vision",
      "features",
      "compare",
      "companion",
      "color",
      "mission",
    ]) {
      const chapter = page.locator(`#${id}`);
      await chapter.evaluate((el) => el.scrollIntoView({ block: "start" }));
      await expect(chapter.locator(".storybook-heading h2")).toBeVisible();
      expect(
        await chapter
          .locator(".storybook-chapter")
          .evaluate((el) => el.scrollWidth <= el.clientWidth)
      ).toBeTruthy();
      if (["vision", "features", "companion"].includes(id)) {
        const choices = chapter.locator(".storybook-choices button");
        await choices.nth(1).click();
        await expect(chapter).toHaveAttribute("data-fp-scene", "1");
        await expect(choices.nth(1)).toHaveAttribute("aria-pressed", "true");
      }
      if (id === "color") {
        const swatch = chapter.locator(".storybook-swatches button").nth(2);
        await swatch.click();
        await expect(swatch).toHaveAttribute("aria-pressed", "true");
      }
      await page.screenshot({ path: `/tmp/aiva-storybook-${id}-${width}.png` });
    }
  });
}
