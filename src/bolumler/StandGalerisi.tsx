import { type CSSProperties, type MouseEvent, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { STANDLAR, SUZGECLER, type Stand, type SuzgecId, URUNLER, standGorseli, standlariSuz } from '../icerik'
import { useHareketli } from '../ortak/kancalar'
import { BuyukGorsel } from './BuyukGorsel'
import '../ortak/ortak.css'
import './urunler.css'

/** Kartların duruş açısı (derece); her standın açısı listedeki sırasına göre sabittir. */
const EGIM = [-2.5, 1.5, -1, 2.5, 2, -2, 1.5, -1.5, -1.5, 2.5, -2.5, 1]

const suzgecBul = (id: SuzgecId) => SUZGECLER.find((s) => s.id === id)!

/** Süzülen kartın girişi ve çıkışı. */
const KUCUK = { opacity: 0, scale: 0.7 }
const TAM = { opacity: 1, scale: 1 }

/**
 * Süzgeç düğmeleri, stand sayısı, kart galerisi ve büyük görsel penceresi.
 * Kartlar bağlantıdır: JavaScript yokken fotoğrafın büyüğünü tarayıcıda açar; varken pencere açılır.
 */
export function StandGalerisi({ suzgec, sec }: { suzgec: SuzgecId; sec: (id: SuzgecId) => void }) {
  const hareketli = useHareketli()
  const sira = useRef<HTMLUListElement>(null)
  const [acik, setAcik] = useState<{ stand: Stand; kart: HTMLElement } | null>(null)
  const gorunen = standlariSuz(suzgec)

  function suz(id: SuzgecId, dugme: HTMLElement) {
    sec(id)
    // Telefonda süzgeç ve galeri yana kayan birer sıradır: basılan düğme sıranın ortasına gelir, galeri baştan başlar.
    const serit = dugme.parentElement!
    const d = dugme.getBoundingClientRect()
    const s = serit.getBoundingClientRect()
    serit.scrollBy({ left: d.left + d.width / 2 - (s.left + s.width / 2), behavior: hareketli ? 'smooth' : 'instant' })
    sira.current?.scrollTo({ left: 0, behavior: 'instant' })
  }

  function ac(olay: MouseEvent<HTMLAnchorElement>, stand: Stand) {
    // Fotoğrafı yeni sekmede açmak isteyen (Ctrl, Shift, orta tuş) engellenmez.
    if (olay.button !== 0 || olay.ctrlKey || olay.metaKey || olay.shiftKey || olay.altKey) return
    olay.preventDefault()
    setAcik({ stand, kart: olay.currentTarget })
  }

  function kapat() {
    // Bağlantıya fareyle basmak her tarayıcıda odak vermez; odak açan karta elle döndürülür.
    acik?.kart.focus({ preventScroll: true })
    setAcik(null)
  }

  return (
    <>
      <h3 className="galeri-baslik">{URUNLER.galeriBasligi}</h3>

      <div className="suzgec js-gerek" role="group" aria-label="Standları konuya göre süzün">
        {SUZGECLER.map((s) => (
          <button key={s.id} type="button" data-suzgec={s.id} aria-pressed={s.id === suzgec} onClick={(olay) => suz(s.id, olay.currentTarget)}>
            <span className="suzgec-nokta" style={{ background: s.renk }} aria-hidden="true" />
            {s.ad}
          </button>
        ))}
      </div>
      {/* Ekranda görünmez (urunler.css); süzgeç değişince sonucu yalnızca ekran okuyucuya duyurur. */}
      <p className="suzgec-sayi js-gerek" aria-live="polite">{`${gorunen.length} stand`}</p>

      {/* layoutScroll: telefonda sıra yana kaymışken de kartların yeri doğru ölçülür. */}
      <motion.ul className="galeri" role="list" ref={sira} layoutScroll>
        <AnimatePresence mode="popLayout" initial={false}>
          {gorunen.map((stand) => {
            const konu = suzgecBul(stand.konular[0])
            const egim = EGIM[STANDLAR.indexOf(stand) % EGIM.length]
            return (
              <motion.li
                key={stand.dosya}
                data-stand={stand.dosya}
                data-hareket=""
                layout={hareketli ? 'position' : false}
                initial={hareketli ? KUCUK : false}
                animate={TAM}
                exit={hareketli ? KUCUK : undefined}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              >
                <a
                  className="stand-kart cikartma"
                  href={standGorseli(stand.dosya, 1040)}
                  style={{ '--egim': `${egim}deg` } as CSSProperties}
                  onClick={(olay) => ac(olay, stand)}
                >
                  <img
                    src={standGorseli(stand.dosya, 640)}
                    alt={stand.alt}
                    width={640}
                    height={640}
                    loading="lazy"
                    decoding="async"
                  />
                  <span style={{ background: konu.renk, color: konu.uzeri }}>{stand.ad}</span>
                </a>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>

      <BuyukGorsel stand={acik?.stand ?? null} kaynak={acik?.kart} kapat={kapat} />
    </>
  )
}
