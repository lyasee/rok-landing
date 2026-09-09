import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const evidence = "evidence/MOVECUT-LANDING-20260909";
for (const route of [
  "/movecut/",
  "/movecut",
  "/movecut/privacy/",
  "/movecut/terms/",
  "/movecut/privacy/versions/2026-09-09/",
]) {
  test(`MoveCut route ${route} is generated and navigable`, async ({
    page,
  }) => {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });
}
test("app registry connects landing, home, sitemap and published policies", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('a[href="/movecut/"]')).toBeVisible();
  await page.goto("/movecut/");
  await expect(page).toHaveTitle(/무브컷.*MoveCut/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://rok.gg/movecut/",
  );
  await expect(
    page.locator('.mc-footer a[href="/movecut/privacy/"]'),
  ).toBeVisible();
  await expect(
    page.locator('.mc-footer a[href="/movecut/terms/"]'),
  ).toBeVisible();
  expect(await (await request.get("/sitemap.xml")).text()).toContain(
    "<loc>https://rok.gg/movecut/</loc>",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://rok.gg/images/movecut/social.webp",
  );
  expect((await request.get("/images/movecut/social.webp")).status()).toBe(200);
});
test("unpublished stores are explicit and prices or invented links are not advertised", async ({
  page,
}) => {
  await page.goto("/movecut/");
  await expect(page.locator(".store-pending")).toHaveCount(2);
  await expect(
    page.locator('a[href*="play.google.com"], a[href*="apps.apple.com"]'),
  ).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText("4,900원");
  await expect(page.locator("#download")).toContainText("스토어 공개 후");
});
test("mode preview is keyboard accessible and modal returns focus", async ({
  page,
}) => {
  await page.goto("/movecut/");
  const dark = page.getByRole("tab", { name: "다크", exact: false });
  await dark.click();
  await expect(dark).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#mode-dark")).toBeVisible();
  await expect(page.locator("#mode-light")).toBeHidden();
  await dark.press("Home");
  await expect(
    page.getByRole("tab", { name: "라이트", exact: false }),
  ).toBeFocused();
  await expect(page.locator("#mode-light")).toBeVisible();
  const trigger = page.getByRole("button", {
    name: "러닝 영수증 카드 크게 보기",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".mc-lightbox img")).toHaveAttribute(
    "src",
    "/images/movecut/card-receipt.webp",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});
test("all landing assets load locally without third-party requests or runtime errors", async ({
  page,
}) => {
  const external: string[] = [],
    errors: string[] = [];
  page.on("request", (request) => {
    if (
      !request.url().startsWith("http://127.0.0.1:4328") &&
      !request.url().startsWith("data:")
    )
      external.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/movecut/");
  for (const image of await page.locator("main img").all()) {
    if (await image.isVisible()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((el) => (el as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
  }
  await page.getByRole("tab", { name: "다크", exact: false }).click();
  await expect
    .poll(() =>
      page
        .locator("#mode-dark img")
        .evaluate((el) => (el as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "무브컷 홍보 이미지 크게 보기", exact: true })
    .click();
  await expect(page.locator(".mc-lightbox img")).toHaveAttribute(
    "src",
    "/images/movecut/promo/story.webp",
  );
  await expect
    .poll(() =>
      page
        .locator(".mc-lightbox img")
        .evaluate((el) => (el as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "이미지 닫기", exact: true }).click();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
test("landing background reaches the viewport top without collapsing the header inset", async ({
  page,
}) => {
  await page.goto("/movecut/");
  const layout = await page.locator("body.mc-page").evaluate((body) => ({
    bodyTop: body.getBoundingClientRect().top,
    headerTop: body
      .querySelector<HTMLElement>(".mc-header")!
      .getBoundingClientRect().top,
  }));
  expect(layout.bodyTop).toBe(0);
  expect(layout.headerTop).toBeGreaterThan(0);
});
for (const width of [320, 360, 390, 768, 1280, 1440]) {
  test(`MoveCut responsive layout has no horizontal page overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/movecut/");
    for (const selector of [
      "#features",
      "#how-it-works",
      "#screens",
      "#download",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
  });
}
test("local page and section links resolve", async ({ page, request }) => {
  await page.goto("/movecut/");
  for (const link of await page
    .locator("a[href]")
    .evaluateAll((items) => items.map((item) => item.getAttribute("href")!))) {
    if (link.startsWith("#"))
      expect(await page.locator(link).count(), link).toBe(1);
    else if (link.startsWith("/"))
      expect((await request.get(link.split("#")[0])).ok(), link).toBe(true);
  }
});
test.describe("progressive enhancement", () => {
  test.use({ javaScriptEnabled: false });
  test("content, download state and FAQ work without JavaScript", async ({
    page,
  }) => {
    await page.goto("/movecut/");
    await expect(page.locator("h1")).toBeVisible();
    const question = page.locator(".mc-faq-list details").first();
    await question.locator("summary").click();
    await expect(question).toHaveAttribute("open", "");
    await expect(question.locator("p")).toBeVisible();
    await expect(page.locator(".store-pending")).toHaveCount(2);
    await expect(page.locator("#mode-light")).toBeVisible();
  });
});
test("capture the actual desktop and mobile landing", async ({ page }) => {
  mkdirSync(evidence, { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/movecut/");
    for (const image of await page.locator("main img").all())
      if (await image.isVisible()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate((el) => (el as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
      }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${evidence}/movecut-${name}-hero.png` });
    await page.screenshot({
      path: `${evidence}/movecut-${name}.png`,
      fullPage: true,
    });
  }
});
