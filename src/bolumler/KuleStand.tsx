import { type CSSProperties, useRef, useState } from 'react'
import { useInView, useMotionValueEvent, useScroll } from 'motion/react'
import { KULE } from '../icerik'
import { WaDugme } from '../ortak/Dugme'
import { useHareketli } from '../ortak/kancalar'
import './kule.css'

const KAT_SAYISI = KULE.katlar.length

/** Kaydırma ilerlemesi (0–1) dört eşit dilime bölünür; her dilim bir kattır. */
const katHesapla = (ilerleme: number) => Math.min(KAT_SAYISI - 1, Math.max(0, Math.floor(ilerleme * KAT_SAYISI)))

/**
 * 4. bölüm: kule stand. Sabitlenmez. Hareket serbestken resim görününce aşağıdan yukarı kat kat kurulur,
 * kaydırdıkça sıradaki kat vurgulanır; bir kat satırının üzerine gelince ya da ona dokununca o kat vurgulanır.
 * Hareket serbest değilken resim tam, dört satır eşit görünür ve işaret çerçevesi hiç gösterilmez (kule.css).
 */
export function KuleStand() {
  const hareketli = useHareketli()
  const bolum = useRef<HTMLElement>(null)
  const resim = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: bolum, offset: ['start 0.4', 'end 0.6'] })
  const [kaydirmaKati, setKaydirmaKati] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (deger) => setKaydirmaKati(katHesapla(deger)))

  // Ziyaretçinin seçtiği kat, seçildiği andaki kaydırma katıyla birlikte tutulur:
  // kaydırma başka bir kata geçince seçim kendiliğinden düşer.
  const [secim, setSecim] = useState<{ kat: number; sirada: number } | null>(null)
  const etkin = secim && secim.sirada === kaydirmaKati ? secim.kat : kaydirmaKati

  const gorundu = useInView(resim, { once: true, amount: 0.35 })
  const [kuruldu, setKuruldu] = useState(false)

  const bant = KULE.katlar[etkin].bant

  return (
    <section id="kule" className="kule" ref={bolum} data-kat={hareketli ? etkin : undefined}>
      <div className="kule-ic">
        <div className="kule-giris">
          <h2>{KULE.baslik}</h2>
          <p>{KULE.metin}</p>
          <WaDugme mesaj="kule" tur="gunes" buyuk>
            {KULE.cta}
          </WaDugme>
        </div>

        <div className="kule-govde">
          <div
            className="kule-resim"
            ref={resim}
            data-gorundu={hareketli && gorundu ? '' : undefined}
            data-kuruldu={hareketli && kuruldu ? 'true' : undefined}
            // Kurulumun durakları: ikinci, üçüncü ve alt katın üst kenarları (kule.css: kule-kur).
            style={
              {
                '--k1': KULE.katlar[1].bant[0],
                '--k2': KULE.katlar[2].bant[0],
                '--k3': KULE.katlar[3].bant[0],
              } as CSSProperties
            }
          >
            <img
              src={KULE.gorsel.yol}
              alt={KULE.gorselAlt}
              width={KULE.gorsel.en}
              height={KULE.gorsel.boy}
              loading="lazy"
              decoding="async"
              data-hareket=""
              onAnimationEnd={() => setKuruldu(true)}
            />
            {/* Etkin katı çerçeveleyen işaret; yeri katın bandından gelir. */}
            <span className="kule-isaret" aria-hidden="true" style={{ '--ust': bant[0], '--alt': bant[1] } as CSSProperties} />
          </div>

          <ol className="kule-katlar" role="list">
            {KULE.katlar.map((kat, i) => (
              <li
                key={kat.baslik}
                data-etkin={hareketli ? String(i === etkin) : undefined}
                onPointerEnter={() => setSecim({ kat: i, sirada: kaydirmaKati })}
                // Fare satırdan çıkınca kaydırmanın katına dönülür; dokunuşta seçim, kaydırma başka kata geçene dek kalır.
                onPointerLeave={(olay) => {
                  if (olay.pointerType === 'mouse') setSecim(null)
                }}
              >
                <h3>{kat.baslik}</h3>
                <p>{kat.metin}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
