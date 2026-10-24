# Animasyonlu site planı — "Atölyeden kutlamaya"

Avrasya Toptan Pasta Süsleri sitesini, doğum günü kutlaması temalı ve kaydırdıkça
ilerleyen bir hikâyeye dönüştürme planı. Mevcut yapı korunur: tek sayfa, derleme
adımı yok, `index.html` + `css/` + `js/` + `assets/`.

**Alınan kararlar (24.10.2026)**

- Renk: lacivert ve altın ana renk, parti renkleri (krem, pasta pembesi, konfeti) vurgu olarak.
- Stand fotoğrafları: galeride stüdyo zemini, animasyonda şeffaf kesik. İkisi birden üretilecek.
- Düz levha fotoğrafları: #26'daki süsler tek tek kesilip animasyonda kullanılacak, #25 kullanılmayacak.
- Animasyon yoğunluğu: hikâyeli tam deneyim, aşağıdaki 7 sahnenin hepsi.

---

## 1. Stand fotoğrafları (`sirket-bilgileri/stant-gorseleri.zip`)

### Mevcut durum

- 27 fotoğraf, hepsi 2040×1530 (3 tanesi dikey). WhatsApp sıkıştırması var.
- Arka planlarda masa, ofis eşyası, duvar, başka standlar ve "Welcome" tabelası görünüyor.
- Aynı stand birkaç kez çekilmiş. Tekrarlar ayıklanınca **13 farklı stand + 1 kule stand** kalıyor.
- Netlik ölçümüne göre çoğu fotoğraf iyi. Site en fazla 1040 px gösterdiği için
  2040 px'lik kaynak yarıya küçülünce yumuşaklık büyük ölçüde kayboluyor.
- **#25 odak dışı** (gerçek bulanıklık). Yazılımla düzeltilemez; yeniden çekilmeli
  ya da kullanılmamalı.
- **#25 ve #26 stand değil**, düz levha üzerinde tek tek süsler.

### Seçilen fotoğraflar (her standın en net çekimi)

| Yeni dosya adı             | Kaynak # | İçerik                                                 | Not                         |
|----------------------------|---------:|--------------------------------------------------------|-----------------------------|
| `stand-cocuk-karakter`     | 1        | Prenses, Kuromi, aslan, kaptan gibi karakterli süsler  | #22 yedek                   |
| `stand-rakam-balon`        | 2        | Balonlu rakamlar ve "Canım Annem" tarzı yazılar        | #23 yedek                   |
| `stand-futbol`             | 3        | Takım temalı süsler                                    | #27 daha bulanık            |
| `stand-ayna-renkli`        | 4        | Siyah standda renkli ayna rakam ve yazılar             | #21 yedek                   |
| `stand-cizgi-film`         | 16       | Rakamlar ve çizgi film karakterleri                    | #5 daha bulanık             |
| `stand-esprili-balon`      | 6        | Konuşma balonu biçiminde esprili yazılar               | #17 daha bulanık            |
| `stand-esprili-yazi`       | 14       | "Kral geri döndü", "Level atladım"…                    | #7 ve #12 yedek             |
| `stand-kadin`              | 13       | "Diva", "Sultanım", "Kraliçe"…                         | #8 daha bulanık             |
| `stand-erkek`              | 18       | "Kral", "Reis", "Patron", "Efsane"…                    | #9 yedek                    |
| `stand-ahsap-ayna`         | 11       | Ahşap standda altın ve gümüş ayna yazılar              | #10 yedek                   |
| `stand-renkli-ayna-yazi`   | 19       | Renkli ayna "Happy Birthday" ve "İyi ki Doğdun"        |                             |
| `stand-altin-gumus`        | 20       | Altın ve gümüş rakamlarla yazılar                      |                             |
| `kule-stand`               | 15, 24   | Çok katlı yer standı                                   | Dikey, ayrı bölümde         |
| `sus-*` (tek süsler)       | 26       | Birthday King, Canım Kızım vb.                         | Animasyonda tek süs olarak  |

### İşleme hattı (`tools/stand-gorselleri/`)

