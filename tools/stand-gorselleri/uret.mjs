// Stand fotoğraflarından site görsellerini üretir.
//   node tools/stand-gorselleri/uret.mjs [çıktı klasörü]
// Kaynak: yeni-fotograflar/ (stüdyo çekimi, düz gri zemin). Çıktı: public/assets/img/standlar/
//   <ad>-640.webp, <ad>-1040.webp : standı ortalayan kare fotoğraf (zemin fotoğrafın kendi zeminidir)
//   <ad>-kesik.webp               : zemini silinmiş, şeffaf görsel (yalnızca `kesik: true` olanlar)
// Yeni kurulum istemez: tools/test içindeki Playwright ile bilgisayardaki Chrome'un tuvalini kullanır.
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const gerek = createRequire(new URL('../test/package.json', import.meta.url))
const { chromium } = gerek('playwright')

const KOK = fileURLToPath(new URL('../../', import.meta.url))
const KAYNAK = resolve(KOK, 'yeni-fotograflar')
const CIKTI = resolve(process.argv[2] ?? resolve(KOK, 'public/assets/img/standlar'))

/**
 * Fotoğrafın saati (dosya adındaki) → sitedeki adı. Yeni stand: buraya ve src/icerik.ts içindeki STANDLAR'a birer satır.
 *   kesik: şeffaf zeminli görsel de üretilir (sayfada yalnızca "Stand nasıl çalışır" sahnesi kullanır).
 *   kutu : standın fotoğraftaki yeri [x, y, en, boy]. Zemin düz gri değilse (duvar–zemin çizgisi varsa) elle verilir.
 *   altaDayali: stand fotoğrafın alt kenarında kesiliyorsa kare de orada biter; aşağı doğru zemin uydurulmaz.
 *   pay  : karede standın çevresindeki boşluk (uzun kenarın oranı; verilmezse 0,05).
 */
const STANDLAR = [
  { saat: '20.13.40', ad: 'stand-cocuk-karakter', kesik: true },
  { saat: '20.25.56', ad: 'stand-rakam-karakter' },
  { saat: '20.42.10', ad: 'stand-rakam-balon' },
  { saat: '20.44.31', ad: 'stand-esprili-yazi' },
  { saat: '20.12.59', ad: 'stand-esprili-balon' },
  { saat: '20.44.30', ad: 'stand-kadin' },
  { saat: '20.44.31 (1)', ad: 'stand-erkek' },
  { saat: '20.12.30', ad: 'stand-futbol' },
  { saat: '20.43.27', ad: 'stand-ayna-renkli' },
  { saat: '20.08.17', ad: 'stand-renkli-yazi', kutu: [68, 94, 1404, 906] },
  { saat: '20.03.01', ad: 'stand-altin-gumus', kutu: [160, 100, 1190, 986], altaDayali: true, pay: 0.02 },
  { saat: '20.40.05', ad: 'stand-ayna-katli' },
]

