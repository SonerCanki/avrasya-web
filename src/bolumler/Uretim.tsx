import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { URETIM, VIDEOLAR } from '../icerik'
import { Video } from '../ortak/Video'
import { useHareketli, useMedya } from '../ortak/kancalar'
import './uretim.css'

const SON_ADIM = URETIM.adimlar.length - 1

/** İlerleme (0–1) kaç adımı yakar: adım i, çizgi ona varmadan hemen önce (i / son adım − 0,02) yanar. */
const yananSayisi = (ilerleme: number) => URETIM.adimlar.filter((_, i) => ilerleme > i / SON_ADIM - 0.02).length

/**
 * 5. bölüm: süsün atölyedeki yolu ve UV baskı videosu.
 * Hareket serbestken kalın çizgi kaydırdıkça çizilir (geniş ekranda yatay, darda dikey) ve ulaştığı adımın
 * numarası yanar. Serbest değilken çizgi tam, dört adım yanık durur. Düzen uretim.css içindedir.
 */
export function Uretim() {
  const hareketli = useHareketli()
  // uretim.css'teki yatay düzenin eşiğiyle aynıdır.
  const yatay = useMedya('(min-width: 900px)')

  const yol = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: yol, offset: ['start 0.8', 'end 0.6'] })
  const [yanan, setYanan] = useState(1)
  useMotionValueEvent(scrollYProgress, 'change', (deger) => setYanan(yananSayisi(deger)))

  return (
    <section id="uretim" className="uretim">
      <div className="uretim-ic">
        <h2>{URETIM.baslik}</h2>
        <p className="uretim-metin">{URETIM.metin}</p>

        <div className="uretim-yol" ref={yol}>
          {/* Yön değişince çizgi baştan kurulur; eski eksenin ölçeği üzerinde kalmaz. */}
          <motion.span
            key={yatay ? 'yatay' : 'dikey'}
            className="uretim-cizgi"
            aria-hidden="true"
            data-hareket=""
            style={hareketli ? (yatay ? { scaleX: scrollYProgress } : { scaleY: scrollYProgress }) : undefined}
          />
          <ol className="uretim-adimlar" role="list">
            {URETIM.adimlar.map((adim, i) => (
              <li key={adim.baslik} data-yandi={String(!hareketli || i < yanan)}>
                <span className="uretim-no" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3>{adim.baslik}</h3>
                  <p>{adim.metin}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="uretim-video">
          <Video bilgi={VIDEOLAR.uv} egim={2} />
        </div>
      </div>
    </section>
  )
}
