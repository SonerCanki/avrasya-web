import { type MouseEvent, useEffect, useRef } from 'react'
import { type Stand, standGorseli } from '../icerik'
import { useHareketli } from '../ortak/kancalar'
import './urunler.css'

type Ozellikler = {
  /** Gösterilecek stand; `null` iken pencere kapalıdır. */
  stand: Stand | null
  /** Pencere kapandığında (Esc, "Kapat" ya da dışına basma) çağrılır. */
  kapat: () => void
  /** Pencereyi açan kart; verilirse pencere onun ekrandaki yerinden büyüyerek açılır. */
  kaynak?: HTMLElement | null
}

/** Pencereyi kartın bulunduğu yerden ve onun boyundan kendi yerine büyütür. */
function buyut(pencere: HTMLDialogElement, kaynak: HTMLElement) {
  const kart = kaynak.getBoundingClientRect()
  const son = pencere.getBoundingClientRect()
  if (!son.width || !son.height || !kart.width) return
  const x = kart.left + kart.width / 2 - (son.left + son.width / 2)
  const y = kart.top + kart.height / 2 - (son.top + son.height / 2)
  pencere.animate(
    [
      { transform: `translate(${x}px, ${y}px) scale(${kart.width / son.width})`, opacity: 0.4 },
      { transform: 'none', opacity: 1 },
    ],
    // Son eğri değeri 1'in üstünde: pencere yerine hafifçe yaylanarak oturur.
    { duration: 380, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.15)' },
  )
}

/**
 * Stand fotoğrafının büyüğünü gösteren pencere (tarayıcının kendi `dialog` öğesi).
 * Esc ile, "Kapat" düğmesiyle ve pencerenin dışına basınca kapanır; hepsi tarayıcının `close` olayından geçer.
 */
export function BuyukGorsel({ stand, kapat, kaynak }: Ozellikler) {
  const pencere = useRef<HTMLDialogElement>(null)
  const hareketli = useHareketli()

  useEffect(() => {
    const p = pencere.current
    if (!p) return
    if (stand && !p.open) {
      p.showModal()
      if (hareketli && kaynak) buyut(p, kaynak)
    } else if (!stand && p.open) {
      p.close()
    }
  }, [stand, kaynak, hareketli])

  /** Pencerenin arkasındaki karartıya basıldıysa kapatır. Karartıya basış pencerenin kendisine gelir. */
  function disinaBasildi(olay: MouseEvent<HTMLDialogElement>) {
    if (olay.target !== olay.currentTarget) return
    const kutu = olay.currentTarget.getBoundingClientRect()
    const icinde =
      olay.clientX >= kutu.left && olay.clientX <= kutu.right && olay.clientY >= kutu.top && olay.clientY <= kutu.bottom
    if (!icinde) olay.currentTarget.close()
  }

  return (
    <dialog
      ref={pencere}
      className="buyuk-gorsel"
      aria-label="Büyük görsel"
      data-lenis-prevent=""
      onClose={kapat}
      onClick={disinaBasildi}
    >
      {stand && (
        <>
          {/* Büyük fotoğraf inene kadar kartta zaten yüklü olan küçüğü görünür. */}
          <img
            src={standGorseli(stand.dosya, 1040)}
            alt={stand.alt}
            width={1040}
            height={1040}
            decoding="async"
            style={{ backgroundImage: `url(${standGorseli(stand.dosya, 640)})` }}
          />
          <p>{stand.ad}</p>
        </>
      )}
      <button type="button" onClick={() => pencere.current?.close()}>
        Kapat
      </button>
    </dialog>
  )
}
