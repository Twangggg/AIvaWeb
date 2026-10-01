# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-story-paging.spec.ts >> Statement mobile: one swipe reveals exactly one new sentence
- Location: tests/e2e/mobile-story-paging.spec.ts:21:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('#statement')
Expected: "1"
Received: "0"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('#statement') with timeout 5000ms
  - waiting for locator('#statement')
    14 × locator resolved to <div id="statement" data-fp-scene="0" data-fp-scenes="3" data-fp-section="true" data-fp-mobile-lock="true" class="cx-fp-section min-h-[100dvh] lg:min-h-[110vh] relative">…</div>
       - unexpected value "0"

```

```yaml
- paragraph: Trẻ em đang cúi đầu vào màn hình.
- paragraph: AIVA đưa ánh nhìn trở lại thế giới thật.
- paragraph: Không màn hình – chỉ giọng nói và khám phá.
- paragraph: 01 03
```

# Test source

```ts
  1  | import { expect, test, type Page } from "@playwright/test";
  2  |
  3  | async function swipeStory(page: Page, fromY = 640, toY = 300) {
  4  |   const cdp = await page.context().newCDPSession(page);
  5  |   const point = (y: number) => ({ x: 195, y, id: 1 });
  6  |
  7  |   await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point(fromY)] });
  8  |   await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point(toY)] });
  9  |   await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  10 |   await cdp.detach();
  11 | }
  12 |
  13 | test.beforeEach(async ({ page }) => {
  14 |   await page.addInitScript(() => localStorage.setItem("aiva_intro_seen", "1"));
  15 |   await page.goto("/");
  16 |   await expect(page.locator("#statement")).toBeAttached();
  17 |   // Let the page preloader unmount before testing touch input.
  18 |   await page.waitForTimeout(1300);
  19 | });
  20 |
  21 | test("Statement mobile: one swipe reveals exactly one new sentence", async ({ page }) => {
  22 |   const statement = page.locator("#statement");
  23 |   const lines = statement.locator(".cx-statement-line");
  24 |
  25 |   await statement.evaluate((element) => element.scrollIntoView({ block: "start" }));
  26 |   await expect(statement).toHaveAttribute("data-fp-scene", "0");
  27 |   await expect(lines.nth(0)).toHaveCSS("opacity", "1");
  28 |   await expect(lines.nth(1)).toHaveCSS("opacity", "0");
  29 |
  30 |   await swipeStory(page);
> 31 |   await expect(statement).toHaveAttribute("data-fp-scene", "1");
     |                           ^ Error: expect(locator).toHaveAttribute(expected) failed
  32 |
  33 |   // The hold prevents a momentum-like second gesture from skipping scene 2.
  34 |   await swipeStory(page);
  35 |   await expect(statement).toHaveAttribute("data-fp-scene", "1");
  36 |
  37 |   await expect(lines.nth(1)).toHaveCSS("opacity", "1");
  38 |   await expect(lines.nth(2)).toHaveCSS("opacity", "0");
  39 |   await expect(lines.nth(0)).toHaveCSS("opacity", "0");
  40 |
  41 |   await page.waitForTimeout(1500);
  42 |   await swipeStory(page);
  43 |   await expect(statement).toHaveAttribute("data-fp-scene", "2");
  44 |   await expect(lines.nth(2)).toHaveCSS("opacity", "1");
  45 |   await expect(lines.nth(1)).toHaveCSS("opacity", "0");
  46 | });
  47 |
```
