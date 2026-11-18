import { Yildiz } from '../cizimler/Yildiz'
import './ortak.css'

/** Şerit dört eş gruptan oluşur ve bir grup boyu kayar; böylece geniş ekranda da boşluk görünmez. */
const GRUP = 4

/**
 * Kayan sarı şerit. Adlar ilk listede bir kez okunur (`etiket` listenin adıdır);
 * ikinci liste yalnızca şeridi doldurur ve ekran okuyuculardan gizlidir.
 */
export function KayanSerit({ ogeler, etiket }: { ogeler: readonly string[]; etiket: string }) {
  const dolgu = Array.from({ length: GRUP - 1 }, (_, tekrar) => ogeler.map((oge) => ({ oge, anahtar: `${tekrar}-${oge}` }))).flat()

  return (
    <div className="kayan-serit">
      <div className="kayan-serit-ic">
        <ul aria-label={etiket}>
          {ogeler.map((oge) => (
            <li key={oge}>
              {oge}
              <Yildiz />
            </li>
          ))}
        </ul>
        <ul aria-hidden="true">
          {dolgu.map(({ oge, anahtar }) => (
            <li key={anahtar}>
              {oge}
              <Yildiz />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