/** Tarayıcıda çalışır: fotoğrafı çözer, zemini bulur, kare ve kesik görselleri WebP olarak döndürür. */
async function isle({ veri, kesik, elleKutu, altaDayali, pay = 0.05 }) {
  const ADIM = 6 // komşu iki zemin pikseli arasında izin verilen en büyük parlaklık farkı

  const coz = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  const kodla = async (tuval, kalite) => {
    const bayt = new Uint8Array(await (await tuval.convertToBlob({ type: 'image/webp', quality: kalite })).arrayBuffer())
    let s = ''
    for (let i = 0; i < bayt.length; i += 0x8000) s += String.fromCharCode(...bayt.subarray(i, i + 0x8000))
    return btoa(s)
  }

  const bmp = await createImageBitmap(new Blob([coz(veri)], { type: 'image/jpeg' }))
  const W = bmp.width
  const H = bmp.height
  const N = W * H
  const ham = new OffscreenCanvas(W, H)
  const hg = ham.getContext('2d', { willReadFrequently: true })
  hg.drawImage(bmp, 0, 0)
  const resim = hg.getImageData(0, 0, W, H)
  const d = resim.data

  // --- Zemin: kenarlardan içeri doğru, yumuşak geçişli gri alanı doldur ---
  const lum = new Float32Array(N)
  const doy = new Uint8Array(N)
  for (let p = 0, i = 0; p < N; p++, i += 4) {
    lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    doy[p] = Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2])
  }
  const kenar = []
  for (let x = 0; x < W; x++) kenar.push(x, (H - 1) * W + x)
  for (let y = 0; y < H; y++) kenar.push(y * W, y * W + W - 1)
  const sirali = Float32Array.from(kenar, (p) => lum[p]).sort()
  const alt = sirali[Math.floor(sirali.length * 0.1)] - 35
  const ust = sirali[Math.floor(sirali.length * 0.9)] + 12
  const uygun = (p) => lum[p] >= alt && lum[p] <= ust && doy[p] <= 26

  const arka = new Uint8Array(N)
  const kuyruk = new Int32Array(N)
  let bas = 0
  let son = 0
  for (const p of kenar)
    if (!arka[p] && uygun(p)) {
      arka[p] = 1
      kuyruk[son++] = p
    }
  const dene = (q, l) => {
    if (!arka[q] && uygun(q) && Math.abs(lum[q] - l) <= ADIM) {
      arka[q] = 1
      kuyruk[son++] = q
    }
  }
  while (bas < son) {
    const p = kuyruk[bas++]
    const x = p % W
    const l = lum[p]
    if (x > 0) dene(p - 1, l)
    if (x < W - 1) dene(p + 1, l)
    if (p >= W) dene(p - W, l)
    if (p < N - W) dene(p + W, l)
  }

  // --- Stand: zemin olmayan en büyük tek parça (ufak lekeler atılır) ---
  const etiket = new Int32Array(N)
  let enBuyuk = 0
  let enBuyukEtiket = 0
  let sayac = 0
  for (let s = 0; s < N; s++) {
    if (arka[s] || etiket[s]) continue
    sayac++
    bas = 0
    son = 0
    etiket[s] = sayac
    kuyruk[son++] = s
    while (bas < son) {
      const p = kuyruk[bas++]
      const x = p % W
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) {
        if (q < 0 || q >= N || arka[q] || etiket[q]) continue
        etiket[q] = sayac
        kuyruk[son++] = q
      }
    }
    if (son > enBuyuk) {
      enBuyuk = son
      enBuyukEtiket = sayac
    }
  }
  const on = new Uint8Array(N)
  let x0 = W
  let y0 = H
  let x1 = 0
  let y1 = 0
  for (let p = 0; p < N; p++) {
    if (etiket[p] !== enBuyukEtiket) continue
    on[p] = 1
    const x = p % W
    const y = (p - x) / W
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
  }
  const kutu = elleKutu
    ? { x: elleKutu[0], y: elleKutu[1], w: elleKutu[2], h: elleKutu[3] }
    : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }

  // --- Kare fotoğraf: stand ortada; fotoğrafın dışına taşan yer, kenar renginin yumuşatılmış devamıdır ---
  const P = Math.ceil(Math.max(W, H) * 0.5)
  const genis = new OffscreenCanvas(W + 2 * P, H + 2 * P)
  const gg = genis.getContext('2d')
  const serit = (yatay, bastan) => {
    // Kenardaki 4 piksellik şeridin ortalaması, kenar boyunca 31 piksellik kayan ortalamayla yumuşatılır.
    const uz = yatay ? W : H
    const renk = new Float32Array(uz * 3)
    for (let k = 0; k < uz; k++)
      for (let t = 0; t < 4; t++) {
        const x = yatay ? k : bastan ? t : W - 1 - t
        const y = yatay ? (bastan ? t : H - 1 - t) : k
        const i = (y * W + x) * 4
        for (let c = 0; c < 3; c++) renk[k * 3 + c] += d[i + c] / 4
      }
    const cikti = new ImageData(yatay ? uz : 1, yatay ? 1 : uz)
    for (let k = 0; k < uz; k++) {
      const a = Math.max(0, k - 15)
      const b = Math.min(uz - 1, k + 15)
      for (let c = 0; c < 3; c++) {
        let t = 0
        for (let j = a; j <= b; j++) t += renk[j * 3 + c]
        cikti.data[k * 4 + c] = t / (b - a + 1)
      }
      cikti.data[k * 4 + 3] = 255
    }
    const tuval = new OffscreenCanvas(cikti.width, cikti.height)
    tuval.getContext('2d').putImageData(cikti, 0, 0)
    return tuval
  }
  const ustS = serit(true, true)
  const altS = serit(true, false)
  const solS = serit(false, true)
  const sagS = serit(false, false)
  gg.imageSmoothingEnabled = false
  gg.drawImage(ustS, 0, 0, 1, 1, 0, 0, P, P)
  gg.drawImage(ustS, W - 1, 0, 1, 1, P + W, 0, P, P)
  gg.drawImage(altS, 0, 0, 1, 1, 0, P + H, P, P)
  gg.drawImage(altS, W - 1, 0, 1, 1, P + W, P + H, P, P)
  gg.drawImage(ustS, 0, 0, W, 1, P, 0, W, P)
  gg.drawImage(altS, 0, 0, W, 1, P, P + H, W, P)
  gg.drawImage(solS, 0, 0, 1, H, 0, P, P, H)
  gg.drawImage(sagS, 0, 0, 1, H, P + W, P, P, H)
  gg.drawImage(bmp, P, P)

  const yan = Math.round(Math.max(kutu.w, kutu.h) * (1 + 2 * pay))
  const kx = Math.round(kutu.x + kutu.w / 2 - yan / 2) + P
  const ky = (altaDayali ? H - yan : Math.round(kutu.y + kutu.h / 2 - yan / 2)) + P
  const kare = async (boy) => {
    // Büyük küçültmelerde bulanıklaşmasın diye yarıya indirerek iner.
    let kaynak = new OffscreenCanvas(yan, yan)
    kaynak.getContext('2d').drawImage(genis, kx, ky, yan, yan, 0, 0, yan, yan)
    while (kaynak.width / 2 >= boy) {
      const yari = new OffscreenCanvas(Math.round(kaynak.width / 2), Math.round(kaynak.height / 2))
      const yg = yari.getContext('2d')
      yg.imageSmoothingQuality = 'high'
      yg.drawImage(kaynak, 0, 0, yari.width, yari.height)
      kaynak = yari
    }
    const tuval = new OffscreenCanvas(boy, boy)
    const tg = tuval.getContext('2d')
    tg.imageSmoothingQuality = 'high'
    tg.drawImage(kaynak, 0, 0, boy, boy)
    return kodla(tuval, 0.8)
  }

  const sonuc = {
    olcu: [W, H],
    kutu,
    kenaraDeger: !elleKutu && (x0 === 0 || y0 === 0 || x1 === W - 1 || y1 === H - 1),
    kare640: await kare(640),
    kare1040: await kare(1040),
  }

  // --- Kesik görsel: kenardan 1 piksel içeri çekilmiş, 1 piksel yumuşatılmış maske ---
  if (kesik) {
    const ic = new Uint8Array(N)
    for (let p = 0; p < N; p++) {
      if (!on[p]) continue
      const x = p % W
      ic[p] = x > 0 && x < W - 1 && p >= W && p < N - W && on[p - 1] && on[p + 1] && on[p - W] && on[p + W] ? 1 : 0
    }
    for (let p = 0, i = 3; p < N; p++, i += 4) {
      const x = p % W
      let t = 0
      let n = 0
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const q = p + dy * W + dx
          if (q < 0 || q >= N || x + dx < 0 || x + dx >= W) continue
          t += ic[q]
          n++
        }
      d[i] = Math.round((255 * t) / n)
    }
    hg.putImageData(resim, 0, 0)
    const en = 1040
    const boy = Math.round((kutu.h / kutu.w) * en)
    const tuval = new OffscreenCanvas(en, boy)
    const tg = tuval.getContext('2d')
    tg.imageSmoothingQuality = 'high'
    tg.drawImage(ham, kutu.x, kutu.y, kutu.w, kutu.h, 0, 0, en, boy)
    sonuc.kesik = await kodla(tuval, 0.86)
    sonuc.kesikOlcu = [en, boy]
  }
  return sonuc
}

