import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Yazı tipi siteye gömülüdür; bu dosya hem optik boyut hem kalınlık eksenini taşır.
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import 'lenis/dist/lenis.css'
import './stil/temel.css'
import App from './App'

const kok = document.getElementById('root')!
const sayfa = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Derlenmiş sitede #root hazır HTML ile dolu gelir, React onu devralır.
// Geliştirme sunucusunda boştur, sayfa baştan çizilir.
if (kok.hasChildNodes()) hydrateRoot(kok, sayfa)
else createRoot(kok).render(sayfa)
