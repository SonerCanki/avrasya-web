# Şenlik Sitesi Kurulum Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Avrasya Toptan Pasta Süsleri'nin tek sayfalık sitesini "Şenlik" tasarımıyla React üzerinde kurmak; çıktı düz dosya olarak yüklenebilen, hazır HTML taşıyan bir `dist/` klasörüdür.

**Architecture:** Tek sayfalık React uygulaması derleme sırasında `react-dom/server` ile hazır HTML'e çevrilir; tarayıcıda `hydrateRoot` onu devralır. Bütün içerik `src/icerik.ts` dosyasındadır; her bölüm kendi bileşeni ve stil dosyasıdır. Hareket Motion ile yapılır ve "son hâl kuralı"na uyar: JavaScript yokken, site betiği yüklenemediğinde ve hareket azaltılmışken sayfa her bölümün son görüntüsünü gösterir.

**Tech Stack:** Vite 8, React 19, TypeScript 7, Tailwind 4 (sıfırlama ve tasarım değerleri için), Motion 14 (`motion/react`), Lenis 1.3, Bricolage Grotesque (`@fontsource-variable/bricolage-grotesque`), Node 26 `node --test`, Playwright 1.64 + axe, Lighthouse 13.

**Spec:** `docs/superpowers/specs/2026-11-18-senlik-site-design.md` — her görevde birlikte okunur. Görsel başvuru: `src/taslaklar/Taslak3.tsx`, `src/taslaklar/taslak3.css` (onaylı açılış taslağı; Görev 9'da silinir).

## Global Constraints

- **Barındırma:** düz dosya. `npm run build` çıktısı (`dist/`) olduğu gibi yüklenir; sunucuda kod çalışmaz.
- **Adres:** `https://www.avrasyasus.com.tr/` — `canonical`, `og:url`, `og:image`, JSON-LD, `robots.txt`, `sitemap.xml` hep bunu gösterir.
- **Paketler:** eklenen tek paket `@fontsource-variable/bricolage-grotesque`. `gsap` ve `@gsap/react` kaldırılır. Test araçları `tools/test/package-lock.json`'daki sürümlerle (`npm ci`) kurulur. Başka paket kurulmaz; `npx` ile paket indirilmez.
- **Metinler** `eski-site/index.html`'den harfi harfine alınır (’ “ ” işaretleri dahil), yeniden yazılmaz. Bölüm kimlikleri: `#stand`, `#urunler`, `#kule`, `#uretim`, `#iletisim`. WhatsApp numarası `905306656373`.
- **Renkler:** kobalt `#2340FF`, güneş `#FFD60A`, pembe `#FF3D8B`, mürekkep `#120B3A`, beyaz `#FFFFFF`. Zemine göre yazı rengi tasarım belgesi bölüm 7'deki kurala uyar; gövde metni en az 4,5:1.
- **Yazı:** yalnızca Bricolage Grotesque, siteye gömülü. h1 `clamp(2.25rem, 7.6vw, 7.5rem)`/800/satır 1/harf aralığı −0,035em; h2 `clamp(2rem, 5vw, 4.25rem)`/800/satır 1; h3 1,5rem/700; gövde 1,125rem/500/satır 1,55/en çok 70 karakter.
- **Biçim:** bölümler uçtan uca düz renk bant, degrade yok. Gölge yalnızca mürekkep renkli sert gölgedir (bulanıksız). Kayan şerit sayfada tam iki tane. Tasarım belgesi bölüm 7'deki "kaçınılacaklar" listesi her görev için geçerlidir.
- **Son hâl kuralı:** JavaScript yokken, site betiği yüklenemediğinde ve hareket azaltılmışken sayfa her bölümün son görüntüsünü gösterir. Bunu sağlayan dört sözleşme:
  1. `<head>` içindeki satır içi betik `<html>`'e `js`, hareket serbestse ayrıca `hareketli` sınıfını ekler; site betiği yüklenemezse ikisini de kaldırır.
  2. Motion ile dinlenme hâlinden uzaklaştırılan her öğe `data-hareket` taşır ve dinlenme hâli "dönüşümsüz, tam görünür, kırpılmamış"tır. `html:not(.hareketli) [data-hareket]` kuralı bu öğeleri zorla dinlenme hâline getirir. Kalıcı eğim `transform` ile değil CSS `rotate` özelliğiyle verilir. Sürüklenen sarmalayıcı `data-hareket` taşımaz.
  3. JavaScript'e bağlı denetimler `js-gerek` sınıfı taşır; `html:not(.js) .js-gerek` gizlidir.
  4. İki tür hareket ayrı bağlanır. *Giriş hareketleri* (`initial` → `animate` / `whileInView`) hazır HTML'e başlangıç stiliyle yazılır (Motion'ın olağan davranışı; React devralırken sıçrama olmaz) ve bu stil 2. maddedeki kural sayesinde yalnızca `html.hareketli` iken etkilidir. *Kaydırmaya bağlı stiller* yalnızca tarayıcıda, bölüm canlıyken bağlanır; hazır HTML'de o öğeler son hâlindedir. Canlıyken değişen yerleşim (uzun, sabitlenen sahne) React'e değil CSS'e bağlıdır (`html.hareketli …`); böylece sayfa React devralırken zıplamaz.
- **Sunucu güvenliği:** bileşenler çizim sırasında `window`, `document`, `matchMedia` okumaz; `src/ortak/kancalar.ts` içindeki kancaları kullanır. Sunucudaki ve tarayıcıdaki ilk çizim aynıdır.
- **Hareket:** kaydırmaya bağlı hareket yalnızca `transform`, `opacity`, `clip-path` ve SVG çizgi çizimi kullanır. Kendiliğinden hareket yalnızca açılış girişi, kayan şeritler, süslerin salınımı ve videolardır. Giriş hareketleri bir kez oynar.
- **Erişilebilirlik:** görünür klavye odağı; dokunma hedefi en az 44 px; tek `h1`; sıralı olmayan şey numaralanmaz.
- **Adlandırma:** kaynak dosyalarda adlar ve açıklamalar Türkçe (depodaki düzen).
- **Commit:** yalnızca site sahibi izin verdiyse yapılır; izin yoksa görev sonundaki commit adımı atlanır. Push hiçbir durumda yapılmaz.

## Review Focus

Tasarım belgesinin ima ettiği ama açıkça saymadığı, ziyaretçiyi en çok vuracak beş durum; her biri sahibi olan görevde bir testle sabitlenir:

1. **Sayfa bir bölüm bağlantısıyla açılır** (`/#iletisim`): ziyaretçi o bölümde kalmalı, sayfa sonradan zıplamamalı. → Görev 8.
2. **Kısa ekran** (yatık telefon, 740×360): büyük sahne sabitlenmemeli, tam ekran menü kaydırılabilmeli. → Görev 3 ve 8.
3. **Site betiği yüklenemez** (ağ hatası; JavaScript açık): içerik gizli kalmamalı. → Görev 1.
4. **Süzgece art arda hızlı basılır, ardından büyük görsel açılır:** sayaç ve kartlar son seçimi göstermeli, kapatınca odak karta dönmeli. → Görev 4.
5. **Ziyaretçi yazı boyutunu iki katına çıkarmış:** başlıklar yana taşmamalı. → Görev 1 (her bölüm eklendikçe korumaya devam eder).

## Dosya düzeni

```
index.html                      sayfa başı (başlık, açıklama, og, JSON-LD), sınıf betiği, #root
src/
  main.tsx                      tarayıcı girişi: hazır HTML varsa hydrateRoot
  entry-server.tsx              derleme girişi: render(): string
  App.tsx                       bölümlerin sırası, MotionConfig, yumuşak kaydırma, data-hazir
  icerik.ts                     BÜTÜN metinler, standlar, süzgeçler, iletişim, WhatsApp mesajları
  stil/temel.css                Tailwind, yazı tipi, renk ve gölge değerleri, temel yazı, son hâl kuralları
  ortak/
    kancalar.ts                 useHareketli, useMedya, useYumusakKaydirma
    Dugme.tsx  ortak.css        hap düğme, WhatsApp düğmesi, çıkartma çerçevesi
    KayanSerit.tsx              kayan sarı şerit
    SusCikartma.tsx             sürüklenebilir süs çıkartması
    Video.tsx                   görününce oynayan, çıkartma çerçeveli video
  cizimler/                     Yildiz.tsx, Pasta.tsx, Tezgah.tsx (satır içi SVG)
  bolumler/
    UstCubuk.tsx  ust-cubuk.css          Acilis.tsx  acilis.css
    StandSahnesi.tsx  stand-sahnesi.css  Urunler.tsx  StandGalerisi.tsx  BuyukGorsel.tsx  urunler.css
    KuleStand.tsx  kule.css              Uretim.tsx  uretim.css
    Iletisim.tsx  AltBilgi.tsx  iletisim.css
tools/
  onceden-uret.mjs              dist/index.html içine hazır HTML'i yerleştirir
  test/
    birim/icerik.test.mjs       içerik dosyasının birim testleri (node --test)
    tests/yardimci.mjs          ortak test yardımcıları
    tests/*.spec.mjs            bölüm başına bir tarayıcı testi dosyası
    playwright.config.mjs  lighthouse.mjs  paylasim-gorseli.mjs  paylasim-sablon.html
```

Her bölüm bileşeni kendi stil dosyasını içe aktarır; sınıf adları bölüm adıyla başlar (`acilis-…`, `sahne-…`).

Tek bir testi çalıştırmak için: `npm run build`, ardından `npm --prefix tools/test test -- tests/<dosya>.spec.mjs`. Hepsi için: `npm test`.

---

### Görev 1: Altyapı — içerik dosyası, hazır HTML üretimi, test düzeni

