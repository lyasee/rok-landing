import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE, getAllApps, getApps, appPath, documentPath } from "@/lib/apps";
export const GET: APIRoute = async () => {
  const apps = await getApps();
  const slugs = new Set((await getAllApps()).map((a) => a.data.slug));
  const docs = await getCollection(
    "legal",
    ({ data }) =>
      data.current && data.status === "published" && slugs.has(data.app),
  );
  const paths = [
    "/",
    "/legal/",
    "/wego/",
    "/wego/privacy/",
    ...apps.map((a) => appPath(a.data.slug)),
    ...docs.map((d) => documentPath(d.data.app, d.data.type)),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(paths)].map((p) => `<url><loc>${new URL(p, SITE.url).href}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
