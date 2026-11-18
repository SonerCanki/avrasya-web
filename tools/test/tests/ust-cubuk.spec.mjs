// Üst çubuk ve telefon menüsü: açılışın üzerinde saydam, sonrasında yüzen beyaz hap; dar ekranda tam ekran menü.
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

test('üst çubuğun öğeleri hiçbir genişlikte çubuğun dışına taşmaz, tek satırda durur', async ({ page }) => {
  test.skip(proje() !== 'masaustu', 'bir kez yeterli')
  // Dizilimin değiştiği eşiklerin (yaklaşık 371, 957 ve 1216 piksel) iki yanı da ölçülür.
  for (const en of [320, 360, 370, 375, 768, 955, 958, 980, 1214, 1218, 1280]) {
    await page.setViewportSize({ width: en, height: 800 })
    await ac(page)
    for (const yuzen of ['false', 'true']) {
      await page.evaluate(y => window.scrollTo(0, y), yuzen === 'true' ? 1400 : 0)
      await expect(page.locator('header.ust')).toHaveAttribute('data-yuzen', yuzen)
      const { tasan, ortalar } = await page.locator('header.ust').evaluate(cubuk => {
        const sinir = cubuk.getBoundingClientRect()
        const ogeler = [...cubuk.querySelectorAll('a, button')].filter(o => o.getClientRects().length).map(o => ({ ad: o.textContent, kutu: o.getBoundingClientRect() }))
        return {
          tasan: ogeler.filter(({ kutu }) => kutu.left < sinir.left - 0.5 || kutu.right > sinir.right + 0.5 || kutu.right > innerWidth).map(o => o.ad),
          ortalar: ogeler.map(({ kutu }) => kutu.top + kutu.height / 2),
        }
      })
      expect(tasan, `${en} piksel, yüzen: ${yuzen}`).toEqual([])
      // Alt satıra inme yalnızca yazı çok büyütüldüğünde son çaredir; olağan boyutta her şey tek satırdadır.
      expect(Math.max(...ortalar) - Math.min(...ortalar), `${en} piksel, yüzen: ${yuzen}: tek satır`).toBeLessThan(8)
    }
  }
})

test('yazı iki katına çıkınca üst çubuğun öğeleri ekranın dışına taşmaz', async ({ page }) => {
  test.skip(!['masaustu', 'telefon'].includes(proje()), 'iki ekran yeterli')
  await ac(page)
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  for (const y of [0, 3000]) {
    await page.evaluate(k => window.scrollTo(0, k), y)
    await expect(page.locator('header.ust')).toHaveAttribute('data-yuzen', String(y > 0))
    const tasan = await page.locator('header.ust').evaluate(cubuk =>
      [...cubuk.querySelectorAll('a, button')].filter(o => o.getClientRects().length).map(o => ({ ad: o.textContent, kutu: o.getBoundingClientRect() }))
        .filter(({ kutu }) => kutu.left < -0.5 || kutu.right > innerWidth + 0.5).map(o => o.ad))
    expect(tasan, `kaydırma: ${y}`).toEqual([])
  }
})

test('menü bağlantısı bölüme götürür', async ({ page }) => {
  test.skip(telefon(), 'geniş ekran menüsü')
  await ac(page)
  await page.locator('.ust-menu').getByRole('link', { name: 'Kule stand' }).click()
  await expect.poll(() => ekranda(page, '#kule')).toBe(true)
})

test('menü bağlantısıyla gidilen bölümün başlığı yüzen çubuğun altında kalmaz', async ({ page }) => {
  test.skip(!jsVar(), 'yüzen çubuk JavaScript ister')
  await ac(page)
  for (const bolum of ['#stand', '#urunler', '#kule', '#uretim', '#iletisim']) {
    await page.evaluate(s => document.querySelector(s).scrollIntoView(), bolum)
    await expect(page.locator('header.ust')).toHaveAttribute('data-yuzen', 'true')
    // Hap yukarıdan iner; ölçüm yerine oturduktan sonra yapılır.
    await page.locator('header.ust').evaluate(o => Promise.all(o.getAnimations().map(a => a.finished)))
    const [cubuk, baslik] =[await page.locator('header.ust').boundingBox(), await page.locator(`${bolum} h2`).first().boundingBox()]
    expect(baslik.y, bolum).toBeGreaterThanOrEqual(cubuk.y + cubuk.height)
  }
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
