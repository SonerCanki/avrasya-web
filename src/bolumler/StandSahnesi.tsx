import { useEffect, useRef, useState } from 'react'
import { type MotionStyle, type MotionValue, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { STAND_SAHNESI, SUSLER, type Sus, VIDEOLAR, standGorseli, susGorseli } from '../icerik'
import { Pasta } from '../cizimler/Pasta'
import { Tezgah } from '../cizimler/Tezgah'
import { WaDugme } from '../ortak/Dugme'
import { Video } from '../ortak/Video'
import { useHareketli, useMedya } from '../ortak/kancalar'
import './stand-sahnesi.css'

const sus = (dosya: string): Sus => SUSLER.find((s) => s.dosya === dosya)!

/** Müşterinin standdan seçip pastaya taktığı süs. */
const SECILEN = sus('sus-canim-kizim')
/** Standa uçan dört süs; açılışta görünmeyen ikisi de buradadır. */
const UCANLAR = ['sus-birthday-king', 'sus-iyi-ki-varsin', 'sus-canim-babam', 'sus-iyi-ki-bizimlesin'].map(sus)

/** Adım eşikleri: sahnenin ilk üçte biri 1., ikincisi 2., kalanı 3. adımdır. */
const adimHesapla = (ilerleme: number): 1 | 2 | 3 => (ilerleme < 0.33 ? 1 : ilerleme < 0.66 ? 2 : 3)

type Stiller = {
  stand: MotionStyle
  tezgah: MotionStyle
  pasta: MotionStyle
  secilen: MotionStyle
  ucan: readonly MotionStyle[]
}

/** Bir süsün, resmin sağ ve üst kenarından kendi yerine uçuşu. Ölçüler süsün kendi boyunun yüzdesidir. */
function useUcus(ilerleme: MotionValue<number>, sira: number, x: string, y: string, donus: number): MotionStyle {
  const bas = 0.04 + sira * 0.05
  const son = bas + 0.14
  return {
    x: useTransform(ilerleme, [bas, son], [x, '0%']),
    y: useTransform(ilerleme, [bas, son], [y, '0%']),
    rotate: useTransform(ilerleme, [bas, son], [donus, 0]),
    scale: useTransform(ilerleme, [bas, son], [1.5, 1]),
    opacity: useTransform(ilerleme, [bas, bas + 0.04], [0, 1]),
  }
}

/**
 * Kaydırma ilerlemesini (0–1) sahnedeki parçaların stillerine çevirir.
 * 0–0,33 stand açılır ve süsler uçar · 0,33–0,66 tezgâh ve pasta gelir · 0,66–0,92 seçilen süs pastaya iner.
 * Her parçanın son değeri "hiç oynatılmamış" hâlidir; dinlenme görüntüsü budur.
 */
function useSahneStilleri(p: MotionValue<number>): Stiller {
  return {
    // Eksi değerler görselin sert gölgesine yer bırakır.
    stand: { clipPath: useTransform(p, [0, 0.28], ['inset(70% -5% -5% -5%)', 'inset(0% -5% -5% -5%)']) },
    tezgah: {
      y: useTransform(p, [0.33, 0.52], ['70%', '0%']),
      opacity: useTransform(p, [0.33, 0.45], [0, 1]),
    },
    pasta: {
      y: useTransform(p, [0.46, 0.64], ['-45%', '0%']),
      scale: useTransform(p, [0.46, 0.64], [0.6, 1]),
      opacity: useTransform(p, [0.46, 0.56], [0, 1]),
    },
    // Süs önce standdaki yerinde küçük durur, sonra yay çizerek pastanın üstüne iner ve hafifçe esner.
    secilen: {
      x: useTransform(p, [0.66, 0.92], ['-258%', '0%']),
      y: useTransform(p, [0.66, 0.78, 0.88, 0.92], ['-30%', '-150%', '6%', '0%']),
      scale: useTransform(p, [0.22, 0.3, 0.66, 0.79, 0.92], [0, 0.5, 0.5, 1.1, 1]),
      rotate: useTransform(p, [0.66, 0.92], [-14, 0]),
    },
    ucan: [
      useUcus(p, 0, '700%', '-150%', 50),
      useUcus(p, 1, '560%', '-260%', -40),
      useUcus(p, 2, '440%', '-320%', 35),
      useUcus(p, 3, '360%', '40%', -50),
    ],
  }
}

/** Sahnenin resmi. `stiller` verilmezse hiçbir hareket stili bağlanmaz; parçalar son görüntüde durur. */
function SahneResmi({ stiller }: { stiller?: Stiller }) {
  return (
    <div className="sahne-resim">
      <motion.div data-sahne="tezgah" data-hareket="" style={stiller?.tezgah}>
        <Tezgah />
      </motion.div>
      {UCANLAR.map((s, i) => (
        <motion.div key={s.dosya} className={`sahne-ucan--${i + 1}`} data-sahne="ucan" data-hareket="" style={stiller?.ucan[i]}>
          <img src={susGorseli(s.dosya)} alt="" width={s.en} height={s.boy} loading="lazy" decoding="async" />
        </motion.div>
      ))}
      <motion.div data-sahne="stand" data-hareket="" style={stiller?.stand}>
        <img
          src={standGorseli(STAND_SAHNESI.stand.dosya, 'kesik')}
          alt={STAND_SAHNESI.standAlt}
          width={STAND_SAHNESI.stand.en}
          height={STAND_SAHNESI.stand.boy}
          loading="lazy"
          decoding="async"
        />
      </motion.div>
      <motion.div data-sahne="secilen" data-hareket="" style={stiller?.secilen}>
        <img src={susGorseli(SECILEN.dosya)} alt="" width={SECILEN.en} height={SECILEN.boy} loading="lazy" decoding="async" />
      </motion.div>
      <motion.div data-sahne="pasta" data-hareket="" style={stiller?.pasta}>
        <Pasta />
      </motion.div>
    </div>
  )
}

function CanliSahneResmi({ ilerleme }: { ilerleme: MotionValue<number> }) {
  return <SahneResmi stiller={useSahneStilleri(ilerleme)} />
}

/** Dar ekranda sabit sahnede resme kalması gereken en az yükseklik (piksel). */
const EN_AZ_RESIM = 220

/**
 * 2. bölüm: sayfanın ekrana sabitlenen tek sahnesi ve altında tanıtım videosu.
 * Sahne yalnızca "canlı"yken (hareket serbest, ekran yeterince yüksek ve yazı bir ekrana sığıyor) kaydırmaya
 * bağlanır; değilken üç adım ve son görüntü alt alta durur. Sabitleme ve yükseklik stand-sahnesi.css içinde,
 * aynı koşullarla açılır; sığmama durumunu oraya `data-sigmaz` bildirir.
 */
export function StandSahnesi() {
  const hareketli = useHareketli()
  const yeterinceYuksek = useMedya('(min-height: 520px)')
  // Yazı (dar ekranda altındaki resimle birlikte) bir ekrana sığmıyorsa sahne sabitlenmez; yoksa yazı kesilirdi.
  const metin = useRef<HTMLDivElement>(null)
  const [sigar, setSigar] = useState(true)
  useEffect(() => {
    const kutu = metin.current
    if (!kutu) return
    const olc = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      // Sabit sahnenin kendi boşlukları (stand-sahnesi.css): geniş ekranda üst-alt 8rem;
      // dar ekranda üst-alt 6,25rem, 1rem ara ve resme kalması gereken en az yer.
      const gereken = window.matchMedia('(min-width: 900px)').matches ? 8 * rem : 7.25 * rem + EN_AZ_RESIM
      setSigar(kutu.offsetHeight + gereken <= window.innerHeight)
    }
    olc()
    const gozcu = new ResizeObserver(olc)
    gozcu.observe(kutu)
    window.addEventListener('resize', olc)
    return () => {
      gozcu.disconnect()
      window.removeEventListener('resize', olc)
    }
  }, [])
  const canli = hareketli && yeterinceYuksek && sigar

  const sahne = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sahne, offset: ['start start', 'end end'] })
  const [adim, setAdim] = useState<1 | 2 | 3>(1)
  useMotionValueEvent(scrollYProgress, 'change', (deger) => setAdim(adimHesapla(deger)))

  return (
    <section id="stand" className="stand">
      <div className="sahne" ref={sahne} data-adim={canli ? adim : undefined} data-sigmaz={sigar ? undefined : ''}>
        <div className="sahne-yapiskan">
          <div className="sahne-metin" ref={metin}>
            <h2>{STAND_SAHNESI.baslik}</h2>
            <ol className="sahne-adimlar" role="list">
              {STAND_SAHNESI.adimlar.map((a, i) => (
                <li key={a.baslik} data-etkin={canli ? String(adim === i + 1) : undefined}>
                  <span className="sahne-no" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3>{a.baslik}</h3>
                    <p>{a.metin}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="sahne-eylem">
              <WaDugme mesaj="stand" tur="murekkep" buyuk>
                {STAND_SAHNESI.cta}
              </WaDugme>
            </div>
          </div>
          <div className="sahne-resim-kap">{canli ? <CanliSahneResmi ilerleme={scrollYProgress} /> : <SahneResmi />}</div>
        </div>
      </div>

      <div className="stand-video">
        <Video bilgi={VIDEOLAR.stand} egim={-2} />
      </div>
    </section>
  )
}
