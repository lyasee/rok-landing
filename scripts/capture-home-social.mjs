/** Capture the real homepage as a compact social preview; run against local Astro preview. */
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = process.argv[2] ?? "http://127.0.0.1:4392/";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+\/$/.test(url))
  throw new Error("Use the local homepage preview URL.");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch(
  existsSync(chrome) ? { executablePath: chrome } : {},
);
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    reducedMotion: "reduce",
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `
    .home-page { padding: 22px; } .site-frame { height: 586px; padding: 28px 42px; overflow: hidden; }
    .home-hero { padding: 30px 12px 22px; min-height: 0; } .home-hero h1 { font-size: 64px; }
    .hero-link, .home-nav, .section-heading, .next-apps, .home-footer, .app-card__artwork, .app-card__headline, .app-card__description, .app-card__actions, .app-card__tags { display: none !important; }
    .hero-description { margin-top: 19px; } .hero-playground { height: 290px; }
    .app-collection__cards { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .app-card { min-height: 0 !important; height: 117px !important; border-radius: 22px; }
    .app-card__link { min-height: 0 !important; height: 117px; padding: 20px 26px !important; display: block !important; }
    .app-card__copy { padding: 0 !important; } .app-card__meta { margin: 0; }
    .app-card__name { font-size: 25px !important; margin-top: 9px !important; }
    .app-card__icon { width: 32px !important; height: 32px !important; }
  `,
  });
  await page.addStyleTag({
    content:
      ".app-artwork, .app-card__action { display:none !important; } .app-card__identity { margin:0 !important; }",
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((img) => img.getBoundingClientRect().width > 0)
        .map((img) => img.decode()),
    );
  });
  const output = path.join(root, "public/images/home/social.png");
  mkdirSync(path.dirname(output), { recursive: true });
  await page.screenshot({ path: output });
  console.log(`Created ${output} (1200 x 630)`);
} finally {
  await browser.close();
}
