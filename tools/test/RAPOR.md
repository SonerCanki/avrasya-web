# Test raporu (Faz 5)

Tarih: 25 Ekim 2026. Ölçümler bu klasördeki testlerle, makinede kurulu Google Chrome üzerinde yapıldı.

## Özet

| Hedef | Sonuç |
|---|---|
| Playwright, masaüstü ve telefon | 64 test geçti, 0 hata (26 test o ortama uymadığı için atlandı, aşağıda) |
| axe erişilebilirlik denetimi (WCAG 2.2 AA + iyi uygulamalar) | 4 ortamda da 0 ihlal |
| Lighthouse Performans ≥ 90 | Telefon 95 / 98, masaüstü 99 / 100 (ilk / tekrar ziyaret) |
| Lighthouse Erişilebilirlik ≥ 95 | Her durumda 100 |
| Lighthouse En iyi uygulamalar, SEO | Her durumda 100 |

## Neler denendi

Aynı 18 test beş ortamda çalışır:

| Ortam | Ne |
|---|---|
| `masaustu` | 1280×800 Chrome, animasyonlar açık |
| `telefon` | Pixel 7 (dokunmatik, 412 px), animasyonlar açık |
| `masaustu-hareketsiz`, `telefon-hareketsiz` | "Hareketi azalt" açık |
| `javascriptsiz` | JavaScript kapalı |

Testler:

- Sayfa hatasız yüklenir: konsol hatası, kırık bağlantı ya da yüklenmeyen görsel yok; baştan sona kaydırırken sayfa yana taşmaz.
- Açılış perdesi yalnızca ilk ziyarette oynar.
- Üstteki başlık bozulmadan kalır, süs pastaya iner.
- Stand sahnesi: 20 parça rafa dolar, sonunda süs pastanın tam ortasına oturur (12 px içinde).
- Koleksiyon: geniş ekranda sabitlenip yana kayar ve son kart ekrana gelir; telefonda parmakla kaydırılır. Süzgeç doğru sayıda stand gösterir (Futbol 1, Ayna 4, Çocuk 1, Tümü 11). Kart büyük görseli açar, Esc kapatır, odak karta döner.
- Kule stand: fotoğraf kaydırmadan önce indirilmez, sonra raf raf kurulur.
- Atölye adımlarının çizgileri sonuna kadar çizilir.
- Final pastası:
  - tek tıkla beş mum söner, konfeti patlar (telefonda daha az parça, hareket azaltılınca hiç), WhatsApp butonu parlar;
  - ikinci tıkla mumlar yeniden yanar;
  - fare tek mumun üzerinden geçince o mum söner.
- WhatsApp bağlantıları doğru numarayı ve hazır mesajı taşır, yeni sekmede açılır.
- Klavye: ilk Tab "İçeriğe geç" bağlantısına gider, Enter içeriğe atlar.
- Telefon menüsü açılır, bir bağlantıya basınca kapanır ve o bölüme gider.
- Hareket azaltılınca hiçbir şey kaymaz ya da saydam kalmaz; sayfa son hâliyle görünür.
- JavaScript kapalıyken bütün içerik görünür; süzgeç ve ipucu gizlenir, final düğmesi devre dışı kalır.
- axe denetimi: ciddi ya da kritik ihlal varsa test düşer. Ayrıntılı sonuç `sonuc/axe/` içine yazılır.

Atlanan 26 test o ortamda anlamı olmayanlar: masaüstünde telefon menüsü ya da telefonda yana kayan koleksiyon gibi. JavaScript kapalıyken axe çalışamadığı için o denetim de atlanır.

## Lighthouse

`npm run lighthouse` ile ölçüldü. Lighthouse varsayılanı kullanıldı:

- telefon: yavaş 4G ve 4 kat yavaş işlemci;
- masaüstü: masaüstü ayarı.

Her durum 3 kez ölçüldü ve ortanca sonuç alındı. Dosyalar gerçek barındırmalardaki gibi gzip ile sıkıştırılarak sunuldu.

"İlk ziyaret" açılış perdesiyle birlikte ölçüldü. "Tekrar ziyaret"te perde yok ve önbellek boş.

| Durum | Performans (3 ölçüm) | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|
| Telefon, ilk ziyaret | 95 (88, 95, 95) | 1,4 sn | 2,8 sn | 30 ms | 0,001 | 2,7 sn |
| Telefon, tekrar | 98 (97, 98, 98) | 1,4 sn | 2,3 sn | 30 ms | 0,001 | 1,5 sn |
| Masaüstü, ilk ziyaret | 99 | 0,7 sn | 0,8 sn | 0 ms | 0,001 | 1,0 sn |
| Masaüstü, tekrar | 100 | 0,4 sn | 0,5 sn | 0 ms | 0,001 | 0,4 sn |

Telefonda ilk ziyaretin üç ölçümünden biri 88 çıktı. Bu ölçüm yavaş bilgisayarda dalgalanabiliyor; ortanca 95.

