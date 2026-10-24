// Stand fotoğraflarından site görselleri üretir.
//
//   1. Arka planı BiRefNet modeliyle kaldırır (kes.mjs; yerelde çalışır, sonuç work/kesim/ altında saklanır).
//   2. Maskeyi sertleştirir, kopuk küçük parçaları atar, beyaz dengesini standın beyazına göre düzeltir.
//   3. Her stand için üç dosya yazar: <ad>-640.webp, <ad>-1040.webp (stüdyo zemini) ve <ad>-kesik.webp (şeffaf).
//
// Kullanım: npm run build            (hepsi)
//           npm run build -- futbol  (adında "futbol" geçenler)
// Bir standın kesimini yeniden yaptırmak için work/kesim/<ad>.png dosyasını silin.
import sharp from 'sharp';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { STANDS, SRC_DIR, OUT_DIR } from './standlar.mjs';
import { cutout } from './kes.mjs';
import { standMask, eraseMarks } from './maske.mjs';
import { refineAlpha } from './alfa.mjs';

const IN_DIR = 'work/girdi';
const CUT_DIR = 'work/kesim';
const STUDIO = 1040;

const exists = p => access(p).then(() => true, () => false);

// ---------- 1. Arka plan kaldırma (önbellekli) ----------
async function cut(stand) {
  const cached = path.join(CUT_DIR, `${stand.name}.png`);
  if (await exists(cached)) return readFile(cached);

  const file = path.join(IN_DIR, `${stand.name}.jpg`);

  let input = sharp(path.join(SRC_DIR, stand.src)).rotate();
  if (stand.crop) {
    const { width, height } = await input.metadata();
    const [l, t, r, b] = stand.crop;
    input = input.extract({
      left: Math.round(l * width), top: Math.round(t * height),
      width: Math.round((r - l) * width), height: Math.round((b - t) * height),
    });
  }
  if (stand.erase) input = await eraseMarks(await input.jpeg({ quality: 98 }).toBuffer(), stand.erase);
  await input.jpeg({ quality: 95 }).toFile(file);
  const png = await cutout(file);
  await writeFile(cached, png);
  return png;
}

// ---------- 2. Maske düzeltme ----------
// Standın beyaz panellerini referans alıp ofis ışığının sarılığını giderir.
function whiteBalance(data, n) {
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (data[o + 3] < 250) continue;
    const R = data[o], G = data[o + 1], B = data[o + 2];
    const max = Math.max(R, G, B), min = Math.min(R, G, B);
    if (max > 175 && max - min < 40) { r += R; g += G; b += B; count++; }
  }
  if (count < 4000) return [1, 1, 1];
  r /= count; g /= count; b /= count;
  const gray = (r + g + b) / 3;
  const clamp = v => Math.max(0.88, Math.min(1.15, v));
  return [clamp(gray / r), clamp(gray / g), clamp(gray / b)];
}

async function prepare(stand) {
  const png = await cut(stand);
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (stand.outline) {
    // Model beyaz stand iskeletini arka plan sayabildiği için asıl maske dış hattan gelir (maske.mjs).
    const n = info.width * info.height;
    const tops = Buffer.alloc(n);
    for (let i = 0; i < n; i++) tops[i] = data[i * 4 + 3];
    const mask = await standMask(path.join(IN_DIR, `${stand.name}.jpg`), tops, stand.outline, stand.mask);
    for (let i = 0; i < n; i++) data[i * 4 + 3] = mask[i];
    refineAlpha(data, info.width, info.height, { low: 0, high: 255 });
  } else {
    refineAlpha(data, info.width, info.height, stand.alpha);
  }
  const [gr, gg, gb] = stand.whiteBalance === false ? [1, 1, 1] : whiteBalance(data, info.width * info.height);

  // Şeffaf kenarları kırp, beyaz dengesi ve hafif canlılık uygula.
  const trimmed = await sharp(data, { raw: info })
    .linear([gr, gg, gb, 1], [0, 0, 0, 0])
    .modulate({ saturation: 1.06 })
    .png()
    .toBuffer();
  return sharp(trimmed).trim({ threshold: 1 }).png().toBuffer();
}

// ---------- 3. Çıktılar ----------
function studioBackground(size) {
  // Sitenin pleksi beyazı ve çelik grisi tonlarında duvar + zemin.
  const horizon = Math.round(size * 0.74);
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EEF2F8"/><stop offset="1" stop-color="#DCE4EE"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D3DCE8"/><stop offset="1" stop-color="#EEF2F7"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".75"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${horizon}" fill="url(#wall)"/>
  <rect y="${horizon}" width="${size}" height="${size - horizon}" fill="url(#floor)"/>
  <rect width="${size}" height="${size}" fill="url(#glow)"/>
</svg>`);
}

function shadow(size, cx, baseY, w) {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${w * 0.035}"/></filter>
    <filter id="tight" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${w * 0.008}"/></filter>
  </defs>
  <ellipse cx="${cx}" cy="${baseY}" rx="${w * 0.56}" ry="${w * 0.07}" fill="#142033" opacity=".22" filter="url(#soft)"/>
  <ellipse cx="${cx}" cy="${baseY - w * 0.004}" rx="${w * 0.49}" ry="${w * 0.016}" fill="#142033" opacity=".38" filter="url(#tight)"/>
</svg>`);
}

async function writeOutputs(stand, cut) {
  const base = path.join(OUT_DIR, stand.name);

  // Şeffaf kesik: animasyon sahneleri için.
  await sharp(cut)
    .resize(STUDIO, STUDIO, { fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 84, alphaQuality: 90, effort: 6 })
    .toFile(`${base}-kesik.webp`);

  // Stüdyo: stand kareye ortalanır, tabanı zemine oturur.
  const fit = stand.fit ?? 0.84;
  const box = Math.round(STUDIO * fit);
  const placed = await sharp(cut)
    .resize(box, Math.round(STUDIO * 0.8), { fit: 'inside', kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6 })
    .png()
    .toBuffer();
  const { width: w, height: h } = await sharp(placed).metadata();
  const baseY = Math.round(STUDIO * 0.9);
  const left = Math.round((STUDIO - w) / 2);
  const top = baseY - h;

  const studio = await sharp(studioBackground(STUDIO))
    .composite([
      { input: shadow(STUDIO, STUDIO / 2, baseY, w), left: 0, top: 0 },
      { input: placed, left, top },
    ])
    .png()
    .toBuffer();

  await sharp(studio).webp({ quality: 82, effort: 6 }).toFile(`${base}-1040.webp`);
  await sharp(studio).resize(640, 640, { kernel: 'lanczos3' }).sharpen({ sigma: 0.5 })
    .webp({ quality: 80, effort: 6 }).toFile(`${base}-640.webp`);
}

// ---------- Çalıştır ----------
await mkdir(IN_DIR, { recursive: true });
await mkdir(CUT_DIR, { recursive: true });
await mkdir(OUT_DIR, { recursive: true });
const filter = process.argv[2];
for (const stand of STANDS.filter(s => !filter || s.name.includes(filter))) {
  const t = Date.now();
  const cut = await prepare(stand);
  await writeOutputs(stand, cut);
  console.log(`${stand.name.padEnd(26)} ${((Date.now() - t) / 1000).toFixed(1)} sn`);
}