const tarayici = await chromium.launch({ channel: 'chrome' })
try {
  const sayfa = await tarayici.newPage()
  await mkdir(CIKTI, { recursive: true })
  for (const stand of STANDLAR) {
    const veri = (await readFile(resolve(KAYNAK, `WhatsApp Image 2026-11-18 at ${stand.saat}.jpeg`))).toString('base64')
    const s = await sayfa.evaluate(isle, {
      veri,
      kesik: Boolean(stand.kesik),
      elleKutu: stand.kutu,
      altaDayali: stand.altaDayali,
      pay: stand.pay,
    })
    const yaz = (ek, b64) => writeFile(resolve(CIKTI, `${stand.ad}-${ek}.webp`), Buffer.from(b64, 'base64'))
    await yaz('640', s.kare640)
    await yaz('1040', s.kare1040)
    if (s.kesik) await yaz('kesik', s.kesik)
    const { x, y, w, h } = s.kutu
    console.log(
      `${stand.ad.padEnd(22)} ${s.olcu.join('×')}  stand ${w}×${h} @ ${x},${y}` +
        (s.kesikOlcu ? `  kesik ${s.kesikOlcu.join('×')}` : '') +
        (s.kenaraDeger ? '  UYARI: stand fotoğrafın kenarına değiyor; bu satıra elle `kutu` verin' : ''),
    )
  }
} finally {
  await tarayici.close()
}
