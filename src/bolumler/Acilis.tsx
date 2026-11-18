import { useRef } from 'react'
import { motion } from 'motion/react'
import { ACILIS, SUSLER, SUZGECLER } from '../icerik'
import { Dugme, WaDugme } from '../ortak/Dugme'
import { KayanSerit } from '../ortak/KayanSerit'
import { SusCikartma } from '../ortak/SusCikartma'
import './acilis.css'

/** Altı süsün duruş açısı, ekrana geliş sırası ve salınım süresi. Yerleri acilis.css içindedir. */
const DURUS = [
  { egim: -10, gecikme: 0.5, sure: 5.2 },
  { egim: 9, gecikme: 0.6, sure: 6.1 },
  { egim: 7, gecikme: 0.7, sure: 5.6 },
  { egim: -8, gecikme: 0.8, sure: 6.4 },
  { egim: 6, gecikme: 0.9, sure: 5.9 },
  { egim: -6, gecikme: 1.0, sure: 5.4 },
]

const KONSEPT_ADLARI = SUZGECLER.filter((s) => s.id !== 'hepsi').map((s) => s.ad)

/** 1. bölüm: dev başlık, iki eylem, kenarlara dağılan süs çıkartmaları ve altta kayan konsept şeridi. */
export function Acilis() {
  const sahne = useRef<HTMLElement>(null)

  return (
    <section id="acilis" className="acilis" ref={sahne}>
      <div className="acilis-metin">
        <h1>
          {/* Satırlar opaklıkla gizlenmez; başlık ilk boyamada görünür, yalnızca yerine yaylanır. */}
          {ACILIS.satirlar.map((satir, i) => (
            <motion.span
              key={satir}
              data-hareket=""
              initial={{ y: 70, rotate: i % 2 ? 4 : -4 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 13, delay: 0.1 + i * 0.1 }}
            >
              {`${satir} `}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="acilis-aciklama"
          data-hareket=""
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          {ACILIS.aciklama}
        </motion.p>
        <motion.div
          className="acilis-eylem"
          data-hareket=""
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.7 }}
        >
          <WaDugme mesaj="fiyat" tur="gunes" buyuk>
            {ACILIS.cta}
          </WaDugme>
          <Dugme href="#urunler" tur="duz">
            {ACILIS.ikincil}
          </Dugme>
        </motion.div>
      </div>

      {SUSLER.slice(0, DURUS.length).map((sus, i) => (
        <SusCikartma key={sus.dosya} sus={sus} sinir={sahne} className={`acilis-sus--${i + 1}`} {...DURUS[i]} />
      ))}

      <div className="acilis-serit">
        <KayanSerit ogeler={KONSEPT_ADLARI} etiket="Konseptler" />
      </div>
    </section>
  )
}
