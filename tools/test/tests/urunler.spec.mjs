// 3. bölüm — Süsler ve standlar: süzgeç, galeri, büyük görsel.
import AxeBuilder from '@axe-core/playwright'
import { test, expect, ac, hamHtml, jsVar, kaydir, telefon, yanaTasma } from './yardimci.mjs'

// Süzgeç adı → [gösterdiği stand sayısı, bölümün alacağı zemin rengi]
const SUZGEC = { 'Tümü': [12, 'rgb(255, 61, 139)'], 'Çocuk': [2, 'rgb(0, 184, 196)'], 'Rakam': [6, 'rgb(255, 68, 56)'], 'Yazı': [9, 'rgb(180, 230, 29)'], 'Esprili': [2, 'rgb(255, 106, 26)'], 'Kadın': [1, 'rgb(225, 29, 116)'], 'Erkek': [1, 'rgb(36, 80, 245)'], 'Futbol': [1, 'rgb(15, 169, 88)'], 'Ayna': [4, 'rgb(122, 60, 255)'] }
const dugme = (page, ad) => page.locator('.suzgec').getByRole('button', { name: ad, exact: true })

test('süzgeç doğru sayıda stand gösterir ve zemini boyar', async ({ page }) => {
  test.skip(!jsVar(), 'süzgeç JavaScript ister')
  await ac(page); await kaydir(page, '.suzgec', 0.2)
  for (const [ad, [sayi, renk]] of Object.entries(SUZGEC)) {
    await dugme(page, ad).click()
    await expect(dugme(page, ad)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.suzgec [aria-pressed="true"]')).toHaveCount(1)
    await expect(page.locator('.galeri [data-stand]')).toHaveCount(sayi)
    // Sayı ekranda yazmaz; yalnızca ekran okuyucuya duyurulur.
    await expect(page.locator('.suzgec-sayi')).toHaveText(`${sayi} stand`)
    expect(await page.locator('.suzgec-sayi').evaluate(o => { const k = o.getBoundingClientRect(); return k.width <= 1 && k.height <= 1 })).toBe(true)
    await expect(page.locator('#urunler')).toHaveCSS('background-color', renk)
  }
})

test('her süzgeç renginde yazı karşıtlığı yeterli', async ({ page }) => {
  test.skip(!jsVar(), 'süzgeç JavaScript ister')
  await ac(page); await kaydir(page, '.suzgec', 0.2)
  for (const [ad, [sayi, renk]] of Object.entries(SUZGEC)) {
    await dugme(page, ad).click()
    // Zemin rengi ve kartların girişi bittikten sonra ölçülür.
    await expect(page.locator('#urunler')).toHaveCSS('background-color', renk)
    await expect(page.locator('.galeri [data-stand]')).toHaveCount(sayi)
    await expect(page.locator('.galeri [data-stand]').last()).toHaveCSS('opacity', '1')
    const { violations } = await new AxeBuilder({ page }).include('#urunler').withRules(['color-contrast']).analyze()
    expect(violations.map(v => `${ad}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)).toEqual([])
  }
})

test('telefonda seçilen süzgeç düğmesi sırada görünür yere kayar', async ({ page }) => {
  test.skip(!telefon() || !jsVar(), 'yalnızca telefonda, JavaScript ile')
  await ac(page); await kaydir(page, '.suzgec', 0.2)
  await expect(dugme(page, 'Ayna')).not.toBeInViewport({ ratio: 1 })
  // Playwright'ın tıklaması düğmeyi kendisi görünür yere getirir; burada tıklama sayfanın içinden verilir.
  await dugme(page, 'Ayna').evaluate(d => d.click())
  await expect(dugme(page, 'Ayna')).toHaveAttribute('aria-pressed', 'true')
  await expect(dugme(page, 'Ayna')).toBeInViewport({ ratio: 1 })
})

test('süzgece art arda hızlı basılınca son seçim kalır; kalan kart büyük görseli açar ve odak ona döner', async ({ page }) => {
  test.skip(!jsVar(), 'süzgeç JavaScript ister')
  await ac(page); await kaydir(page, '.suzgec', 0.2)
  for (const ad of ['Çocuk', 'Ayna', 'Yazı', 'Futbol']) await dugme(page, ad).click({ noWaitAfter: true })
  await expect(page.locator('.galeri [data-stand]')).toHaveCount(1)
  await expect(page.locator('.suzgec-sayi')).toHaveText('1 stand')
  await expect(page.locator('.galeri [data-stand] span')).toHaveText('Futbol')
  const kart = page.locator('.galeri [data-stand] a'), pencere = page.locator('dialog.buyuk-gorsel')
  await kart.click()
  await expect(pencere).toHaveAttribute('open', '')
  await expect(pencere.locator('img')).toHaveAttribute('src', /stand-futbol-1040\.webp$/)
  await expect(pencere.locator('p')).toHaveText('Futbol')
  await page.keyboard.press('Escape')
  await expect(pencere).not.toHaveAttribute('open', '')
  await expect(kart).toBeFocused()
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

test('büyük görsel ekrana sığar, açıkken arkadaki sayfa kaymaz', async ({ page }) => {
  test.skip(!jsVar(), 'büyük görsel JavaScript ister')
  await ac(page)
  const kart = page.locator('.galeri [data-stand] a').first(), pencere = page.locator('dialog.buyuk-gorsel')
  await kart.scrollIntoViewIfNeeded()
  await kart.click()
  await expect(pencere).toHaveAttribute('open', '')
  await expect(pencere.getByRole('button', { name: 'Kapat' })).toBeInViewport({ ratio: 1 })
  await expect(pencere.locator('img')).toBeInViewport({ ratio: 1 })
  await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden')
  if (telefon()) return
  // Karartının üstünde fare tekerleği çevrilince de sayfa yerinde kalır.
  const once = await page.evaluate(() => window.scrollY)
  await page.mouse.move(6, 6); await page.mouse.wheel(0, 500); await page.waitForTimeout(500)
  expect(await page.evaluate(() => window.scrollY)).toBe(once)
})

test('telefonda standlar yana kaydırılan tek sıradır', async ({ page }) => {
  test.skip(!telefon(), 'yalnızca telefonda')
  await ac(page); await kaydir(page, '.galeri', 0.2)
  const { tasan, tekSira } = await page.locator('.galeri').evaluate(g => ({ tasan: g.scrollWidth > g.clientWidth, tekSira: new Set([...g.children].map(k => k.offsetTop)).size === 1 }))
  expect(tasan).toBe(true); expect(tekSira).toBe(true)
  expect(await yanaTasma(page)).toBe(0)
})

test('JavaScript kapalıyken süzgeç gizli, on iki kart büyük görsele bağlanır', async ({ page }) => {
  test.skip(jsVar(), 'yalnızca JavaScript\'siz projede')
  await ac(page)
  await expect(page.locator('.suzgec')).toBeHidden()
  await expect(page.locator('.suzgec-sayi')).toBeHidden()
  await expect(page.locator('.galeri [data-stand] a[href$="-1040.webp"]')).toHaveCount(12)
})

test('süsler ve standlar hazır HTML\'de var', async ({ request }) => {
  const html = await hamHtml(request)
  for (const metin of ['Standdaki süsler', 'Ayna pleksi yazılar', 'Rakam süsleri', 'Baskılı pleksi süsler', 'Karakterli çocuk süsleri', 'Her konsepte ayrı stand', 'Çift katlı ayna yazılar']) expect(html).toContain(metin)
})
