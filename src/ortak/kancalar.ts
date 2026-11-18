import { useCallback, useEffect, useSyncExternalStore } from 'react'

// Bileşenler çizim sırasında window, document ya da matchMedia okumaz; bu kancaları kullanır.
// Üçü de sunucuda ve React sayfayı devralırken "hayır" der; böylece hazır HTML ile ilk çizim aynı olur.

const aboneYok = () => () => {}
const sunucuda = () => false

/** React sayfayı devraldı mı: sunucuda ve ilk çizimde "hayır", tarayıcıda bağlandıktan sonra "evet". */
export function useTarayicida(): boolean {
  return useSyncExternalStore(aboneYok, () => true, sunucuda)
}

/** Hareket serbest mi: `<html>` öğesi `hareketli` sınıfını taşıyor mu (index.html'deki betik ekler). */
export function useHareketli(): boolean {
  return useSyncExternalStore(aboneYok, () => document.documentElement.classList.contains('hareketli'), sunucuda)
}

/** Verilen medya sorgusu şu an tutuyor mu; ekran değiştikçe güncellenir. */
export function useMedya(sorgu: string): boolean {
  const abone = useCallback(
    (haberVer: () => void) => {
      const medya = window.matchMedia(sorgu)
      medya.addEventListener('change', haberVer)
      return () => medya.removeEventListener('change', haberVer)
    },
    [sorgu],
  )
  return useSyncExternalStore(abone, () => window.matchMedia(sorgu).matches, sunucuda)
}

/** Yalnızca hareket serbestken yumuşak kaydırmayı (Lenis) başlatır; dokunmatik kaydırma tarayıcıda kalır. */
export function useYumusakKaydirma(): void {
  const hareketli = useHareketli()
  useEffect(() => {
    if (!hareketli) return
    let lenis: { destroy(): void } | undefined
    let vazgecildi = false
    // Lenis burada yüklenir ki sunucu derlemesine girmesin.
    import('lenis')
      .then(({ default: Lenis }) => {
        if (!vazgecildi) lenis = new Lenis({ autoRaf: true, anchors: true })
      })
      // Yüklenemezse sayfa tarayıcının kendi kaydırmasıyla çalışmaya devam eder.
      .catch(() => {})
    return () => {
      vazgecildi = true
      lenis?.destroy()
    }
  }, [hareketli])
}
