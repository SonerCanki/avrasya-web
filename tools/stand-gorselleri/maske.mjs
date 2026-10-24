// Stand maskesi: elle çizilmiş kaba dış hat + GrabCut + BiRefNet süs maskesi.
//
// Genel amaçlı modeller süsleri buluyor ama beyaz stand iskeletini arka plan sayıyor.
// Bu yüzden standın dış hattı standlar.mjs içinde yüzde koordinatlarla verilir. GrabCut bu hattın
// çevresindeki dar şeritte kenarı piksel düzeyinde bulur. Hattın dışına taşan süsler BiRefNet'ten gelir.
import sharp from 'sharp';
import cvModule from '@techstark/opencv-js';

// opencv.js modülü kendisini döndüren bir "then" taşır; doğrudan await sonsuz döngüye girer.
const cv = await new Promise(resolve => {
  if (cvModule.Mat) return resolve(cvModule);
  cvModule.then(m => { delete m.then; resolve(m); });
});

const WORK = 1360; // GrabCut çalışma genişliği (hız / doğruluk dengesi)

function polygonMask(points, w, h, offset) {
  const pts = points.map(([x, y]) => `${(x / 100) * w},${(y / 100) * h}`).join(' ');
  // Pozitif offset hattı büyütür, negatif küçültür (kalın çizgiyle yaklaşık ofset).
  const stroke = Math.abs(offset) * 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="black"/>
    <polygon points="${pts}" fill="white" stroke="${offset > 0 ? 'white' : 'black'}" stroke-width="${stroke}" stroke-linejoin="round"/>
  </svg>`;
  return sharp(Buffer.from(svg)).extractChannel(0).raw().toBuffer();
}

// Telefonun "Galaxy A37 5G" damgası gibi yazıları siler. rects: [x0, y0, x1, y1] yüzde dikdörtgenleri.
// Dikdörtgen içinde çevresinden belirgin ayrışan pikseller bulunur ve OpenCV inpaint ile doldurulur.
export async function eraseMarks(jpeg, rects) {
  const { data, info } = await sharp(jpeg).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const img = cv.matFromArray(h, w, cv.CV_8UC3, data);
  const gray = new cv.Mat(), smooth = new cv.Mat(), mask = cv.Mat.zeros(h, w, cv.CV_8UC1);
  cv.cvtColor(img, gray, cv.COLOR_RGB2GRAY);
  cv.medianBlur(gray, smooth, 21);
  for (const [x0, y0, x1, y1] of rects) {
    for (let y = Math.round((y0 / 100) * h); y < Math.round((y1 / 100) * h); y++) {
      for (let x = Math.round((x0 / 100) * w); x < Math.round((x1 / 100) * w); x++) {
        const i = y * w + x;
        if (Math.abs(gray.data[i] - smooth.data[i]) > 10) mask.data[i] = 255;
      }
    }
  }
  const kernel = cv.Mat.ones(5, 5, cv.CV_8U);
  cv.dilate(mask, mask, kernel);
  const out = new cv.Mat();
  cv.inpaint(img, mask, out, 6, cv.INPAINT_TELEA);
  const result = Buffer.from(out.data);
  [img, gray, smooth, mask, kernel, out].forEach(m => m.delete());
  return sharp(result, { raw: { width: w, height: h, channels: 3 } });
}

// rgbPath: kaynak JPEG; topperAlpha: BiRefNet alfa (kaynakla aynı boyutta, tek kanal raw).
// reach: süslerin hattın dışına en fazla ne kadar taşabileceği (genişliğin yüzdesi). Daha uzaktaki
// nesneleri (tabela, masa üstü eşyaları) model bulsa da maskeye girmez.
export async function standMask(rgbPath, topperAlpha, outline, { band = 1.6, reach = 6, exclude = [] } = {}) {
  const src = sharp(rgbPath);
  const { width: W0, height: H0 } = await src.metadata();
  const near = await polygonMask(outline, W0, H0, (reach / 100) * W0);
  topperAlpha = Buffer.from(topperAlpha);
  for (let i = 0; i < topperAlpha.length; i++) if (!near[i]) topperAlpha[i] = 0;
  const w = WORK, h = Math.round((H0 * WORK) / W0);
  const bandPx = (band / 100) * w;

  const rgb = await src.clone().resize(w, h).removeAlpha().raw().toBuffer();
  const outer = await polygonMask(outline, w, h, bandPx);
  const inner = await polygonMask(outline, w, h, -bandPx);
  const core = await polygonMask(outline, w, h, 0);
  // extractChannel(0): sharp tek kanallı raw girdiyi yeniden boyutlandırınca 3 kanal döndürebiliyor.
  const tops = await sharp(topperAlpha, { raw: { width: W0, height: H0, channels: 1 } })
    .resize(w, h).extractChannel(0).raw().toBuffer();

  const img = cv.matFromArray(h, w, cv.CV_8UC3, rgb);
  const mask = new cv.Mat(h, w, cv.CV_8UC1);
  for (let i = 0; i < w * h; i++) {
    let v;
    if (inner[i] || tops[i] > 230) v = cv.GC_FGD;
    else if (core[i]) v = cv.GC_PR_FGD;
    else if (outer[i] || tops[i] > 40) v = cv.GC_PR_BGD;
    else v = cv.GC_BGD;
    mask.data[i] = v;
  }
  const bgd = new cv.Mat(), fgd = new cv.Mat();
  cv.grabCut(img, mask, new cv.Rect(0, 0, 1, 1), bgd, fgd, 5, cv.GC_INIT_WITH_MASK);

  const small = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    const v = mask.data[i];
    small[i] = v === cv.GC_FGD || v === cv.GC_PR_FGD ? 255 : 0;
  }
  [img, mask, bgd, fgd].forEach(m => m.delete());

  // Kaynak boyuta büyüt, kenarı hafif yumuşat; süslerin ince kenarları için BiRefNet ile birleştir.
  const big = await sharp(small, { raw: { width: w, height: h, channels: 1 } })
    .resize(W0, H0, { kernel: 'cubic' })
    .blur(0.8)
    .extractChannel(0)
    .raw()
    .toBuffer();
  const out = Buffer.alloc(W0 * H0);
  for (let i = 0; i < out.length; i++) out[i] = Math.max(big[i], topperAlpha[i]);
  // exclude: standa değen arka plan nesneleri (ör. duvardaki tabela), [x0, y0, x1, y1] yüzde.
  for (const [x0, y0, x1, y1] of exclude) {
    for (let y = Math.round((y0 / 100) * H0); y < Math.round((y1 / 100) * H0); y++) {
      out.fill(0, y * W0 + Math.round((x0 / 100) * W0), y * W0 + Math.round((x1 / 100) * W0));
    }
  }
  return out;
}
