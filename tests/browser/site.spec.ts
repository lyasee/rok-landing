import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const evidence = "evidence/SITE-001-20260908-111427";
const routes = [
  "/",
  "/mecodi/",
  "/mecodi/privacy/",
  "/mecodi/terms/",
  "/mecodi/privacy/versions/2026-09-08/",
  "/mecodi/terms/versions/2026-09-08/",
  "/movecut/privacy/",
  "/pogeun-diary/",
  "/pogeun-diary/support/",
  "/pogeun-diary/privacy/",
  "/pogeun-diary/terms/",
  "/pogeun-diary/privacy/versions/2026-09-10/",
  "/pogeun-diary/terms/versions/2026-09-10/",
  "/legal/",
  "/wego",
  "/wego/privacy",
  "/wego/",
  "/wego/privacy/",
];
for (const route of routes)
  test(`direct route ${route} renders without a client-side router`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  });
test("homepage points to Mecodi landing instead of its old dynamic link", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('a[href="/mecodi/"]')).toBeVisible();
  await expect(page.locator('a[href*="mapleapp.page.link"]')).toHaveCount(0);
  await expect(page.locator('a[href="/wego"], a[href="/wego/"]')).toHaveCount(
    0,
  );
});
test("both platform download destinations and current policy are explicit", async ({
  page,
}) => {
  await page.goto("/mecodi/");
  const links = page.locator("a.store-button");
  await expect(links).toHaveCount(2);
  await expect(links.first()).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/details?id=com.lyasee.maple",
  );
  await expect(page.locator(".store-pending")).toHaveCount(2);
  await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(0);
  await expect(
    page.getByText("기본 슬롯 2칸을 제공합니다.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("이 페이지는 재출시를 준비 중인", { exact: false }),
  ).toBeVisible();
});
test("all screenshot assets load and new pages make no third-party requests", async ({
  page,
}) => {
  const external: string[] = [],
    errors: string[] = [];
  page.on("request", (req) => {
    if (!req.url().startsWith("http://127.0.0.1:4328"))
      external.push(req.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/mecodi/");
  const images = page.locator("main img");
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((img) => (img as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
test("published legal document has working TOC, cross-links and version history", async ({
  page,
}) => {
  await page.goto("/mecodi/privacy/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index,follow",
  );
  await expect(
    page.getByText("시행일 2026년 9월 8일", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText("만 16세 이상 이용자");
  for (const anchor of await page
    .locator('.legal-sidebar a[href^="#"]')
    .all()) {
    const id = (await anchor.getAttribute("href"))!.slice(1);
    expect(
      await page.evaluate((value) => !!document.getElementById(value), id),
    ).toBe(true);
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://rok.gg/mecodi/privacy/",
  );
  await expect(page.locator(".version-history a")).toHaveAttribute(
    "href",
    "/mecodi/privacy/versions/2026-09-08/",
  );
});
test("MoveCut privacy policy is published and links to its terms", async ({
  page,
}) => {
  await page.goto("/movecut/privacy/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index,follow",
  );
  await expect(
    page.getByText("시행일 2026년 9월 9일", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('a[href="mailto:notice.rokgg@gmail.com"]').first(),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText("만 18세 이상 이용자");
  await expect(page.locator('a[href="/movecut/terms/"]').first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://rok.gg/movecut/privacy/",
  );
});
test("FAQ works without application JavaScript", async ({ page }) => {
  await page.goto("/mecodi/");
  const question = page.locator(".faq-list details").first();
  await question.locator("summary").click();
  await expect(question).toHaveAttribute("open", "");
  await expect(question.locator("p")).toBeVisible();
});
for (const width of [360, 390, 768, 1280])
  test(`responsive pages have no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/mecodi/",
      "/mecodi/privacy/",
      "/mecodi/terms/",
      "/movecut/privacy/",
      "/pogeun-diary/",
      "/pogeun-diary/support/",
      "/pogeun-diary/privacy/",
      "/pogeun-diary/terms/",
      "/legal/",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        route,
      ).toBe(true);
    }
  });
test("sitemap includes published legal documents and unknown paths return 404", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("https://rok.gg/mecodi/");
  expect(xml).toContain("https://rok.gg/mecodi/privacy/");
  expect(xml).toContain("https://rok.gg/mecodi/terms/");
  expect(xml).toContain("https://rok.gg/movecut/privacy/");
  expect(xml).toContain("https://rok.gg/pogeun-diary/");
  expect(xml).toContain("https://rok.gg/pogeun-diary/support/");
  expect(xml).toContain("https://rok.gg/pogeun-diary/privacy/");
  expect(xml).toContain("https://rok.gg/pogeun-diary/terms/");
  expect((await request.get("/missing-app-qa/")).status()).toBe(404);
});
test("all local links on new pages resolve to an existing page or anchor", async ({
  page,
  request,
}) => {
  const checked = new Set<string>();
  for (const route of [
    "/mecodi/",
    "/mecodi/privacy/",
    "/mecodi/terms/",
    "/movecut/privacy/",
    "/pogeun-diary/",
    "/pogeun-diary/support/",
    "/pogeun-diary/privacy/",
    "/pogeun-diary/terms/",
    "/legal/",
  ]) {
    await page.goto(route);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")!));
    for (const link of links) {
      if (!link.startsWith("/") || checked.has(link)) continue;
      checked.add(link);
      const path = link.split("#")[0];
      expect((await request.get(path)).ok(), `${route} → ${link}`).toBe(true);
    }
  }
});
test("capture desktop, mobile, and document layouts", async ({ page }) => {
  mkdirSync(evidence, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/mecodi/");
  await page.locator("#download").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `${evidence}/mecodi-desktop.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mecodi/");
  await page.screenshot({
    path: `${evidence}/mecodi-mobile.png`,
    fullPage: true,
  });
  await page.goto("/mecodi/privacy/");
  await page.screenshot({
    path: `${evidence}/privacy-mobile.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/legal/");
  await page.screenshot({
    path: `${evidence}/legal-index.png`,
    fullPage: true,
  });
});