**Files:**
- Create: `src/icerik.ts`, `src/entry-server.tsx`, `src/stil/temel.css`, `src/ortak/kancalar.ts`, `tools/onceden-uret.mjs`, `tools/test/birim/icerik.test.mjs`, `tools/test/tests/yardimci.mjs`, `tools/test/tests/genel.spec.mjs`
- Modify: `package.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `tools/test/playwright.config.mjs`, `.gitignore` (`dist-ssr/` eklenir)
- Delete: `src/index.css`, `tools/test/tests/site.spec.mjs`

**Interfaces:**
- Produces (`src/icerik.ts`; yalnızca silinebilir TypeScript sözdizimi, göreli içe aktarma yok — Node dosyayı doğrudan yükler):

```ts
export const SITE: { ad: 'Avrasya Toptan Pasta Süsleri'; adres: 'https://www.avrasyasus.com.tr/' }
export type WaMesaji = 'ust' | 'fiyat' | 'stand' | 'kule'
export const WA_MESAJ: Record<WaMesaji, string>          // tasarım belgesi "WhatsApp'ın hazır mesajları"
export function waBaglantisi(mesaj: WaMesaji): string    // https://wa.me/905306656373?text=<encodeURIComponent(mesaj)>
export const MENU: readonly { ad: string; hedef: `#${string}` }[]   // Stand, Süsler, Kule stand, Üretim, İletişim
export const ACILIS: { satirlar: readonly [string, string, string]; aciklama: string; cta: string; ikincil: string; ipucu: string }
export type Sus = { dosya: string; alt: string }
export const SUSLER: readonly Sus[]                      // 8 süs; ilk altısı açılışınkiler, taslaktaki sırayla
export function susGorseli(dosya: string): string        // /assets/img/susler/<dosya>.webp
export type SuzgecId = 'hepsi' | 'cocuk' | 'rakam' | 'yazi' | 'esprili' | 'kadin' | 'erkek' | 'futbol' | 'ayna'
export type Suzgec = { id: SuzgecId; ad: string; renk: string; uzeri: string }
export const SUZGECLER: readonly Suzgec[]                // bu sırayla, 9 adet
export type Stand = { dosya: string; ad: string; alt: string; konular: readonly Exclude<SuzgecId, 'hepsi'>[] }
export const STANDLAR: readonly Stand[]                  // 11 stand, eski sitedeki sırayla
export function standlariSuz(suzgec: SuzgecId): readonly Stand[]
export function standGorseli(dosya: string, boyut: 640 | 1040 | 'kesik'): string
export const STAND_SAHNESI: { baslik: string; adimlar: readonly { baslik: string; metin: string }[]; cta: string; standAlt: string }
export const URUNLER: { baslik: string; metin: string; turler: readonly { baslik: string; metin: string }[]; galeriBasligi: 'Her konsepte ayrı stand' }
export const KULE: { baslik: string; metin: string; cta: string; gorselAlt: string; katlar: readonly { baslik: string; metin: string; bant: readonly [number, number] }[] }
export const URETIM: { baslik: string; metin: string; adimlar: readonly { baslik: string; metin: string }[] }
export type VideoBilgisi = { kaynak: string; poster: string; en: number; boy: number; baslik: string }
export const VIDEOLAR: { stand: VideoBilgisi; uv: VideoBilgisi }
export type Baglanti = { yazi: string; href: string }
export const ILETISIM: { ust: string; baslik: string; metin: string; cta: string; telefon: Baglanti; whatsapp: Baglanti; eposta: Baglanti; instagram: Baglanti; facebook: Baglanti; adres: readonly string[] }
```

- Produces (`src/ortak/kancalar.ts`):

```ts
export function useHareketli(): boolean          // <html> `hareketli` sınıfını taşıyor mu; sunucuda ve ilk çizimde false
export function useMedya(sorgu: string): boolean // matchMedia(sorgu).matches, canlı; sunucuda ve ilk çizimde false
export function useYumusakKaydirma(): void       // yalnızca hareketliyken Lenis başlatır
```

- Produces (test yardımcıları, `tools/test/tests/yardimci.mjs`): `test` (sorun toplayan otomatik fikstürlü), `expect`, `proje()`, `jsVar()`, `hareketVar()`, `telefon()`, `waAdresi(mesajMetni)` (tam `wa.me` adresi), `ac(page, yol = '/')`, `yanaTasma(page)`, `kaydir(page, secici, oran = 0)`, `hamHtml(request)`.
- Produces (sayfa): `html.js`, `html.hareketli`, `html[data-hazir]` (React devraldıktan sonra), `a.atla[href="#icerik"]`, `main#icerik`.

- [ ] **Step 1: Paketleri düzenle**

Run: `npm install @fontsource-variable/bricolage-grotesque` · `npm uninstall gsap @gsap/react` · `npm --prefix tools/test ci`
Expected: üçü de hatasız biter; `package.json` içinde `gsap` kalmaz.

- [ ] **Step 2: İçerik dosyasının birim testini yaz** — `tools/test/birim/icerik.test.mjs`

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { MENU, STANDLAR, SUSLER, SUZGECLER, KULE, WA_MESAJ, standGorseli, standlariSuz, susGorseli, waBaglantisi } from '../../../src/icerik.ts'

const diskte = yol => existsSync(new URL(`../../../public${yol}`, import.meta.url))

test('11 stand var ve her birinin üç görseli diskte', () => {
  assert.equal(STANDLAR.length, 11)
  for (const s of STANDLAR) for (const b of [640, 1040, 'kesik']) assert.ok(diskte(standGorseli(s.dosya, b)), `${s.dosya} ${b}`)
  assert.ok(STANDLAR.every(s => s.ad && s.alt.length > 20))
})

test('süzgeçler eski sitedeki sayıları verir', () => {
  const beklenen = { hepsi: 11, cocuk: 1, rakam: 5, yazi: 9, esprili: 2, kadin: 1, erkek: 1, futbol: 1, ayna: 4 }
  assert.deepEqual(SUZGECLER.map(s => s.id), Object.keys(beklenen))
  for (const [id, n] of Object.entries(beklenen)) assert.equal(standlariSuz(id).length, n, id)
})

test('8 süs var, görselleri diskte, alt metinleri dolu', () => {
  assert.equal(SUSLER.length, 8)
  for (const s of SUSLER) { assert.ok(diskte(susGorseli(s.dosya)), s.dosya); assert.ok(s.alt.length > 10) }
})

test('WhatsApp bağlantısı numarayı ve mesajı taşır', () => {
  assert.deepEqual(Object.keys(WA_MESAJ), ['ust', 'fiyat', 'stand', 'kule'])
  assert.equal(waBaglantisi('kule'), `https://wa.me/905306656373?text=${encodeURIComponent('Merhaba, kule stand hakkında bilgi almak istiyorum.')}`)
})

test('menü beş bölümü eski kimlikleriyle gösterir', () => {
  assert.deepEqual(MENU.map(m => m.hedef), ['#stand', '#urunler', '#kule', '#uretim', '#iletisim'])
})

test('kule katlarının bantları fotoğrafı yukarıdan aşağı kesintisiz böler', () => {
  assert.deepEqual(KULE.katlar.map(k => k.bant), [[1, 29], [29, 54], [54, 77], [77, 97]])
})
```

- [ ] **Step 3: Testin düştüğünü gör**

Run: `node --test tools/test/birim/`
Expected: FAIL — `src/icerik.ts` bulunamıyor.

- [ ] **Step 4: `src/icerik.ts` dosyasını yaz**

Kaynaklar (harfi harfine): açılış ve menü `src/taslaklar/ortak.ts`; stand sahnesi `eski-site/index.html` 252–266 (`standAlt` = 252. satırdaki alt metin); süsler 285–294; standlar 319–329 (`dosya`, `ad` = `kart-ad`, `alt`, `konular` = `data-kategori`); kule 341–353 (`gorselAlt` = 353. satırdaki alt metin); üretim 369–382; iletişim 527–539. Buna ek kararlar:

| Süzgeç | `renk` | `uzeri` |
|---|---|---|
| hepsi "Tümü" | `#FF3D8B` | `#120B3A` |
| cocuk "Çocuk" | `#00B8C4` | `#120B3A` |
| rakam "Rakam" | `#FF4438` | `#120B3A` |
| yazi "Yazı" | `#B4E61D` | `#120B3A` |
| esprili "Esprili" | `#FF6A1A` | `#120B3A` |
| kadin "Kadın" | `#E11D74` | `#FFFFFF` |
| erkek "Erkek" | `#2450F5` | `#FFFFFF` |
| futbol "Futbol" | `#0FA958` | `#120B3A` |
| ayna "Ayna" | `#7A3CFF` | `#FFFFFF` |

`SUSLER`'in son ikisi: `sus-canim-babam` — "Mavi balonlu, altın taçlı ve siyah papyonlu “Canım Babam” süsü"; `sus-iyi-ki-bizimlesin` — "Mavi zeminli, altın kalpli “İyi ki Bizimlesin” süsü". `ACILIS.ipucu` = "Süsleri tutup sürükleyebilirsiniz." `VIDEOLAR.stand` = `stand-tanitim.mp4`, 848×480, "Standın tanıtım videosu"; `VIDEOLAR.uv` = `uv-baski.mp4`, 404×720, "UV baskı videosu". `MENU`'de ikinci ad "Süsler"dir. "WhatsApp’tan yazın" her yerde kıvrık kesme işaretiyle yazılır. Galeri başlığı onaylı taslaktaki "Her konsepte ayrı stand"dır (eski sitede "Hazır standlarımızdan örnekler" idi; tasarım belgesi 8.3 yenisini adlandırır).

- [ ] **Step 5: Birim testinin geçtiğini gör**

Run: `node --test tools/test/birim/`
Expected: 6 test, hepsi PASS.

- [ ] **Step 6: Ortak test yardımcılarını ve genel testleri yaz**

`tools/test/playwright.config.mjs`: `webServer.command` → `npx http-server ../../dist -p 5510 -c-1 --silent`; beş proje adı aynen kalır.

