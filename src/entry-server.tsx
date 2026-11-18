import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** Derleme sırasında çağrılır: sayfanın hazır HTML'ini verir (tools/onceden-uret.mjs yerleştirir). */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
