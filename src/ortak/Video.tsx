import { useEffect, useRef, useState } from 'react'
import type { VideoBilgisi } from '../icerik'
import { useHareketli, useTarayicida } from './kancalar'
import './ortak.css'

/** Gözcünün haber vereceği görünürlük basamakları (0, 0,1 … 1). */
const ESIKLER = Array.from({ length: 11 }, (_, i) => i / 10)

function oynat(video: HTMLVideoElement) {
  // Tarayıcı oynatmayı geri çevirirse (ya da araya duraklatma girerse) video durur; düğme zaten bunu gösterir.
  video.play().catch(() => {})
}

/**
 * Çıkartma çerçevesinde sessiz, döngülü video.
 * Hareket serbestken yarısından fazlası görününce oynar, ekrandan çıkınca durur;
 * ziyaretçi düğmeyle durdurduysa kendiliğinden yeniden başlamaz.
 * Hareket azaltılmışken yalnızca düğmeyle oynar. JavaScript yokken tarayıcının kendi denetimleri kalır.
 */
export function Video({ bilgi, egim = 0 }: { bilgi: VideoBilgisi; egim?: number }) {
  const hareketli = useHareketli()
  const tarayicida = useTarayicida()
  const video = useRef<HTMLVideoElement>(null)
  const elleDurdu = useRef(false)
  const [oynuyor, setOynuyor] = useState(false)

  useEffect(() => {
    const v = video.current
    if (!v || !hareketli) return
    const gozcu = new IntersectionObserver(
      ([kayit]) => {
        // Ekrandan uzun bir video hiçbir zaman yarı yarıya görünmeyebilir; ekranın çoğunu kaplaması da yeter.
        const yeterli =
          kayit.intersectionRatio >= 0.5 || kayit.intersectionRect.height >= (kayit.rootBounds?.height ?? Infinity) * 0.6
        if (yeterli) {
          if (!elleDurdu.current) oynat(v)
        } else if (!kayit.isIntersecting) {
          v.pause()
        }
      },
      { threshold: ESIKLER },
    )
    gozcu.observe(v)
    return () => gozcu.disconnect()
  }, [hareketli])

  function degistir() {
    const v = video.current
    if (!v) return
    if (v.paused) {
      elleDurdu.current = false
      oynat(v)
    } else {
      elleDurdu.current = true
      v.pause()
    }
  }

  return (
    <figure className="video cikartma" style={egim ? { rotate: `${egim}deg` } : undefined}>
      <video
        ref={video}
        src={bilgi.kaynak}
        poster={bilgi.poster}
        width={bilgi.en}
        height={bilgi.boy}
        aria-label={bilgi.baslik}
        muted
        loop
        playsInline
        preload="none"
        controls={!tarayicida}
        onPlay={() => setOynuyor(true)}
        onPause={() => setOynuyor(false)}
      />
      <figcaption className="video-baslik">{bilgi.baslik}</figcaption>
      <button type="button" className="video-dugme js-gerek" onClick={degistir}>
        {oynuyor ? 'Duraklat' : 'Oynat'}
      </button>
    </figure>
  )
}
