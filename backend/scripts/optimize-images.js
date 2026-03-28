const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..", "..");
const imgDir = path.join(projectRoot, "img");
const outputDir = path.join(projectRoot, "img_webp");

const exts = new Set([".jpg", ".jpeg", ".png"]);

function walk(dir, results = []) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      walk(full, results);
    } else {
      results.push(full);
    }
  });
  return results;
}

async function main() {
  if (!fs.existsSync(imgDir)) {
    console.log("img folder not found.");
    return;
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = walk(imgDir).filter((f) => exts.has(path.extname(f).toLowerCase()));
  if (!files.length) {
    console.log("No images to optimize.");
    return;
  }

  console.log("Optimizing", files.length, "images...");

  for (const file of files) {
    const rel = path.relative(imgDir, file);
    const outPath = path.join(outputDir, rel).replace(/\.(jpg|jpeg|png)$/i, ".webp");
    const outDir = path.dirname(outPath);
    fs.mkdirSync(outDir, { recursive: true });

    await sharp(file)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outPath);
  }

  console.log("WebP images written to img_webp/");
}

main().catch((err) => {
  console.error("Image optimization failed:", err);
  process.exit(1);
});
