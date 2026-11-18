import { MENU, SITE } from '../icerik'
import './iletisim.css'

/** Alt bilgi (mürekkep): beyaz halkada logo, telif satırı ve bölüm bağlantıları. */
export function AltBilgi() {
  return (
    <footer className="alt">
      <div className="alt-ic">
        <div className="alt-marka">
          {/* Firma adı hemen yanında yazıyla durduğu için logo süs sayılır. */}
          <img className="alt-logo" src="/assets/img/logo-160.webp" alt="" width={56} height={56} loading="lazy" decoding="async" />
          <p>{`© 2026 ${SITE.ad}`}</p>
        </div>
        <nav aria-label="Alt menü">
          <ul role="list">
            {MENU.map((oge) => (
              <li key={oge.hedef}>
                <a href={oge.hedef}>{oge.ad}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
