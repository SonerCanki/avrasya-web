// Sayfanın bütününe dair testler: yana taşma, hazır HTML, son hâl kuralı, adresler, erişilebilirlik.
import AxeBuilder from '@axe-core/playwright'
import { test, expect, ac, hamHtml, hareketVar, jsVar, proje, yanaTasma, kesilenler } from './yardimci.mjs'

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

test('site betiği takılıp kalırsa içerik yine görünür', async ({ page, sorunlar }) => {
  test.skip(proje() !== 'masaustu', 'bir kez yeterli')
  // Betik isteği hiç yanıtlanmaz: ne yüklenir ne de hata verir.
  await page.route('**/assets/*.js', () => {})
  await page.goto('/', { waitUntil: 'commit' })
  await expect(page.locator('h1')).toBeVisible()
  // Açılış girişi betiğe bağlı değildir; kendi kendine biter.
  for (const secici of ['.acilis-aciklama', '.acilis-eylem']) await expect(page.locator(secici)).toHaveCSS('opacity', '1')
  // Sayfa bir süre bekler, sonra hareketsiz son hâline geçer.
  await expect(page.locator('html')).not.toHaveClass(/js|hareketli/, { timeout: 10_000 })
  for (const oge of await page.locator('[data-hareket]').all()) await expect(oge).toHaveCSS('opacity', '1')
  await expect(page.locator('.sahne-yapiskan')).not.toHaveCSS('position', 'sticky')
  sorunlar.length = 0 // yarıda kalan betik isteği bu testte beklenen tek sorundur
})

test('başlıklar ve düğmeler hiçbir genişlikte kesilmez', async ({ page }) => {
  test.skip(proje() !== 'masaustu', 'genişlikler testin içinde denenir')
  for (const genislik of [320, 375, 740, 1280]) {
    await page.setViewportSize({ width: genislik, height: 800 })
    await ac(page)
    expect(await kesilenler(page), `genişlik ${genislik}`).toEqual([])
  }
})

test('yazı boyutu iki katına çıkınca yana taşma olmaz', async ({ page }) => {
  test.skip(!jsVar(), 'yazı boyutunu sayfada değiştirmek betik ister')
  await ac(page)
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  const boy = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= boy; y += 600) { await page.evaluate(y => window.scrollTo(0, y), y); expect(await yanaTasma(page), `y=${y}`).toBe(0) }
  expect(await kesilenler(page)).toEqual([])
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
  const adres = 'https://avrasyasus.com/'
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
  // Açılışın giriş hareketi sürerken yazı yarı saydamdır; ölçüm yazı yerine oturduktan sonra yapılır.
  for (const secici of ['.acilis-aciklama', '.acilis-eylem']) await expect(page.locator(secici)).toHaveCSS('opacity', '1')
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations.filter(v => ['serious', 'critical'].includes(v.impact)).map(v => `${v.id}: ${v.nodes.length}`)).toEqual([])
})

test('paylaşım görseli 1200×630 ve sayfa başı onu gösterir', async ({ page }) => {
  test.skip(proje() !== 'masaustu', 'bir kez yeterli')
  await ac(page)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://avrasyasus.com/assets/img/paylasim.jpg')
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#2340FF')
  expect(JSON.parse(await page.locator('script[type="application/ld+json"]').textContent()).image).toBe('https://avrasyasus.com/assets/img/paylasim.jpg')
  const boyut = await page.evaluate(() => new Promise(bitti => { const g = new Image(); g.onload = () => bitti([g.naturalWidth, g.naturalHeight]); g.src = '/assets/img/paylasim.jpg' }))
  expect(boyut).toEqual([1200, 630])
})
