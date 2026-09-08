import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readRegistry, validSlug } from "./content-utils.mjs";
export function checkContent(root, { release = false } = {}) {
  const { apps, legal } = readRegistry(root),
    errors = [],
    versions = new Set(),
    slugs = new Set();
  const asset = (value) =>
    typeof value === "string" &&
    /^\/images\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|svg)$/.test(value) &&
    existsSync(path.join(root, "public", value));
  for (const app of apps) {
    if (
      !validSlug(app.slug) ||
      slugs.has(app.slug) ||
      path.basename(app.file) !== `${app.slug}.json`
    )
      errors.push(`Invalid/duplicate app slug: ${app.slug}`);
    slugs.add(app.slug);
    if (existsSync(path.join(root, "src/pages", `${app.slug}.astro`)))
      errors.push(`Static route collision: ${app.slug}`);
    for (const src of [
      app.icon,
      app.hero?.image,
      ...(app.screenshots ?? []).map((s) => s.src),
    ])
      if (!asset(src)) errors.push(`${app.slug}: missing/unsafe image ${src}`);
    for (const [store, link] of Object.entries(app.stores ?? {})) {
      try {
        const url = new URL(link),
          expected =
            store === "googlePlay"
              ? "play.google.com"
              : store === "appStore"
                ? "apps.apple.com"
                : "";
        if (
          url.protocol !== "https:" ||
          url.hostname !== expected ||
          url.username ||
          url.password
        )
          throw new Error("Unsafe store URL");
      } catch {
        errors.push(`${app.slug}: invalid ${store} URL`);
      }
    }
    if (
      !Array.isArray(app.requiredDocuments) ||
      app.requiredDocuments.length !== 2 ||
      !["privacy", "terms"].every((type) =>
        app.requiredDocuments.includes(type),
      )
    )
      errors.push(`${app.slug}: privacy and terms are both required`);
    for (const type of app.requiredDocuments ?? []) {
      const current = legal.filter(
        (d) => d.app === app.slug && d.type === type && d.current === true,
      );
      if (current.length !== 1)
        errors.push(`${app.slug}/${type}: expected one current document`);
      if (
        release &&
        app.visible &&
        current.some(
          (d) =>
            d.status !== "published" ||
            !d.approvedBy?.trim() ||
            !d.effectiveDate ||
            (d.reviewItems ?? []).length,
        )
      )
        errors.push(`${app.slug}/${type}: publication review incomplete`);
    }
  }
  for (const doc of legal) {
    const key = `${doc.app}/${doc.type}/${doc.version}`;
    if (
      !slugs.has(doc.app) ||
      versions.has(key) ||
      !["privacy", "terms"].includes(doc.type)
    )
      errors.push(`Orphaned/duplicate/invalid document: ${key}`);
    if (path.basename(doc.file) !== `${doc.type}-${doc.version}.md`)
      errors.push(`Document filename mismatch: ${key}`);
    if (
      doc.status === "published" &&
      (!doc.approvedBy?.trim() ||
        !doc.effectiveDate ||
        (doc.reviewItems ?? []).length)
    )
      errors.push(`Invalid published document: ${key}`);
    if (
      doc.status === "published" &&
      /공개 전 검토본|국외이전 명세 확인 중|문서 작성 안내/.test(doc.body)
    )
      errors.push(`Unresolved draft content in published document: ${key}`);
    if (!doc.body.trim()) errors.push(`Empty document: ${key}`);
    versions.add(key);
  }
  return {
    ok: !errors.length,
    release,
    apps: apps.length,
    visibleApps: apps.filter((a) => a.visible).length,
    documents: legal.length,
    drafts: legal.filter((d) => d.status === "draft").length,
    errors,
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const root = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
    );
    const result = checkContent(root, {
      release: process.argv.includes("--release"),
    });
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
