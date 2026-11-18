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

test('küçük telefonda sahne sabitlenmez; resim küçülmez', async ({ page }) => {
  test.skip(proje() !== 'masaustu', 'bir kez yeterli')
  await page.setViewportSize({ width: 375, height: 667 })
  await ac(page)
  await expect(page.locator('.sahne-yapiskan')).not.toHaveCSS('position', 'sticky')
  await expect(page.locator('.sahne')).not.toHaveAttribute('data-adim', /./)
  expect((await page.locator('.sahne-resim').boundingBox()).width).toBeGreaterThan(300)
  await expect(page.locator('.sahne-eylem')).toHaveCSS('opacity', '1')
})

test('yazı büyüyüp sahneye sığmayınca sabitleme kalkar', async ({ page }) => {
  test.skip(proje() !== 'masaustu', 'bir kez yeterli')
  await ac(page)
  await expect(page.locator('.sahne-yapiskan')).toHaveCSS('position', 'sticky')
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  await expect(page.locator('.sahne-yapiskan')).not.toHaveCSS('position', 'sticky')
  await expect(page.locator('.sahne-eylem')).toHaveCSS('opacity', '1')
})

test('sabit sahnede yazı ve düğme ekranın içinde kalır', async ({ page }) => {
  test.skip(!hareketVar(), 'sabitleme yalnızca hareket açıkken')
  await ac(page)
  await sonaKaydir(page)
  await expect(page.locator('.sahne')).toHaveAttribute('data-adim', '3')
  const dugme = await page.locator('.sahne-eylem a').boundingBox(), ekran = page.viewportSize()
  expect(dugme.y + dugme.height).toBeLessThanOrEqual(ekran.height)
  expect((await page.locator('.sahne-resim').boundingBox()).height).toBeGreaterThan(200)
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
