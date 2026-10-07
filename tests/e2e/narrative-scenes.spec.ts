import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000" });

async function openHome(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page
    .getByTestId("home-loading-intro")
    .waitFor({ state: "detached", timeout: 12000 });
}

test("distinct chapter transitions keep scene controls and images in sync", async ({
  page,
}) => {
  await openHome(page);
  const vision = page.locator("#vision");
  await vision.evaluate((e) => e.scrollIntoView({ block: "start" }));
  await expect(vision.locator(".narrative-word-mask > span").first()).toHaveCSS(
    "clip-path",
    "inset(0px 0% 0px 0px)"
  );
  const choices = vision.locator(".storybook-choices button");
  await choices.nth(2).click();
  await choices.nth(1).click();
  await expect(vision).toHaveAttribute("data-fp-scene", "1");
  await expect(choices.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(
    vision.locator(
      '.storybook-photo-window [data-narrative-scene="current"] img'
    )
  ).toHaveAttribute("alt", "Một trang sách mới");
  await expect(vision.locator('[data-narrative-scene="outgoing"]')).toHaveCount(
    0
  );

  const companion = page.locator("#companion");
  await companion.evaluate((e) => e.scrollIntoView({ block: "start" }));
  await companion.locator(".storybook-choices button").last().click();
  await expect(companion).toHaveAttribute("data-fp-scene", "2");
  await expect(
    companion.locator(
      '.storybook-phone-display [data-narrative-scene="current"] img'
    )
  ).toHaveAttribute("alt", "Cùng đồng hành");
  await expect(
    companion.locator('[data-narrative-scene="outgoing"]')
  ).toHaveCount(0);

  const color = page.locator("#color");
  await color.evaluate((e) => e.scrollIntoView({ block: "start" }));
  await color.locator(".storybook-swatches button").nth(2).click();
  await expect(
    color.locator(".storybook-swatches button").nth(2)
  ).toHaveAttribute("aria-pressed", "true");
  await expect(color.locator(".storybook-color-bloom")).toHaveCSS(
    "background-color",
    "rgb(253, 164, 175)"
  );
  await expect(color.locator("svg stop").first()).toHaveAttribute(
    "stop-color",
    "#fda4af"
  );
});

test("feature deck remains usable on small phones and tablet", async ({
  page,
}) => {
  await openHome(page);
  const features = page.locator("#features");
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 800, height: 1280 },
  ]) {
    await page.setViewportSize(viewport);
    await features.evaluate((e) => e.scrollIntoView({ block: "start" }));
    for (let index = 0; index < 4; index++) {
      const choice = features.locator(".storybook-choices button").nth(index);
      await choice.click();
      await expect(choice).toHaveAttribute("aria-pressed", "true");
      await expect(features.locator(".storybook-feature-deck")).toHaveAttribute(
        "data-discovery",
        String(index)
      );
    }
    await expect(
      features.locator('[data-narrative-scene="outgoing"]')
    ).toHaveCount(0);
    const box = await features.locator(".storybook-feature-deck").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(viewport.width);
  }
});

test("reduced motion still exposes all content and scene controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);
  const vision = page.locator("#vision");
  await vision.evaluate((e) => e.scrollIntoView({ block: "start" }));
  await vision.locator(".storybook-choices button").last().click();
  await expect(vision.locator('[data-narrative-scene="outgoing"]')).toHaveCount(
    0
  );
  await expect(
    vision.locator('.storybook-photo-window [data-narrative-scene="current"]')
  ).toHaveCSS("clip-path", "circle(75% at 50% 50%)");
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("#about img").last().scrollIntoViewIfNeeded();
  await expect(page.locator("#about img")).toHaveCount(6);
});

test("editorial content reveals without staying behind a mask", async ({
  page,
}) => {
  await page.goto("/news");
  const article = page.locator(".narrative-panel-wrap > div").first();
  await article.scrollIntoViewIfNeeded();
  await expect(article).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
  await expect(article.getByRole("heading")).toBeVisible();
  await page.goto("/about");
  const portrait = page.locator(".narrative-panel-wrap > div").first();
  await portrait.scrollIntoViewIfNeeded();
  await expect(portrait).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
});

