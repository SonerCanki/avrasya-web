// 5. bölüm — Atölyeden vitrine: çizilen yol, yanan adımlar, UV baskı videosu.
import { test, expect, ac, hamHtml, hareketVar, jsVar, kaydir, telefon } from './yardimci.mjs'

const yanik = page => page.locator('.uretim-adimlar li[data-yandi="true"]')
/** Yolun alt kenarını ekranın %45'ine getirir: çizginin sonu geçilmiş olur. */
const yolunSonunaGit = page => page.evaluate(() => { const r = document.querySelector('.uretim-yol').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.bottom - window.innerHeight * 0.45) })

test('atölye çizgisi sonuna kadar çizilir, dört adım sırayla yanar', async ({ page }) => {
  test.skip(!hareketVar(), 'yalnızca hareket açıkken')
  await ac(page)
  await kaydir(page, '.uretim-yol', 0.95)
  await expect.poll(() => yanik(page).count()).toBeLessThanOrEqual(1)
  await yolunSonunaGit(page)
  await expect(yanik(page)).toHaveCount(4)
})

test('çizgi masaüstünde yatay, telefonda dikeydir', async ({ page }) => {
  await ac(page)
  await yolunSonunaGit(page)
  if (hareketVar()) await expect(yanik(page)).toHaveCount(4)
  const kutu = await page.locator('.uretim-cizgi').boundingBox()
  telefon() ? expect(kutu.height).toBeGreaterThan(kutu.width) : expect(kutu.width).toBeGreaterThan(kutu.height)
})

test('çizgi ilk numara dairesinin ortasından son dairenin ortasına uzanır', async ({ page }) => {
  await ac(page)
  await yolunSonunaGit(page)
  if (hareketVar()) await expect(yanik(page)).toHaveCount(4)
  // Çizginin iki ucu ile ilk ve son dairenin ortası arasındaki en büyük sapma (piksel); yan eksende daire ortası çizginin içinde mi.
  const olc = () => page.evaluate(dikey => {
    const kutu = o => o.getBoundingClientRect()
    const c = kutu(document.querySelector('.uretim-cizgi'))
    const orta = d => ({ x: d.left + d.width / 2, y: d.top + d.height / 2 })
    const daireler = [...document.querySelectorAll('.uretim-no')].map(d => orta(kutu(d)))
    const ilk = daireler[0], son = daireler.at(-1)
    return dikey
      ? { sapma: Math.max(Math.abs(c.top - ilk.y), Math.abs(c.bottom - son.y)), icinde: daireler.every(d => d.x >= c.left && d.x <= c.right) }
      : { sapma: Math.max(Math.abs(c.left - ilk.x), Math.abs(c.right - son.x)), icinde: daireler.every(d => d.y >= c.top && d.y <= c.bottom) }
  }, telefon())
  await expect.poll(async () => (await olc()).sapma).toBeLessThanOrEqual(3)
  expect((await olc()).icinde).toBe(true)
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

test('UV baskı videosu ekran yüksekliğini aşmaz', async ({ page }) => {
  await ac(page)
  const cerceve = page.locator('#uretim figure.video')
  await cerceve.scrollIntoViewIfNeeded()
  expect((await cerceve.boundingBox()).height).toBeLessThanOrEqual(page.viewportSize().height * 0.75)
})

test('üretim bölümü hazır HTML\'de var', async ({ request }) => {
  const html = await hamHtml(request)
  for (const metin of ['Atölyeden vitrine', 'Baskı da kesim de kendi atölyemizde yapılır.', 'Paketleme ve gönderim']) expect(html).toContain(metin)
})
