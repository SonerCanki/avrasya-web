// Kırpılmış stand fotoğrafının üstüne %5 ızgara çizer; dış hattın köşeleri yüzde olarak okunur.
// Kullanım: node izgara.mjs <ad>   (work/girdi/<ad>.jpg okunur, work/izgara-<ad>.jpg yazılır)
import sharp from 'sharp';

const name = process.argv[2];
if (!name) {
  console.error('Kullanım: node izgara.mjs <stand-adı>');
  process.exit(1);
}

const img = sharp(`work/girdi/${name}.jpg`);
const { width, height } = await img.metadata();
const W = 1000, H = Math.round(height * W / width);

// Her %10 numaralı, kalın camgöbeği çizgi; aradaki %5 çizgileri ince ve sarı.
let lines = '';
for (let p = 0; p <= 100; p += 5) {
  const x = p * W / 100, y = p * H / 100, major = p % 10 === 0;
  const style = major ? 'stroke="#00ffff" stroke-width="1.2" opacity=".85"' : 'stroke="#ffff00" stroke-width=".8" opacity=".6"';
  lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" ${style}/><line x1="0" y1="${y}" x2="${W}" y2="${y}" ${style}/>`;
  if (major) {
    lines += `<text x="${x + 2}" y="12" font-size="11" fill="#ff0" stroke="#000" stroke-width=".4">${p}</text>`
      + `<text x="2" y="${y - 2}" font-size="11" fill="#ff0" stroke="#000" stroke-width=".4">${p}</text>`;
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Arial">${lines}</svg>`;
await img.resize(W, H).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 88 }).toFile(`work/izgara-${name}.jpg`);
console.log(`work/izgara-${name}.jpg yazıldı`);