Node.js kurulu, Python yok. Bu yüzden her şey Node ile yapılır. Araçlar
`tools/` klasöründe kalır ve siteye yüklenmez.

1. **Arka plan kaldırma:** `@imgly/background-removal-node`. Yapay zekâ modeli
   bilgisayarda çalışır, fotoğraflar hiçbir servise gönderilmez. Çıktı, standın
   etrafı kesilmiş şeffaf PNG olur.
2. **Kontrol:** Beyaz stand beyaz zemin önünde (#13, #14, #16) ya da raflar arası
   boşluklar modeli yanıltabilir. Her kesim yan yana önizleme sayfasında kontrol
   edilir. Hatalı olanlar maske düzeltmesiyle ya da yedek fotoğrafla yeniden yapılır.
3. **Netleştirme:** `sharp` ile Lanczos küçültme ve hafif keskinleştirme (unsharp
   mask). Renkler biraz canlandırılır, beyaz dengesi düzeltilir (sarımsı ofis ışığı).
4. **Stant görünümüne getirme:** Her fotoğrafta aynı düzen kullanılır. Stand ortalanır,
   kare çerçeve içinde aynı ölçek ve taban çizgisine oturtulur, altına yumuşak gölge
   eklenir. Galeri tek tip ve "ürün kataloğu" gibi görünür.
5. **Çıktılar** (her stand için):
   - `assets/img/standlar/<ad>-640.webp` ve `-1040.webp`: sade stüdyo zemini (galeri ve büyütme).
   - `assets/img/standlar/<ad>-kesik.webp`: şeffaf zemin (animasyon sahneleri).
6. **Tek süsler:** #26'daki süsler tek tek kesilir (`assets/img/susler/`). Hero'da
   pastanın üstüne inen süs bunlardan biri olur.

---

## 2. Tema: doğum günü kutlaması

- **Renkler:** Logodaki lacivert ve altın ana renk kalır. Kutlama vurgusu olarak
  krem, pasta pembesi ve konfeti renkleri eklenir. Mevcut turkuaz konfetide kullanılır.
- **Çizimler (SVG, el yapımı, hafif):** katlı pasta, mumlar ve alevleri, balonlar,
  konfeti ve şeker serpintisi, bölümler arasında akan **krema damlası** ayırıcıları.
- **Yazı:** Mevcut Unbounded (başlık) ve Figtree (metin) kalır. Başlıklar harf harf animasyonlu gelir.
- **Ayna pleksi etkisi:** Mevcut `.acrylic` parlama efekti geliştirilir. Kartların
  üzerinde kaydırmaya bağlı ışık yansıması gezer.

---

## 3. Sayfa akışı ve animasyonlar (kaydırdıkça ilerleyen hikâye)

| # | Sahne | Ne olur | Teknik |
|---|-------|---------|--------|
| 0 | **Açılış** (en fazla 1,2 sn, ikinci ziyarette yok) | Logo belirir, küçük bir mum yanar, perde açılır | GSAP timeline |
| 1 | **Hero: "Pastaneniz için süslerle dolu stand"** | Başlık harfleri zıplayarak gelir. Sağda SVG pasta var. Kaydırma başlayınca gerçek bir süs (kesik foto) yukarıdan inip pastaya batar, mumlar yanar, küçük konfeti patlar. Arkada balonlar ağır ağır yükselir. | SplitText, ScrollTrigger, canvas-confetti |
| 2 | **Stand nasıl çalışır** (sabitlenen sahne) | Ortada boş stand var. Kaydırdıkça: **1. Dolu gelir:** süsler raflara tek tek dizilir. **2. Tezgâhın yanına konur:** stand bir tezgâh çizgisinin üstüne kayar. **3. Müşteri seçer:** bir süs öne çıkıp büyür ve pastanın üstüne uçar. | ScrollTrigger `pin` + `scrub` |
| 3 | **Stand koleksiyonu** | 13 stand yatay kayan bir şeritte gösterilir. Kategori filtreleri: Çocuk, Rakam, Yazı, Esprili, Kadın, Erkek, Futbol, Ayna. Kartlar fareyle hafif 3D eğilir. Tıklayınca büyür (mevcut lightbox). | Masaüstünde yatay pin, mobilde kaydırmalı karusel |
| 4 | **Kule stand** | Dikey stand aşağıdan yukarı "inşa olur", raflar sırayla dolar | ScrollTrigger stagger |
| 5 | **Atölyeden vitrine** | UV baskı videosu kalır. Yanında 4 adımı birleştiren çizgi kaydırdıkça kendini çizer, her adımda ikon belirir. | DrawSVG |
| 6 | **Final: "Kutlamaya hazır mısınız?"** | Pastada yanan mumlar var. Kullanıcı mumlara tıklayınca (ya da üflemeye benzer şekilde üzerinden geçince) mumlar söner, konfeti patlar, WhatsApp butonu parlayarak öne çıkar. | Etkileşim + confetti |
| — | **Genel** | Yumuşak kaydırma. Bölümler arasında krema damlası geçişleri. Arka planda yavaş süzülen şeker serpintisi (parallax). | Lenis, ScrollTrigger |

**Yapılmayacaklar:** Özel imleç, otomatik ses, sayfayı kilitleyen uzun açılış, 3D model.
Bunlar hem yavaşlatır hem satış mesajını gölgeler.

---

## 4. Teknik altyapı

- **Kütüphaneler:** GSAP 3 (ScrollTrigger, SplitText, DrawSVG; artık hepsi ücretsiz),
  Lenis, canvas-confetti. Sabit sürümlerle `assets/vendor/` içine konur, CDN'e
  bağımlılık olmaz. Toplam yaklaşık 150 KB (gzip ~60 KB).
- **Kod düzeni:** `js/main.js` mevcut davranışları tutar (WhatsApp, menü, video,
  lightbox). Animasyonlar yeni `js/animations.js` dosyasına gider. Her sahne kendi
  fonksiyonunda olur.
- **Hareket azaltma:** `prefers-reduced-motion` açıksa ya da JavaScript yüklenmezse
  her sahne son hâliyle durağan görünür. İçerik hiçbir zaman animasyona bağlı kalmaz.
- **Mobil:** Sabitlenen sahneler kısalır. Yatay pin yerine dokunmatik karusel kullanılır.
  Konfeti parçası sayısı düşer.
- **Performans:** Yalnızca `transform` ve `opacity` animasyonu kullanılır. Görseller lazy
  yüklenir, hero görseline `fetchpriority="high"` verilir. Hedef Lighthouse
  Performans ≥ 90, Erişilebilirlik ≥ 95.

---

## 5. Uygulama aşamaları

| Faz | İş | Çıktı |
|-----|----|-------|
| 0 | `git init` ve ilk commit (proje şu an git'te değil; büyük değişiklikten önce geri dönüş noktası) | Güvenli başlangıç |
| 1 | Görsel işleme hattı ve 13 stand + tek süsler | `assets/img/standlar/`, önizleme sayfası, **senin onayın** |
| 2 | Tema: renk tokenları, SVG çizimler (pasta, mum, balon, krema, konfeti) | `css/style.css`, `assets/svg/` |
| 3 | Animasyon altyapısı: vendor dosyaları, Lenis, reduced-motion iskeleti | `js/animations.js` |
| 4 | Sahneler 0 → 6, her biri ayrı ayrı test edilerek | Çalışan sayfa |
| 5 | Test: masaüstü + mobil (Playwright), Lighthouse, erişilebilirlik denetimi | Rapor ve düzeltmeler |
| 6 | README güncellemesi (yeni stand nasıl eklenir, görsel hattı nasıl çalışır) | Belgeler |

---

## 6. Senden gerekenler

- [ ] #25'in yeniden çekilmesi (isteğe bağlı; kullanmadan da plan çalışır)
- [ ] Varsa gerçek rakamlar ("X pastaneye stand gönderdik", "Y model süs").
      Uydurma rakam koymayacağız; yoksa bu bölüm hiç olmayacak.
- [ ] Faz 1 sonunda kesilmiş stand görsellerinin onayı
