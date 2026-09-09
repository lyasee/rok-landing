import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const root = process.cwd(),
  metadata = JSON.parse(fs.readFileSync("docs/movecut-assets.json", "utf8"));
const retired = JSON.parse(
  fs.readFileSync("docs/movecut-retired-assets.json", "utf8"),
);
const hash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const errors = [];
for (const asset of metadata.assets) {
  const file = path.join(root, "public", asset.output);
  if (!fs.existsSync(file) || hash(file) !== asset.sha256)
    errors.push(`Landing asset needs review: ${asset.output}`);
}
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((i) =>
      i.isDirectory() ? walk(path.join(dir, i.name)) : [path.join(dir, i.name)],
    );
}
for (const file of walk("public/images/movecut"))
  if (retired.some((item) => item.sha256 === hash(file)))
    errors.push(`Retired image still present: ${file}`);
if (fs.existsSync("dist/images/movecut"))
  for (const file of walk("dist/images/movecut"))
    if (retired.some((item) => item.sha256 === hash(file)))
      errors.push(`Retired image in build: ${file}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "MoveCut landing assets match reviewed derivatives; retired hashes absent.",
  );
