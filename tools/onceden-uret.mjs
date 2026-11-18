// Derlemenin son adımı: React'in ürettiği hazır HTML'i dist/index.html içine yerleştirir.
// Böylece sayfa JavaScript çalışmadan da okunur; tarayıcıda React bu HTML'i devralır.
import { readFile, rm, writeFile } from 'node:fs/promises'

const kok = new URL('../', import.meta.url)
const sayfaYolu = new URL('dist/index.html', kok)
const sunucuKlasoru = new URL('dist-ssr/', kok)
const ISARET = '<div id="root"></div>'

function dur(ileti) {
  console.error(`onceden-uret: ${ileti}`)
  process.exit(1)
}

const { render } = await import(new URL('entry-server.js', sunucuKlasoru).href)
const sayfa = await readFile(sayfaYolu, 'utf8')
const icerik = render()

if (!sayfa.includes(ISARET)) dur(`dist/index.html içinde ${ISARET} bulunamadı`)
if (!icerik.includes('<h1')) dur('üretilen HTML <h1 içermiyor')

// İşlev biçiminde değiştirme: içerikteki $ işaretleri özel anlam taşımasın.
await writeFile(sayfaYolu, sayfa.replace(ISARET, () => `<div id="root">${icerik}</div>`))
await rm(sunucuKlasoru, { recursive: true, force: true })
console.log(`Hazır HTML yerleştirildi (${icerik.length} karakter).`)
