// #26 fotoğrafındaki (beyaz levha üzerinde 8 süs) süsleri tek tek keser.
// Çıktı: assets/img/susler/sus-<ad>.webp, şeffaf zemin. Şeffaf pleksi çubuklar kesilmez;
// animasyonda gerekirse çubuk CSS/SVG ile çizilir.
//
// Kullanım: npm run susler
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { SRC_DIR } from './standlar.mjs';
import { cutout } from './kes.mjs';
import { refineAlpha } from './alfa.mjs';

const SRC = 'WhatsApp Image 2026-10-24 at 22.25.38 (4).jpeg';
const OUT = '../../assets/img/susler';
const WORK = 'work/susler';
const MAX = 640;

// Her süsün kabaca kutusu, [x0, y0, x1, y1] yüzde (kenar payı kodda eklenir).
const SUSLER = [
  { name: 'birthday-king',     box: [6, 19.3, 25, 40.7] },
  { name: 'birthday-queen',    box: [29, 18.7, 48, 40.7] },
  { name: 'iyi-ki-dogdun',     box: [51, 17.3, 69, 38.7] },
  { name: 'iyi-ki-varsin',     box: [72, 17.6, 91.5, 37.3] },
  { name: 'iyi-ki-bizimlesin', box: [3, 63, 23.5, 86] },
  { name: 'canim-kizim',       box: [26, 58, 47.5, 87] },
  { name: 'canim-babam',       box: [51, 56.5, 71.5, 83] },
  { name: 'happy-birthday',    box: [75.5, 57, 96.5, 82] },
];
const PAD = 1.5;

await mkdir(OUT, { recursive: true });
await mkdir(WORK, { recursive: true });
const src = sharp(path.join(SRC_DIR, SRC)).rotate();
const { width, height } = await src.metadata();

for (const { name, box: [x0, y0, x1, y1] } of SUSLER) {
  const left = Math.max(0, Math.round(((x0 - PAD) / 100) * width));
  const top = Math.max(0, Math.round(((y0 - PAD) / 100) * height));
  const right = Math.min(width, Math.round(((x1 + PAD) / 100) * width));
  const bottom = Math.min(height, Math.round(((y1 + PAD) / 100) * height));
  const file = path.join(WORK, `${name}.jpg`);
  await src.clone().extract({ left, top, width: right - left, height: bottom - top }).jpeg({ quality: 96 }).toFile(file);

  const png = await cutout(file);
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  // Yalnızca süsün kendisi kalsın: levha kenarındaki işaretler ve çubuk kırıntıları atılır.
  refineAlpha(data, info.width, info.height, { low: 40, high: 160, keep: 0.25 });
  const clean = await sharp(data, { raw: info }).modulate({ saturation: 1.05 }).png().toBuffer();
  await sharp(clean).trim({ threshold: 1 })
    .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 86, alphaQuality: 92, effort: 6 })
    .toFile(path.join(OUT, `sus-${name}.webp`));
  console.log(`sus-${name}`);
}
