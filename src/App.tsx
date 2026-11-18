import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { Acilis } from './bolumler/Acilis'
import { AltBilgi } from './bolumler/AltBilgi'
import { Iletisim } from './bolumler/Iletisim'
import { KuleStand } from './bolumler/KuleStand'
import { StandSahnesi } from './bolumler/StandSahnesi'
import { UstCubuk } from './bolumler/UstCubuk'
import { Uretim } from './bolumler/Uretim'
import { Urunler } from './bolumler/Urunler'
import { useYumusakKaydirma } from './ortak/kancalar'

export default function App() {
  useYumusakKaydirma()
  // React sayfayı devraldı: testler ve stiller bunu `html[data-hazir]` ile anlar.
  // Geç kaldıysa index.html içindeki bekçi `js` sınıfını kaldırmıştır; düğmeler artık çalıştığı için geri eklenir.
  useEffect(() => {
    document.documentElement.classList.add('js')
    document.documentElement.dataset.hazir = ''
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="atla" href="#icerik">
        İçeriğe geç
      </a>
      <UstCubuk />
      <main id="icerik">
        <Acilis />
        <StandSahnesi />
        <Urunler />
        <KuleStand />
        <Uretim />
        <Iletisim />
      </main>
      <AltBilgi />
    </MotionConfig>
  )
}
