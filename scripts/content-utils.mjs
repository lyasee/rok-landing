import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
export const reservedSlugs = new Set([
  "wego",
  "apps",
  "legal",
  "404",
  "images",
  "sitemap",
  "robots",
]);
export const validSlug = (slug) =>
  typeof slug === "string" &&
  /^[a-z][a-z0-9-]*$/.test(slug) &&
  !reservedSlugs.has(slug);
export function filesUnder(directory, extension) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? filesUnder(file, extension)
      : entry.name.endsWith(extension)
        ? [file]
        : [];
  });
}
export function readLegal(file) {
  const source = readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);
  return { ...parse(match[1]), file, body: source.slice(match[0].length) };
}
export function readRegistry(root) {
  const appFiles = filesUnder(path.join(root, "src/content/apps"), ".json");
  const apps = appFiles.map((file) => ({
    ...JSON.parse(readFileSync(file, "utf8")),
    file,
  }));
  const legal = filesUnder(path.join(root, "src/content/legal"), ".md").map(
    readLegal,
  );
  return { apps, legal };
}