Raporların tamamı `sonuc/lighthouse/` içinde. Tarayıcıda açmak için `telefon-ilk.html` gibi dosyalara bakın.

## Bulunan sorunlar ve düzeltmeler

1. **JavaScript kapalıyken süzgeç görünüyordu.**
   - Sorun: `display: flex` kuralı `hidden` niteliğini eziyordu.
   - Düzeltme: `css/style.css` içine genel `[hidden] { display: none !important; }` kuralı eklendi.
2. **Renk karşıtlığı yetersizdi.** axe ve Lighthouse bunu ciddi ihlal olarak buldu.
   - Sorun: koyu zemindeki stand adımları ve kule katları henüz sırası gelmemişken %40 saydamlıktaydı. Atölye adımlarının yazıları da beyaz zeminde silik başlıyordu.
   - Düzeltme: bekleyen satırlar %70 saydamlığa çıkarıldı, karşıtlık oranı 5,1:1 oldu. Atölye yazıları artık solgun başlamıyor, yalnızca kayarak giriyor.
3. **Bazı öğeler bir sayfa bölümüne ait değildi.**
   - Sorun: yüzen WhatsApp butonu ve konfeti tuvali hiçbir bölümün içinde değildi.
   - Düzeltme: buton alt bilginin (`footer`) içine taşındı. Konfeti artık kendi tuvalinde çiziliyor; tuval ekran okuyuculardan gizli.
4. **Yazı tipi gelince sayfa kayıyordu** (CLS 0,108).
   - Sorun: Google yazı tipleri yerine geçen Arial farklı boyutta olduğu için üstteki pasta yer değiştiriyordu.
   - Düzeltme: Arial, gerçek yazı tiplerinin ölçülerine göre ayarlandı (`Figtree Fallback`, `Unbounded Fallback`). CLS 0,001'e indi.
5. **Telefonda en büyük yazı geç görünüyordu.**
   - Sorun: üstteki açıklama yazısı JavaScript gelene kadar saydamdı, bu yüzden telefonda LCP 5,5 sn çıkıyordu.
   - Düzeltme: yazı artık saydamlaşmıyor, yalnızca aşağıdan kayarak giriyor. Başlık da yalnızca perde yokken gizleniyor; perde zaten önünde.
6. **Yazı tipi dosyası sayfanın çizilmesini bekletiyordu.**
   - Düzeltme: Google Fonts stil dosyası artık sayfayı bekletmeden yükleniyor. JavaScript kapalıysa `<noscript>` içindeki yedek kullanılır.
7. **Görünmeyen fotoğraflar baştan iniyordu.**
   - Sorun: stand ve kule sahnelerindeki parçalar fotoğrafı arka plan olarak kullandığı için iki büyük fotoğraf (311 KB) sayfa açılır açılmaz iniyordu.
   - Düzeltme: parçalar artık sayfadaki `<img>` yüklenince boyanıyor. Fotoğraf, bölüme yaklaşınca iniyor.
8. **Sayfa, animasyon kütüphaneleri inene kadar boş kalıyordu.**
   - Sorun: telefonda ilk ziyarette sayfa, sekiz betik inip çalışana kadar çizilmiyordu. Performans 88'de kalıyordu.
   - Düzeltme: betikler artık ilk çizimden hemen sonra, aynı sırayla ekleniyor (`index.html` sonundaki küçük betik). Performans 95'e çıktı.
   - Arka planda açılan sekmelerde de en geç 1 sn içinde yüklenirler.
   - Betikler 3 sn içinde gelmezse sayfa animasyonsuz son hâline geçer; bu yedek eskisi gibi duruyor.

## Kalan küçük notlar

Bunlar puanı hedefin altına düşürmüyor; ileride bakılabilir.

- **Görsel boyutu:** Lighthouse görsellerde yaklaşık 60–70 KB kazanç öneriyor. Çoğu, stand fotoğraflarının ekranda gösterildiğinden biraz büyük olmasından geliyor.
- **Sıkıştırma:** CSS ve JavaScript sıkıştırılmamış (minify). Toplam kazanç 8 KB; derleme adımı olmasın diye bilerek böyle bırakıldı.
- **Telefon işlemcisi:** ana iş parçacığı yaklaşık 4 sn çalışıyor. Bu, 4 kat yavaşlatılmış işlemcide kaydırma sahnelerinin kurulması. Sayfayı kilitlemiyor (TBT 30 ms).

## Yeniden çalıştırmak

```bash
cd tools/test
npm install
npx playwright test
npm run lighthouse
```

- Testler için makinede Google Chrome kurulu olmalı.
- `npx playwright test` kendi sunucusunu 5510 numaralı kapıda açar. HTML raporu `sonuc/rapor/` içine yazılır; açmak için `npx playwright show-report sonuc/rapor`.
- `npm run lighthouse` yaklaşık 3–4 dakika sürer ve 5511 numaralı kapıyı kullanır.
- `sonuc/` klasörü git'e girmez.
