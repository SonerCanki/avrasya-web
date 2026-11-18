const MUREKKEP = '#120B3A'

/** Pastane tezgâhının önden görünüşü: kobalt tabla, beyaz gövde, kapak çizgileri. Gövde çizimin altından taşar. */
export function Tezgah() {
  return (
    <svg className="cizim" viewBox="0 0 800 140" aria-hidden="true" focusable="false">
      <g stroke={MUREKKEP} strokeWidth="4" strokeLinejoin="round">
        <rect x="26" y="30" width="748" height="140" fill="#fff" />
        <path d="M213 54v110M400 54v110M587 54v110" fill="none" strokeLinecap="round" />
        <rect x="6" y="6" width="788" height="30" rx="8" fill="#2340FF" />
      </g>
    </svg>
  )
}
