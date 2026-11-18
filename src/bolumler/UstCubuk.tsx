import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { ILETISIM, MENU, SITE } from '../icerik'
import { WaDugme } from '../ortak/Dugme'
import './ust-cubuk.css'

/** Açılışın bitimine bu kadar piksel kala çubuk yüzen hapa dönüşür. */
const YUZME_PAYI = 80

/** "WhatsApp’tan yazın": çok dar ekranda yalnızca ilk sözcük görünür, gerisi ekran okuyucuya kalır (ust-cubuk.css). */
const WA_SOZCUGU = 'WhatsApp'
const [WA_BAS, WA_SON] = ILETISIM.cta.startsWith(WA_SOZCUGU)
  ? [WA_SOZCUGU, ILETISIM.cta.slice(WA_SOZCUGU.length)]
  : [ILETISIM.cta, '']

/**
 * Üst çubuk: logo ve firma adı, bölüm menüsü, WhatsApp düğmesi.
 * Açılışın üzerinde saydamdır ve sayfayla birlikte kayar; açılış geçilince ekranın üstüne sabitlenen beyaz,
 * sert gölgeli bir hap olur. Dar ekranda menünün yerini "Menü" düğmesi alır; düğme tam ekran menüyü açar.
 * Menü tarayıcının kendi `dialog` öğesidir: odağı içinde tutar, Esc ile kapanır, kapanınca odağı düğmeye geri verir.
 */
export function UstCubuk() {
  const ortu = useRef<HTMLDialogElement>(null)
  const [yuzen, setYuzen] = useState(false)

  useEffect(() => {
    const acilis = document.getElementById('acilis')
    let esik = 0
    const guncelle = () => setYuzen(window.scrollY > esik)
    // Açılışın boyu yalnızca değiştiğinde ölçülür; kaydırırken ölçüm yapılmaz.
    const olc = () => {
      esik = (acilis?.offsetHeight ?? 0) - YUZME_PAYI
      guncelle()
    }
    olc()
    const gozcu = acilis ? new ResizeObserver(olc) : null
    if (acilis) gozcu?.observe(acilis)
    window.addEventListener('scroll', guncelle, { passive: true })
    return () => {
      gozcu?.disconnect()
      window.removeEventListener('scroll', guncelle)
    }
  }, [])

  const kapat = () => ortu.current?.close()

  return (
    <>
      <header className="ust" data-yuzen={String(yuzen)}>
        <a className="ust-marka" href="#acilis">
          {/* Firma adı hemen yanında yazıyla durduğu için logo süs sayılır. */}
          <img src="/assets/img/logo-160.webp" alt="" width={48} height={48} decoding="async" />
          <span className="ust-marka-ad">{SITE.ad}</span>
        </a>

        <nav className="ust-menu" aria-label="Ana menü">
          <ul role="list">
            {MENU.map((oge) => (
              <li key={oge.hedef}>
                <a href={oge.hedef}>{oge.ad}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ust-eylem">
          {/* Yazı iki parçaya bölündüğü için ad açıkça verilir; yoksa ekran okuyucu araya boşluk koyar. */}
          <WaDugme mesaj="ust" tur="beyaz" etiket={WA_SON ? ILETISIM.cta : undefined}>
            {WA_BAS}
            {WA_SON && <span className="ust-wa-son">{WA_SON}</span>}
          </WaDugme>
          <button
            type="button"
            className="ust-menu-dugme js-gerek"
            aria-haspopup="dialog"
            onClick={() => ortu.current?.showModal()}
          >
            Menü
          </button>
        </div>
      </header>

      <dialog ref={ortu} className="menu-ortu" aria-label="Menü" data-lenis-prevent="">
        <button type="button" className="menu-ortu-kapat" onClick={kapat}>
          Kapat
        </button>
        <nav aria-label="Bölümler">
          <ul role="list">
            {MENU.map((oge, i) => (
              // Bağlantılar sırayla gelir; sıra numarası gecikmeyi verir (ust-cubuk.css: menu-gel).
              <li key={oge.hedef} data-hareket="" style={{ '--sira': i } as CSSProperties}>
                {/* Menü kapanır, tarayıcı bağlantının bölümüne gider. */}
                <a href={oge.hedef} onClick={kapat}>
                  {oge.ad}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  )
}
