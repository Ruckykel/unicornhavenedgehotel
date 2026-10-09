// Builds the default branded share image: public/og/default.jpg (1200×630).
// Run after `npm run media` (needs the traced unicorn path).
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const W = 1200;
const H = 630;
const src = readFileSync(join(ROOT, "src", "lib", "unicorn-path.ts"), "utf8");
const d = src.match(/PATH =\s*"([^"]+)"/)[1];
const vb = src.match(/VIEWBOX = "([^"]+)"/)[1];

const photo = await sharp(join(ROOT, "public", "media", "spaces", "exterior-facade.jpg"))
  .resize(560, H, { fit: "cover", position: "centre" })
  .toBuffer();

const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="640" height="${H}" fill="#14171A"/>
  <circle cx="132" cy="150" r="62" fill="none" stroke="#FAFAF7" stroke-width="2"/>
  <svg x="84" y="102" width="96" height="96" viewBox="${vb}"><path fill="#FAFAF7" d="${d}"/></svg>
  <text x="70" y="330" font-family="Bodoni Moda, Didot, Georgia, serif" font-size="58" fill="#FAFAF7">Unicorn Haven Edge</text>
  <text x="70" y="392" font-family="Bodoni Moda, Didot, Georgia, serif" font-size="58" fill="#FAFAF7">Hotel</text>
  <rect x="70" y="440" width="48" height="3" fill="#A8844F"/>
  <text x="70" y="500" font-family="Helvetica, Arial, sans-serif" font-size="23" fill="#B9C2BC">30 Elelenwo Street, Port Harcourt</text>
  <text x="70" y="540" font-family="Helvetica, Arial, sans-serif" font-size="23" fill="#B9C2BC">24/7 power · Wi-Fi · Restaurant · Secure parking</text>
</svg>`);

mkdirSync(join(ROOT, "public", "og"), { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: "#14171A" } })
  .composite([
    { input: photo, left: 640, top: 0 },
    { input: overlay, left: 0, top: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(join(ROOT, "public", "og", "default.jpg"));
console.log("og image written");
