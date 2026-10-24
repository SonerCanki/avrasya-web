// Sitenin doğum günü çizimlerini üretir: assets/svg/*.svg
// Krema damlaları ve serpintiler hesapla yerleştirildiği için çizimler elle değil bu dosyayla düzenlenir.
//
// Kullanım (proje kökünden): node tools/svg/ciz.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../../assets/svg/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const write = (name, svg) => writeFileSync(new URL(name, OUT), svg.replace(/\n\s*\n/g, '\n').trim() + '\n');

// Renkler css/style.css ile aynı.
const C = {
  navy: '#131C3A', navy2: '#1E2A55', gold: '#D9B15C', goldLight: '#F3D98F', goldDeep: '#9C7424',
  cream: '#FFF6E9', pink: '#F4A7BB', berry: '#D6457A', sky: '#7CC6F0', turquoise: '#45E0D8',
};
const SPRINKLE = [C.pink, C.turquoise, C.gold, C.sky, C.berry];

const f = n => +n.toFixed(1);

// Tekrarlanabilir rastgelelik (her çalıştırmada aynı çizim).
function rng(seed) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

// Damla profili: kenarları dik, ucu yuvarlak (süper elips).
function drop(x, { x: dx, w, L }) {
  const u = Math.abs(x - dx) / (w / 2);
  return u >= 1 ? 0 : L * Math.pow(1 - Math.pow(u, 2.6), 1 / 2.6);
}

// Katın üst yüzünü kaplayan ve ön kenardan aşağı akan krema.
function icing(cx, cy, rx, ry, lip, drops) {
  const R = rx + 1.5;
  let d = `M${f(cx - R)},${f(cy)} A${f(R)},${f(ry)} 0 0 1 ${f(cx + R)},${f(cy)}`;
  for (let x = cx + R; x >= cx - R - 0.01; x -= 1.5) {
    const edge = cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / R) ** 2)) + lip;
    const y = edge + drops.reduce((s, dr) => s + drop(x, { ...dr, x: cx + dr.u * rx }), 0);
    d += ` L${f(x)},${f(y)}`;
  }
  return d + ' Z';
}

function star(cx, cy, R, r, rot = -90) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = ((rot + i * 36) * Math.PI) / 180, rad = i % 2 ? r : R;
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]);
  }
  return pts;
}
const poly = pts => 'M' + pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L') + ' Z';