test("mission stays readable and chapter entrances replay in both scroll directions", async ({
  page,
}) => {
  await openHome(page);
  const mission = page.locator("#mission");
  const notes = mission.locator(".storybook-value-note");
  for (const neighbour of ["specs", "faq", "specs"]) {
    await page
      .locator("#" + neighbour)
      .evaluate((e) => e.scrollIntoView({ block: "start" }));
    await expect(mission.locator(".storybook-chapter")).toHaveAttribute(
      "data-narrative-visible",
      "false"
    );
    await mission.evaluate((e) => e.scrollIntoView({ block: "start" }));
    await expect(mission.locator(".storybook-chapter")).toHaveAttribute(
      "data-narrative-visible",
      "true"
    );
    for (const note of await notes.all())
      await expect(note).toHaveCSS("opacity", "1");
    await expect(
      mission.locator(".narrative-word-mask > span").first()
    ).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
  }
  const features = page.locator("#features .storybook-chapter");
  for (const neighbour of ["vision", "compare"]) {
    await page
      .locator("#" + neighbour)
      .evaluate((e) => e.scrollIntoView({ block: "start" }));
    await expect(features).toHaveAttribute("data-narrative-visible", "false");
    await features.evaluate((e) =>
      e.closest("[data-fp-section]")!.scrollIntoView({ block: "start" })
    );
    await expect(features).toHaveAttribute("data-narrative-visible", "true");
    await expect(features.locator(".storybook-feature-deck")).toHaveCSS(
      "animation-name",
      "chapter-deck-deal"
    );
  }
});

test("reverse wheel momentum cannot move scenes while the destination is revealing", async ({
  page,
}) => {
  await openHome(page);
  const color = page.locator("#color");
  const companion = page.locator("#companion");
  await color.evaluate((e) => e.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1200);
  await page.mouse.move(720, 400);
  await page.mouse.wheel(0, -120);
  await expect
    .poll(() =>
      companion.evaluate((e) => Math.abs(e.getBoundingClientRect().top))
    )
    .toBeLessThan(5);
  await expect(companion).toHaveAttribute("data-fp-scene", "2");
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, -150);
    await page.waitForTimeout(120);
  }
  await expect(companion).toHaveAttribute("data-fp-scene", "2");
  await expect
    .poll(() =>
      companion.evaluate((e) => Math.abs(e.getBoundingClientRect().top))
    )
    .toBeLessThan(5);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, -120);
  await expect(companion).toHaveAttribute("data-fp-scene", "1");
  await expect
    .poll(() =>
      companion.evaluate((e) => Math.abs(e.getBoundingClientRect().top))
    )
    .toBeLessThan(5);
});

test.describe("touch arrival guard", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  test("reverse swipes wait for the arriving chapter to reveal", async ({
    page,
  }) => {
    await openHome(page);
    await page
      .locator("#color")
      .evaluate((e) => e.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(1200);
    const cdp = await page.context().newCDPSession(page);
    const swipeBack = async () => {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: 195, y: 300, id: 1 }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 195, y: 650, id: 1 }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    };
    const companion = page.locator("#companion");
    await swipeBack();
    await expect
      .poll(() =>
        companion.evaluate((e) => Math.abs(e.getBoundingClientRect().top))
      )
      .toBeLessThan(5);
    await swipeBack();
    await expect(companion).toHaveAttribute("data-fp-scene", "2");
    await expect
      .poll(() =>
        companion.evaluate((e) => Math.abs(e.getBoundingClientRect().top))
      )
      .toBeLessThan(5);
    await page.waitForTimeout(1500);
    await swipeBack();
    await expect(companion).toHaveAttribute("data-fp-scene", "1");
    await cdp.detach();
  });
});