`tools/test/tests/yardimci.mjs`: `test`, `@playwright/test`'in `test.extend`'iyle kurulur; otomatik `sorunlar` fikstürü `pageerror`, hata düzeyindeki `console` iletileri, durumu 400 ve üstü yanıtlar ve `ERR_ABORTED` dışındaki başarısız istekleri bir diziye toplar, testten sonra `expect(sorunlar).toEqual([])` der. `ac()` sayfayı açar ve `jsVar()` ise `html[data-hazir]` bekler. `yanaTasma()` = `max(0, scrollWidth − clientWidth)`. `kaydir(page, secici, oran)` öğenin üst kenarını ekran yüksekliğinin `oran` katına getirir. `hamHtml(request)` = `(await request.get('/')).text()`; onunla aranan metinler `'`, `"` ve `&` içermez (React bunları hazır HTML'de kodlar). `telefon()` Pixel 7 profilidir (412×915).

`tools/test/tests/genel.spec.mjs`:

```js
import AxeBuilder from '@axe-core/playwright'
import { test, expect, ac, hamHtml, hareketVar, jsVar, proje, yanaTasma } from './yardimci.mjs'

test('sayfa yüklenir, baştan sona kaydırılınca yana taşma olmaz', async ({ page }) => {
  const genislikler = proje() === 'masaustu' ? [375, 768, 1440] : [page.viewportSize().width]
  for (const en of genislikler) {
    await page.setViewportSize({ width: en, height: page.viewportSize().height })
    await ac(page)
    const boy = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y <= boy; y += 400) { await page.evaluate(y => window.scrollTo(0, y), y); expect(await yanaTasma(page), `${en}px, y=${y}`).toBe(0) }
  }
})

test('hazır HTML sayfanın başlığını taşır', async ({ request }) => {
  const html = await hamHtml(request)
  for (const satir of ['Pastaneniz için', 'süslerle dolu', 'teşhir standı']) expect(html).toContain(satir)
  expect(html).toMatch(/<h1[\s>]/)
})

test('hareket yokken hiçbir öğe gizli kalmaz', async ({ page }) => {
  test.skip(hareketVar(), 'yalnızca hareketsiz ve JavaScript\'siz projelerde')
  await ac(page)
  for (const oge of await page.locator('[data-hareket]').all()) {
    await expect(oge).toHaveCSS('opacity', '1')
    await expect(oge).toHaveCSS('transform', 'none')
  }
  if (!jsVar()) for (const oge of await page.locator('.js-gerek').all()) await expect(oge).toBeHidden()
})

test('site betiği yüklenemezse içerik yine görünür', async ({ page, sorunlar }) => {
  test.skip(proje() !== 'masaustu', 'bir kez yeterli')
  await page.route('**/assets/*.js', istek => istek.abort())
  await page.goto('/')
  await expect(page.locator('html')).not.toHaveClass(/\bjs\b|hareketli/)
  await expect(page.locator('h1')).toBeVisible()
  for (const oge of await page.locator('[data-hareket]').all()) await expect(oge).toHaveCSS('opacity', '1')
  sorunlar.length = 0 // engellenen betik bu testte beklenen tek hatadır
})

test('yazı boyutu iki katına çıkınca yana taşma olmaz', async ({ page }) => {
  test.skip(!jsVar(), 'yazı boyutunu sayfada değiştirmek betik ister')
  await ac(page)
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  const boy = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= boy; y += 600) { await page.evaluate(y => window.scrollTo(0, y), y); expect(await yanaTasma(page), `y=${y}`).toBe(0) }
})

test('ilk Tab "İçeriğe geç" bağlantısına gider', async ({ page }) => {
  await ac(page)
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toHaveText('İçeriğe geç')
  await expect(page.locator(':focus')).toHaveAttribute('href', '#icerik')
})

test('robots.txt, sitemap.xml ve sayfadaki adresler aynı alan adını gösterir', async ({ page, request }) => {
  test.skip(proje() !== 'masaustu', 'dosyalar cihaza göre değişmez')
  await page.goto('/')
  const adres = 'https://www.avrasyasus.com.tr/'
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', adres)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', adres)
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(new RegExp(`^${adres}`))
  expect(JSON.parse(await page.locator('script[type="application/ld+json"]').textContent()).url).toBe(adres)
  expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${adres}sitemap.xml`)
  expect(await (await request.get('/sitemap.xml')).text()).toContain(`<loc>${adres}</loc>`)
})

test('erişilebilirlik: axe ciddi ya da kritik ihlal bulmaz', async ({ page }) => {
  test.skip(!jsVar(), 'axe sayfaya betik olarak yüklenir')
  await ac(page)
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations.filter(v => ['serious', 'critical'].includes(v.impact)).map(v => `${v.id}: ${v.nodes.length}`)).toEqual([])
})
```

- [ ] **Step 7: Testlerin düştüğünü gör**

`package.json` betikleri: `"build": "tsc --noEmit && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node tools/onceden-uret.mjs"`, `"test:birim": "node --test tools/test/birim/"`, `"test:tarayici": "npm --prefix tools/test test"`, `"test": "npm run test:birim && npm run build && npm run test:tarayici"`, `"lighthouse": "npm run build && npm --prefix tools/test run lighthouse"`.

Run: `npm test`
Expected: FAIL — derleme `src/entry-server.tsx` ve `tools/onceden-uret.mjs` olmadığı için durur.

- [ ] **Step 8: Hazır HTML üretimini ve sayfa iskeletini kur**

- `src/entry-server.tsx`: `export function render(): string` — `renderToString(<StrictMode><App /></StrictMode>)`.
- `src/main.tsx`: `#root` dolu ise `hydrateRoot`, boş ise (geliştirme sunucusu) `createRoot`. Stil dosyaları burada, şu sırayla içe aktarılır: yazı tipi paketinin `opsz` ve `wght` eksenlerini birlikte taşıyan stil dosyası (`node_modules/@fontsource-variable/bricolage-grotesque/` içinden doğrula; beklenen `opsz.css`, aile adı `"Bricolage Grotesque Variable"`), `lenis/dist/lenis.css`, `./stil/temel.css`.
- `tools/onceden-uret.mjs`: `dist-ssr/entry-server.js`'ten `render()` çağırır; `dist/index.html` içindeki `<div id="root"></div>` yerine dolusunu yazar; işaret bulunamazsa ya da çıktı `<h1` içermiyorsa hata verip çıkar; sonunda `dist-ssr/` klasörünü siler.
- `index.html`: `eski-site/index.html` 6–18 ve 45–67 satırlarındaki başlık, açıklama, `canonical`, `og:` etiketleri ve JSON-LD aynen taşınır; `theme-color` `#2340FF` olur; Google yazı tipi satırları silinir; `<head>`'in başına şu betik konur:

```html
<script>
  (function (k) {
    k.add('js');
    if (matchMedia('(prefers-reduced-motion: no-preference)').matches) k.add('hareketli');
    addEventListener('error', function (o) {
      if (o.target && o.target.tagName === 'SCRIPT') k.remove('js', 'hareketli');
    }, true);
  })(document.documentElement.classList);
</script>
```

- `src/stil/temel.css`: `@import "tailwindcss"`; `@theme` içinde `--color-kobalt`, `--color-gunes`, `--color-pembe`, `--color-murekkep`, `--font-sans`; gölge değerleri `--golge-kucuk: 4px 4px 0`, `--golge: 5px 5px 0`, `--golge-buyuk: 8px 8px 0`, `--golge-basili: 2px 2px 0` (hepsi mürekkep); Global Constraints'teki yazı ölçeği; başlıklarda `overflow-wrap: anywhere`; `:focus-visible` çerçevesi; `.atla` (odaklanınca görünen atlama bağlantısı); ve iki kural:

```css
html:not(.hareketli) [data-hareket] { opacity: 1 !important; transform: none !important; clip-path: none !important; }
html:not(.js) .js-gerek { display: none !important; }
```

- `src/ortak/kancalar.ts`: üç kanca. `useYumusakKaydirma`, Lenis'i etki içinde `import('lenis')` ile yükler (sunucu derlemesine girmesin), `new Lenis({ autoRaf: true, anchors: true })` kurar (varsayılan ayarda dokunmatik kaydırma tarayıcıda kalır), `useHareketli()` false ise hiç başlatmaz, temizlikte `destroy()` çağırır.
- `src/App.tsx`: `<MotionConfig reducedMotion="user">`; `a.atla`; `main#icerik` içinde şimdilik yalnızca `ACILIS.satirlar`'dan kurulan `h1` (Görev 2 gerçek açılışı koyar); etki içinde `document.documentElement.dataset.hazir = ''`; `useYumusakKaydirma()`. `Taslak3` artık içe aktarılmaz.

- [ ] **Step 9: Testlerin geçtiğini gör**

Run: `npm test`
Expected: birim 6/6 PASS; derleme hatasız; tarayıcı testleri beş projede PASS (atlananlar hariç). `dist/index.html` içinde `<h1` var.

- [ ] **Step 10: Commit** (izin varsa) — `Şenlik 1: içerik dosyası, hazır HTML üretimi ve test düzeni`

---

### Görev 2: Açılış ve ortak parçalar

**Files:**
- Create: `src/ortak/Dugme.tsx`, `src/ortak/ortak.css`, `src/ortak/KayanSerit.tsx`, `src/ortak/SusCikartma.tsx`, `src/cizimler/Yildiz.tsx`, `src/bolumler/Acilis.tsx`, `src/bolumler/acilis.css`, `tools/test/tests/acilis.spec.mjs`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `ACILIS`, `SUSLER`, `SUZGECLER`, `Sus`, `WaMesaji`, `waBaglantisi`, `susGorseli`; `useMedya`.
- Produces:

```tsx
Dugme({ href, tur, buyuk?, disarida?, children }: { href: string; tur: 'gunes' | 'beyaz' | 'murekkep' | 'duz'; buyuk?: boolean; disarida?: boolean; children: ReactNode })
  // <a class="dugme dugme--<tur>">; disarida → target="_blank" rel="noopener"; "duz" altı çizili düz bağlantıdır
WaDugme({ mesaj, tur, buyuk?, children }: { mesaj: WaMesaji; tur: 'gunes' | 'beyaz' | 'murekkep'; buyuk?: boolean; children: ReactNode })
KayanSerit({ ogeler, etiket }: { ogeler: readonly string[]; etiket: string })
  // <div class="kayan-serit"> > <div class="kayan-serit-ic"> (kayan öğe) > iki kopya <ul>; ilki aria-label={etiket}, ikincisi aria-hidden
SusCikartma({ sus, sinir, egim, gecikme, sure, className }: { sus: Sus; sinir: RefObject<HTMLElement | null>; egim: number; gecikme: number; sure: number; className?: string })
  // kök öğe [data-sus][data-surukle="true|false"]
```

- Produces (sayfa): `section#acilis`; CSS sınıfı `.cikartma` (10 px beyaz çerçeve, sert gölge) `ortak.css` içinde.

- [ ] **Step 1: Testi yaz** — `tools/test/tests/acilis.spec.mjs`

