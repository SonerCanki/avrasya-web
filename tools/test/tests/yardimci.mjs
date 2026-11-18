// Tarayıcı testlerinin ortak yardımcıları. Testler derlenmiş siteye (dist/) karşı çalışır.
import { test as temel, expect } from '@playwright/test'

/**
 * Her testte kendiliğinden çalışan `sorunlar` fikstürü: sayfa hatalarını, konsoldaki hataları,
 * 400 ve üstü yanıtları ve düşen istekleri toplar; test bitince listenin boş olmasını ister.
 * Bilerek hata üreten bir test, bitmeden `sorunlar.length = 0` der.
 */
export const test = temel.extend({
  sorunlar: [
    async ({ page }, kullan) => {
      const sorunlar = []
      page.on('pageerror', hata => sorunlar.push(`sayfa hatası: ${hata.message}`))
      page.on('console', ileti => {
        if (ileti.type() === 'error') sorunlar.push(`konsol: ${ileti.text()}`)
      })
      page.on('response', yanit => {
        if (yanit.status() >= 400) sorunlar.push(`${yanit.status()} ${yanit.url()}`)
      })
      page.on('requestfailed', istek => {
        const neden = istek.failure()?.errorText ?? ''
        if (!neden.includes('ERR_ABORTED')) sorunlar.push(`istek düştü: ${istek.url()} ${neden}`)
      })
      await kullan(sorunlar)
      expect(sorunlar).toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

/** Çalışan projenin adı: masaustu, telefon, masaustu-hareketsiz, telefon-hareketsiz, javascriptsiz. */
export const proje = () => test.info().project.name
export const jsVar = () => proje() !== 'javascriptsiz'
/** Hareket serbest mi (JavaScript açık ve hareket azaltma kapalı). */
export const hareketVar = () => jsVar() && !proje().endsWith('-hareketsiz')
/** Telefon profili mi (Pixel 7, 412×915, dokunmatik). */
export const telefon = () => proje().startsWith('telefon')

/** Verilen mesaj metnini taşıyan tam WhatsApp adresi. */
export const waAdresi = mesajMetni => `https://wa.me/905306656373?text=${encodeURIComponent(mesajMetni)}`

/** Sayfayı açar; JavaScript açıksa React'in sayfayı devralmasını bekler. */
export async function ac(page, yol = '/') {
  await page.goto(yol)
  if (jsVar()) await expect(page.locator('html')).toHaveAttribute('data-hazir', '')
}

/** Sayfanın yana taşan piksel sayısı (0 = taşma yok). */
export const yanaTasma = page =>
  page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth))

/** Öğenin üst kenarını ekran yüksekliğinin `oran` katına getirir (0 = ekranın en üstü). */
export const kaydir = (page, secici, oran = 0) =>
  page.evaluate(
    ([secici, oran]) => {
      const kutu = document.querySelector(secici).getBoundingClientRect()
      window.scrollTo({ top: window.scrollY + kutu.top - window.innerHeight * oran, behavior: 'instant' })
    },
    [secici, oran],
  )

/**
 * Sunucudan gelen ham sayfa (tarayıcı çalıştırmadan). Aranan metinler ' " & içermemeli:
 * React bunları hazır HTML'de kodlar.
 */
export const hamHtml = async request => (await request.get('/')).text()
