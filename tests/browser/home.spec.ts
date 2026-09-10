import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";

const retired = /위고|김프|물타기|쿠키런|라이즈 오브 킹덤즈/;
test("home only lists registered visible apps and preserves actual launch states", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/ROK.GG.*취향대로/);
  await expect(page.locator(".app-card")).toHaveCount(3);
  await expect(page.locator("main")).not.toContainText(retired);
  await expect(page.locator('[data-app="mecodi"]')).toContainText(
    "메코디 2.0 미리보기",
  );
  await expect(page.locator('[data-app="movecut"]')).toContainText(
    "스토어 공개 준비 중",
  );
  await expect(page.locator('[data-app="pogeun-diary"]')).toContainText(
    "Pogeun Diary",
  );
  await expect(page.locator('[data-app="pogeun-diary"]')).toContainText(
    "스티커 다이어리",
  );
  await expect(page.locator('[data-app="pogeun-diary"]')).toContainText(
    "글은 짧게, 하루는 귀엽게.",
  );
  await expect(page.locator('[data-app="pogeun-diary"]')).toContainText(
    "스토어 공개 준비 중",
  );
  await expect(
    page.locator('a[href*="play.google.com"], a[href*="apps.apple.com"]'),
  ).toHaveCount(0);
  await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
});

test("all product cards navigate to their real landing pages", async ({
  page,
}) => {
  for (const [name, slug] of [
    ["메코디", "mecodi"],
    ["무브컷", "movecut"],
    ["포근일기", "pogeun-diary"],
  ]) {
    await page.goto("/");
    await page
      .getByRole("link", { name: `${name} 살펴보기`, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${slug}/$`));
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("all images, the social cover and links resolve without external requests or runtime errors", async ({
  page,
  request,
}) => {
  const external: string[] = [],
    errors: string[] = [];
  page.on("request", (req) => {
    if (
      !req.url().startsWith("http://127.0.0.1:4328") &&
      !req.url().startsWith("data:")
    )
      external.push(req.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const img of await page.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  }
  for (const href of await page
    .locator("a[href]")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")!))) {
    if (href.startsWith("#"))
      expect(await page.locator(href).count(), href).toBe(1);
    else if (href.startsWith("/"))
      expect((await request.get(href)).ok(), href).toBe(true);
  }
  expect((await request.get("/images/home/social.png")).ok()).toBe(true);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

for (const width of [320, 360, 390, 540, 700, 768, 1024, 1440, 1920]) {
  test(`home does not overflow or clip product text at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const clipping = await page.locator(".app-card").evaluateAll((cards) =>
      cards.flatMap((card) => {
        const bounds = card.getBoundingClientRect();
        return [
          ...card.querySelectorAll(
            ".app-card__copy h3, .app-card__copy p, .pill-link",
          ),
        ]
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return (
              rect.left < bounds.left ||
              rect.right > bounds.right ||
              el.scrollWidth > el.clientWidth + 1
            );
          })
          .map((el) => el.textContent);
      }),
    );
    expect(clipping).toEqual([]);
  });
}

test("skip link and keyboard navigation work", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "본문으로 바로가기" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  const card = page.getByRole("link", { name: "메코디 살펴보기", exact: true });
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/mecodi\/$/);
});

test("decorations animate, pause on request and honor live system preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  const shape = page.locator(".hero-shape--blue");
  await expect
    .poll(() => shape.evaluate((el) => el.getAnimations().length))
    .toBeGreaterThan(0);
  const first = await shape.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(250);
  expect(await shape.evaluate((el) => getComputedStyle(el).transform)).not.toBe(
    first,
  );
  await page.getByRole("button", { name: "움직임 끄기", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.locator("[data-motion-toggle]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
  ).toBe(0);
  await page.getByRole("button", { name: "움직임 켜기", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(
    page.getByRole("button", { name: "동작 줄이기 적용 중" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
  ).toBe(0);
});

test("offscreen decorations stop and desktop artwork reacts to the pointer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const card = page.locator('[data-app="mecodi"] .app-card__link');
  await card.scrollIntoViewIfNeeded();
  await card.hover({ position: { x: 60, y: 60 } });
  await expect
    .poll(() =>
      page
        .locator('[data-app="mecodi"] [data-parallax-plane]')
        .evaluate((el) =>
          (el as HTMLElement).style.getPropertyValue("--pointer-x"),
        ),
    )
    .not.toBe("");
  await page.locator(".home-footer").scrollIntoViewIfNeeded();
  await expect(page.locator(".home-hero")).toHaveAttribute(
    "data-in-view",
    "false",
  );
  expect(
    await page
      .locator(".hero-shape--blue")
      .evaluate((el) => el.getAnimations().length),
  ).toBe(0);
});

test.describe("home without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("content and navigation remain usable without a motion script", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".app-card")).toHaveCount(3);
    await expect(page.locator("[data-motion-toggle]")).toBeHidden();
    await page
      .getByRole("link", { name: "무브컷 살펴보기", exact: true })
      .click();
    await expect(page).toHaveURL(/\/movecut\/$/);
  });
});

test("capture production desktop and mobile layouts", async ({ page }) => {
  const dir = "evidence/HOME-PLAYFUL-20260909";
  mkdirSync(dir, { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${dir}/home-${name}.png`, fullPage: true });
    await page.screenshot({ path: `${dir}/home-${name}-first-fold.png` });
  }
});

test("homepage manifest and brand icons load as actual images", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/home.webmanifest",
  );
  const response = await request.get("/home.webmanifest");
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.short_name).toBe("ROK.GG");
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).ok(), icon.src).toBe(true);
    const size = await page.evaluate(async (src) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    }, icon.src);
    expect(size[0], icon.src).toBeGreaterThan(0);
    expect(size[0]).toBe(size[1]);
  }
});
