// İçerik dosyasının birim testleri. Çalıştırma: npm run test:birim
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { MENU, STANDLAR, STAND_SAHNESI, SUSLER, SUZGECLER, KULE, WA_MESAJ, standGorseli, standlariSuz, susGorseli, waBaglantisi } from '../../../src/icerik.ts'

const diskte = yol => existsSync(new URL(`../../../public${yol}`, import.meta.url))

test('12 stand var ve her birinin iki boy fotoğrafı diskte', () => {
  assert.equal(STANDLAR.length, 12)
  assert.equal(new Set(STANDLAR.map(s => s.dosya)).size, 12)
  for (const s of STANDLAR) for (const b of [640, 1040]) assert.ok(diskte(standGorseli(s.dosya, b)), `${s.dosya} ${b}`)
  assert.ok(STANDLAR.every(s => s.ad && s.alt.length > 20))
})

test('sahnedeki stand listededir ve şeffaf görseli diskte', () => {
  assert.ok(STANDLAR.some(s => s.dosya === STAND_SAHNESI.stand.dosya))
  assert.ok(diskte(standGorseli(STAND_SAHNESI.stand.dosya, 'kesik')))
  assert.ok(STAND_SAHNESI.stand.en > 500 && STAND_SAHNESI.stand.boy > 500)
})

test('stand klasöründe listede olmayan (eski) fotoğraf yok', () => {
  const beklenen = [...STANDLAR.flatMap(s => [640, 1040].map(b => `${s.dosya}-${b}.webp`)), `${STAND_SAHNESI.stand.dosya}-kesik.webp`]
  assert.deepEqual(readdirSync(new URL('../../../public/assets/img/standlar/', import.meta.url)).sort(), beklenen.sort())
})

test('süzgeçler doğru sayıda stand verir', () => {
  const beklenen = { hepsi: 12, cocuk: 2, rakam: 6, yazi: 9, esprili: 2, kadin: 1, erkek: 1, futbol: 1, ayna: 4 }
  assert.deepEqual(SUZGECLER.map(s => s.id), Object.keys(beklenen))
  for (const [id, n] of Object.entries(beklenen)) assert.equal(standlariSuz(id).length, n, id)
})

test('8 süs var, görselleri diskte, alt metinleri dolu', () => {
  assert.equal(SUSLER.length, 8)
  for (const s of SUSLER) { assert.ok(diskte(susGorseli(s.dosya)), s.dosya); assert.ok(s.alt.length > 10); assert.ok(s.en > 100 && s.boy > 100, s.dosya + ' ölçüsü') }
})

test('WhatsApp bağlantısı numarayı ve mesajı taşır', () => {
  assert.deepEqual(Object.keys(WA_MESAJ), ['ust', 'fiyat', 'stand', 'kule'])
  assert.equal(waBaglantisi('kule'), `https://wa.me/905306656373?text=${encodeURIComponent('Merhaba, kule stand hakkında bilgi almak istiyorum.')}`)
})

test('menü beş bölümü eski kimlikleriyle gösterir', () => {
  assert.deepEqual(MENU.map(m => m.hedef), ['#stand', '#urunler', '#kule', '#uretim', '#iletisim'])
})

test('kule resmi diskte; katların bantları resmi yukarıdan aşağı kesintisiz böler', () => {
  assert.ok(diskte(KULE.gorsel.yol), KULE.gorsel.yol)
  assert.ok(KULE.gorsel.boy > KULE.gorsel.en)
  assert.deepEqual(KULE.katlar.map(k => k.bant), [[4, 27], [27, 50], [50, 73], [73, 96]])
  KULE.katlar.slice(1).forEach((k, i) => assert.equal(k.bant[0], KULE.katlar[i].bant[1]))
})