// ---------- Pasta ----------
function cake() {
  const tiers = [
    { id: 'kat-1', cx: 200, top: 300, bottom: 405, rx: 150, ry: 14, body: 'govde-lacivert', icing: 'krema-altin',
      drops: [{ u: -0.86, w: 18, L: 20 }, { u: -0.6, w: 24, L: 38 }, { u: -0.3, w: 16, L: 16 }, { u: -0.05, w: 26, L: 46 }, { u: 0.25, w: 18, L: 24 }, { u: 0.52, w: 24, L: 40 }, { u: 0.8, w: 16, L: 18 }] },
    { id: 'kat-2', cx: 200, top: 205, bottom: 300, rx: 112, ry: 11, body: 'govde-krem', icing: 'krema-pembe',
      drops: [{ u: -0.78, w: 18, L: 26 }, { u: -0.45, w: 22, L: 36 }, { u: -0.12, w: 15, L: 16 }, { u: 0.18, w: 22, L: 40 }, { u: 0.5, w: 16, L: 20 }, { u: 0.78, w: 20, L: 30 }] },
    { id: 'kat-3', cx: 200, top: 125, bottom: 205, rx: 76, ry: 9, body: 'govde-pembe', icing: 'krema-beyaz',
      drops: [{ u: -0.7, w: 16, L: 22 }, { u: -0.3, w: 20, L: 32 }, { u: 0.1, w: 14, L: 14 }, { u: 0.45, w: 18, L: 28 }, { u: 0.78, w: 13, L: 16 }] },
  ];
  const rand = rng(7);
  let layers = '';
  for (const t of tiers) {
    const { cx, top, bottom, rx, ry } = t;
    let deco = '';
    if (t.id === 'kat-1') {
      // Logodaki gibi altın yıldızlar.
      for (const [x, y, s] of [[95, 372, 9], [150, 388, 6], [255, 384, 7], [312, 368, 8], [205, 368, 5]]) {
        deco += `<path d="${poly(star(x, y, s, s * 0.42))}" fill="url(#altin)"/>`;
      }
    }
    if (t.id === 'kat-2') {
      // Şeker serpintisi.
      for (let i = 0; i < 26; i++) {
        const x = cx - rx + 12 + rand() * (rx * 2 - 24), y = top + ry + 46 + rand() * (bottom - top - ry - 50);
        deco += `<rect x="${f(x - 4)}" y="${f(y - 1.6)}" width="8" height="3.2" rx="1.6" fill="${SPRINKLE[i % 5]}" transform="rotate(${Math.round(rand() * 180)} ${f(x)} ${f(y)})"/>`;
      }
    }
    // Katın tabanındaki altın inciler.
    let pearls = '';
    const n = Math.round(rx / 7.5);
    for (let i = 0; i <= n; i++) {
      const a = Math.PI * (i / n);
      pearls += `<circle cx="${f(cx - rx * Math.cos(a))}" cy="${f(bottom + ry * Math.sin(a) - 2)}" r="4.2"/>`;
    }
    layers += `
  <g id="${t.id}">
    <path d="M${cx - rx},${top} V${bottom} A${rx},${ry} 0 0 0 ${cx + rx},${bottom} V${top} Z" fill="url(#${t.body})"/>
    ${deco}
    <g fill="url(#inci)">${pearls}</g>
    <path class="krema" d="${icing(cx, top, rx, ry, 7, t.drops)}" fill="url(#${t.icing})"/>
    <ellipse cx="${cx - rx * 0.2}" cy="${top - ry * 0.2}" rx="${f(rx * 0.55)}" ry="${f(ry * 0.45)}" fill="#fff" opacity=".35"/>
  </g>`;
  }

  const candle = (id, x) => {
    const top = 78, base = 128;
    return `
  <g id="${id}" class="mum">
    <clipPath id="${id}-kesit"><rect x="${x - 6}" y="${top}" width="12" height="${base - top}" rx="3"/></clipPath>
    <rect x="${x - 6}" y="${top}" width="12" height="${base - top}" rx="3" fill="#FFFBF3"/>
    <g clip-path="url(#${id}-kesit)" fill="${C.berry}">
      ${[0, 1, 2, 3].map(i => `<path d="M${x - 8},${top + 10 + i * 13} l16,-8 v5 l-16,8 Z"/>`).join('')}
    </g>
    <rect x="${x - 6}" y="${top}" width="12" height="${base - top}" rx="3" fill="url(#mum-golge)"/>
    <path d="M${x},${top} v-7" stroke="#3B2A1A" stroke-width="1.6" stroke-linecap="round"/>
    <g class="alev">
      <circle class="alev-isik" cx="${x}" cy="${top - 18}" r="24" fill="url(#isik)"/>
      <path d="M${x},${top - 40} C${x + 3},${top - 31} ${x + 8},${top - 19} ${x + 8},${top - 13} A8,8 0 0 1 ${x - 8},${top - 13} C${x - 8},${top - 19} ${x - 3},${top - 31} ${x},${top - 40} Z" fill="url(#alev-dis)"/>
      <path d="M${x},${top - 27} C${x + 1.5},${top - 22} ${x + 4},${top - 16} ${x + 4},${top - 12} A4,4 0 0 1 ${x - 4},${top - 12} C${x - 4},${top - 16} ${x - 1.5},${top - 22} ${x},${top - 27} Z" fill="#FFF6C9"/>
    </g>
  </g>`;
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460" role="img" aria-labelledby="pasta-baslik">
  <title id="pasta-baslik">Mumları yanan üç katlı doğum günü pastası</title>
  <defs>
    <linearGradient id="govde-lacivert" x1="0" x2="1"><stop offset="0" stop-color="#0C1330"/><stop offset=".38" stop-color="#26366B"/><stop offset="1" stop-color="#0C1330"/></linearGradient>
    <linearGradient id="govde-krem" x1="0" x2="1"><stop offset="0" stop-color="#EAD8BC"/><stop offset=".38" stop-color="#FFF9EF"/><stop offset="1" stop-color="#E3CFAF"/></linearGradient>
    <linearGradient id="govde-pembe" x1="0" x2="1"><stop offset="0" stop-color="#E383A0"/><stop offset=".38" stop-color="#FAC6D4"/><stop offset="1" stop-color="#DC7895"/></linearGradient>
    <linearGradient id="krema-altin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.goldLight}"/><stop offset=".55" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldDeep}"/></linearGradient>
    <linearGradient id="krema-pembe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDDCE5"/><stop offset="1" stop-color="#EE93AE"/></linearGradient>
    <linearGradient id="krema-beyaz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F1E3CB"/></linearGradient>
    <linearGradient id="altin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBE9A6"/><stop offset=".5" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldDeep}"/></linearGradient>
    <radialGradient id="inci" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".6" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldDeep}"/></radialGradient>
    <linearGradient id="mum-golge" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
    <linearGradient id="alev-dis" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB627"/><stop offset=".7" stop-color="#FF8A1F"/><stop offset="1" stop-color="#E8590C"/></linearGradient>
    <radialGradient id="isik"><stop offset="0" stop-color="#FFD66B" stop-opacity=".6"/><stop offset="1" stop-color="#FFD66B" stop-opacity="0"/></radialGradient>
    <linearGradient id="tabak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBEBB5"/><stop offset="1" stop-color="${C.gold}"/></linearGradient>
  </defs>

  <g id="tabak">
    <path d="M182,428 C186,436 190,440 190,446 H210 C210,440 214,436 218,428 Z" fill="${C.goldDeep}"/>
    <ellipse cx="200" cy="449" rx="58" ry="8" fill="${C.goldDeep}"/>
    <ellipse cx="200" cy="446" rx="58" ry="7" fill="${C.gold}"/>
    <path d="M28,410 A172,16 0 0 0 372,410 V417 A172,16 0 0 1 28,417 Z" fill="${C.goldDeep}"/>
    <ellipse cx="200" cy="410" rx="172" ry="16" fill="url(#tabak)"/>
    <ellipse cx="200" cy="417" rx="150" ry="9" fill="${C.navy}" opacity=".2"/>
  </g>
