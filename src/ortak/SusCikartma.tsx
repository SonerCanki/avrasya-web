import type { RefObject } from 'react'
import { motion } from 'motion/react'
import { type Sus, susGorseli } from '../icerik'
import { useMedya } from './kancalar'
import './ortak.css'

type Ozellikler = {
  sus: Sus
  /** Süsün dışına sürüklenemeyeceği alan. */
  sinir: RefObject<HTMLElement | null>
  /** Kalıcı duruş açısı (derece). */
  egim: number
  /** Girişin kaçıncı saniyede başlayacağı. */
  gecikme: number
  /** Salınımın bir turu kaç saniye. */
  sure: number
  className?: string
}

/**
 * Çıkartma gibi duran süs görseli. Katmanlar dıştan içe:
 * sürüklenen kök (`data-sus`) → eğim → giriş (`data-hareket`) → salınan görsel.
 * Eğim, sürüklenen öğenin içindedir; böylece süs imleci tam izler.
 */
export function SusCikartma({ sus, sinir, egim, gecikme, sure, className }: Ozellikler) {
  // Sürükleme yalnızca farede açık; dokunmatik ekranda süs sabittir ve kaydırmayı engellemez.
  const fare = useMedya('(pointer: fine)')

  return (
    <motion.div
      className={className ? `sus ${className}` : 'sus'}
      data-sus=""
      data-surukle={fare ? 'true' : 'false'}
      drag={fare}
      dragConstraints={sinir}
      dragElastic={0.18}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
      whileHover={fare ? { scale: 1.06 } : undefined}
      whileDrag={{ scale: 1.14, zIndex: 6 }}
    >
      <div className="sus-egim" style={{ rotate: `${egim}deg` }}>
        {/* Giriş CSS ile oynar (ortak.css: sus-gel); betik gecikse de süs görünür. */}
        <div className="sus-giris" data-hareket="" style={{ animationDelay: `${gecikme}s` }}>
          <img
            src={susGorseli(sus.dosya)}
            alt={sus.alt}
            width={sus.en}
            height={sus.boy}
            draggable={false}
            style={{ animationDuration: `${sure}s` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
