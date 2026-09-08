import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(root, "../mecodi/evidence");
const out = path.join(root, "public/images/mecodi");
mkdirSync(out, { recursive: true });
const cases = [
  ["home", "ADS-002-20260907-205137/qa-home.png", 0.048, 0.982, 720],
  ["hair", "DESIGN-003-20260907-095134/device-hair-list.png", 0.325, 0.9, 640],
  [
    "skin",
    "DESIGN-003-20260907-095134/device-skins-final.png",
    0.325,
    0.9,
    640,
  ],
  ["pose", "DESIGN-003-20260907-095134/device-poses.png", 0.188, 0.976, 640],
];
const hash = (b) => createHash("sha256").update(b).digest("hex");
const manifest = [];
for (const [name, relative, topRatio, bottomRatio, width] of cases) {
  const original = readFileSync(path.join(source, relative)),
    meta = await sharp(original).metadata();
  const crop = {
    left: 0,
    top: Math.round(meta.height * topRatio),
    width: meta.width,
    height:
      Math.round(meta.height * bottomRatio) -
      Math.round(meta.height * topRatio),
  };
  const target = path.join(out, `${name}.webp`);
  const info = await sharp(original)
    .extract(crop)
    .resize({ width })
    .webp({ quality: 88 })
    .toFile(target);
  manifest.push({
    name,
    source: relative,
    sourceSHA256: hash(original),
    cropPixels: crop,
    output: `/images/mecodi/${name}.webp`,
    width: info.width,
    height: info.height,
    bytes: info.size,
    sha256: hash(readFileSync(target)),
  });
}
const dataPath = path.join(root, "src/content/apps/mecodi.json"),
  data = JSON.parse(readFileSync(dataPath, "utf8"));
Object.assign(data.hero, {
  width: manifest[0].width,
  height: manifest[0].height,
});
for (const shot of data.screenshots) {
  const item = manifest.find((m) => m.output === shot.src);
  Object.assign(shot, { width: item.width, height: item.height });
}
writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n");
writeFileSync(
  path.join(root, "docs/mecodi-assets.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(JSON.stringify(manifest, null, 2));