${layers}
  <!-- Faz 4: gerçek süs fotoğrafı (assets/img/susler) buraya iner. -->
  <g id="sus-yeri" transform="translate(200 128)"/>
${candle('mum-1', 166)}
${candle('mum-2', 234)}
</svg>`;
}

// ---------- Tek mum ----------
function candleOnly() {
  const svg = cake();
  const defs = svg.slice(svg.indexOf('<defs>'), svg.indexOf('</defs>') + 7);
  const body = svg.slice(svg.indexOf('<g id="mum-1"'), svg.indexOf('<g id="mum-2"'));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="142 28 48 104" role="img" aria-label="Yanan doğum günü mumu">
  ${defs}
  ${body.trim()}
</svg>`;
}

// ---------- Balon ----------
// Rengi CSS ile değişir: --balon-renk (satır içi SVG'de, index.html'deki #balon sembolü). <img> ile altın görünür.
const BALLOON_DEFS = `<radialGradient id="balon-hacim" cx=".38" cy=".32" r=".75"><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0B1230" stop-opacity=".32"/></radialGradient>`;

function balloon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 232" role="img" aria-label="Balon">
  <defs>${BALLOON_DEFS}</defs>
  ${balloonBody()}
</svg>`;
}

function balloonBody() {
  return `<path class="balon-ip" d="M60,148 C50,166 72,186 60,206 C54,216 60,224 58,231" fill="none" stroke="#8E97AE" stroke-width="1.5" stroke-linecap="round"/>
  <g class="balon-govde">
    <path d="M60,6 C93,6 114,33 114,66 C114,104 86,134 64,140 L56,140 C34,134 6,104 6,66 C6,33 27,6 60,6 Z" style="fill: var(--balon-renk, ${C.gold})"/>
    <path d="M60,6 C93,6 114,33 114,66 C114,104 86,134 64,140 L56,140 C34,134 6,104 6,66 C6,33 27,6 60,6 Z" fill="url(#balon-hacim)"/>
    <path d="M54,139 L66,139 L63,148 L57,148 Z" style="fill: var(--balon-renk, ${C.gold})"/>
    <path d="M54,139 L66,139 L63,148 L57,148 Z" fill="#0B1230" opacity=".25"/>
    <ellipse cx="36" cy="42" rx="9" ry="19" transform="rotate(28 36 42)" fill="#fff" opacity=".55"/>
    <ellipse cx="30" cy="70" rx="3.5" ry="6" transform="rotate(20 30 70)" fill="#fff" opacity=".4"/>
  </g>`;
}

// ---------- index.html içindeki satır içi çizimler ----------
// <!-- ciz:ad --> ile <!-- /ciz:ad --> arası her çalıştırmada yeniden yazılır; elle düzenlemeyin.
function sprite() {
  return `  <svg class="sprite" aria-hidden="true" focusable="false">
    <defs>${BALLOON_DEFS}</defs>
    <symbol id="balon" viewBox="0 0 120 232">
      ${balloonBody().replace(/\n\s*/g, '\n      ')}
    </symbol>
  </svg>`;
}

function inject(key, content) {
  const file = new URL('../../index.html', import.meta.url);
  const html = readFileSync(file, 'utf8');
  const re = new RegExp(`(<!-- ciz:${key} -->)[\\s\\S]*?(\\s*<!-- /ciz:${key} -->)`);
  if (!re.test(html)) throw new Error(`index.html içinde <!-- ciz:${key} --> işareti yok`);
  writeFileSync(file, html.replace(re, (_, open, close) => `${open}\n${content}${close}`));
}

// ---------- Yıldız (logodaki gibi faset altın) ----------
function goldStar() {
  const cx = 50, cy = 53, pts = star(cx, cy, 46, 19);
  let facets = '';
  for (let i = 0; i < 10; i++) {
    const [a, b] = [pts[i], pts[(i + 1) % 10]];
    facets += `<path d="M${cx},${cy} L${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} Z" fill="url(#${i % 2 ? 'yildiz-acik' : 'yildiz-koyu'})"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Altın yıldız">
  <defs>
    <linearGradient id="yildiz-acik" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3C4"/><stop offset="1" stop-color="${C.gold}"/></linearGradient>
    <linearGradient id="yildiz-koyu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldDeep}"/></linearGradient>
  </defs>
  ${facets}
