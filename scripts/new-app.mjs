import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";
import { validSlug } from "./content-utils.mjs";
export function scaffoldApp(
  root,
  slug,
  name,
  today = new Date().toISOString().slice(0, 10),
) {
  if (!validSlug(slug))
    throw new Error(
      "Use an unused lowercase slug, e.g. my-app. Reserved routes are not allowed.",
    );
  if (!name?.trim() || name.length > 80)
    throw new Error("Provide an app name (1–80 characters).");
  const appFile = path.join(root, "src/content/apps", `${slug}.json`),
    legalDir = path.join(root, "src/content/legal", slug);
  if (
    existsSync(appFile) ||
    existsSync(legalDir) ||
    existsSync(path.join(root, "src/pages", slug)) ||
    existsSync(path.join(root, "src/pages", `${slug}.astro`))
  )
    throw new Error("This app or route exists. No files were overwritten.");
  const app = {
    slug,
    name: name.trim(),
    listingName: name.trim(),
    tagline: "앱의 핵심 가치를 한 문장으로 작성하세요.",
    description: "실제로 제공하는 기능을 소개해 주세요.",
    visible: false,
    order: 100,
    accent: "#c44708",
    icon: "/images/app-placeholder.svg",
    launchStatus: "coming-soon",
    releaseLabel: "출시 준비 중",
    releaseNote: "스토어 공개 전 안내입니다.",
    hero: {
      line1: "새로운 앱을",
      line2: "준비하고 있어요.",
      body: "제공 기능과 사용자에게 전달할 가치를 작성하세요.",
      image: "/images/app-placeholder.svg",
      imageAlt: "출시 준비 중인 앱의 임시 아이콘",
      width: 400,
      height: 400,
    },
    stores: {},
    features: [
      {
        title: "대표 기능",
        description: "실제로 구현하고 확인한 기능을 작성하세요.",
      },
    ],
    screenshots: [],
    faq: [],
    usage: {
      title: "이용 안내",
      body: "요금, 광고, 저장 방식 등 이용 조건을 작성하세요.",
      notes: [],
    },
    requiredDocuments: ["privacy", "terms"],
    disclaimer: "",
  };
  const documents = ["privacy", "terms"].map((type) => {
    const title = type === "privacy" ? "개인정보처리방침" : "서비스 이용약관";
    const data = {
      app: slug,
      type,
      title,
      summary: `${name} ${title} 검토본입니다.`,
      version: today,
      current: true,
      status: "draft",
      updatedAt: today,
      reviewItems: [
        "앱의 실제 동작과 운영 사실을 확인하여 본문을 작성하고 공개를 승인하세요.",
      ],
    };
    return {
      file: path.join(legalDir, `${type}-${today}.md`),
      text: `---\n${stringify(data)}---\n\n## 1. 문서 작성 안내\n\n이 문서는 아직 시행하지 않는 작성용 틀입니다. ${type === "privacy" ? "처리 항목·목적·기간·외부 사업자·국외이전·이용자 권리·담당 연락처를 실제 데이터 흐름에 맞게 작성하세요." : "제공 기능·이용 조건·저장 및 복구·광고나 결제·책임·변경 고지를 해당 앱에 맞게 작성하세요."}\n`,
    };
  });
  mkdirSync(path.dirname(appFile), { recursive: true });
  mkdirSync(legalDir, { recursive: true });
  writeFileSync(appFile, JSON.stringify(app, null, 2) + "\n", { flag: "wx" });
  for (const document of documents)
    writeFileSync(document.file, document.text, { flag: "wx" });
  return { appFile, documents: documents.map((d) => d.file), visible: false };
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
    const result = scaffoldApp(root, process.argv[2], process.argv[3]);
    console.log(JSON.stringify(result, null, 2));
    console.log(
      "Fill in the app JSON and legal Markdown, then set visible=true. No router changes required.",
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
