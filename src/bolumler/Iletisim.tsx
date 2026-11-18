import { useRef, useState } from 'react'
import { ILETISIM, SUSLER, SUZGECLER } from '../icerik'
import { WaDugme } from '../ortak/Dugme'
import { KayanSerit } from '../ortak/KayanSerit'
import { SusCikartma } from '../ortak/SusCikartma'
import { useHareketli } from '../ortak/kancalar'
import './iletisim.css'

/** Sekiz süsün duruş açısı, ekrana geliş sırası ve salınım süresi. Yerleri iletisim.css içindedir. */
const DURUS = [
  { egim: -9, gecikme: 0.1, sure: 5.4 },
  { egim: 8, gecikme: 0.15, sure: 6.2 },
  { egim: 6, gecikme: 0.2, sure: 5.8 },
  { egim: -7, gecikme: 0.25, sure: 6.5 },
  { egim: 7, gecikme: 0.3, sure: 5.6 },
  { egim: -6, gecikme: 0.35, sure: 6.0 },
  { egim: -8, gecikme: 0.4, sure: 5.2 },
  { egim: 9, gecikme: 0.45, sure: 6.3 },
]
/** Süsler iki öbektir: dar ekranda ilk öbek yazının üstünde, ikincisi düğmenin altında birer sıra olur. */
const OBEK = DURUS.length / 2

/** Açılıştaki şeridin tersten sıralısı; iki şerit yan yana aynı görünmez. */
const KONSEPT_ADLARI = SUZGECLER.filter((s) => s.id !== 'hepsi')
  .map((s) => s.ad)
  .reverse()

/** Kartın bağlantılı satırları; sırası karttaki sıradır. Adres ayrı yazılır. */
const SATIRLAR = [
  { ad: 'Telefon', baglanti: ILETISIM.telefon, disarida: false },
  { ad: 'WhatsApp', baglanti: ILETISIM.whatsapp, disarida: true },
  { ad: 'E-posta', baglanti: ILETISIM.eposta, disarida: false },
  { ad: 'Instagram', baglanti: ILETISIM.instagram, disarida: true },
  { ad: 'Facebook', baglanti: ILETISIM.facebook, disarida: true },
]

/**
 * 6. bölüm: açılışın eşi. Üstünde sayfanın ikinci ve son kayan şeridi, ortada dev başlık ve sayfanın
 * en büyük düğmesi, çevresinde sekiz süs çıkartması, altında beyaz iletişim kartı.
 * Fare büyük düğmenin üzerine gelince (yalnızca hareket serbestken) süsler bir kez kısaca kıpırdar.
 */
export function Iletisim() {
  const hareketli = useHareketli()
  const bolum = useRef<HTMLElement>(null)
  const [kipirti, setKipirti] = useState(false)

  const susler = (ilk: number) =>
    SUSLER.slice(ilk, ilk + OBEK).map((sus, i) => (
      <SusCikartma key={sus.dosya} sus={sus} sinir={bolum} className={`iletisim-sus--${ilk + i + 1}`} {...DURUS[ilk + i]} />
    ))

  return (
    <>
      <div className="iletisim-serit">
        <div className="iletisim-serit-ic">
          <KayanSerit ogeler={KONSEPT_ADLARI} etiket="Konseptler" />
        </div>
      </div>

      <section
        id="iletisim"
        className="iletisim"
        ref={bolum}
        data-kipirti={kipirti ? '' : undefined}
        // Kıpırtı bitince işaret kalkar; düğmeye yeniden gelince bir kez daha oynar (iletisim.css: iletisim-kipirti).
        onAnimationEnd={(olay) => {
          if (olay.animationName === 'iletisim-kipirti') setKipirti(false)
        }}
      >
        <div className="iletisim-sahne">
          <div className="iletisim-susler">{susler(0)}</div>

          <div className="iletisim-metin">
            <p className="iletisim-ust">{ILETISIM.ust}</p>
            <h2>{ILETISIM.baslik}</h2>
            <p className="iletisim-aciklama">{ILETISIM.metin}</p>
            <div
              className="iletisim-eylem"
              onPointerEnter={(olay) => {
                if (hareketli && olay.pointerType === 'mouse') setKipirti(true)
              }}
            >
              <WaDugme mesaj="fiyat" tur="gunes" buyuk>
                {ILETISIM.cta}
              </WaDugme>
            </div>
          </div>

          <div className="iletisim-susler iletisim-susler--alt">{susler(OBEK)}</div>
        </div>

        <dl className="iletisim-kart cikartma">
          {SATIRLAR.map(({ ad, baglanti, disarida }) => (
            <div key={ad}>
              <dt>{ad}</dt>
              <dd>
                <a href={baglanti.href} {...(disarida ? { target: '_blank', rel: 'noopener' } : null)}>
                  {baglanti.yazi}
                </a>
              </dd>
            </div>
          ))}
          <div>
            <dt>Adres</dt>
            <dd className="iletisim-adres">
              {ILETISIM.adres.map((satir) => (
                <span key={satir}>{satir}</span>
              ))}
            </dd>
          </div>
        </dl>
      </section>
    </>
  )
}
