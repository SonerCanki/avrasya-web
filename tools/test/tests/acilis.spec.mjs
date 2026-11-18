// Açılış bölümü: başlık, iki eylem, süs çıkartmaları, kayan şerit.
import { test, expect, ac, hamHtml, hareketVar, jsVar, telefon, waAdresi } from './yardimci.mjs'

const kesisir = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

test('açılış başlığı ve iki eylemi doğru yere gider', async ({ page }) => {
  await ac(page)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('#acilis h1')).toHaveText(/Pastaneniz için\s*süslerle dolu\s*teşhir standı/)
  // Sürükleme ipucu yazısı kaldırıldı (kullanıcı isteği); sürüklemenin kendisi duruyor.
  await expect(page.locator('#acilis')).not.toContainText('sürükleyebilirsiniz')
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
