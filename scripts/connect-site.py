from pathlib import Path
root = Path(__file__).resolve().parents[1]
def replace(rel, old, new, count=1):
 p=root/rel; text=p.read_text()
 if text.count(old)!=count: raise RuntimeError('Unexpected matches: '+rel)
 p.write_text(text.replace(old,new))
replace('src/data/products.ts','  name: string;\n  icon: string;','  name: string;\n  appSlug?: string;\n  icon: string;')
replace('src/data/products.ts','// 내부 소개 페이지 경로(다운로드 링크가 아직 없는 출시 준비 중 앱용).','// 공통 앱 레지스트리를 연결하면 새 정보와 내부 소개 페이지를 우선 사용합니다.')
replace('src/data/products.ts','    name: "메코디 - 코디 시뮬레이터",','    name: "메코디 - 코디 시뮬레이터",\n    appSlug: "mecodi",')
replace('src/data/products.ts','    link: {\n      href: "https://mapleapp.page.link/default",\n    },','    page: "/mecodi/",')
replace('src/pages/index.astro','import { appProducts, webProducts } from "@/data/products";','''import { appProducts, webProducts, type AppProduct } from "@/data/products";
import { getApps, appPath } from "@/lib/apps";
const registered = await getApps();
const registeredCard = (app: (typeof registered)[number]): AppProduct => ({ appSlug: app.data.slug, name: app.data.listingName, icon: app.data.icon, description: app.data.tagline, page: appPath(app.data.slug) });
const products: AppProduct[] = appProducts.map(product => {
  const app = registered.find(entry => entry.data.slug === product.appSlug);
  return app ? registeredCard(app) : product;
});
products.push(...registered.filter(app => !appProducts.some(product => product.appSlug === app.data.slug)).map(registeredCard));''')
replace('src/pages/index.astro','appProducts.slice(', 'products.slice(',2)
replace('src/pages/index.astro','<html lang="en">','<html lang="ko">')
replace('src/pages/index.astro','    <title>{title}</title>','    <link rel="canonical" href="https://rok.gg/" />\n    <title>{title}</title>')
replace('src/pages/index.astro','      <footer class="footer">','      <footer class="footer">')
replace('src/pages/index.astro','          <p>\n            <a href="mailto:notice.rokgg@gmail.com">Contact Us</a>\n          </p>','          <p><a href="mailto:notice.rokgg@gmail.com">Contact Us</a></p>\n          <p><a href="/legal/">앱별 개인정보처리방침 · 이용약관</a></p>')
# Emit directory indexes for GitHub Pages deep links, without an SPA fallback.
replace('astro.config.mjs','  output: "static",','  output: "static",\n  trailingSlash: "always",\n  build: { format: "directory" },')
print('Connected registry to home; legacy Wego pages and other apps preserved.')
