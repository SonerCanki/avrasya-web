// 6. bölüm — Stand için fiyat alın: ikinci kayan şerit, süsler, iletişim kartı ve alt bilgi.
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

test('Instagram ve Facebook yeni sekmede açılır', async ({ page }) => {
  await ac(page)
  for (const adres of ['https://www.instagram.com/avrasyapastasusleri34/', 'https://www.facebook.com/profile.php?id=61595280272926']) {
    const baglanti = page.locator(`.iletisim-kart a[href="${adres}"]`)
    await expect(baglanti).toHaveAttribute('target', '_blank')
    await expect(baglanti).toHaveAttribute('rel', /noopener/)
  }
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

test('büyük düğmenin üzerine gelince süsler bir kez kıpırdar', async ({ page }) => {
  test.skip(!hareketVar() || telefon(), 'yalnızca hareket açıkken ve fareyle')
  await ac(page); await kaydir(page, '#iletisim', 0.1)
  const bolum = page.locator('#iletisim')
  await expect(bolum).not.toHaveAttribute('data-kipirti', '')
  await bolum.locator('.dugme').hover()
  await expect(bolum).toHaveAttribute('data-kipirti', '')
  // Kıpırtı bir kez oynar ve biter; fare düğmenin üzerinde dursa da yinelenmez.
  await expect(bolum).not.toHaveAttribute('data-kipirti', '')
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