test("native specifications hand off to mission without overshooting on downward momentum", async ({
  page,
}) => {
  await openHome(page);
  await page
    .locator("#specs")
    .evaluate((e) => e.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1200);
  await page.mouse.move(80, 400);
  await page.mouse.wheel(0, 3000);
  const mission = page.locator("#mission");
  await expect
    .poll(() =>
      mission.evaluate((e) => Math.abs(e.getBoundingClientRect().top))
    )
    .toBeLessThan(5);
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(120);
  }
  await expect
    .poll(() =>
      mission.evaluate((e) => Math.abs(e.getBoundingClientRect().top))
    )
    .toBeLessThan(5);
  await expect(
    mission.locator(".narrative-word-mask > span").first()
  ).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
  for (const note of await mission.locator(".storybook-value-note").all())
    await expect(note).toHaveCSS("opacity", "1");
});

for (const [sourceId, targetId] of [
  ["invitation", "video"],
  ["specs", "color"],
]) {
  test(`upward native boundary ${sourceId} → ${targetId} enters before scrolling through the chapter`, async ({
    page,
  }) => {
    await openHome(page);
    await page.locator("#" + sourceId).evaluate((e) =>
      window.scrollTo({
        top: e.getBoundingClientRect().top + window.scrollY + 100,
        behavior: "instant",
      })
    );
    await page.waitForTimeout(1200);
    await page.mouse.move(80, 400);
    await page.mouse.wheel(0, -350);
    const target = page.locator("#" + targetId);
    await expect
      .poll(() =>
        target.evaluate((e) =>
          Math.abs(
            e.getBoundingClientRect().top -
              (Number.parseFloat(getComputedStyle(e).scrollMarginTop) || 0)
          )
        )
      )
      .toBeLessThan(5);
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, -100);
      await page.waitForTimeout(120);
    }
    await expect
      .poll(() =>
        target.evaluate((e) =>
          Math.abs(
            e.getBoundingClientRect().top -
              (Number.parseFloat(getComputedStyle(e).scrollMarginTop) || 0)
          )
        )
      )
      .toBeLessThan(5);
    if (await target.locator(".narrative-word-mask > span").count()) {
      await expect(
        target.locator(".narrative-word-mask > span").first()
      ).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
    }
  });
}

test("mission supports a complete down-and-back journey through its real neighbours", async ({
  page,
}) => {
  await openHome(page);
  await page
    .locator("#specs")
    .evaluate((e) => e.scrollIntoView({ block: "start" }));
  await page.mouse.move(80, 400);
  for (const [targetId, delta] of [
    ["mission", 3000],
    ["video", 120],
    ["mission", -120],
    ["specs", -120],
  ] as const) {
    await page.waitForTimeout(1800);
    await page.mouse.wheel(0, delta);
    const target = page.locator("#" + targetId);
    await expect
      .poll(() =>
        target.evaluate((e) =>
          Math.abs(
            e.getBoundingClientRect().top -
              (Number.parseFloat(getComputedStyle(e).scrollMarginTop) || 0)
          )
        )
      )
      .toBeLessThan(5);
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, Math.sign(delta) * 100);
      await page.waitForTimeout(100);
    }
    await expect
      .poll(() =>
        target.evaluate((e) =>
          Math.abs(
            e.getBoundingClientRect().top -
              (Number.parseFloat(getComputedStyle(e).scrollMarginTop) || 0)
          )
        )
      )
      .toBeLessThan(5);
    if (targetId === "mission") {
      await expect(
        target.locator(".narrative-word-mask > span").first()
      ).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
      for (const note of await target.locator(".storybook-value-note").all())
        await expect(note).toHaveCSS("opacity", "1");
    }
  }
});

test("landing opens and the first wheel leaves hero instead of repeatedly realigning it", async ({
  page,
}) => {
  await openHome(page);
  await page.mouse.move(80, 400);
  await page.mouse.wheel(0, 120);
  const play = page.locator("#play-corner");
  await expect
    .poll(() => play.evaluate((e) => Math.abs(e.getBoundingClientRect().top)))
    .toBeLessThan(5);
  await page.waitForTimeout(1800);
  await page.mouse.wheel(0, 120);
  const discover = page.locator("#discover");
  await expect
    .poll(() =>
      discover.evaluate((e) => Math.abs(e.getBoundingClientRect().top - 100))
    )
    .toBeLessThan(5);
});