```js
import { test, expect, ac, hamHtml, hareketVar, jsVar, telefon, waAdresi } from './yardimci.mjs'

const kesisir = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

test('açılış başlığı ve iki eylemi doğru yere gider', async ({ page }) => {
  await ac(page)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('#acilis h1')).toHaveText(/Pastaneniz için\s*süslerle dolu\s*teşhir standı/)
  const fiyat = page.locator('#acilis').getByRole('link', { name: 'Stand için fiyat alın' })
  await expect(fiyat).toHaveAttribute('href', waAdresi('Merhaba, pastanem için süs standı fiyatı almak istiyorum.'))
  await expect(fiyat).toHaveAttribute('target', '_blank')
  await expect(page.locator('#acilis').getByRole('link', { name: 'Standları görün' })).toHaveAttribute('href', '#urunler')
})

test('masaüstünde altı, telefonda dört süs görünür; telefonda başlığa binmez', async ({ page }) => {
  await ac(page)
  if (hareketVar()) await page.waitForTimeout(2500)
  const gorunen = page.locator('#acilis [data-sus]:visible')
  await expect(gorunen).toHaveCount(telefon() ? 4 : 6)
  if (telefon()) {
    const baslik = await page.locator('#acilis h1').boundingBox()
    for (const s of await gorunen.all()) expect(kesisir(await s.boundingBox(), baslik)).toBe(false)
  }
})

test('süs yalnızca fareyle sürüklenir', async ({ page }) => {
  test.skip(!jsVar(), 'sürükleme JavaScript ister')
  await ac(page)
  const sus = page.locator('#acilis [data-sus]:visible').first()
  await expect(sus).toHaveAttribute('data-surukle', telefon() ? 'false' : 'true')
  if (telefon()) return
  await page.waitForTimeout(hareketVar() ? 2500 : 0)
  const once = await sus.boundingBox()
  await page.mouse.move(once.x + once.width / 2, once.y + once.height / 2)
  await page.mouse.down(); await page.mouse.move(once.x + once.width / 2 + 140, once.y + once.height / 2 + 60, { steps: 12 }); await page.mouse.up()
  expect((await sus.boundingBox()).x - once.x).toBeGreaterThan(60)
})

test('kayan şerit konseptleri bir kez okutur, hareket azaltılınca durur', async ({ page }) => {
  await ac(page)
  const listeler = page.locator('#acilis .kayan-serit ul')
  await expect(listeler).toHaveCount(2)
  await expect(listeler.first()).toHaveAttribute('aria-label', 'Konseptler')
  await expect(listeler.last()).toHaveAttribute('aria-hidden', 'true')
  await expect(listeler.first().locator('li')).toHaveText(['Çocuk', 'Rakam', 'Yazı', 'Esprili', 'Kadın', 'Erkek', 'Futbol', 'Ayna'])
  const ad = await page.locator('#acilis .kayan-serit-ic').evaluate(o => getComputedStyle(o).animationName)
  hareketVar() ? expect(ad).not.toBe('none') : expect(ad).toBe('none')
})

test('açılış girişi bitince her şey yerinde ve görünür', async ({ page }) => {
  test.skip(!hareketVar(), 'giriş yalnızca hareket açıkken oynar')
  await ac(page)
  await page.waitForTimeout(2500)
  for (const oge of await page.locator('#acilis [data-hareket]:visible').all()) await expect(oge).toHaveCSS('opacity', '1')
})

test('açılış metni hazır HTML\'de var', async ({ request }) => {
  const html = await hamHtml(request)
  expect(html).toContain('Stand için fiyat alın')
  expect(html).toContain('Pleksi pasta süslerini kendi atölyemizde üretiyor')
})
```

- [ ] **Step 2: Testin düştüğünü gör**

Run: `npm run build` · `npm --prefix tools/test test -- tests/acilis.spec.mjs`
Expected: FAIL — `#acilis` yok.

- [ ] **Step 3: Ortak parçaları ve açılışı yaz**

Yerleşim, ölçüler, yay ayarları ve altı süsün yeri `Taslak3.tsx` ile `taslak3.css`'ten taşınır (`t3-` öneki `acilis-` olur); üst çubuk bu görevde yoktur (Görev 8). Taslaktan farklar:
- `useState(() => window.matchMedia…)` yerine `useMedya('(pointer: fine)')`; `data-surukle` bu değeri yansıtır, `drag` ona bağlıdır.
- Her süsün kalıcı eğimi CSS `rotate` ile verilir; Motion girişte `scale` ve `opacity`'yi oynatır. Yapı: konumlu ve eğimli kök (`data-sus`) → sürükleme sarmalayıcısı (`data-hareket` yok) → giriş sarmalayıcısı (`data-hareket`) → salınan `img` (`data-hareket`).
- Başlık satırları, açıklama ve eylem kutusu `data-hareket` taşır. Başlık satırları opaklıkla gizlenmez; yalnızca konum ve eğimle girer (başlık ilk boyamada görünür kalır).
- Hangi süsün hangi genişlikte görüneceği yalnızca CSS'le belirlenir (720 px altında dördü).
- İpucu satırı her zaman HTML'dedir; yalnızca `html.js` ve `(pointer: fine)` iken CSS ile görünür.
- Şeridin kayması CSS animasyonudur ve yalnızca `html.hareketli` altında tanımlıdır. `KayanSerit`'e `SUZGECLER`'in "Tümü" dışındaki adları, `etiket="Konseptler"` verilir.
- Düğme üzerine gelince gölge `--golge-basili`'ye iner ve düğme o kadar kayar.

- [ ] **Step 4: Testlerin geçtiğini gör**

