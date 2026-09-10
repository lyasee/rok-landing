import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";

const evidence = "evidence/POGEUN-DIARY-20260910";
const appRoutes = [
  "/pogeun-diary/",
  "/pogeun-diary",
  "/pogeun-diary/support/",
  "/pogeun-diary/privacy/",
  "/pogeun-diary/terms/",
  "/pogeun-diary/privacy/versions/2026-09-10/",
  "/pogeun-diary/terms/versions/2026-09-10/",
];

for (const route of appRoutes) {
  test(`Pogeun Diary route ${route} is generated`, async ({ page }) => {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  });
}

test("landing metadata, factual headline, and actual example labels are explicit", async ({
  page,
}) => {
  await page.goto("/pogeun-diary/");
  await expect(page).toHaveTitle(/포근일기.*Pogeun Diary/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://rok.gg/pogeun-diary/",
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "글은 짧게, 하루는 귀엽게.",
    }),
  ).toBeVisible();
  await expect(page.locator(".pd-showcase")).toContainText(
    "실제 이용자의 개인 기록은 사용하지 않았습니다",
  );
  await expect(page.getByText("72가지 작은 표정.")).toBeVisible();
  await expect(page.locator("body")).toContainText("8가지 속지");
});

test("all six real screenshots and the icon load without third-party requests", async ({
  page,
}) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on("request", (request) => {
    if (
      !request.url().startsWith("http://127.0.0.1:4328") &&
      !request.url().startsWith("data:")
    )
      external.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/pogeun-diary/");

  const paths = [
    "screen-home.webp",
    "screen-editor.webp",
    "screen-stickers.webp",
    "screen-calendar.webp",
    "screen-papers.webp",
    "screen-backup.webp",
  ];
  for (const name of paths) {
    const image = page.locator(`main img[src$="${name}"]`).first();
    await image.evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await expect
      .poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  }
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    "/images/pogeun-diary/icon.png",
  );
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test("unreleased stores stay pending without fake store or purchase links", async ({
  page,
}) => {
  await page.goto("/pogeun-diary/");
  await expect(page.locator(".store-pending")).toHaveCount(2);
  await expect(
    page.locator('a[href*="play.google.com"], a[href*="apps.apple.com"]'),
  ).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/3,900|3900|무료 앱/);
  await expect(page.locator("body")).not.toContainText(/리뷰|다운로드 수|랭킹/);
  await expect(page.locator("#download")).toContainText(
    "최종 조건은 스토어 공개 시",
  );
});

test("support uses the confirmed address and discourages sensitive attachments", async ({
  page,
}) => {
  await page.goto("/pogeun-diary/support/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://rok.gg/pogeun-diary/support/",
  );
  const mail = page.locator(
    'main a[href^="mailto:notice.rokgg@gmail.com?subject="]',
  );
  await expect(mail).toBeVisible();
  await expect(page.locator("main")).toContainText(
    "처음부터 일기 사진, 일기 원문, 백업 파일을 첨부하지 마세요",
  );
  await expect(page.locator("main")).toContainText(
    "백업 암호, 기기 비밀번호, 인증 코드도 절대 보내지 마세요",
  );
  await expect(page.locator("main")).toContainText(
    "문의 내용과 확인 범위에 따라 답변까지 시간이 걸릴 수 있습니다",
  );
});

test("draft policies and version routes remain review-only and canonical", async ({
  page,
}) => {
  for (const kind of ["privacy", "terms"] as const) {
    await page.goto(`/pogeun-diary/${kind}/`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,follow",
    );
    await expect(page.locator(".document-notice")).toContainText(
      "공개 전 검토본",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://rok.gg/pogeun-diary/${kind}/`,
    );
    await expect(
      page.locator(`a[href="/pogeun-diary/${kind}/versions/2026-09-10/"]`),
    ).toBeVisible();

    await page.goto(`/pogeun-diary/${kind}/versions/2026-09-10/`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,follow",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://rok.gg/pogeun-diary/${kind}/versions/2026-09-10/`,
    );
  }
});

test("legal index and sitemap expose only routes safe for the draft state", async ({
  page,
  request,
}) => {
  await page.goto("/legal/");
  const card = page.locator(".document-card", { hasText: "포근일기" });
  await expect(card).toBeVisible();
  await expect(card).toContainText("공개 전 검토본");
  await expect(card.locator('a[href="/pogeun-diary/privacy/"]')).toBeVisible();
  await expect(card.locator('a[href="/pogeun-diary/terms/"]')).toBeVisible();

  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("<loc>https://rok.gg/pogeun-diary/</loc>");
  expect(xml).toContain("<loc>https://rok.gg/pogeun-diary/support/</loc>");
  expect(xml).not.toContain("https://rok.gg/pogeun-diary/privacy/");
  expect(xml).not.toContain("https://rok.gg/pogeun-diary/terms/");
});

for (const [name, width, height] of [
  ["mobile-360", 360, 844],
  ["desktop", 1440, 1000],
] as const) {
  test(`landing and support do not overflow at ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of ["/pogeun-diary/", "/pogeun-diary/support/"]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        route,
      ).toBe(true);
      expect(
        await page.evaluate(
          () =>
            document
              .getAnimations()
              .filter((animation) => animation.playState === "running").length,
        ),
      ).toBe(0);
    }
  });
}

test("landing works without JavaScript and all internal links resolve", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4328/pogeun-diary/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".store-pending")).toHaveCount(2);

  const checked = new Set<string>();
  for (const href of await page
    .locator("a[href]")
    .evaluateAll((items) => items.map((item) => item.getAttribute("href")!))) {
    if (href.startsWith("#"))
      expect(await page.locator(href).count(), href).toBe(1);
    else if (href.startsWith("/") && !checked.has(href)) {
      checked.add(href);
      expect((await request.get(href.split("#")[0])).ok(), href).toBe(true);
    }
  }
  await context.close();
});

test("capture Pogeun Diary desktop and 360px mobile layouts", async ({
  page,
}) => {
  mkdirSync(evidence, { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile-360", 360, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/pogeun-diary/");
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((el) => (el as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `${evidence}/pogeun-${name}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `${evidence}/pogeun-${name}-hero.png` });
  }
});
