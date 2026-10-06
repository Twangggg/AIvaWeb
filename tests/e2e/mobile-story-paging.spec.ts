import { expect, test, type Page } from "@playwright/test";

async function swipeStory(page: Page, fromY = 640, toY = 300) {
  const cdp = await page.context().newCDPSession(page);
  const point = (y: number) => ({ x: 195, y, id: 1 });

  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [point(fromY)],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [point(toY)],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await cdp.detach();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#statement")).toBeAttached();
  await expect(page.locator("#hero")).toHaveAttribute("data-fp-active", "true");
  // Let the page preloader unmount before testing touch input.
  await page.waitForTimeout(1300);
});

for (const viewport of [
  { width: 360, height: 800 },
  { width: 393, height: 873 },
  { width: 414, height: 896 },
  { width: 375, height: 534 },
]) {
  test(`Mobile ${viewport.width}×${viewport.height}: chapters align and overflow hands off at the boundary`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const compare = page.locator("#compare");
    await compare.evaluate((el) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 120,
        behavior: "instant",
      })
    );
    await expect
      .poll(() =>
        compare.evaluate((el) => Math.abs(el.getBoundingClientRect().top))
      )
      .toBeLessThan(2);
    await page.waitForTimeout(800);
    const chapter = compare.locator(".storybook-chapter");
    await chapter.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    // The table is independently scrollable on narrow screens too.
    await compare.locator("[data-fp-scroll]").evaluateAll((elements) => {
      elements.forEach((el) => {
        el.scrollTop = el.scrollHeight;
      });
    });
    await swipeStory(page, viewport.height - 100, viewport.height - 250);
    await expect
      .poll(() =>
        page
          .locator("#companion")
          .evaluate((el) => Math.abs(el.getBoundingClientRect().top))
      )
      .toBeLessThan(2);
    await expect(page.locator("#companion")).toHaveAttribute(
      "data-fp-scene",
      "0"
    );
  });
}

test("Chrome mobile viewport resize preserves the current scene and fits the chapter", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 760 });
  const statement = page.locator("#statement");
  await statement.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(800);
  await swipeStory(page, 600, 300);
  await expect(statement).toHaveAttribute("data-fp-scene", "1");
  await page.setViewportSize({ width: 393, height: 873 });
  await expect
    .poll(() => statement.evaluate((el) => el.getBoundingClientRect().height))
    .toBe(873);
  await expect(statement).toHaveAttribute("data-fp-scene", "1");
  await expect
    .poll(() =>
      statement.evaluate((el) => Math.abs(el.getBoundingClientRect().top))
    )
    .toBeLessThan(2);
  await page.waitForTimeout(800);
  await swipeStory(page);
  await expect(statement).toHaveAttribute("data-fp-scene", "2");
});

test("Statement mobile: one swipe reveals exactly one new sentence", async ({
  page,
}) => {
  const statement = page.locator("#statement");
  const lines = statement.locator(".cx-statement-line");

  await statement.evaluate((element) =>
    element.scrollIntoView({ block: "start" })
  );
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

test("Entering the mobile story from fluid cards aligns the chapter before changing sentences", async ({
  page,
}) => {
  await page.setViewportSize({ width: 414, height: 896 });
  const statement = page.locator("#statement");
  await statement.evaluate((el) =>
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 220,
      behavior: "instant",
    })
  );
  await expect
    .poll(() =>
      statement.evaluate((el) => Math.abs(el.getBoundingClientRect().top))
    )
    .toBeLessThan(2);
  await expect(statement).toHaveAttribute("data-fp-scene", "0");
  await expect
    .poll(() =>
      page
        .locator("#discover")
        .evaluate((el) => el.getBoundingClientRect().bottom)
    )
    .toBeLessThanOrEqual(1);
  await page.waitForTimeout(800);
  await swipeStory(page);
  await expect(statement).toHaveAttribute("data-fp-scene", "1");
  const line = statement.locator('.cx-statement-line[data-current="true"]');
  const box = await line.boundingBox();
  expect(box!.y).toBeGreaterThan(90);
  expect(box!.y + box!.height).toBeLessThan(800);
});

test("Mission on a short phone keeps all values readable in the page flow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 534 });
  const mission = page.locator("#mission");
  const chapter = mission.locator(".storybook-mission");
  await expect(mission).not.toHaveAttribute("data-fp-mobile-lock", "");
  await expect(chapter).toHaveCSS("overflow-y", "visible");
  const layout = await chapter.evaluate((el) => ({
    height: el.clientHeight,
    contentHeight: el.scrollHeight,
  }));
  expect(layout.height).toBeGreaterThan(534);
  expect(layout.contentHeight).toBeLessThanOrEqual(layout.height + 1);

  await mission.evaluate((el) =>
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 150,
      behavior: "instant",
    })
  );
  const lastValue = mission.locator(".storybook-values article").last();
  await lastValue.scrollIntoViewIfNeeded();
  await expect(lastValue).toBeInViewport();
});

for (const viewport of [
  { width: 375, height: 664 },
  { width: 393, height: 760 },
  { width: 360, height: 640 },
  { width: 375, height: 534 },
]) {
  test(`Features ${viewport.width}×${viewport.height}: all four scenes fit without inner scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const features = page.locator("#features");
    await features.evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(800);
    const chapter = features.locator(".storybook-chapter");
    const choices = features.locator(".storybook-choices button");
    for (let scene = 0; scene < 4; scene++) {
      await choices.nth(scene).click();
      await expect(features).toHaveAttribute("data-fp-scene", String(scene));
      const layout = await chapter.evaluate((el) => ({
        height: el.clientHeight,
        content: el.scrollHeight,
        top: el.scrollTop,
      }));
      expect(layout.content).toBeLessThanOrEqual(layout.height + 2);
      expect(layout.top).toBe(0);
      const heading = await features
        .locator(".storybook-heading")
        .boundingBox();
      expect(heading!.y).toBeGreaterThanOrEqual(60);
      const lastChoice = await choices.last().boundingBox();
      expect(lastChoice!.y + lastChoice!.height).toBeLessThanOrEqual(
        viewport.height - 20
      );
    }
    await swipeStory(page, viewport.height - 120, 280);
    await expect
      .poll(() =>
        page
          .locator("#compare")
          .evaluate((el) => Math.abs(el.getBoundingClientRect().top))
      )
      .toBeLessThan(2);
  });
}
