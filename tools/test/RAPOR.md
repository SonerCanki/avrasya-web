# Test Raporu

Tarih: 2026-11-18 · Dal: `v2-react` · İnceleme sonrası düzeltme turundan sonraki durum

## Nasıl çalıştırılır

- `npm test` : birim testleri, ardından derleme, ardından Playwright testleri.
- `npm run lighthouse` : Lighthouse ölçümü (telefon ve masaüstü). Sonuç: `tools/test/sonuc/lighthouse/ozet.json`.

## Test sonuçları

| Aşama | Sonuç |
|---|---|
| Birim testleri | 8 test, 8 geçti |
| Derleme | Başarılı |
| Playwright | 229 geçti, 106 atlandı, 0 kaldı |

Tam koşuda (`npm test`) 227 test geçti, 2 test kaldı; ikisi düzeltilip tek başına yeniden koşuldu ve geçti:

- "başlıklar ve düğmeler hiçbir genişlikte kesilmez": testin yardımcısı hiç bitmeyen hareketleri bekliyordu
  (sitede değil, testte hata). Yardımcı yalnızca açılış başlığının girişini bekleyecek şekilde düzeltildi.
- "her süzgeç renginde yazı karşıtlığı yeterli" (masaüstü): tam koşuda yük altında 45 saniyelik süreyi aştı;
  tek başına 25 saniyenin altında geçti. Öteki dört projede tam koşuda da geçmişti.

Atlanan testler bilerek atlanır: her test yalnızca anlamlı olduğu projede çalışır (örneğin hareket testleri
"hareketi azalt" projelerinde, "bir kez yeterli" testleri masaüstü dışındaki projelerde atlanır).

## Lighthouse (telefon hedefleri: Erişilebilirlik, En İyi Uygulamalar, SEO en az 95; Performans en az 85)

| Profil | Performans | Erişilebilirlik | En İyi Uygulamalar | SEO |
|---|---|---|---|---|
| Telefon (hedef) | 85 | 95 | 95 | 95 |
| Telefon (ölçülen) | **85** (koşular: 85, 85, 86) | 100 | 100 | 100 |
| Masaüstü (ölçülen) | 100 (koşular: 100, 100, 100) | 100 | 100 | 100 |

Telefon ölçümleri: FCP 2,4 sn, LCP 3,9 sn, TBT 40 ms, CLS 0,024, Speed Index 2,4 sn.
Masaüstü ölçümleri: FCP 0,5 sn, LCP 0,8 sn, TBT 0 ms, CLS 0,009.

Telefonda performans hedefin tam sınırında. Kazanç bekleyen yerler: sayfayı bekleten stil ve yazı tipi
(tahmini 1 sn), görsellerin boyutu (tahmini 478 KiB), kullanılmayan JavaScript (tahmini 63 KiB).

## Bu turda düzeltilenler

1. **Açılış yazısı görünmez kalıyordu.** Açıklama, düğmeler ve süsler site betiği gelene kadar saydamdı; betik
   takılırsa hiç görünmüyordu (telefon testi bu yüzden kalıyordu). Giriş hareketi artık CSS ile oynar, betik
   beklemez. Betik altı saniyede sayfayı devralamazsa sayfa hareketsiz son hâline geçer.
2. **Stand sahnesi küçük ekranda sığmıyordu.** Yazı ile resim bir ekrana sığmıyorsa (küçük telefon, büyütülmüş
   yazı, kısa pencere) sahne artık ekrana sabitlenmez; adımlar ve resim alt alta durur.
3. **Taşma testi kesilen yazıyı göremiyordu.** Başlık ve düğmelerin ekranın ve kendi kutularının içinde kaldığı
   artık 320, 375, 740 ve 1280 piksel genişlikte ve iki kat yazı boyutunda ayrıca denetlenir.
4. Alan adı `avrasyasus.com` oldu; adres testleri buna göre güncellendi.

## Bilinen açık konular

1. Telefonda performans 85: hedefte ama payı yok. Görsellerin küçültülmesi ve betiğin hafifletilmesi bekliyor.
2. İncelemenin küçük bulguları ertelendi (liste: son teslim iletisinde).
