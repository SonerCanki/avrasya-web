// Paylaşım görselini üretir: public/assets/img/paylasim.jpg (1200×630).
// Site WhatsApp'ta ya da sosyal medyada paylaşılınca bağlantının yanında bu görsel çıkar.
//   npm --prefix tools/test run paylasim
// paylasim-sablon.html dosyasını bilgisayardaki Chrome'da açar ve ekran görüntüsünü kaydeder; yeni kurulum istemez.
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const SABLON = new URL('./paylasim-sablon.html', import.meta.url)
const CIKTI = fileURLToPath(new URL('../../public/assets/img/paylasim.jpg', import.meta.url))
const EN = 1200
const BOY = 630

const tarayici = await chromium.launch({ channel: 'chrome' })
try {
  const sayfa = await tarayici.newPage({ viewport: { width: EN, height: BOY }, deviceScaleFactor: 1 })
  await sayfa.goto(SABLON.href)
  // Yazı tipi ya da görsel eksikken çekilen görüntü sessizce bozuk çıkar; ikisi de önce doğrulanır.
  const eksik = await sayfa.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((g) => g.decode().catch(() => {})))
    const eksikler = [...document.images].filter((g) => !g.naturalWidth).map((g) => g.getAttribute('src'))
    if (![...document.fonts].some((y) => y.status === 'loaded')) eksikler.push('yazı tipi (Bricolage Grotesque)')
    return eksikler
  })
  if (eksik.length) throw new Error(`Yüklenemedi: ${eksik.join(', ')}`)
  await sayfa.screenshot({ path: CIKTI, type: 'jpeg', quality: 86 })
  console.log(`Paylaşım görseli yazıldı: ${CIKTI} (${EN}×${BOY})`)
} finally {
  await tarayici.close()
}
