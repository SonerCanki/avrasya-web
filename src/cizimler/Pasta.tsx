const MUREKKEP = '#120B3A'

/** Düz renkli pasta: pembe gövde, sarı dolgu şeridi, sarkan beyaz krema ve tabak. Süs olduğu için okunmaz. */
export function Pasta() {
  return (
    <svg className="cizim" viewBox="0 50 240 130" aria-hidden="true" focusable="false">
      <g stroke={MUREKKEP} strokeWidth="4" strokeLinejoin="round">
        <rect x="36" y="70" width="168" height="92" rx="8" fill="#FF3D8B" />
        <rect x="36" y="120" width="168" height="12" fill="#FFD60A" />
        <path
          d="M30 70a14 14 0 0 1 14-14h152a14 14 0 0 1 14 14v18a15 15 0 0 1-30 0v-4a15 15 0 0 0-30 0v14a15 15 0 0 1-30 0v-14a15 15 0 0 0-30 0v8a15 15 0 0 1-30 0v-8a15 15 0 0 0-30 0z"
          fill="#fff"
        />
        <rect x="8" y="158" width="224" height="16" rx="8" fill="#fff" />
      </g>
    </svg>
  )
}
