# Üçüncü taraf kütüphaneler

CDN'e bağımlı kalmamak için sabit sürümler burada tutulur. Dosyalar npm paketlerinin `dist/` klasöründen olduğu gibi alındı (yalnızca `sourceMappingURL` satırı silindi).

| Dosya | Paket | Sürüm | Lisans |
|-------|-------|-------|--------|
| `gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`, `DrawSVGPlugin.min.js` | gsap | 3.15.0 | GSAP Standard License (ücretsiz, ticari kullanım dahil): https://gsap.com/standard-license |
| `lenis.min.js`, `lenis.css` | lenis | 1.3.26 | MIT (`LICENSE-lenis.txt`) |
| `confetti.browser.js` | canvas-confetti | 1.9.4 | ISC (`LICENSE-canvas-confetti.txt`) |

Güncellemek için: `npm pack <paket>@<sürüm>`, arşivden aynı dosyaları kopyalayın, bu tabloyu düzeltin ve sayfayı masaüstü ile mobilde kontrol edin.