Run: `npm test`
Expected: PASS (Görev 1'in genel testleri dahil).

- [ ] **Step 5: Gözle doğrula**

`npm run dev`; tarayıcı bölmesinde 1280 ve 375 genişlikte ekran görüntüsü al. Beklenen: taslaktaki açılışla aynı görünüm; telefonda dört süs köşelerde; konsolda hata yok.

- [ ] **Step 6: Commit** (izin varsa) — `Şenlik 2: açılış ve ortak parçalar`

---

### Görev 3: Stand nasıl çalışır — büyük sahne ve tanıtım videosu

**Files:**
- Create: `src/bolumler/StandSahnesi.tsx`, `src/bolumler/stand-sahnesi.css`, `src/cizimler/Pasta.tsx`, `src/cizimler/Tezgah.tsx`, `src/ortak/Video.tsx`, `tools/test/tests/stand-sahnesi.spec.mjs`
- Modify: `src/App.tsx`, `src/ortak/ortak.css`

**Interfaces:**
- Consumes: `STAND_SAHNESI` (`standAlt` dahil), `standGorseli('stand-cocuk-karakter', 'kesik')`, `SUSLER`, `VIDEOLAR.stand`, `WaDugme`, `useHareketli`, `useMedya`.
- Produces: `Video({ bilgi, egim? }: { bilgi: VideoBilgisi; egim?: number })` — kök `figure.video.cikartma`; içinde `<video>` ve `button.video-dugme.js-gerek` ("Duraklat" / "Oynat").
- Produces (sayfa):

```
section#stand.stand                       güneş zemin
  div.sahne[data-adim]                    canlıyken "1" | "2" | "3"; değilken nitelik yok. Kaydırma ölçüsü bu öğedir
    div.sahne-yapiskan
      h2 · ol.sahne-adimlar > li[data-etkin] (h3 + p) × 3 · WaDugme mesaj="stand"
      div.sahne-resim
        [data-sahne="stand"]   stand-cocuk-karakter-kesik.webp (1040×976)
        [data-sahne="tezgah"]  [data-sahne="pasta"]  [data-sahne="secilen"] (sus-canim-kizim)  [data-sahne="ucan"] × 4
  figure.video                            tanıtım videosu, başlığıyla
```

Sahnenin kuralları:
- **Dinlenme hâli son görüntüdür:** stand tezgâhta, pasta yanında, "Canım Kızım" pastanın üstünde. `[data-sahne]` öğelerinin hepsi `data-hareket` taşır.
- **Canlılık** = `useHareketli() && useMedya('(min-height: 520px)')`. Canlı değilken bileşen hiçbir Motion stili bağlamaz ve `data-adim` yazmaz. Yükseklik ve sabitleme CSS'tedir, aynı iki koşulla: `html.hareketli .sahne` için `@media (min-height: 520px)` altında yükseklik 900 px ve üstü genişlikte `300svh`, altında `220svh`; `.sahne-yapiskan` `position: sticky; top: 0; height: 100svh`.
- **İlerleme:** `useScroll({ target, offset: ['start start', 'end end'] })`. 0–0,33: stand alttan yukarı `clip-path` ile açılır, dört süs kenarlardan yerine uçar. 0,33–0,66: tezgâh alttan kayar, pasta belirir. 0,66–0,92: seçilen süs standdaki yerinden pastanın üstüne yay çizerek gider; 0,92–1 dinlenme. `data-adim` eşikleri 0,33 ve 0,66.
- Canlıyken etkin olmayan adımlar soluktur (`opacity` 0,35); canlı değilken üçü de tam görünür ve alt alta durur. Düğme canlıyken üçüncü adımda belirir; canlı değilken hep görünür.
- Pasta ve tezgâh düz renkli, degradesiz, mürekkep dış çizgili satır içi SVG'dir; `aria-hidden`.

Videonun kuralları: `muted loop playsInline preload="none" poster width height`; sunucu çıktısında `controls` vardır, tarayıcıda bileşen bağlanınca kalkar. `useHareketli()` iken yarısından fazlası görününce oynar, görünmezken durur. Düğmeyle durdurulan video kendiliğinden yeniden başlamaz. Hareket azaltılmışken yalnızca düğmeyle oynar. `aria-label` = `bilgi.baslik`.

- [ ] **Step 1: Testi yaz** — `tools/test/tests/stand-sahnesi.spec.mjs`

```js
import { test, expect, ac, hamHtml, hareketVar, jsVar, kaydir, proje, waAdresi, yanaTasma } from './yardimci.mjs'

const sonaKaydir = page => page.evaluate(() => { const r = document.querySelector('.sahne').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.bottom - window.innerHeight) })
const susPastada = async page => {
  const s = await page.locator('[data-sahne="secilen"]').boundingBox(), p = await page.locator('[data-sahne="pasta"]').boundingBox()
  const x = s.x + s.width / 2
  return x > p.x && x < p.x + p.width && s.y + s.height / 2 < p.y + p.height / 2
}

test('stand sahnesi kaydırınca son hâline varır ve geri oynar', async ({ page }) => {
  test.skip(!hareketVar(), 'sahne yalnızca hareket açıkken oynar')
  await ac(page)
  await kaydir(page, '.sahne')
  await expect(page.locator('.sahne')).toHaveAttribute('data-adim', '1')
  expect(await susPastada(page)).toBe(false)
  await sonaKaydir(page)
  await expect(page.locator('.sahne')).toHaveAttribute('data-adim', '3')
  await expect.poll(() => susPastada(page)).toBe(true)
  await kaydir(page, '.sahne')
  await expect(page.locator('.sahne')).toHaveAttribute('data-adim', '1')
})

test('sahne ortasında ekrana sabit kalır', async ({ page }) => {
  test.skip(!hareketVar(), 'sabitleme yalnızca hareket açıkken')
  await ac(page)
  await kaydir(page, '.sahne')
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.8))
  await expect.poll(async () => Math.abs((await page.locator('.sahne-yapiskan').boundingBox()).y)).toBeLessThan(2)
  await expect(page.locator('#stand h2')).toBeInViewport()
})

test('hareket yokken sabitleme yok; üç adım ve son görüntü birlikte görünür', async ({ page }) => {
  test.skip(hareketVar(), 'yalnızca hareketsiz ve JavaScript\'siz projelerde')
  await ac(page)
  await expect(page.locator('.sahne-yapiskan')).not.toHaveCSS('position', 'sticky')
  await expect(page.locator('.sahne')).not.toHaveAttribute('data-adim', /./)
  for (const adim of await page.locator('.sahne-adimlar li').all()) await expect(adim).toHaveCSS('opacity', '1')
  expect(await susPastada(page)).toBe(true)
})

test('kısa ekranda sahne sabitlenmez', async ({ page }) => {
  test.skip(proje() !== 'masaustu', 'bir kez yeterli')
  await page.setViewportSize({ width: 740, height: 360 })
  await ac(page)
  await expect(page.locator('.sahne-yapiskan')).not.toHaveCSS('position', 'sticky')
  await expect(page.locator('.sahne')).not.toHaveAttribute('data-adim', /./)
  await kaydir(page, '.sahne')
  expect(await yanaTasma(page)).toBe(0)
})

test('stand düğmesi kendi mesajını taşır', async ({ page }) => {
  await ac(page)
  await expect(page.locator('#stand').getByRole('link', { name: 'Stand için bilgi alın' })).toHaveAttribute('href', waAdresi('Merhaba, süs standı hakkında bilgi almak istiyorum.'))
})

test('tanıtım videosu görününce oynar, düğmeyle duraklar', async ({ page }) => {
  const video = page.locator('video[aria-label="Standın tanıtım videosu"]')
  await ac(page)
  await expect(video).toHaveAttribute('preload', 'none')
  if (!jsVar()) { await expect(video).toHaveAttribute('controls', ''); return }
  const durdu = () => video.evaluate(v => v.paused)
  const dugme = page.locator('figure.video', { has: video }).getByRole('button')
  await video.scrollIntoViewIfNeeded()
  if (hareketVar()) {
    await expect.poll(durdu).toBe(false)
    await dugme.click()
    await expect.poll(durdu).toBe(true)
    await expect(dugme).toHaveText('Oynat')
  } else {
    await page.waitForTimeout(800)
    expect(await durdu()).toBe(true)
    await dugme.click()
    await expect.poll(durdu).toBe(false)
  }
})

test('stand bölümü hazır HTML\'de var', async ({ request }) => {
  const html = await hamHtml(request)
  for (const metin of ['Stand nasıl çalışır', 'Dolu gelir', 'Tezgâhın yanına konur', 'Müşteri süsünü seçer']) expect(html).toContain(metin)
})
```

- [ ] **Step 2: Testin düştüğünü gör** — Run: `npm run build` · `npm --prefix tools/test test -- tests/stand-sahnesi.spec.mjs` · Expected: FAIL — `#stand` yok.

- [ ] **Step 3: Bölümü yukarıdaki sözleşmeye göre yaz** (zemin güneş; adımlar numaralı `ol`; video sahnenin altında, hafif eğik çıkartma çerçevesinde).

- [ ] **Step 4: Testlerin geçtiğini gör** — Run: `npm test` · Expected: PASS.

- [ ] **Step 5: Gözle doğrula** — 1280 ve 375 genişlikte sahneyi baştan sona ve geri kaydır. Beklenen: üç adım sırayla okunur, hiçbir öğe başka birinin üstüne binmez, süs pastanın üstünde durur, kaydırma takılmaz; 375'te adım metinleri resmin üstünde ve tamamı ekranda.

- [ ] **Step 6: Commit** (izin varsa) — `Şenlik 3: stand sahnesi ve tanıtım videosu`

---

### Görev 4: Süsler ve standlar — süzgeç, galeri, büyük görsel

**Files:**
- Create: `src/bolumler/Urunler.tsx`, `src/bolumler/StandGalerisi.tsx`, `src/bolumler/BuyukGorsel.tsx`, `src/bolumler/urunler.css`, `tools/test/tests/urunler.spec.mjs`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `URUNLER`, `SUZGECLER`, `STANDLAR`, `standlariSuz`, `standGorseli`, `Stand`, `SuzgecId`.
- Produces: `BuyukGorsel({ stand, kapat }: { stand: Stand | null; kapat: () => void })` — `dialog.buyuk-gorsel[aria-label="Büyük görsel"][data-lenis-prevent]`.
- Produces (sayfa):

```
section#urunler.urunler            style: --zemin, --uzeri (seçili süzgeçten); background-color 400 ms geçişli
  h2 · p · dl.tur-listesi (4 × dt + dd)
  h3 "Her konsepte ayrı stand"
  div.suzgec.js-gerek[role="group"][aria-label="Standları konuya göre süzün"] > button[data-suzgec][aria-pressed] × 9
  p.suzgec-sayi.js-gerek[aria-live="polite"]        "11 stand"
  ul.galeri > li[data-stand] > a[href = 1040'lık görsel] > img (640×640, loading="lazy") + span (ad)
dialog.buyuk-gorsel > img (1040'lık) + p (ad) + button "Kapat"
```

Kurallar:
- Kartlar bağlantıdır: JavaScript yokken büyük görseli tarayıcıda açar; varken tıklama engellenir ve `showModal()` ile pencere açılır. Pencere Esc, "Kapat" ve dışına basmakla kapanır; odak açan karta döner.
- Pencere, kartın ekrandaki yerinden büyüyerek açılır (hareket yokken doğrudan açılır).
- Süzgeç: uymayan kartlar çıkar, kalanlar Motion `layout` ile yeni yerine kayar. Ad etiketinin rengi standın ilk konusunun rengidir. Kartların eğimi CSS `rotate` ile; üzerine gelince düzelir.
- 720 px altında `.galeri` yana kaydırılan tek sıradır (`overflow-x: auto`, `scroll-snap-type: x mandatory`); süzgeç düğmeleri de tek sırada yana kayar. Üstünde dört sütunlu ızgara.
- Pencere açıkken arkadaki sayfa kaymaz (`html:has(dialog[open]) { overflow: hidden }`).

- [ ] **Step 1: Testi yaz** — `tools/test/tests/urunler.spec.mjs`

```js
import { test, expect, ac, hamHtml, jsVar, kaydir, telefon, yanaTasma } from './yardimci.mjs'

const SUZGEC = { 'Tümü': [11, 'rgb(255, 61, 139)'], 'Çocuk': [1, 'rgb(0, 184, 196)'], 'Rakam': [5, 'rgb(255, 68, 56)'], 'Yazı': [9, 'rgb(180, 230, 29)'], 'Esprili': [2, 'rgb(255, 106, 26)'], 'Kadın': [1, 'rgb(225, 29, 116)'], 'Erkek': [1, 'rgb(36, 80, 245)'], 'Futbol': [1, 'rgb(15, 169, 88)'], 'Ayna': [4, 'rgb(122, 60, 255)'] }
const dugme = (page, ad) => page.locator('.suzgec').getByRole('button', { name: ad, exact: true })

test('süzgeç doğru sayıda stand gösterir ve zemini boyar', async ({ page }) => {
  test.skip(!jsVar(), 'süzgeç JavaScript ister')
  await ac(page); await kaydir(page, '.suzgec', 0.2)
  for (const [ad, [sayi, renk]] of Object.entries(SUZGEC)) {
    await dugme(page, ad).click()
    await expect(dugme(page, ad)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.suzgec [aria-pressed="true"]')).toHaveCount(1)
    await expect(page.locator('.galeri [data-stand]')).toHaveCount(sayi)
    await expect(page.locator('.suzgec-sayi')).toHaveText(`${sayi} stand`)
    await expect(page.locator('#urunler')).toHaveCSS('background-color', renk)
  }
})

test('süzgece art arda hızlı basılınca son seçim kalır', async ({ page }) => {
  test.skip(!jsVar(), 'süzgeç JavaScript ister')
  await ac(page); await kaydir(page, '.suzgec', 0.2)
  for (const ad of ['Çocuk', 'Ayna', 'Yazı', 'Futbol']) await dugme(page, ad).click({ noWaitAfter: true })
  await expect(page.locator('.galeri [data-stand]')).toHaveCount(1)
  await expect(page.locator('.suzgec-sayi')).toHaveText('1 stand')
  await expect(page.locator('.galeri [data-stand] span')).toHaveText('Futbol')
})

test('stand kartı büyük görseli açar; Esc, Kapat ve dışına basmak kapatır; odak karta döner', async ({ page }) => {
  test.skip(!jsVar(), 'büyük görsel JavaScript ister')
  await ac(page)
  const kart = page.locator('.galeri [data-stand] a').first(), pencere = page.locator('dialog.buyuk-gorsel')
  await kart.scrollIntoViewIfNeeded()
  const kapatmaYollari = [() => page.keyboard.press('Escape'), () => pencere.getByRole('button', { name: 'Kapat' }).click(), () => page.mouse.click(4, 4)]
  for (const kapat of kapatmaYollari) {
    await kart.click()
    await expect(pencere).toHaveAttribute('open', '')
    await expect(pencere.locator('img')).toHaveAttribute('src', /stand-cocuk-karakter-1040\.webp$/)
    await kapat()
    await expect(pencere).not.toHaveAttribute('open', '')
    await expect(kart).toBeFocused()
  }
})

test('telefonda standlar yana kaydırılan tek sıradır', async ({ page }) => {
  test.skip(!telefon(), 'yalnızca telefonda')
  await ac(page); await kaydir(page, '.galeri', 0.2)
  const { tasan, tekSira } = await page.locator('.galeri').evaluate(g => ({ tasan: g.scrollWidth > g.clientWidth, tekSira: new Set([...g.children].map(k => k.offsetTop)).size === 1 }))
  expect(tasan).toBe(true); expect(tekSira).toBe(true)
  expect(await yanaTasma(page)).toBe(0)
})

test('JavaScript kapalıyken süzgeç gizli, on bir kart büyük görsele bağlanır', async ({ page }) => {
  test.skip(jsVar(), 'yalnızca JavaScript\'siz projede')
  await ac(page)
  await expect(page.locator('.suzgec')).toBeHidden()
  await expect(page.locator('.galeri [data-stand] a[href$="-1040.webp"]')).toHaveCount(11)
})

test('süsler ve standlar hazır HTML\'de var', async ({ request }) => {
  const html = await hamHtml(request)
  for (const metin of ['Standdaki süsler', 'Ayna pleksi yazılar', 'Rakam süsleri', 'Baskılı pleksi süsler', 'Karakterli çocuk süsleri', 'Her konsepte ayrı stand', 'Ahşap standda ayna']) expect(html).toContain(metin)
})
```

- [ ] **Step 2: Testin düştüğünü gör** — Run: `npm run build` · `npm --prefix tools/test test -- tests/urunler.spec.mjs` · Expected: FAIL — `#urunler` yok.

- [ ] **Step 3: Bölümü yukarıdaki sözleşmeye göre yaz.**

- [ ] **Step 4: Testlerin geçtiğini gör** — Run: `npm test` · Expected: PASS (axe dahil: her süzgeç renginde yazı karşıtlığı yeterli).

- [ ] **Step 5: Gözle doğrula** — 1280 ve 375'te her süzgece bas. Beklenen: zemin rengi ve yazı rengi birlikte değişir, hiçbir zeminde okunmayan yazı yok; kartlar üst üste binmeden yer değiştirir; büyük görsel ekrana sığar.

- [ ] **Step 6: Commit** (izin varsa) — `Şenlik 4: süsler, stand galerisi ve süzgeç`

---

### Görev 5: Kule stand

**Files:**
- Create: `src/bolumler/KuleStand.tsx`, `src/bolumler/kule.css`, `tools/test/tests/kule.spec.mjs`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `KULE`, `standGorseli('kule-stand', 'kesik')` (471×1040), `WaDugme`, `useHareketli`.
- Produces (sayfa):

```
section#kule.kule[data-kat]         canlıyken "0".."3" (0 = Üst kat); değilken nitelik yok
  h2 · p · WaDugme mesaj="kule"
  div.kule-resim[data-kuruldu]      açılma bitince "true"
    img[data-hareket] · span.kule-isaret[aria-hidden]   (--ust ve --alt: etkin katın bandı, % olarak)
  ol.kule-katlar > li[data-etkin] (h3 + p) × 4
```

Kurallar:
- Zemin mürekkep, yazı beyaz. Bölüm sabitlenmez.
- Kule, bölüm ekrana girerken alttan yukarı dört adımda `clip-path` ile açılır (kat bantlarının sınırlarında durarak).
- Etkin kat kaydırmayla Üst kattan Alt kata ilerler: `useScroll({ target, offset: ['start 0.4', 'end 0.6'] })`, dört eşit dilim. Bir satırın üzerine gelmek ya da dokunmak o katı etkin yapar; imleç satırdan çıkınca kaydırmanın gösterdiği kata dönülür.
- İşaret, etkin katın bandını fotoğrafın üstünde çerçeveler (`top` = `--ust`%, `height` = `--alt − --ust`%); katlar arasında `transform` ile kayar.
- Canlı değilken: fotoğraf tam, dört satır tam görünür, işaret gizli.

- [ ] **Step 1: Testi yaz** — `tools/test/tests/kule.spec.mjs`

```js
import { test, expect, ac, hamHtml, hareketVar, kaydir, telefon, waAdresi } from './yardimci.mjs'

test('kule kaydırınca tamamen kurulur, katlar sırayla vurgulanır', async ({ page }) => {
  test.skip(!hareketVar(), 'yalnızca hareket açıkken')
  await ac(page)
  const { ust, boy } = await page.locator('#kule').evaluate(b => ({ ust: b.getBoundingClientRect().top + window.scrollY, boy: b.offsetHeight }))
  const ekran = page.viewportSize().height, gorulen = []
  for (let y = ust - ekran; y <= ust + boy; y += 40) {
    await page.evaluate(y => window.scrollTo(0, y), y)
    await page.waitForTimeout(30)
    const kat = await page.locator('#kule').getAttribute('data-kat')
    if (kat !== null && gorulen.at(-1) !== kat) gorulen.push(kat)
  }
  expect(gorulen).toEqual(['0', '1', '2', '3'])
  await expect(page.locator('.kule-resim')).toHaveAttribute('data-kuruldu', 'true')
  await expect(page.locator('.kule-katlar li[data-etkin="true"]')).toHaveCount(1)
})

test('kat satırına gelince o kat vurgulanır', async ({ page }) => {
  test.skip(!hareketVar() || telefon(), 'fare yalnızca masaüstünde')
  await ac(page); await kaydir(page, '.kule-katlar', 0.3)
  const satir = page.locator('.kule-katlar li').nth(2)
  await satir.hover()
  await expect(page.locator('#kule')).toHaveAttribute('data-kat', '2')
  await expect(satir).toHaveAttribute('data-etkin', 'true')
  await expect.poll(async () => {
    const r = await page.locator('.kule-resim img').boundingBox(), i = await page.locator('.kule-isaret').boundingBox()
    return Math.round(((i.y - r.y) / r.height) * 100)
  }).toBeGreaterThanOrEqual(51)
})

test('hareket yokken kule tam görünür, dört kat okunur', async ({ page }) => {
  test.skip(hareketVar(), 'yalnızca hareketsiz ve JavaScript\'siz projelerde')
  await ac(page)
  await expect(page.locator('#kule')).not.toHaveAttribute('data-kat', /./)
  await expect(page.locator('.kule-isaret')).toBeHidden()
  await expect(page.locator('.kule-katlar li h3')).toHaveText(['Üst kat', 'İkinci kat', 'Üçüncü kat', 'Alt kat'])
  for (const satir of await page.locator('.kule-katlar li').all()) await expect(satir).toHaveCSS('opacity', '1')
})

test('kule düğmesi kendi mesajını taşır', async ({ page }) => {
  await ac(page)
  await expect(page.locator('#kule').getByRole('link', { name: 'Kule stand için bilgi alın' })).toHaveAttribute('href', waAdresi('Merhaba, kule stand hakkında bilgi almak istiyorum.'))
})

test('kule bölümü hazır HTML\'de var', async ({ request }) => {
  const html = await hamHtml(request)
  for (const metin of ['Kule stand', 'Tezgâhta yer yoksa kule stand yere konur', 'Karakterli çocuk süsleri.']) expect(html).toContain(metin)
})
```

- [ ] **Step 2: Testin düştüğünü gör** — Run: `npm run build` · `npm --prefix tools/test test -- tests/kule.spec.mjs` · Expected: FAIL — `#kule` yok.
- [ ] **Step 3: Bölümü yukarıdaki sözleşmeye göre yaz.**
- [ ] **Step 4: Testlerin geçtiğini gör** — Run: `npm test` · Expected: PASS.
- [ ] **Step 5: Gözle doğrula** — 1280 ve 375'te bölümü kaydır. Beklenen: işaret her katta fotoğraftaki doğru rafları çerçeveler (kaymışsa `KULE.katlar[].bant` değerlerini ve birim testini birlikte düzelt); 375'te fotoğraf ile liste üst üste binmez.
- [ ] **Step 6: Commit** (izin varsa) — `Şenlik 5: kule stand`

---

### Görev 6: Atölyeden vitrine

**Files:**
- Create: `src/bolumler/Uretim.tsx`, `src/bolumler/uretim.css`, `tools/test/tests/uretim.spec.mjs`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `URETIM`, `VIDEOLAR.uv`, `Video`, `useHareketli`.
- Produces (sayfa):

```
section#uretim.uretim
  h2 · p
  div.uretim-yol
    span.uretim-cizgi[aria-hidden][data-hareket]      canlıyken scaleX (900 px ve üstü) ya da scaleY (altı), 0 → 1
    ol.uretim-adimlar > li[data-yandi] (h3 + p) × 4   sunucuda hepsi "true"
  figure.video (UV baskı videosu, dikey; yolun altında, en çok 70svh yüksekliğinde)
```

Kurallar: zemin beyaz, yazı mürekkep. Çizgi kalın ve mürekkep renklidir; ulaştığı adımın numara dairesi güneş sarısına döner ("yanar"). Video her genişlikte yolun altında durur (çizginin sonuna kadar kaydırılabilmesi için yolun altında içerik gerekir). İlerleme `useScroll({ target: yol, offset: ['start 0.8', 'end 0.6'] })`; adım *i*, ilerleme `i / 3 − 0,02`'yi geçince yanar. Canlı değilken dört adım yanık, çizgi tam. Adımlar numaralı `ol`'dür (gerçekten sıralı).

- [ ] **Step 1: Testi yaz** — `tools/test/tests/uretim.spec.mjs`

```js
import { test, expect, ac, hamHtml, hareketVar, jsVar, kaydir, telefon } from './yardimci.mjs'

const yanik = page => page.locator('.uretim-adimlar li[data-yandi="true"]')

test('atölye çizgisi sonuna kadar çizilir, dört adım sırayla yanar', async ({ page }) => {
  test.skip(!hareketVar(), 'yalnızca hareket açıkken')
  await ac(page)
  await kaydir(page, '.uretim-yol', 0.95)
  await expect.poll(() => yanik(page).count()).toBeLessThanOrEqual(1)
  await page.evaluate(() => { const r = document.querySelector('.uretim-yol').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.bottom - window.innerHeight * 0.45) })
  await expect(yanik(page)).toHaveCount(4)
})

test('çizgi masaüstünde yatay, telefonda dikeydir', async ({ page }) => {
  await ac(page)
  await page.evaluate(() => { const r = document.querySelector('.uretim-yol').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.bottom - window.innerHeight * 0.45) })
  if (hareketVar()) await expect(yanik(page)).toHaveCount(4)
  const kutu = await page.locator('.uretim-cizgi').boundingBox()
  telefon() ? expect(kutu.height).toBeGreaterThan(kutu.width) : expect(kutu.width).toBeGreaterThan(kutu.height)
})

test('hareket yokken dört adım yanık durur', async ({ page }) => {
  test.skip(hareketVar(), 'yalnızca hareketsiz ve JavaScript\'siz projelerde')
  await ac(page)
  await expect(yanik(page)).toHaveCount(4)
  await expect(page.locator('.uretim-adimlar h3')).toHaveText(['UV baskı', 'Kesim', 'Standa dizme', 'Paketleme ve gönderim'])
})

test('UV baskı videosu dikeydir ve görününce oynar', async ({ page }) => {
  const video = page.locator('video[aria-label="UV baskı videosu"]')
  await ac(page)
  await expect(video).toHaveAttribute('width', '404'); await expect(video).toHaveAttribute('height', '720')
  if (!hareketVar()) { if (!jsVar()) await expect(video).toHaveAttribute('controls', ''); return }
  await video.scrollIntoViewIfNeeded()
  await expect.poll(() => video.evaluate(v => v.paused)).toBe(false)
})

test('üretim bölümü hazır HTML\'de var', async ({ request }) => {
  const html = await hamHtml(request)
  for (const metin of ['Atölyeden vitrine', 'Baskı da kesim de kendi atölyemizde yapılır.', 'Paketleme ve gönderim']) expect(html).toContain(metin)
})
```

- [ ] **Step 2: Testin düştüğünü gör** — Run: `npm run build` · `npm --prefix tools/test test -- tests/uretim.spec.mjs` · Expected: FAIL — `#uretim` yok.
- [ ] **Step 3: Bölümü yukarıdaki sözleşmeye göre yaz.**
- [ ] **Step 4: Testlerin geçtiğini gör** — Run: `npm test` · Expected: PASS.
- [ ] **Step 5: Gözle doğrula** — 1280 ve 375'te kaydır. Beklenen: çizgi adımların numara dairelerinin ortasından geçer; dikey video 375'te ekran yüksekliğini aşmaz.
- [ ] **Step 6: Commit** (izin varsa) — `Şenlik 6: atölyeden vitrine`

---

### Görev 7: İletişim ve alt bilgi

**Files:**
- Create: `src/bolumler/Iletisim.tsx`, `src/bolumler/AltBilgi.tsx`, `src/bolumler/iletisim.css`, `tools/test/tests/iletisim.spec.mjs`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `ILETISIM`, `SUSLER` (sekizi), `SUZGECLER`, `MENU`, `SITE`, `KayanSerit`, `SusCikartma`, `WaDugme`, `useHareketli`.
- Produces (sayfa):

```
KayanSerit (sayfadaki ikinci ve son şerit; #iletisim'in hemen üstünde)
section#iletisim.iletisim
  p.iletisim-ust "Kutlamaya hazır mısınız?" · h2 · p · WaDugme mesaj="fiyat" tur="gunes" buyuk
  SusCikartma × 8
  dl.iletisim-kart.cikartma   Telefon, WhatsApp, E-posta, Instagram, Facebook, Adres (dt + dd; bağlantılar ILETISIM'den)
footer.alt   logo (logo-160.webp, beyaz halkada) · "© 2026 Avrasya Toptan Pasta Süsleri" · nav[aria-label="Alt menü"] (MENU)
```

Kurallar: zemin kobalt, alt bilgi mürekkep. "Kutlamaya hazır mısınız?" normal yazımlı bir satırdır (büyük harfli etiket değil). Masaüstünde sekiz süs başlığın çevresinde; 720 px altında dördü görünür ve başlığa, düğmeye, karta binmez. Büyük düğmenin üzerine gelince (yalnızca `useHareketli()` iken) süsler bir kez kısaca kıpırdar. Instagram ve Facebook bağlantıları yeni sekmede açılır.

- [ ] **Step 1: Testi yaz** — `tools/test/tests/iletisim.spec.mjs`

```js
import { test, expect, ac, hamHtml, hareketVar, kaydir, telefon, waAdresi } from './yardimci.mjs'

const kesisir = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

test('iletişim kartı bilgileri doğru bağlantılarla verir', async ({ page }) => {
  await ac(page)
  const kart = page.locator('.iletisim-kart')
  const beklenen = [['+90 530 665 63 73', 'tel:+905306656373'], ['mustafa.kuscu@avrasyasus.com.tr', 'mailto:mustafa.kuscu@avrasyasus.com.tr'], ['@avrasyapastasusleri34', 'https://www.instagram.com/avrasyapastasusleri34/'], ['Avrasya Pastasüsleri', 'https://www.facebook.com/profile.php?id=61595280272926']]
  for (const [yazi, href] of beklenen) await expect(kart.locator(`a[href="${href}"]`)).toHaveText(yazi)
  await expect(kart.locator('a[href="https://wa.me/905306656373"]')).toHaveText('+90 530 665 63 73')
  await expect(kart.locator('dt')).toHaveText(['Telefon', 'WhatsApp', 'E-posta', 'Instagram', 'Facebook', 'Adres'])
  for (const satir of ['Orta Mahalle, Maltepe Caddesi', 'Çağlayan Alba Sanayi Sitesi', 'B Blok No: 12/B F', 'Bayrampaşa / İstanbul']) await expect(kart).toContainText(satir)
})

test('büyük WhatsApp düğmesi fiyat mesajını taşır', async ({ page }) => {
  await ac(page)
  await expect(page.locator('#iletisim h2')).toHaveText('Stand için fiyat alın')
  await expect(page.locator('#iletisim').getByRole('link', { name: 'WhatsApp’tan yazın' })).toHaveAttribute('href', waAdresi('Merhaba, pastanem için süs standı fiyatı almak istiyorum.'))
})

test('masaüstünde sekiz, telefonda dört süs görünür ve yazıya binmez', async ({ page }) => {
  await ac(page); await kaydir(page, '#iletisim', 0.1)
  if (hareketVar()) await page.waitForTimeout(1500)
  const susler = page.locator('#iletisim [data-sus]:visible')
  await expect(susler).toHaveCount(telefon() ? 4 : 8)
  if (!telefon()) return
  for (const secici of ['#iletisim h2', '#iletisim .dugme', '.iletisim-kart']) {
    const kutu = await page.locator(secici).first().boundingBox()
    for (const s of await susler.all()) expect(kesisir(await s.boundingBox(), kutu), secici).toBe(false)
  }
})

test('sayfada tam iki kayan şerit var', async ({ page }) => {
  await ac(page)
  await expect(page.locator('.kayan-serit')).toHaveCount(2)
})

test('alt bilgi telif satırını ve beş bölüm bağlantısını taşır', async ({ page }) => {
  await ac(page)
  await expect(page.locator('footer.alt')).toContainText('© 2026 Avrasya Toptan Pasta Süsleri')
  const hedefler = await page.locator('footer.alt nav a').evaluateAll(a => a.map(x => x.getAttribute('href')))
  expect(hedefler).toEqual(['#stand', '#urunler', '#kule', '#uretim', '#iletisim'])
})

test('iletişim bölümü hazır HTML\'de var', async ({ request }) => {
  const html = await hamHtml(request)
  for (const metin of ['Kutlamaya hazır mısınız?', 'Stand fiyatı ve içeriği için WhatsApp’tan yazın ya da arayın.', 'Bayrampaşa']) expect(html).toContain(metin)
})
```

- [ ] **Step 2: Testin düştüğünü gör** — Run: `npm run build` · `npm --prefix tools/test test -- tests/iletisim.spec.mjs` · Expected: FAIL — `#iletisim` yok.
- [ ] **Step 3: Bölümü ve alt bilgiyi yukarıdaki sözleşmeye göre yaz.**
- [ ] **Step 4: Testlerin geçtiğini gör** — Run: `npm test` · Expected: PASS.
- [ ] **Step 5: Gözle doğrula** — 1280 ve 375'te. Beklenen: sayfa başladığı renkle biter; kart okunaklı; süsler başlığı ve düğmeyi kapatmaz.
- [ ] **Step 6: Commit** (izin varsa) — `Şenlik 7: iletişim ve alt bilgi`

---

### Görev 8: Üst çubuk ve telefon menüsü

**Files:**
- Create: `src/bolumler/UstCubuk.tsx`, `src/bolumler/ust-cubuk.css`, `tools/test/tests/ust-cubuk.spec.mjs`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `MENU`, `SITE`, `ILETISIM.cta` (WhatsApp düğmesinin yazısı), `WaDugme`.
- Produces (sayfa):

```
header.ust[data-yuzen]              "false" (açılışın üstünde, şeffaf) | "true" (beyaz, sert gölgeli, yüzen hap)
  a.ust-marka[href="#acilis"] (logo-160.webp + SITE.ad) · nav.ust-menu[aria-label="Ana menü"] (MENU)
  WaDugme mesaj="ust" tur="beyaz" "WhatsApp’tan yazın" · button.ust-menu-dugme.js-gerek[aria-haspopup="dialog"] "Menü"
dialog.menu-ortu[aria-label="Menü"][data-lenis-prevent]   nav (MENU, büyük yazı) · button "Kapat"
```

Kurallar:
- `.ust` JavaScript yokken `position: absolute`, `html.js` altında `position: fixed`. Kaydırma açılışın yüksekliğinden 80 px eksiğini geçince `data-yuzen="true"`.
- 960 px ve altında `.ust-menu` gizlenir, marka adı gizlenir (logo kalır), "Menü" düğmesi görünür. WhatsApp düğmesi her genişlikte görünür.
- Menü `showModal()` ile açılan tam ekran kobalt örtüdür: odak içinde kalır, Esc kapatır, kapanınca odak "Menü" düğmesine döner. Bağlantıya basınca örtü kapanır ve sayfa o bölüme gider. Bağlantılar sırayla belirir (`data-hareket`). Örtünün içeriği `overflow-y: auto` ile kaydırılabilir.
- Bölümlere `scroll-margin-top` verilmez; her bölümün üst boşluğu, başlığı yüzen hapın altında bırakmayacak kadardır.

- [ ] **Step 1: Testi yaz** — `tools/test/tests/ust-cubuk.spec.mjs`

```js
import { test, expect, ac, jsVar, proje, telefon, waAdresi } from './yardimci.mjs'

const ekranda = (page, secici) => page.locator(secici).evaluate(o => { const r = o.getBoundingClientRect(); return r.top > -60 && r.top < window.innerHeight / 2 })

test('üst çubuk açılıştan sonra yüzen hapa dönüşür', async ({ page }) => {
  test.skip(!jsVar(), 'yüzen çubuk JavaScript ister')
  await ac(page)
  await expect(page.locator('header.ust')).toHaveAttribute('data-yuzen', 'false')
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.3))
  await expect(page.locator('header.ust')).toHaveAttribute('data-yuzen', 'true')
  await expect(page.locator('header.ust')).toHaveCSS('position', 'fixed')
  await expect(page.locator('header.ust')).toBeInViewport()
})

test('WhatsApp düğmesi her genişlikte üst çubukta görünür', async ({ page }) => {
  const genislikler = proje() === 'masaustu' ? [375, 768, 1440] : [page.viewportSize().width]
  for (const en of genislikler) {
    await page.setViewportSize({ width: en, height: page.viewportSize().height })
    await ac(page)
    const dugme = page.locator('header.ust').getByRole('link', { name: 'WhatsApp’tan yazın' })
    await expect(dugme).toBeVisible()
    await expect(dugme).toHaveAttribute('href', waAdresi('Merhaba, pastanem için süs standı hakkında bilgi almak istiyorum.'))
  }
})

test('menü bağlantısı bölüme götürür', async ({ page }) => {
  test.skip(telefon(), 'geniş ekran menüsü')
  await ac(page)
  await page.locator('.ust-menu').getByRole('link', { name: 'Kule stand' }).click()
  await expect.poll(() => ekranda(page, '#kule')).toBe(true)
})

test('telefonda menü açılır, odak içinde kalır, Esc ve bağlantı kapatır', async ({ page }) => {
  test.skip(!telefon() || !jsVar(), 'menü düğmesi yalnızca telefonda ve JavaScript ile')
  await ac(page)
  const dugme = page.getByRole('button', { name: 'Menü' }), ortu = page.locator('dialog.menu-ortu')
  await dugme.click()
  await expect(ortu).toHaveAttribute('open', '')
  await expect(ortu.locator('nav a')).toHaveText(['Stand', 'Süsler', 'Kule stand', 'Üretim', 'İletişim'])
  for (let i = 0; i < 10; i++) { await page.keyboard.press('Tab'); expect(await page.evaluate(() => { const o = document.activeElement; return o === document.body || !!o.closest('dialog.menu-ortu') })).toBe(true) }
  await page.keyboard.press('Escape')
  await expect(ortu).not.toHaveAttribute('open', '')
  await expect(dugme).toBeFocused()
  await dugme.click()
  await ortu.getByRole('link', { name: 'İletişim' }).click()
  await expect(ortu).not.toHaveAttribute('open', '')
  await expect.poll(() => ekranda(page, '#iletisim')).toBe(true)
})

test('yatık telefonda menünün son bağlantısına ulaşılır', async ({ page }) => {
  test.skip(proje() !== 'telefon', 'bir kez yeterli')
  await page.setViewportSize({ width: 740, height: 360 })
  await ac(page)
  await page.getByRole('button', { name: 'Menü' }).click()
  const son = page.locator('dialog.menu-ortu nav a').last()
  await son.scrollIntoViewIfNeeded()
  await expect(son).toBeInViewport()
})

test('bölüm bağlantısıyla açılan sayfa o bölümde kalır', async ({ page }) => {
  await ac(page, '/#iletisim')
  await page.waitForTimeout(1200)
  expect(await ekranda(page, '#iletisim')).toBe(true)
})

test('JavaScript kapalıyken menü düğmesi gizli, alt menü yerinde', async ({ page }) => {
  test.skip(jsVar(), 'yalnızca JavaScript\'siz projede')
  await ac(page)
  await expect(page.locator('.ust-menu-dugme')).toBeHidden()
  await expect(page.locator('header.ust')).toHaveCSS('position', 'absolute')
  await expect(page.locator('footer.alt nav a')).toHaveCount(5)
})
```

- [ ] **Step 2: Testin düştüğünü gör** — Run: `npm run build` · `npm --prefix tools/test test -- tests/ust-cubuk.spec.mjs` · Expected: FAIL — `header.ust` yok.
- [ ] **Step 3: Üst çubuğu ve menüyü yukarıdaki sözleşmeye göre yaz.** Açılışın üst boşluğu çubuğa göre ayarlanır.
- [ ] **Step 4: Testlerin geçtiğini gör** — Run: `npm test` · Expected: PASS ("ilk Tab" testi dahil: atlama bağlantısı üst çubuktan önce gelir).
- [ ] **Step 5: Gözle doğrula** — 1280, 980 ve 375'te her bölümün üstünde çubuğa bak. Beklenen: hap her zemin renginde okunur; hiçbir genişlikte çubuk öğeleri alt satıra kırılmaz ya da taşmaz; menü bağlantısıyla gidilen bölümün başlığı hapın altında kalmaz.
- [ ] **Step 6: Commit** (izin varsa) — `Şenlik 8: üst çubuk ve telefon menüsü`

---

### Görev 9: Yayına hazırlık — paylaşım görseli, ölçüm, belgeler, temizlik

**Files:**
- Create: `tools/test/paylasim-gorseli.mjs`, `tools/test/paylasim-sablon.html`, `public/assets/img/paylasim.jpg` (üretilir)
- Modify: `index.html`, `tools/test/package.json` (`"paylasim": "node paylasim-gorseli.mjs"`), `tools/test/lighthouse.mjs`, `tools/test/tests/genel.spec.mjs`, `tools/test/RAPOR.md`, `README.md`
- Delete: `src/taslaklar/`, `eski-site/`, `PLAN.md`, `public/assets/img/og.jpg`, `public/assets/svg/` içinde kaynak kodun kullanmadığı dosyalar ve bunları üreten `tools/svg/`

**Interfaces:**
- Consumes: bütün önceki görevler.
- Produces: `/assets/img/paylasim.jpg` (1200×630); `og:image` ve JSON-LD `image` bu dosyayı gösterir.

- [ ] **Step 1: Paylaşım görseli testini ekle** — `tools/test/tests/genel.spec.mjs` sonuna

```js
test('paylaşım görseli 1200×630 ve sayfa başı onu gösterir', async ({ page }) => {
  test.skip(proje() !== 'masaustu', 'bir kez yeterli')
  await ac(page)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://www.avrasyasus.com.tr/assets/img/paylasim.jpg')
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#2340FF')
  expect(JSON.parse(await page.locator('script[type="application/ld+json"]').textContent()).image).toBe('https://www.avrasyasus.com.tr/assets/img/paylasim.jpg')
  const boyut = await page.evaluate(() => new Promise(bitti => { const g = new Image(); g.onload = () => bitti([g.naturalWidth, g.naturalHeight]); g.src = '/assets/img/paylasim.jpg' }))
  expect(boyut).toEqual([1200, 630])
})
```

- [ ] **Step 2: Testin düştüğünü gör** — Run: `npm run build` · `npm --prefix tools/test test -- tests/genel.spec.mjs` · Expected: FAIL — `og:image` hâlâ `og.jpg`.

- [ ] **Step 3: Paylaşım görselini üret**

`tools/test/paylasim-sablon.html`: 1200×630, kobalt zemin; solda logo ve "Avrasya Toptan Pasta Süsleri", altında üç satırlık başlık (beyaz, 800); sağda iki stand kesiği (`stand-cocuk-karakter-kesik`, `stand-kadin-kesik`) ve üç süs çıkartması eğik; altta sarı şerit. Görseller `../../public/assets/…`, yazı tipi `../../node_modules/@fontsource-variable/bricolage-grotesque/files/` içindeki `latin` ve `latin-ext` dosyalarından `@font-face` ile yüklenir.
`tools/test/paylasim-gorseli.mjs`: `@playwright/test`'in `chromium`'unu `channel: 'chrome'` ile açar, şablonu `file://` adresiyle 1200×630 ekranda yükler, yazı tipleri ve görseller yüklendikten sonra `public/assets/img/paylasim.jpg` olarak (`type: 'jpeg'`, `quality: 86`) kaydeder.

Run: `npm --prefix tools/test run paylasim`
Expected: dosya oluşur. Görsele bakarak doğrula: yazılar kesilmiyor, Türkçe harfler doğru, WhatsApp'ın kare kırpmasında (ortadaki 630×630) firma adı okunuyor.

- [ ] **Step 4: Sayfa başını güncelle** — `index.html`: `og:image` → `…/assets/img/paylasim.jpg`, `og:image:height` → `630`, JSON-LD `image` → aynı adres. `public/sitemap.xml`'e dokunulmaz.

- [ ] **Step 5: Temizlik** — "Delete" listesindekileri sil; `git grep -n --untracked -E "taslaklar|eski-site|og\.jpg|assets/svg" -- src index.html tools ":(exclude)tools/test/RAPOR.md"` çıktısı boş olmalı (`RAPOR.md` Step 8'de yeniden yazılır).

- [ ] **Step 6: Bütün testleri çalıştır** — Run: `npm test` · Expected: birim ve beş projedeki bütün tarayıcı testleri PASS.

- [ ] **Step 7: Lighthouse ölçümü**

`tools/test/lighthouse.mjs`: kök `../../dist` olur; "tekrar ziyaret" koşusu ve açılış perdesiyle ilgili açıklama kalkar (her tur tek ölçüm; üç tur; ortanca tutulur).
Run: `npm run lighthouse`
Expected (telefon): Erişilebilirlik, En İyi Uygulamalar, SEO ≥ 95; Performans ≥ 85. Altında kalan olursa `eksikler` listesindeki ilk kalemlerden başlayarak düzelt ve yeniden ölç; düzelmeyen kalırsa nedeniyle birlikte rapora yaz. Performans düşükse ilk bakılacak yer en büyük öğenin (açılış başlığı ya da açılıştaki stand görseli) ilk boyamada görünür olmasıdır: başlık opaklıkla gizlenmemeli, açılış görseli `fetchpriority="high"` taşımalı ve `loading="lazy"` olmamalıdır.

- [ ] **Step 8: Belgeler**

`tools/test/RAPOR.md`: test sayıları ve Lighthouse sonuçlarıyla yeniden yazılır.
`README.md` yeni siteyi anlatır: yerelde açma (`npm install`, `npm run dev`); derleme (`npm run build` → `dist/`); yayına alma (`sitemap.xml` içindeki tarihi yayın gününe çek, yeniden derle, `dist/` içindekileri barındırmaya yükle); içerik güncelleme (`src/icerik.ts`; yeni stand = üç görsel + `STANDLAR`'a bir satır + birim testindeki sayılar); testler (`npm --prefix tools/test ci` bir kez, `npm test`, `npm run lighthouse`); paylaşım görselini yeniden üretme.

- [ ] **Step 9: Son gözle doğrulama** — `npm run build`, ardından `npm run preview` (derlenmiş `dist/`'i sunar) ile 1280 ve 375 genişlikte sayfayı baştan sona gez. Beklenen: tasarım belgesi bölüm 8'deki her bölüm yerinde ve sırasında; bölüm 4'teki başarısızlık durumlarının hiçbiri yok; konsol temiz.

- [ ] **Step 10: Commit** (izin varsa) — `Şenlik 9: paylaşım görseli, ölçüm, belgeler ve temizlik`
