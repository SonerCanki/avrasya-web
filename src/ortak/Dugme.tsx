import type { ReactNode } from 'react'
import { type WaMesaji, waBaglantisi } from '../icerik'
import './ortak.css'

type DugmeOzellikleri = {
  href: string
  /** `duz`, altı çizili düz bağlantıdır; diğerleri sert gölgeli hap düğmedir. */
  tur: 'gunes' | 'beyaz' | 'murekkep' | 'duz'
  buyuk?: boolean
  /** Başka siteye gider; yeni sekmede açılır. */
  disarida?: boolean
  /** Ekran okuyucunun okuyacağı ad. Yalnızca görünen yazı parçalara bölündüğünde verilir; görünen yazıyı içermelidir. */
  etiket?: string
  children: ReactNode
}

export function Dugme({ href, tur, buyuk, disarida, etiket, children }: DugmeOzellikleri) {
  return (
    <a
      className={`dugme dugme--${tur}${buyuk ? ' dugme--buyuk' : ''}`}
      href={href}
      aria-label={etiket}
      {...(disarida ? { target: '_blank', rel: 'noopener' } : null)}
    >
      {children}
    </a>
  )
}

type WaDugmeOzellikleri = {
  /** Düğmenin WhatsApp'ta açacağı hazır mesaj. */
  mesaj: WaMesaji
  tur: 'gunes' | 'beyaz' | 'murekkep'
  buyuk?: boolean
  etiket?: string
  children: ReactNode
}

export function WaDugme({ mesaj, tur, buyuk, etiket, children }: WaDugmeOzellikleri) {
  return (
    <Dugme href={waBaglantisi(mesaj)} tur={tur} buyuk={buyuk} etiket={etiket} disarida>
      {children}
    </Dugme>
  )
}
