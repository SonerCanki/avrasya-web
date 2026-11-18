// 4. bölüm — Kule stand: açılma, kat vurgusu, hareketsiz hâl.
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
  // Kurulunca resim kırpılmadan durur, işaret görünür.
  await expect(page.locator('.kule-resim img')).toHaveCSS('clip-path', 'none')
  await expect(page.locator('.kule-isaret')).toHaveCSS('opacity', '1')
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
  }).toBeGreaterThanOrEqual(49)
})

test('hareket yokken kule tam görünür, dört kat okunur', async ({ page }) => {
  test.skip(hareketVar(), 'yalnızca hareketsiz ve JavaScript kapalı projelerde')
  await ac(page)
  await expect(page.locator('#kule')).not.toHaveAttribute('data-kat', /./)
  await expect(page.locator('.kule-isaret')).toBeHidden()
  await expect(page.locator('.kule-katlar li h3')).toHaveText(['Üst kat', 'İkinci kat', 'Üçüncü kat', 'Alt kat'])
  for (const satir of await page.locator('.kule-katlar li').all()) await expect(satir).toHaveCSS('opacity', '1')
  await expect(page.locator('.kule-resim img')).toHaveCSS('clip-path', 'none')
})

test('kule resmi yüklenir; telefonda kat listesiyle üst üste binmez', async ({ page }) => {
  await ac(page)
  const resim = page.locator('.kule-resim img')
  await resim.scrollIntoViewIfNeeded()
  await expect.poll(() => resim.evaluate(r => r.complete && r.naturalWidth > 0)).toBe(true)
  const r = await resim.boundingBox(), l = await page.locator('.kule-katlar').boundingBox()
  expect(r.height).toBeGreaterThan(r.width)
  const ayri = r.x + r.width <= l.x || l.x + l.width <= r.x || r.y + r.height <= l.y || l.y + l.height <= r.y
  expect(ayri).toBe(true)
})

test('kule düğmesi kendi mesajını taşır', async ({ page }) => {
  await ac(page)
  await expect(page.locator('#kule').getByRole('link', { name: 'Kule stand için bilgi alın' })).toHaveAttribute('href', waAdresi('Merhaba, kule stand hakkında bilgi almak istiyorum.'))
})

test('kule bölümü hazır HTML’de var', async ({ request }) => {
  const html = await hamHtml(request)
  for (const metin of ['Kule stand', 'Tezgâhta yer yoksa kule stand yere konur', 'Karakterli çocuk süsleri.']) expect(html).toContain(metin)
})
