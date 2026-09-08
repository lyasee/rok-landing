import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { scaffoldApp } from "../scripts/new-app.mjs";
import { checkContent } from "../scripts/check-content.mjs";
import { readRegistry, readLegal } from "../scripts/content-utils.mjs";
const fixture = () => {
  const root = mkdtempSync(path.join(tmpdir(), "rok-content-test-"));
  mkdirSync(path.join(root, "public/images"), { recursive: true });
  writeFileSync(path.join(root, "public/images/app-placeholder.svg"), "<svg/>");
  return root;
};
function withApp(fn) {
  const root = fixture();
  try {
    const result = scaffoldApp(root, "sample-app", "테스트 앱", "2026-09-08");
    fn(root, result);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
test("scaffold creates one app and two Markdown documents without making them public", () =>
  withApp((root, result) => {
    const data = readRegistry(root);
    assert.equal(data.apps.length, 1);
    assert.equal(data.legal.length, 2);
    assert.equal(data.apps[0].visible, false);
    assert.equal(data.legal[0].status, "draft");
    assert.equal(checkContent(root).ok, true);
    assert.equal(result.documents.length, 2);
  }));
test("existing app is never overwritten", () =>
  withApp((root, result) => {
    const before = readFileSync(result.appFile, "utf8");
    assert.throws(() => scaffoldApp(root, "sample-app", "Overwrite"));
    assert.equal(readFileSync(result.appFile, "utf8"), before);
  }));
for (const slug of [
  "../escape",
  "Bad App",
  "wego",
  "legal",
  "images",
  "",
  "https://example.com",
])
  test(`rejects unsafe or reserved slug: ${slug}`, () => {
    const root = fixture();
    try {
      assert.throws(() => scaffoldApp(root, slug, "앱"));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
test("hidden draft app does not block another app release", () =>
  withApp((root) => {
    assert.equal(checkContent(root, { release: true }).ok, true);
  }));
test("visible draft app blocks publication but allows local preview", () =>
  withApp((root, result) => {
    const data = JSON.parse(readFileSync(result.appFile));
    data.visible = true;
    writeFileSync(result.appFile, JSON.stringify(data));
    assert.equal(checkContent(root).ok, true);
    const release = checkContent(root, { release: true });
    assert.equal(release.ok, false);
    assert.equal(release.errors.length, 2);
  }));
test("every required document needs exactly one current version", () =>
  withApp((root, result) => {
    const duplicate = readFileSync(result.documents[0], "utf8").replaceAll(
      "2026-09-08",
      "2026-09-09",
    );
    writeFileSync(
      path.join(path.dirname(result.documents[0]), "privacy-2026-09-09.md"),
      duplicate,
    );
    assert.equal(checkContent(root).ok, false);
  }));
test("missing assets are rejected", () =>
  withApp((root, result) => {
    const data = JSON.parse(readFileSync(result.appFile));
    data.icon = "/images/missing.png";
    writeFileSync(result.appFile, JSON.stringify(data));
    assert.equal(checkContent(root).ok, false);
  }));
test("store redirects and JavaScript links are not allowed", () =>
  withApp((root, result) => {
    const data = JSON.parse(readFileSync(result.appFile));
    data.stores = {
      googlePlay: "javascript:alert(1)",
      appStore: "https://example.org/redirect",
    };
    writeFileSync(result.appFile, JSON.stringify(data));
    assert.equal(checkContent(root).errors.length, 2);
  }));
test("published flag cannot silently bypass the legal review", () =>
  withApp((root, result) => {
    const file = result.documents[0];
    writeFileSync(
      file,
      readFileSync(file, "utf8").replace("status: draft", "status: published"),
    );
    assert.equal(checkContent(root).ok, false);
  }));
test("malformed Markdown frontmatter fails clearly", () => {
  const root = fixture(),
    file = path.join(root, "invalid.md");
  writeFileSync(file, "# no frontmatter");
  try {
    assert.throws(() => readLegal(file), /frontmatter/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("both legal document types are required for shared navigation", () =>
  withApp((root, result) => {
    const data = JSON.parse(readFileSync(result.appFile));
    data.requiredDocuments = ["privacy"];
    writeFileSync(result.appFile, JSON.stringify(data));
    assert.equal(checkContent(root).ok, false);
  }));
test("reviewed metadata cannot publish placeholder legal body", () =>
  withApp((root, result) => {
    const file = result.documents[0];
    const text = readFileSync(file, "utf8")
      .replace(
        "status: draft",
        'status: published\neffectiveDate: "2026-09-08"\napprovedBy: "Fixture reviewer"',
      )
      .replace(/reviewItems:[\s\S]*?\n---/, "reviewItems: []\n---");
    writeFileSync(file, text);
    assert.ok(
      checkContent(root).errors.some((error) =>
        error.includes("Unresolved draft content"),
      ),
    );
  }));
test("reviewed app and actual legal content can pass the release gate", () =>
  withApp((root, result) => {
    const data = JSON.parse(readFileSync(result.appFile));
    data.visible = true;
    writeFileSync(result.appFile, JSON.stringify(data));
    for (const file of result.documents) {
      const text = readFileSync(file, "utf8")
        .replace(
          "status: draft",
          'status: published\neffectiveDate: "2026-09-08"\napprovedBy: "Fixture reviewer"',
        )
        .replace(
          /reviewItems:[\s\S]*?\n---[\s\S]*/,
          "reviewItems: []\n---\n\n## 적용 범위\n검증을 위한 완성된 문서 본문입니다.\n",
        );
      writeFileSync(file, text);
    }
    assert.equal(checkContent(root, { release: true }).ok, true);
  }));
