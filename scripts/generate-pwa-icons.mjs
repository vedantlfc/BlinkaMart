import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const sourceLogo = path.join(rootDir, "public", "dopecart-logo-web.svg");
const outputDir = path.join(rootDir, "public", "pwa");
const background = "#fff8ea";

async function writeStandardIcon(size) {
  const outputPath = path.join(outputDir, `icon-${size}.png`);

  await sharp(sourceLogo, { density: 384 })
    .resize(size, size, { fit: "contain", background })
    .png()
    .toFile(outputPath);
}

async function writeMaskableIcon(size) {
  const outputPath = path.join(outputDir, `maskable-icon-${size}.png`);

  await sharp(sourceLogo, { density: 384 })
    .resize(size, size, { fit: "contain", background })
    .png()
    .toFile(outputPath);
}

await fs.mkdir(outputDir, { recursive: true });

for (const size of [192, 512]) {
  await writeStandardIcon(size);
  await writeMaskableIcon(size);
}

console.log("Generated PWA icons in public/pwa.");