</svg>`;
}

// ---------- Krema damlası ayırıcı (yatay tekrar eden karo) ----------
// CSS'te maske olarak kullanılır; rengi bir önceki bölümün rengidir.
function drip() {
  const W = 480, lip = 18;
  const drops = [{ x: 38, w: 26, L: 34 }, { x: 102, w: 18, L: 18 }, { x: 160, w: 30, L: 60 }, { x: 228, w: 20, L: 26 },
    { x: 290, w: 34, L: 46 }, { x: 350, w: 16, L: 14 }, { x: 410, w: 28, L: 64 }, { x: 458, w: 14, L: 22 }];
  let d = `M0,0 H${W} V${lip}`;
  for (let x = W; x >= 0; x -= 1.5) {
    const y = lip + 3 * Math.sin((x / W) * Math.PI * 4) + drops.reduce((s, dr) => s + drop(x, dr), 0);
    d += ` L${f(x)},${f(y)}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 90" preserveAspectRatio="none">
  <path d="${d} Z"/>
</svg>`;
}

// ---------- Şeker serpintisi (arka plan karosu) ----------
function sprinkles() {
  const rand = rng(21), S = 220;
  let rects = '';
  for (let i = 0; i < 20; i++) {
    const x = 12 + rand() * (S - 24), y = 12 + rand() * (S - 24);
    rects += `<rect x="${f(x - 6)}" y="${f(y - 2)}" width="12" height="4" rx="2" fill="${SPRINKLE[i % 5]}" transform="rotate(${Math.round(rand() * 180)} ${f(x)} ${f(y)})"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  ${rects}
</svg>`;
}

write('pasta.svg', cake());
write('mum.svg', candleOnly());
write('balon.svg', balloon());
write('yildiz.svg', goldStar());
write('krema.svg', drip());
write('serpinti.svg', sprinkles());
inject('sprite', sprite());
console.log('assets/svg: pasta, mum, balon, yildiz, krema, serpinti; index.html: sprite');
