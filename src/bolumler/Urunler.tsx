import { type CSSProperties, useState } from 'react'
import { SUZGECLER, type SuzgecId, URUNLER } from '../icerik'
import { StandGalerisi } from './StandGalerisi'
import './urunler.css'

/**
 * 3. bölüm: standdaki süs türleri ve konseptlere göre süzülen stand galerisi.
 * Seçilen süzgeç bölümün zeminini ve yazı rengini belirler (urunler.css: --zemin, --uzeri).
 */
export function Urunler() {
  const [suzgec, setSuzgec] = useState<SuzgecId>('hepsi')
  const secili = SUZGECLER.find((s) => s.id === suzgec)!

  return (
    <section
      id="urunler"
      className="urunler"
      style={{ '--zemin': secili.renk, '--uzeri': secili.uzeri } as CSSProperties}
    >
      <div className="urunler-ic">
        <h2>{URUNLER.baslik}</h2>
        <p className="urunler-metin">{URUNLER.metin}</p>
        <dl className="tur-listesi">
          {URUNLER.turler.map((tur) => (
            <div key={tur.baslik}>
              <dt>{tur.baslik}</dt>
              <dd>{tur.metin}</dd>
            </div>
          ))}
        </dl>

        <StandGalerisi suzgec={suzgec} sec={setSuzgec} />
      </div>
    </section>
  )
}
