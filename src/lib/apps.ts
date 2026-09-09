import { getCollection, type CollectionEntry } from "astro:content";
export type AppEntry = CollectionEntry<"apps">;
export type AppInfo = AppEntry["data"];
export type LegalEntry = CollectionEntry<"legal">;
export const SITE = {
  url: "https://rok.gg",
  name: "알오케이지지",
  email: "notice.rokgg@gmail.com",
} as const;
export const documentLabel = {
  privacy: "개인정보처리방침",
  terms: "서비스 이용약관",
} as const;
export const appPath = (slug: string) => `/${slug}/`;
export const documentPath = (app: string, kind: string) => `/${app}/${kind}/`;
export const versionPath = (entry: LegalEntry) =>
  `/${entry.data.app}/${entry.data.type}/versions/${entry.data.version}/`;
export const dateLabel = (value: string) =>
  `${value.slice(0, 4)}년 ${Number(value.slice(5, 7))}월 ${Number(value.slice(8, 10))}일`;
async function sortApps() {
  const apps = await getCollection("apps");
  return apps.sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.slug.localeCompare(b.data.slug),
  );
}
export async function getApps() {
  return (await sortApps()).filter((entry) => entry.data.visible);
}
export async function getAllApps() {
  return sortApps();
}
export async function getCurrentDocuments(app: string) {
  return getCollection("legal", ({ data }) => data.app === app && data.current);
}
export async function getLegalVersions(app: string, kind: string) {
  const entries = await getCollection(
    "legal",
    ({ data }) => data.app === app && data.type === kind,
  );
  return entries.sort((a, b) => b.data.version.localeCompare(a.data.version));
}
export async function validateRegistry() {
  const apps = await getCollection("apps"),
    documents = await getCollection("legal");
  const slugs = new Set<string>();
  for (const { data: app } of apps) {
    if (
      slugs.has(app.slug) ||
      ["wego", "apps", "legal", "404"].includes(app.slug)
    )
      throw new Error(`Reserved or duplicate app slug: ${app.slug}`);
    slugs.add(app.slug);
    for (const kind of app.requiredDocuments) {
      const current = documents.filter(
        (d) =>
          d.data.app === app.slug && d.data.type === kind && d.data.current,
      );
      if (current.length !== 1)
        throw new Error(
          `${app.slug}/${kind} requires exactly one current document.`,
        );
    }
  }
  const versions = new Set<string>();
  for (const entry of documents) {
    const key = `${entry.data.app}/${entry.data.type}/${entry.data.version}`;
    if (!slugs.has(entry.data.app) || versions.has(key))
      throw new Error(`Orphaned or duplicate legal document: ${key}`);
    versions.add(key);
  }
}
